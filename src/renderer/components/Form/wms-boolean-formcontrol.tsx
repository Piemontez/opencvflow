import Form from 'react-bootstrap/Form';
import { WmsFormProps } from './index'

export function WmsBooleanFormControl(props: WmsFormProps) {
    return (
        <Form.Check autoComplete="off" type="switch"
            checked={props.checked}
            id={props.name}
            name={props.name}
            value={props.description || props.value || ""}
            onChange={(event) =>
                props.onChange
                && props.onChange(event.target.value, event.target.value, event)
            }
        />
    );
}