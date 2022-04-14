import React, {useEffect} from 'react';

import { Chart } from './features/chart/Chart';

import {useSelector, useDispatch} from 'react-redux';
import {
  selectStatus,
  selectError,
  apiConnect,
  apiClose
} from './features/nats/natsSlice';

import './App.css';


function App() {

  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(apiConnect());
    return () => {
      dispatch(apiClose());
    };
  }, [dispatch]);

  return (
    <div className="App">
      <div>
        <div>Status: {status}</div>
        <div>Error: {error}</div>
      </div>
      <div>
        <Chart />
      </div>      
    </div>
  );
}

export default App;
