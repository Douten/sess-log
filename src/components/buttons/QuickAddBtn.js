import { ReactComponent as PlusIcon } from '../../images/icon/plus.svg';
import { useState } from 'react'

// animations
import AddRotate from  '../animations/AddRotate'

const QuickAddBtn = ({ onClick, closeMode }) => {

  return (
    <AddRotate isClose={closeMode}>
      <button onClick={onClick}>
        <PlusIcon />
      </button>
    </AddRotate>
  );
}

export default QuickAddBtn

