import Form from 'react-bootstrap/Form';
import { CVFFormProps } from "./types/CVFFormProps";

export function CVFBooleanFormControl(props: CVFFormProps) {
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
