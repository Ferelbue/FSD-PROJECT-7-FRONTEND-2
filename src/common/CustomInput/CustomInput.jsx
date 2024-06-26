import "./CustomInput.css";

export const CustomInput = ({ className, type, placeholder, name, disabled, value, onChangeFunction, onBlurFunction }) => {

    return (
        <input
            className={className}
            type={type}
            placeholder={placeholder}
            name={name}
            disabled={disabled}
            value={value}
            onChange={onChangeFunction}
            onBlur={onBlurFunction}
        />
    )
}