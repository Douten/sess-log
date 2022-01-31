const ExerciseRow = ({ exercise }) => {
  return (
    <div className="flex p-xm gap-m odd:bg-fuschia-60 even:bg-white">
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
    </div>
  )
}

export default ExerciseRow

