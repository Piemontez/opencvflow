import cv, { Mat } from 'opencv-ts';
import numeral from 'numeral';
import { Col, Row, Form } from 'react-bootstrap';
import { CVFFormEvent } from "./types/CVFFormEvent";
import { CVFFormProps } from "./types/CVFFormProps";

/**
 * Cria um componente para editar o Mat com atributos 0 e 1
 * @param props
 */
export function OCVOneZeroMatrixFormControl(props: CVFFormProps) {
  props.groupAs = undefined;
  props.column = undefined;

  const value = props.value as Mat;
  const cols = value.cols;
  const rows = value.rows;

  const changeSize = (
    cols: number | null,
    rows: number | null,
    event: CVFFormEvent
  ) => {
    if (props.onChange) {
      if (cols !== null) {
        if (cols > value.cols) {
          const zs = new cv.Mat(value.rows, 1, value.type(), new cv.Scalar(0));
          const vector = new cv.MatVector();
          vector.push_back(zs);
          vector.push_back(value);
          const dst = new cv.Mat(
            value.rows,
            cols,
            value.type(),
            new cv.Scalar(0)
          );
          cv.hconcat(vector, dst);
          props.onChange(dst, null, event);
        } else {
          props.onChange(
            value.roi(new cv.Rect(0, 0, cols, value.rows)),
            null,
            event
          );
        }
      } else if (rows !== null) {
        if (rows > value.rows) {
          const zs = new cv.Mat(1, value.cols, value.type(), new cv.Scalar(0));
          const vector = new cv.MatVector();
          vector.push_back(zs);
          vector.push_back(value);
          const dst = new cv.Mat(
            rows,
            value.cols,
            value.type(),
            new cv.Scalar(0)
          );
          cv.vconcat(vector, dst);
          props.onChange(dst, null, event);
        } else {
          props.onChange(
            value.roi(new cv.Rect(0, 0, value.cols, rows)),
            null,
            event
          );
        }
      }
    }
  };

  const rowsSeries = Array.from(Array(rows).keys());
  const colsSeries = Array.from(Array(cols).keys());

  return (
    <>
      <MatrixSizeComp rows={rows} cols={cols} changeSize={changeSize} />
      {rowsSeries.map((row) => (
        <Row key={row}>
          {colsSeries.map((col) => (
            <Col key={col}>
              <Form.Check
                type="checkbox"
                checked={value.data.at(row * rows + col)}
                onClick={() =>
                  (value.data[row * rows + col] = !value.data.at(
                    row * rows + col
                  ))
                }
              />
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}

export function MatrixSizeComp({
  rows,
  cols,
  changeSize,
}: {
  rows: number;
  cols: number;
  changeSize: (
    rows: number | null,
    cols: number | null,
    event: CVFFormEvent
  ) => void;
}) {
  return (
    <Row>
      <Col>
        <Form.Control
          placeholder={'rows'}
          autoComplete="off"
          type="number"
          value={rows}
          onChange={(event) => {
            const parser = numeral(event.target.value);
            changeSize(null, parser.value() || 0, event);
          }}
        />
      </Col>
      <Col>
        <Form.Control
          placeholder={'cols'}
          autoComplete="off"
          type="number"
          value={cols}
          onChange={(event) => {
            const parser = numeral(event.target.value);
            changeSize(parser.value() || 0, null, event);
          }}
        />
      </Col>
    </Row>
  );
}
