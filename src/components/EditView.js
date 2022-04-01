import Input from './Input'
import Button from './Button'
import { useState, useEffect } from 'react'
import { getSetTime } from '../utils/date';


import { useDispatch } from 'react-redux';
import {
  patchExercise, patchSet, deleteSet
} from '../features/exercise/exerciseSlice'

const EditView = ({ exercise, setView }) => {
  const dispatch = useDispatch();

  const [newReps, setNewReps] = useState('');
  const [newWeight, setNewWeight] = useState('');

  // for timer
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive])

  const handleStartTimer = () => {
    setIsActive(true);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTime(0);
  };


  const onWeightChange = (setIndex) => (e) => {
    const { id, value } = getProps(e);
    const prop = `sets[${setIndex}].weight`

    dispatch(patchExercise({ id, prop, value}));
  }

  const onRepChange = (setIndex) => (e) => {
    const { id, value } = getProps(e);
    const prop = `sets[${setIndex}].reps`

    dispatch(patchExercise({ id, prop, value}));
  }

  const onDeleteSet = (setIndex) => (e) => {
    const { id, value } = getProps(e);
    const prop = `sets[${setIndex}].reps`

    dispatch(deleteSet({ id, setIndex }));
  }

  const onNameChange = (e) => {
    const { id, value } = getProps(e);
    const prop = 'name';

    dispatch(patchExercise({ id, prop, value }));
  }

  const getProps = (e) => {
    return { id: exercise.id, value: e.target.value };
  }

  const addNewSet = () => {
    const reps = newReps < 1 ? 1 : newReps;
    const weight = newWeight;
    dispatch(patchSet({ id: exercise.id, reps, weight }));
    handleResetTimer();
    handleStartTimer();
  }

  // complete this as separate component & RowView too
  return (
    <div className="w-full flex flex-col">
      <div className="flex mb-l">
        <Input onChange={onNameChange} placeholder="Exercise Name" value={exercise.name} className="flex-1 box-border mr-m"/>
      </div>
      <div>
        {exercise.sets.map((set, index) => {
          let { reps, weight, created } = set;
          reps = String(reps);
          weight = String(weight);
          created = getSetTime(new Date(created));
          return (
            <div key={index} className="flex items-center mb-l">
              <Input onChange={onRepChange(index)} placeholder="reps" value={reps} className="w-50 mr-m" />
              <Input onChange={onWeightChange(index)} placeholder="weight" value={weight} className="w-50 flex-1 mr-m" />
              <div className="mr-l">{created}</div>
              <button onClick={onDeleteSet(index)} className="mr-m w-btn h-btn text-red text-center border border-red rounded opacity-75	">
                X
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <Input onChange={(e) => { setNewReps(e.target.value) }} placeholder="reps" value={newReps} className="w-50 mr-m" />
        <Input onChange={(e) => { setNewWeight(e.target.value) }} placeholder="weight" value={newWeight} className="w-50 mr-m flex-1" />
        <Button text="Add Set" onClick={() => addNewSet()} className="self-end" />
      </div>
      <div className="flex justify-between">
        <button onClick={() => setView('row')} className="self-end">
          Close
        </button>
        <div className="w-100 flex justify-between align-center text-l">
          <span className="flex-1 text-center">{("0" + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
          <span className="flex-1 text-center">{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>.
          <span className="flex-1 text-center text-red">{("0" + ((time / 10) % 100)).slice(-2)}</span>
        </div>
      </div>
    </div>
  )
}

export default EditView

