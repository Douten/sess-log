const Input = ({ setValue, placeholder, type, value, className }) => {

  const inputStyle = `
        border
        border-gray-3
        h-btn
        mb-l
        px-m
        rounded-lg
        text-m
        ${className}
      `;

  return (
    <input
      className={inputStyle}
      type={type}
      pattern={type === 'number' ? "[0-9]*" : ""}
      placeholder={placeholder || value}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Input

