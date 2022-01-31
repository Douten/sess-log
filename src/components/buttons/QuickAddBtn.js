import { ReactComponent as PlusIcon } from '../../images/icon/plus.svg';
import { useState } from 'react'

// animations
import AddRotate from  '../animations/AddRotate'

const QuickAddBtn = ({ onClick, closeMode }) => {

  const [exitMode, setExitMode] = useState(false);

  const clickAction = () => {
    setExitMode(!exitMode);
    onClick();
  }

  return (
    <AddRotate isClose={closeMode}>
      <button onClick={clickAction}>
        <PlusIcon />
      </button>
    </AddRotate>
  );
}

export default QuickAddBtn

