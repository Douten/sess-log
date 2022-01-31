import './index.css';
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

      const createdAt = getDate(currentItem['created']);
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
      let createdAt = getDate(exercise['created']);

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
    const createdAt = getDate(newExercise.created);
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

  const downloadJson = (fileName, contentType) => {
    var a = document.createElement("a");
    const content = JSON.stringify(sessions);
    console.log('content', content);
    var file = new Blob([content], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = 'session-json.json';
    a.click();
  }

  const openUploaded = () => {
    let uploadInput = document.getElementById('uploadJsonInput');
    uploadInput.click();
  }

  const uploadJson = e => {

    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {

      let sessionData = JSON.parse(e.target.result);

      console.log("sessionData", sessionData);


      setSessions(sessionData);

      // setFiles(e.target.result);
    };
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

  return (
    <div className="flex justify-center items-center w-100">
      <input id="uploadJsonInput" type="file" className="hidden" onChange={uploadJson}/>
      <div className="relative flex flex-col">
        <FadeIn isVisible={newExerciseMode} className="sticky top-0">
          <NewExercise
            addExercise={addExercise}
            addReps={addReps}
          />
        </FadeIn>
        <section>
          <ExerciseTables sessions={sessions} />
        </section>
        <div className="sticky self-end mr-m bottom-m flex items-end">
          <button className={circleBtnClass} onClick={downloadJson}>
            <DownloadSvg className="w-xm h-xm stroke-white" />
          </button>
          <button className={circleBtnClass} onClick={openUploaded}>
            <UploadSvg className="w-xm h-xm stroke-white"  />
          </button>
          <QuickAddBtn closeMode={newExerciseMode} onClick={toggleNewExercise()} />
        </div>
      </div>
    </div>
  );
}

export default App;
