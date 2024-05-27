import {FormControlLabel, Radio, RadioGroup} from "@mui/material";


export default function RadioGroupToggle({ trueLabel, falseLabel, value, onChange }) {
    const handleChange = (event) => {
        onChange(event.target.value === 'true');
    };

    return <RadioGroup row
        name="permission"
        value={String(Boolean(value))}
        onChange={handleChange}
    >
        <FormControlLabel
            value="true"
            control={<Radio color="primary" />}
            label="Allowed"
        />
        <FormControlLabel
            value="false"
            control={<Radio color="primary" />}
            label="Disallowed"
        />
    </RadioGroup>;
}