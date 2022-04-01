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

    const id = exercise.id;

    if (newView === 'row') {
      if (!exercise.name) {
        const prop = 'name';
        const value = 'New Exercise';
        dispatch(patchExercise({ id, prop, value}));
      }

      if (exercise.sets.length < 1) {
        const prop = 'sets[0]';
        const value = { reps: '1', weight: '', created: new Date().toJSON() };
        dispatch(patchExercise({ id, prop, value}));
      }

      if (exercise.sets.find((set) => set.reps < 1)) {
        exercise.sets.forEach((set, index) => {
          if (set.reps < 1) {
            const prop = `sets[${index}].reps`;
            const value = '1';
            dispatch(patchExercise({ id, prop, value}));
          }
        });
      }
    }

    dispatch(patchExercise({ id, prop: 'view', value: newView}));
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

