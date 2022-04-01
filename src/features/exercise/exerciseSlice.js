import { createSlice } from '@reduxjs/toolkit'
import localForage from 'localforage';
import { getDate, getDateIndex } from '../../utils/date';
import set from 'lodash/set';

const initialState = []

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    addSet: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.value += 1
      console.log('addSet', state, action);
      const { id, reps, weight } = action.payload;
      const created = new Date().toJSON();
      let exercise = state.find((exercise) => exercise.id === id);
      exercise.sets.push({reps, weight, created});
    },
    removeSet: (state, action) => {
      const { id, setIndex } = action.payload;
      let exercise = state.find((exercise) => exercise.id === id);
      exercise.sets.splice(setIndex, 1);
    },
    addExercise: (state, action) => {
      // state.value -= 1
      // state = [action.payload, ...state];
      state.push(action.payload);
    },
    editExercise: (state, action) => {
      const { id, prop, value } = action.payload;
      console.log(id, prop, value);
      let exercise = state.find((exercise) => exercise.id === id);
      set(exercise, prop, value);
    }
  }
})


// the outside "thunk creator" function
export const loadExercises = () => {
  // the inside "thunk function"
  return async (dispatch, getState) => {
    try {
      // make an async call in the thunk
      const dbItems = await localForage.getItems();
      const exercisesArray = Object.values(dbItems);
      exercisesArray.forEach((exercise) => {
        dispatch(addExercise(exercise));
      });
      return true;
    } catch (err) {
      // If something went wrong, handle it here
    }
  }
}

// the outside "thunk creator" function
export const postExercise = exercise => {
  // the inside "thunk function"
  return async (dispatch, getState) => {
    console.log('posting exercise');
    console.log('exercise', exercise);
    try {
      // make an async call in the thunk
      await localForage.setItem(exercise.id.toString(), exercise);
      dispatch(addExercise(exercise));
      return true;
    } catch (err) {
      console.log('err', err);
      // If something went wrong, handle it here
    }
  }
}

export const patchExercise = ({ id, prop, value }) => {
  return async (dispatch, getState) => {
    console.log('patchExercise');
    try {
      // make an async call in the thunk

      await dispatch(editExercise({ id, prop, value }));
      const { exercise: exercises } = getState();
      console.log('exercises', exercises)
      const exercise = exercises.find((exercise) => exercise.id === id);
      // let exercise = state.find((exercise) => exercise.id === id);
      console.log('exercise after patch', exercise);
      await localForage.setItem(exercise.id.toString(), exercise);
      return true;
    } catch (err) {
      console.log('patchExercise err', err);
      // If something went wrong, handle it here
    }
  }
}

export const patchSet = ({ id, reps, weight }) => {
  return async (dispatch, getState) => {
    try {
      await dispatch(addSet({ id, reps, weight }));
      const { exercise: exercises } = getState();
      const exercise = exercises.find((exercise) => exercise.id === id);
      await localForage.setItem(exercise.id.toString(), exercise);
      return true;
    } catch (err) {
      console.log('patchSet err', err);
    }
  }
}

export const deleteSet = ({ id, setIndex }) => {
  return async (dispatch, getState) => {
    try {
      await dispatch(removeSet({ id, setIndex }));
      const { exercise: exercises } = getState();
      const exercise = exercises.find((exercise) => exercise.id === id);
      await localForage.setItem(exercise.id.toString(), exercise);
      return true;
    } catch (err) {
      console.log('patchSet err', err);
    }
  }
}

export const sessionByDate = (data) => {
  if (data?.exercise?.length) {
    const sessionsDate = getDatesArray(data.exercise)
                        // sort chronologically
                        .sort((a, b) => new Date(b) - new Date(a));

    // Something like [ ['01/19/2022', [{exercise1}, {exercise2}]] ]
    let sessions = loadExercisesIntoDates(sessionsDate, data.exercise);

    return sessions;
  } else {
    return [];
  }
}

/* === util functions === */

const getDatesArray = (exercises) => {

  if (exercises?.length > 1) {
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
  } else {
    return [];
  }

}

const loadExercisesIntoDates = (sessions, exercises) => {
  let populatedSession = sessions;

  exercises.forEach(exercise => {
    let createdAt = getDate(new Date(exercise.created));
    const index = getDateIndex(populatedSession, createdAt);

    if (index >= 0) {
      populatedSession[index][1].unshift(exercise);
    }
  });

  return populatedSession;
}

export const { addSet, addExercise, editExercise, removeSet } = exerciseSlice.actions

export default exerciseSlice.reducer