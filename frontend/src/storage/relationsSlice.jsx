
// import { createSlice } from '@reduxjs/toolkit';

// // Initialize the state from sessionStorage, or fallback to default values
// const initialState = {
//   selectedRelations: JSON.parse(sessionStorage.getItem('selectedRelations')) || [],
//   age: JSON.parse(sessionStorage.getItem('age')) || null,
//   disease: JSON.parse(sessionStorage.getItem('disease')) || null,
//   sumAssured1: Number(sessionStorage.getItem("sumAssured1")) || 500000,
//   preExisting1: sessionStorage.getItem("preExisting1") === "true" || false,
//   preExistingAmount1: Number(sessionStorage.getItem("preExistingAmount1")) || 0,
//   finalPremium1: Number(sessionStorage.getItem("finalPremium1")) || 0,
//   selectedDuration1: sessionStorage.getItem("selectedDuration1") || "1 Year",
//   initialPremium1: Number(sessionStorage.getItem("initialPremium1")) || 0, // Store initial premium
// };

// const relationsSlice = createSlice({
//   name: 'relations',
//   initialState,
//   reducers: {
//     setSelectedRelations: (state, action) => {
//       state.selectedRelations = action.payload;
//       sessionStorage.setItem('selectedRelations', JSON.stringify(action.payload));
//     },
//     setAge: (state, action) => {
//       state.age = action.payload;
//       sessionStorage.setItem('age', JSON.stringify(action.payload));
//     },
//     setDisease: (state, action) => {
//       state.disease = action.payload;
//       sessionStorage.setItem('disease', JSON.stringify(action.payload));
//     },
//     setSumAssured1: (state, action) => {
//       state.sumAssured1 = action.payload;
//       sessionStorage.setItem("sumAssured1", JSON.stringify(action.payload));
//     },
//     setPreExisting1: (state, action) => {
//       state.preExisting1 = action.payload;
//       sessionStorage.setItem("preExisting1", JSON.stringify(action.payload));
//     },
//     setPreExistingAmount1: (state, action) => {
//       state.preExistingAmount1 = action.payload;
//       sessionStorage.setItem("preExistingAmount1", JSON.stringify(action.payload));
//     },
//     setFinalPremium1: (state, action) => {
//       state.finalPremium1 = action.payload;
//       sessionStorage.setItem("finalPremium1", JSON.stringify(action.payload));
//     },
//     setInitialPremium1: (state, action) => { // Store Initial Premium
//       state.initialPremium1 = action.payload;
//       sessionStorage.setItem("initialPremium1", JSON.stringify(action.payload));
//     },
//     setSelectedDuration1: (state, action) => {
//       state.selectedDuration1 = action.payload;
//       sessionStorage.setItem("selectedDuration1", JSON.stringify(action.payload));
//     },
//   },
// });



// export const { 
//   setSelectedRelations, 
//   setAge, 
//   setDisease, 
//   setSumAssured1, 
//   setPreExisting1, 
//   setPreExistingAmount1, 
//   setFinalPremium1, 
//   setInitialPremium1,
//   setSelectedDuration1, 
// } = relationsSlice.actions;

// export default relationsSlice.reducer;








import { createSlice } from '@reduxjs/toolkit';

// Initialize the state from sessionStorage, or fallback to default values
const initialState = {
  selectedRelations: JSON.parse(sessionStorage.getItem('selectedRelations')) || [],
  age: JSON.parse(sessionStorage.getItem('age')) || null,
  disease: JSON.parse(sessionStorage.getItem('disease')) || null,
  sumAssured1: Number(sessionStorage.getItem("sumAssured1")) || 500000,
  preExisting1: sessionStorage.getItem("preExisting1") === "true" || false,
  preExistingAmount1: Number(sessionStorage.getItem("preExistingAmount1")) || 0,
  finalPremium1: Number(sessionStorage.getItem("finalPremium1")) || 0,
  selectedDuration1: sessionStorage.getItem("selectedDuration1") || "1 Year",
  storeDataOfUser: sessionStorage.getItem("storeDataOfUser") || [],
  initialPremium1: Number(sessionStorage.getItem("initialPremium1")) || 0, // Store initial premium
};

const relationsSlice = createSlice({
  name: 'relations',
  initialState,
  reducers: {
    setSelectedRelations: (state, action) => {
      state.selectedRelations = action.payload;
      sessionStorage.setItem('selectedRelations', JSON.stringify(action.payload));
    },
    setAge: (state, action) => {
      state.age = action.payload;
      sessionStorage.setItem('age', JSON.stringify(action.payload));
    },
    setDisease: (state, action) => {
      state.disease = action.payload;
      sessionStorage.setItem('disease', JSON.stringify(action.payload));
    },
    setSumAssured1: (state, action) => {
      state.sumAssured1 = action.payload;
      sessionStorage.setItem("sumAssured1", JSON.stringify(action.payload));
    },
    setPreExisting1: (state, action) => {
      state.preExisting1 = action.payload;
      sessionStorage.setItem("preExisting1", JSON.stringify(action.payload));
    },
    setPreExistingAmount1: (state, action) => {
      state.preExistingAmount1 = action.payload;
      sessionStorage.setItem("preExistingAmount1", JSON.stringify(action.payload));
    },
    setFinalPremium1: (state, action) => {
      state.finalPremium1 = action.payload;
      sessionStorage.setItem("finalPremium1", JSON.stringify(action.payload));
    },
    setInitialPremium1: (state, action) => { // Store Initial Premium
      state.initialPremium1 = action.payload;
      sessionStorage.setItem("initialPremium1", JSON.stringify(action.payload));
    },
    setSelectedDuration1: (state, action) => {
      state.selectedDuration1 = action.payload;
      sessionStorage.setItem("selectedDuration1", JSON.stringify(action.payload));
    },
    setStoreDataOfUser: (state, action) => {
      state.storeDataOfUser = action.payload;
      sessionStorage.setItem("storeDataOfUser", JSON.stringify(action.payload));
    },
  },
});

export const { 
  setSelectedRelations, 
  setAge, 
  setDisease, 
  setSumAssured1, 
  setPreExisting1, 
  setPreExistingAmount1, 
  setFinalPremium1, 
  setInitialPremium1,
  setSelectedDuration1, 
  setStoreDataOfUser,
} = relationsSlice.actions;

export default relationsSlice.reducer;
