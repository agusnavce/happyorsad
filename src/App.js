import React from 'react';
import './App.css';
import { Main } from './containers/Main';
import { StateProvider } from './state/store';
const App = () => {
  const initialState = {
    predictions: []
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'predictions':
        return { ...state, predictions: action.payload };
      default:
        return state;
    }
  };
  return (
    <div className="App">
      <StateProvider initialState={initialState} reducer={reducer}>
        <Main />
      </StateProvider>
    </div>
  );
};

export default App;
