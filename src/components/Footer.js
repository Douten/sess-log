import localForage from 'localforage';
import { useDispatch
 } from 'react-redux';
import {
  postExercise
} from '../features/exercise/exerciseSlice'

// components
import QuickAddBtn from './buttons/QuickAddBtn'

// images
import pointerArrows from '../images/btn-pointer-arrows.png'
import { ReactComponent as DownloadSvg } from '../images/icon/download.svg'
import { ReactComponent as UploadSvg } from '../images/icon/upload.svg'

const Footer = ({ emptySessions }) => {
  const dispatch = useDispatch();

  // Actions
  const downloadJson = async (fileName, contentType) => {
    const dbItems = await localForage.getItems();
    const exercisesArray = Object.values(dbItems);

    let a = document.createElement("a");
    const content = JSON.stringify(exercisesArray, null, 2);
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
          promises.push(localForage.setItem(exercise.id.toString(), exercise));
        });
      };
    } catch (error) {
      alert('There was an error uploading your file. Please try again.')
    }

    try {
        // clear db
        await localForage.clear();
        // populate w/ new data
        await Promise.all(promises);
        // load to state
      } catch (error) {
        alert('There was an error processing your file. Please check its content.');
      }
  };

  const addNewExercise = async (e) => {
    const exerciseId = await localForage.length() + 1;
    let createdAt = new Date();

    // set up new exercise
    const newExercise = {
      id: exerciseId,
      name: '',
      sets: [
        // {
        //   reps: '',
        //   weight: '',
        //   created: ''
        // }
      ],
      massType: 'lb',
      created: createdAt.toJSON(),
      view: 'edit'
    }

    dispatch(postExercise(newExercise));


    window.scrollTo({ top: 0, behavior: 'auto' });

    // update db, a lot simpler
    await localForage.setItem(exerciseId.toString(), newExercise);
  }

  // Component & Helpers
  const ArrowPointers = () => (
    <div className="absolute flex-1 w-fit btn-arrow-pointers">
      <img className="w-7/10" src={pointerArrows} alt="Arrows pointing to action buttons" />
    </div>
  );

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

  const DataButton = ({ type, onClick }) => (
    <button className={circleBtnClass} onClick={onClick}>
      { type === 'upload'
          ? <UploadSvg className="w-xm h-xm stroke-white"  />
          : <DownloadSvg className="w-xm h-xm stroke-white"  />
      }
    </button>
  )

  return (
    <div className="sticky self-end mr-m bottom-m flex items-end">
      <input id="uploadJsonInput" type="file" className="hidden" onChange={uploadJson}/>
      { emptySessions ? <ArrowPointers /> : null }
      <DataButton type="upload" onClick={openUploader} />
      <DataButton type="download" onClick={downloadJson} />
      <QuickAddBtn onClick={addNewExercise} />
    </div>
  );
}

export default Footer

