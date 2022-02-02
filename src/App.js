import './index.scss';
import localForage from 'localforage';
import { extendPrototype } from 'localforage-getitems';
import { useState, useEffect } from 'react'

// components
import ExerciseTables from './components/ExerciseTables'
import NewExercise from './components/NewExercise'
import QuickAddBtn from './components/buttons/QuickAddBtn'

// animations
import FadeIn from  './components/animations/FadeIn'

// icons
import { ReactComponent as DownloadSvg } from './images/icon/download.svg'
import { ReactComponent as UploadSvg } from './images/icon/upload.svg'
import pointerArrows from './images/btn-pointer-arrows.png'



extendPrototype(localForage);

var threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

var oneDayAgo = new Date();
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

const Exercises2 = [
  {
    id: 4,
    name: 'Chest Press',
    sets: [
      { weight: 100, reps: 8, side: null },
      { weight: 100, reps: 6, side: null },
      { weight: 85, reps: 7, side: null }
    ],
    massType: 'lb', // Lb or Kg
    lengthType: 'm',
    created: threeDaysAgo,
    updated: null
  },
  {
    id: 5,
    name: 'Pull ups',
    sets: [
      { reps: 8 },
      { reps: 7 },
      { reps: 6 }
    ],
    massType: 'lb', // Lb or Kg
    created: threeDaysAgo,
    updated: null
  },
  {
    id: 6,
    name: 'Leg Press',
    sets: [
      { weight: 220, reps: 8 }, //
      { weight: 220, reps: 8 },
      { weight: 205, reps: 8 }
    ],
    massType: 'lb', // Lb or Kg
    created: threeDaysAgo,
    updated: null
  }
]

const Exercises = [
  {
    id: 1,
    name: 'Pec Fly Long Ass Name',
    sets: [
      { weight: 100, reps: 8, side: null }, //
      { weight: 100, reps: 6, side: null },
      { weight: 100, reps: 4, side: null },
      { weight: 100, reps: 3, side: null },
      { weight: 100, reps: 7, side: null }
    ],
    massType: 'lb', // Lb or Kg
    lengthType: 'm',
    created: oneDayAgo,
    updated: null
  },
  {
    id: 2,
    name: 'Torso Rotate',
    sets: [
      { weight: 155, reps: 5, side: 'left' },
      { weight: 155, reps: 7, side: 'right' }
    ],
    massType: 'lb', // Lb or Kg
    created: oneDayAgo,
    updated: null
  },
  {
    id: 3,
    name: 'Abs crunch',
    sets: [
      { reps: 8 },
      { reps: 8 },
      { reps: 7 }
    ],
    massType: 'lb', // Lb or Kg
    created: oneDayAgo,
    updated: null
  }
]

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

  const toggleNewExercise = () => {
    return async() => {
      await setNewExerciseMode(!newExerciseMode)
    }
  }

  const downloadJson = async (fileName, contentType) => {
    const dbItems = await localForage.getItems();
    const exercisesArray = Object.values(dbItems);

    let a = document.createElement("a");
    const content = JSON.stringify(exercisesArray, null, 2);
    console.log('content', content);
    var file = new Blob([content], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);

    a.download = `sess-log-exercises-${exercisesArray.length}.json`;
    a.click();
  }

  const openUploader = () => {
    let uploadInput = document.getElementById('uploadJsonInput');
    uploadInput.click();
  }

  const uploadJson = async (e) => {
    let promises =[];

    try {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        let exercises = JSON.parse(e.target.result);

        exercises.forEach(async (exercise) => {
          console.log('exercise', exercise);
          promises.push(localForage.setItem(exercise.id.toString(), exercise));
        });
      };
    } catch (error) {
      console.log('error 1', error);
      alert('There was an error uploading your file. Please try again.')
    }

    try {
        // clear db
        await localForage.clear();
        // populate w/ new data
        await Promise.all(promises);
        // load to state
        let newSessions = await loadSessions();
        await setSessions(newSessions);
        console.log('')
      } catch (error) {
        console.log('error 2', error);
        alert('There was an error processing your file. Please check its content.');
      }
  };

  const circleBtnClass = `
    rounded-full
    bg-pink
    flex
    h-btn
    items-center
    justify-center
    w-btn
    mr-s
  `;

  const btnArrows = (
    <div className="absolute flex-1 w-fit btn-arrow-pointers">
      <img className="w-7/10" src={pointerArrows} alt="Arrows pointing to action buttons" />
    </div>
  );

  return (
    <div className="flex justify-center items-center sm:w-100 md:w-1/3 md:m-auto">
      <input id="uploadJsonInput" type="file" className="hidden" onChange={uploadJson}/>
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
        <div className="sticky self-end mr-m bottom-m flex items-end">
          { sessions.length > 0 ? null : btnArrows }
          <button className={circleBtnClass} onClick={openUploader}>
            <UploadSvg className="w-xm h-xm stroke-white"  />
          </button>
          <button className={circleBtnClass} onClick={downloadJson}>
            <DownloadSvg className="w-xm h-xm stroke-white" />
          </button>
          <QuickAddBtn closeMode={newExerciseMode} onClick={toggleNewExercise()} />
        </div>
      </div>
    </div>
  );
}

export default App;
