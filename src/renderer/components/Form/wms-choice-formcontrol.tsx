import Form from 'react-bootstrap/Form';
import { WmsFormProps } from './index';
import { WmsPicker } from './wms-picker';

export function WmsChoiceFormControl(props: WmsFormProps) {
  let pickerRef: any = null;
  let option = props.description;
  if (!option) {
    if (typeof props.value === 'string') option = props.value;
    else option = '';
  }
  return (
    <>
      <Form.Control
        autoComplete="off"
        as="select"
        name={props.name}
        value={props.value}
        onMouseDown={() => pickerRef.show()}
      >
        <option>{option}</option>
      </Form.Control>
      <WmsPicker
        onSel={(value: any | null, row: any, event: any) =>
          props.onChange && props.onChange(value, row, event)
        }
        title={props.title}
        header={props.header}
        options={props.options}
        multi={props.multi}
        ref={(ref) => (pickerRef = ref)}
      />
    </>
  );
}
