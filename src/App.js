import './index.scss';
import localForage from 'localforage';
import { extendPrototype } from 'localforage-getitems';
import { useState, useEffect } from 'react'

// components
import ExerciseTables from './components/ExerciseTables'
import NewExercise from './components/NewExercise'
import Footer from './components/Footer'

// animations
import FadeIn from  './components/animations/FadeIn'


extendPrototype(localForage);

function App() {
  localForage.config({
    name        : 'sessLog',
    version     : 1.0,
    storeName   : 'exercises', // Should be alphanumeric, with underscores.
    description : 'A store for exercise data'
  });

  const [sessions, setSessions] = useState([]);
  const [exerciseId, setExerciseId] = useState();
  const [currentExercise, setCurrentExercise] = useState();
  const [newExerciseMode, setNewExerciseMode] = useState(false);

  // on render
  useEffect(() => {
    const setUp = async () => {
      const sessions = await loadSessions()
      setSessions(sessions)
    }

    setUp();
  }, [])

  // Sessions (by date) > Exercises > Sets > Reps & Weight
  async function loadSessions() {
    // let sessions = await localForage.getItems();
    const dbItems = await localForage.getItems();
    const exercisesArray = Object.values(dbItems);

    // set id for new exercises
    setExerciseId(exercisesArray.length + 1);

    // Something like [ ['01/25/2022', [] ], ['01/19/2022', []] ]
    // empty array is for exercises to be added in
    const sessionsDate = getDatesArray(exercisesArray)
                        // sort chronologically
                        .sort((a, b) => new Date(b) - new Date(a));

    console.log('sessionsDate', sessionsDate);

    // Something like [ ['01/19/2022', [{exercise1}, {exercise2}]] ]
    let sessions = loadExercises(sessionsDate, exercisesArray);

    return sessions;
  }

  /* === util functions === */

  const getDatesArray = (exercises) => {
    return exercises.reduce((result, currentItem) => {

      const createdAt = getDate(new Date(currentItem['created']));
      // see if currentItem belongs to an existing date in the array already
      const index = getDateIndex(result, createdAt);
      // if not, add the date to the array
      if (index < 0) {
        result.unshift([createdAt, []]);
      }

      return result;
    }, []);
  }

  const getDate = (dateObject) => {
    return dateObject.toLocaleString('en-US', { day: '2-digit', month: '2-digit',year: 'numeric' });
  }

  const getDateIndex = (session, date) => {
    return session.findIndex(storedDate =>  storedDate[0] === date);
  }

  /* === CRUD functions === */
  const loadExercises = (sessions, exercises) => {
    let populatedSession = sessions;

    exercises.forEach(exercise => {
      let createdAt = getDate(new Date(exercise.created));
      console.log('createdAt', createdAt);

      const index = getDateIndex(populatedSession, createdAt);

      if (index >= 0) {
        populatedSession[index][1].unshift(exercise);
      }
    });

    return populatedSession;
  }

  const addExercise = async ({ exercise, reps, weight }) => {
    console.log('exerciseId', exerciseId);
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

    console.log('index', index)

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
    // increase id count
    await setExerciseId(exerciseId + 1);
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
    <div className="flex justify-center items-center sm:w-100 md:w-1/3 md:m-auto">
      <div className="relative h-screen flex-1 flex flex-col">
        <FadeIn isVisible={newExerciseMode} className="sticky top-0">
          <NewExercise
            addExercise={addExercise}
            addReps={addReps}
          />
        </FadeIn>

        <section className="flex-1 flex flex-col">
          <ExerciseTables sessions={sessions} />
        </section>

        <Footer
          emptySessions={sessions.length < 1}
          newExerciseMode={newExerciseMode}
          setNewExerciseMode={setNewExerciseMode}
          loadSessions={loadSessions}
          setSessions={setSessions}
        />

      </div>
    </div>
  );
}

export default App;
