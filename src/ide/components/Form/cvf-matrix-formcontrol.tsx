import cv, { Mat } from 'opencv-ts';
import numeral from 'numeral';
import { Col, Row, Form } from 'react-bootstrap';
import { CVFFormEvent } from './types/CVFFormEvent';
import { CVFFormProps } from './types/CVFFormProps';
import GCStore from '../../contexts/GCStore';

enum MatrixType {
  OneZero,
  Int,
}

function BaseMatrixFormControl(props: CVFFormProps, type: MatrixType) {
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
      if (!value.cols && !value.rows) {
        const startMat = new cv.Mat(1, 1, cv.CV_8U, new cv.Scalar(0));
        //GCStore.add(value);
        props.onChange(startMat, null, event);
      } else if (cols !== null) {
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

          GCStore.add(value);
          GCStore.add(zs);
          GCStore.add(vector);

          props.onChange(dst, null, event);
        } else {
          GCStore.add(value);
          const roi = value.roi(new cv.Rect(0, 0, cols, value.rows));
          props.onChange(roi, null, event);
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

          GCStore.add(value);
          GCStore.add(zs);
          GCStore.add(vector);

          props.onChange(dst, null, event);
        } else {
          GCStore.add(value);
          const roi = value.roi(new cv.Rect(0, 0, value.cols, rows));
          props.onChange(roi, null, event);
        }
      }
    }
  };

  const rowsSeries = Array.from(Array(rows).keys());
  const colsSeries = Array.from(Array(cols).keys());

  let fields = null;
  switch (type) {
    case MatrixType.Int:
      fields = rowsSeries.map((row) => (
        <Row key={row}>
          {colsSeries.map((col) => (
            <Col key={col}>
              <Form.Control
                type="number"
                value={value.ucharAt(row, col)}
                onChange={(event) => {
                  const parser = numeral(event.target.value);
                  value.ucharPtr(row, col)[0] = parser.value() || 0;
                  if (props.onChange) props.onChange(value, null, event);
                }}
              />
            </Col>
          ))}
        </Row>
      ));
      break;
    case MatrixType.OneZero:
    default:
      fields = rowsSeries.map((row) => (
        <Row key={row}>
          {colsSeries.map((col) => (
            <Col key={col}>
              <Form.Check
                type="checkbox"
                checked={value.charAt(row, col) !== 0}
                onChange={(event) => {
                  value.charPtr(row, col)[0] = !value.charAt(row, col) ? 1 : 0;
                  if (props.onChange) props.onChange(value, null, event);
                }}
              />
            </Col>
          ))}
        </Row>
      ));
  }
  return (
    <>
      <MatrixSizeComp rows={rows} cols={cols} changeSize={changeSize} />
      {fields}
    </>
  );
}

/**
 * Cria um componente para editar o Mat com atributos inteiros
 * @param props
 */
export function OCVIntMatrixFormControl(props: CVFFormProps) {
  return BaseMatrixFormControl(props, MatrixType.Int);
}

/**
 * Cria um componente para editar o Mat com atributos 0 e 1
 * @param props
 */
export function OCVOneZeroMatrixFormControl(props: CVFFormProps) {
  return BaseMatrixFormControl(props, MatrixType.OneZero);
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
