import { configureStore } from '@reduxjs/toolkit';
import relationsReducer from './relationsSlice';

const store = configureStore({
  reducer: {
    relations: relationsReducer,
  },
});

export default store;
