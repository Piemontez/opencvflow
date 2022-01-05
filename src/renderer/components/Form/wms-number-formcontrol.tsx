import numeral from 'numeral';
import Form from 'react-bootstrap/Form';
import { WmsFormProps } from './index';

export function WmsIntegerFormControl(props: WmsFormProps) {
    return (
        <Form.Control autoComplete="off" type="text"
            name={props.name}
            disabled={props.disabled}
            value={props.description || props.value}
            onChange={(event) => {
                if (props.onChange) {
                    const parser = numeral(event.target.value);
                    props.onChange(
                        parser.value(),
                        parser.format(),
                        event
                    );
                }
            }}
        />
    );
}

export function WmsDecimalFormControl(props: WmsFormProps) {
    return (
        <Form.Control autoComplete="off" type="text"
            name={props.name}
            disabled={props.disabled}
            value={props.description || props.value || ""}
            onChange={(event) => {
                if (props.onChange) {
                    const parser = numeral(event.target.value);
                    props.onChange(
                        parser.value(),
                        parser.format(),
                        event
                    );
                }
            }}
        />
    );
}