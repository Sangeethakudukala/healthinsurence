// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './storage/store.jsx';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  
<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>  

  // <Provider store={store}>
  //   <App />
  // </Provider>,
);

