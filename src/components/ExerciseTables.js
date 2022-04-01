import ExerciseTable from './ExerciseTable'

const EmptyState = () => (
  <div className="text-black-lite  flex-col flex flex-1 justify-center items-center">
    <h2 className="text-emoji-l">🧘🏻‍♂️</h2>
    <p className="mt-m">you have no exercises.</p>
    <p >add or import below.</p>
  </div>
);

const Tables = ({ sessions }) => (
  <div className="flex flex-col px-l pt-l">
    {sessions.map((session, index) => (
      <ExerciseTable key={index} date={session[0]} session={session[1]} />
    ))}
  </div>
)


const ExerciseTables = ({ sessions }) => {
  return (
    <section className="flex-1 flex flex-col">
      { sessions.length ? <Tables sessions={sessions} /> : <EmptyState /> }
    </section>
  );
}

export default ExerciseTables

