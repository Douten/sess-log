import { useState } from 'react'
import ExerciseInput from './ExerciseInput'
import Button from './Button'


const NewExercise = ({ addExercise, addReps, show }) => {
  const [exercise, setExercise] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [addRepsMode, setAddRepsMode] = useState(false);

  // var to provide dynamic way of setting states
  const set = {
    exercise: setExercise,
    reps: setReps,
    weight: setWeight,
    repsMode: setAddRepsMode
  }

  const setProp = async (type, value) => {
    await set[type](value);
  }

  const toggleRepMode = async () => {
    console.log('repsMode before toggle', addRepsMode);
    await set.repsMode(!addRepsMode);
    console.log('repsMode after toggle', addRepsMode);
  }

  const recordData = async () => {
    if (!addRepsMode) {
      addExercise({ exercise, reps: parseInt(reps), weight: parseInt(weight) });
      await setAddRepsMode(true);
      console.log('addRepsMode', addRepsMode);
    } else {
      addReps({ reps: parseInt(reps), weight: parseInt(weight) });
    }
  }


  const divClass = `
    backdrop-blur-md
    bg-white/20
    border-b
    border-gray-1
    drop-shadow
    flex
    flex-col
    items-start
    pt-l
    px-l
    sticky
    top-0
  `;

  // Template variables
  return (
    <div className={divClass}>
      <h2>Today's Workout 💪🏻</h2>
      <div className="flex flex-col w-full">
        {
          addRepsMode
            ? <h4 className="mb-l flex items-center">
              <span className="inline-block mr-m">
                {exercise}
              </span>
              <Button type="icon" size="s" icon="x" alt="close icon" onClick={toggleRepMode} />
            </h4>
            : <ExerciseInput setProp={setProp} type="exercise" value={exercise} />
        }
        <ExerciseInput setProp={setProp} type="reps" value={reps} />
        <ExerciseInput setProp={setProp} type="weight" value={weight} />
      </div>
      <Button onClick={recordData} text={ addRepsMode ? "Add Reps" : "Add Exercise" } className="self-end"/>
    </div>
  )
}

export default NewExercise

