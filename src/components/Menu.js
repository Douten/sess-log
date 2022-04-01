import localForage from 'localforage';
import { useDispatch } from 'react-redux';
import {
  postExercise
} from '../features/exercise/exerciseSlice'

// components
import NewExercise from './NewExercise'

// animation
import FadeIn from  './animations/FadeIn'

const Menu = ({ newExerciseMode, sessions, setSessions, setCurrentExercise, currentExercise }) => {
  const dispatch = useDispatch();

  // Actions
  const addExercise = async ({ exercise, reps, weight }) => {
    const exerciseId = await localForage.length() + 1;
    let createdAt = new Date();

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
      created: createdAt.toJSON()
    }

    setCurrentExercise(newExercise);
    dispatch(postExercise(newExercise));




    window.scrollTo({ top: 0, behavior: 'auto' });


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
    <div className="sticky top-0">
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

