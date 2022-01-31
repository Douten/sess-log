import ExerciseRow from './ExerciseRow'

const ExerciseTable = ({ session, date }) => {
  return (
    session ? (
      <div>
        <h2>
          {date}
        </h2>
        <div className="flex flex-col mb-6">
          {session.map((exercise) => (
            <ExerciseRow key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    ) : ''
  )
}

export default ExerciseTable

