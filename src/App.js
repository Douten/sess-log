import './index.scss';
import localForage from 'localforage';
import { extendPrototype } from 'localforage-getitems';
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
  sessionByDate, loadExercises,
} from './features/exercise/exerciseSlice'

// components
import ExerciseTables from './components/ExerciseTables'
import Footer from './components/Footer'


extendPrototype(localForage);

function App() {
  localForage.config({
    name        : 'sessLog',
    version     : 1.0,
    storeName   : 'exercises', // Should be alphanumeric, with underscores.
    description : 'A store for exercise data'
  });

  const dispatch = useDispatch()
  const sessions = useSelector(sessionByDate);

  // on render
  useEffect(() => {
    const setUp = async () => {
      await dispatch(loadExercises());
    }

    setUp();
  }, [])

  /* === util functions === */

  return (
    <div className="flex justify-center items-center sm:w-100 md:w-1/3 md:m-auto">
      <div className="relative h-screen flex-1 flex flex-col">
        <ExerciseTables sessions={sessions} />

        <Footer
          emptySessions={sessions.length < 1}
        />

      </div>
    </div>
  );
}

export default App;
