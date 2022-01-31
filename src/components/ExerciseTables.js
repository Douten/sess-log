import ExerciseTable from './ExerciseTable'

const ExerciseTables = ({ sessions }) => {

  return (
    sessions.length ? (
    <div className="flex flex-col px-l pt-l">
      {sessions.map((session, index) => (
        <ExerciseTable key={index} date={session[0]} session={session[1]} />
      ))}
    </div>
    ) : '--'
  );
}

export default ExerciseTables

