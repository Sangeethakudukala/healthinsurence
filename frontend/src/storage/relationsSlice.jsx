
// import { createSlice } from '@reduxjs/toolkit';

 // Initialize the state from sessionStorage, or fallback to an empty array
// const initialState = {
//   selectedRelations: JSON.parse(sessionStorage.getItem('selectedRelations')) || [],
// };
// const initialState1 = {
//     selectedRelations: JSON.parse(sessionStorage.getItem('selectedRelations')) || [],
//   };

// const relationsSlice = createSlice({
//   name: 'relations',
//   initialState,
//   reducers: {
//     setSelectedRelations: (state, action) => {
//       // Update the Redux state
//       state.selectedRelations = action.payload;

//       // Save to sessionStorage
//       sessionStorage.setItem('selectedRelations', JSON.stringify(action.payload));
//     },
//   },
// });

// export const { setSelectedRelations } = relationsSlice.actions;

// export default relationsSlice.reducer;





import { createSlice } from '@reduxjs/toolkit';

// Initialize the state from sessionStorage, or fallback to default values
const initialState = {
  selectedRelations: JSON.parse(sessionStorage.getItem('selectedRelations')) || [],
  age: JSON.parse(sessionStorage.getItem('age')) || null,
  disease: JSON.parse(sessionStorage.getItem('disease')) || null,
};

const relationsSlice = createSlice({
  name: 'relations',
  initialState,
  reducers: {
    setSelectedRelations: (state, action) => {
      // Update the selectedRelations in Redux state
      state.selectedRelations = action.payload;

      // Save to sessionStorage
      sessionStorage.setItem('selectedRelations', JSON.stringify(action.payload));
    },
    setAge: (state, action) => {
      // Update the age in Redux state
      state.age = action.payload;

      // Save to sessionStorage
      sessionStorage.setItem('age', JSON.stringify(action.payload));
    },
    setDisease: (state, action) => {
      // Update the disease in Redux state
      state.disease = action.payload;

      // const { index, disease } = action.payload;
      // state.disease[index] = disease;

      // Save to sessionStorage
      sessionStorage.setItem('disease', JSON.stringify(action.payload));
    },
  },
});

export const { setSelectedRelations, setAge, setDisease } = relationsSlice.actions;

export default relationsSlice.reducer;
