const ExerciseInput = ({ setProp, type, value }) => {

  const inputType = type !== 'exercise' ? 'number' : 'text';

  const inputStyle = `
        border
        border-gray-3
        box-content
        h-btn
        mb-l
        px-m
        rounded-lg
        text-m`;

  return (
    <input
      className={inputStyle}
      type={inputType}
      pattern={inputType === 'number' ? "[0-9]*" : ""}
      placeholder={type}
      value={value}
      onChange={(e) => setProp(type, e.target.value)}
    />
  );
}

export default ExerciseInput

