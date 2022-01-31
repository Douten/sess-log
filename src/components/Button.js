import { ReactComponent as CloseX } from '../images/icon/x.svg';

const Button = ({ alt, className, icon, size, onClick, text, type }) => {
  const btnStyle = `
        box-content
        bg-blue
        h-btn
        mb-l
        px-m
        rounded-lg
        text-s
        text-white
        ${className}`;

  const iconStyle = `
    rounded-full
    p-2
    border
    border-gray-3
    w-xxm
    h-xxm
    flex
    justify-center
    items-center
    group
    hover:border-red
  `

  const iconMode = type === "icon";

  return (
    <button className={iconMode ? iconStyle : btnStyle} onClick={onClick} >
      {text}
      {iconMode ? <CloseX className="fill-gray-3" /> : "" }
    </button>
  );
}

export default Button

