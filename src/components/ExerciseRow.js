import { useState } from 'react'
import EditView from './EditView'
import RowView from './RowView'

import { useDispatch } from 'react-redux';
import {
  patchExercise
} from '../features/exercise/exerciseSlice'


const ExerciseRow = ({ exercise }) => {
  const dispatch = useDispatch();

  const setViewState = (newView, e = null) => {
    if (e && exercise.view === 'edit') {
      e.preventDefault();
      return;
    }

    if (newView === 'row' && !exercise.name) {
      dispatch(patchExercise({ id: exercise.id, prop: 'name', value: 'New Exercise'}));
    }

    dispatch(patchExercise({ id: exercise.id, prop: 'view', value: newView}));
  }

  return (
    <div onClick={(e) => setViewState('edit', e)} className="flex p-xm gap-m odd:bg-fuschia-60 even:bg-white">
      {
        exercise.view === 'edit' ?
          <EditView exercise={exercise} setView={setViewState} /> :
          <RowView exercise={exercise} />
      }
    </div>
  )
}

export default ExerciseRow

