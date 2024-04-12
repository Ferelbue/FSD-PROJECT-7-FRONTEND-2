import "./CustomNumber.css";

export const CustomNumber = ({ className, type, placeholder, name, disabled, value, min, defaultvalue, onChangeFunction, onBlurFunction }) => {

    return (
        <input
            className={className}
            type={type}
            placeholder={placeholder}
            name={name}
            disabled={disabled}
            value={value}
            min={min}
            defaultValue={defaultvalue}
            onChange={onChangeFunction}
        />
    )
}