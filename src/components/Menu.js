import localForage from 'localforage';
import { getDate, getDateIndex } from '../utils/date';

// components
import NewExercise from './NewExercise'

// animation
import FadeIn from  './animations/FadeIn'

const Menu = ({ newExerciseMode, sessions, setSessions, setCurrentExercise, currentExercise }) => {

  // Actions
  const addExercise = async ({ exercise, reps, weight }) => {
    const exerciseId = (sessions.length + 1);
    // set up new exercise
    const newExercise = {
      id: exerciseId,
      name: exercise,
      sets: [
        {
          reps,
          weight
        }
      ],
      massType: 'lb',
      created: new Date()
    }
    setCurrentExercise(newExercise);

    // get vars for exercise placement in sessions
    const createdAt = getDate(new Date(newExercise.created));
    const index = getDateIndex(sessions, createdAt);

    // get updated or new session to add
    let sessToAdd;

    if (index >= 0) {
      sessToAdd = [createdAt,[newExercise].concat(sessions[index][1])];
    } else {
      sessToAdd = [createdAt, [newExercise]];
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    // this assumes that exercises are always inserted into the newest session
    // you can't add exercises to past sessions (for now)

    console.log('sessToAdd', sessToAdd);
    await setSessions([sessToAdd, ...sessions.slice(1)]);

    console.log('added, sessions =>', sessions);

    // update db, a lot simpler
    await localForage.setItem(exerciseId.toString(), newExercise);
  }

  const addReps = async({ reps, weight }) => {
    let exercise = currentExercise;
    exercise.sets.push({ reps, weight });

    await setCurrentExercise(exercise);

    let updatedExercises = [ exercise, ...sessions[0][1].slice(1) ];
    let updatedSession = [ sessions[0][0], updatedExercises ];

    // update state
    await setSessions([updatedSession, ...sessions.slice(1)]);
    // update db
    await localForage.setItem(exercise.id.toString(), exercise);
  }

  return (
    <div className="sticky top-0 flex-1">
      <FadeIn isVisible={newExerciseMode}>
        <NewExercise
          addExercise={addExercise}
          addReps={addReps}
        />
      </FadeIn>
    </div>
  );
}

export default Menu

