import { configureStore } from '@reduxjs/toolkit'
import exerciseReducer from '../features/exercise/exerciseSlice'

export default configureStore({
  reducer: {
    exercise: exerciseReducer
  }
})