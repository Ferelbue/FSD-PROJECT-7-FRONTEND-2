import "./CustomTextArea.css";

export const CustomTextArea = ({ className, type, placeholder, name, disabled, value, onChangeFunction, onBlurFunction }) => {

    return (
        <textarea
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