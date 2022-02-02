import './index.scss';
import localForage from 'localforage';
import { extendPrototype } from 'localforage-getitems';
import { useState, useEffect } from 'react'
import { getDate, getDateIndex } from './utils/date';

// components
import ExerciseTables from './components/ExerciseTables'
import Menu from './components/Menu'
import Footer from './components/Footer'


extendPrototype(localForage);

function App() {
  localForage.config({
    name        : 'sessLog',
    version     : 1.0,
    storeName   : 'exercises', // Should be alphanumeric, with underscores.
    description : 'A store for exercise data'
  });

  const [sessions, setSessions] = useState([]);
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

    // Something like [ ['01/25/2022', [] ], ['01/19/2022', []] ]
    // empty array is for exercises to be added in
    const sessionsDate = getDatesArray(exercisesArray)
                        // sort chronologically
                        .sort((a, b) => new Date(b) - new Date(a));

    // Something like [ ['01/19/2022', [{exercise1}, {exercise2}]] ]
    let sessions = loadExercisesIntoDates(sessionsDate, exercisesArray);

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

  const loadExercisesIntoDates = (sessions, exercises) => {
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

  return (
    <div className="flex justify-center items-center sm:w-100 md:w-1/3 md:m-auto">
      <div className="relative h-screen flex-1 flex flex-col">
        <Menu
          newExerciseMode={newExerciseMode}
          setSessions={setSessions}
          sessions={sessions}
          setCurrentExercise={setCurrentExercise}
          currentExercise={currentExercise}
        />

        <ExerciseTables sessions={sessions} />

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
