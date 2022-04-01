const Input = ({ onChange, placeholder, type, value, className, indexKey }) => {

  const inputStyle = `
        border
        border-gray-3
        h-btn
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
      onChange={(e) => onChange(e)}
      data-index-key={indexKey}
    />
  );
}

export default Input

