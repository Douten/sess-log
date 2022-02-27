import { useState } from 'react'
import Input from './Input'
import Button from './Button'


const ExerciseRow = ({ exercise }) => {

  const [showEditForm, setShowEditForm] = useState(false);

  const toggleMode = () => {
    setShowEditForm(!showEditForm);
  }

  const ReadMode = () => (
    <>
      <span className="truncate w-1/3">
        {exercise.name}
      </span>
      <div className="flex flex-1 gap-1 flex-wrap text-m">
        {exercise.sets.map((set, index) => {
          let { reps, weight } = set;

          let insertComa = index < (exercise.sets.length - 1);
          return (
            <span key={index} className="whitespace-nowrap">
              {reps}{weight ? `x${weight}` : ''}{insertComa && ', '}
            </span>
          );
        })}
      </div>
    </>
  );

  const EditMode = () => (
    <div className="w-full flex flex-col">
      <div className="flex">
        <div className="w-maxx flex">
          <Input placeholder="exercise" value={exercise.name} className="flex-1 w-full box-border mr-m"/>
        </div>
        <div>
          {exercise.sets.map((set, index) => {
            let { reps, weight } = set;
            reps = String(reps);
            weight = String(weight);
            return (
              <div key={index} className="flex">
                <Input placeholder="reps" value={reps} className="w-50 mr-m" />
                <Input placeholder="weight" value={weight} className="w-50" />
                <Button text="Add Set" className="self-end"/>
              </div>
            );
          })}
        </div>
      </div>
      <div className="">
        <Button onClick={toggleMode} text="Close" className="self-end"/>
      </div>
    </div>
  );


  return (
    <div onClick={showEditForm ? null : toggleMode} className="flex p-xm gap-m odd:bg-fuschia-60 even:bg-white">
      {showEditForm ? <EditMode /> : <ReadMode />}
    </div>
  )
}

export default ExerciseRow

