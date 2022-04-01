const RowView = ({ exercise }) => {
  return (
    <>
      <span className="truncate w-1/3">
        {exercise.name}
      </span>
      <div className="flex flex-s gap-1 flex-wrap text-m">
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
}

export default RowView

