import { configureStore } from '@reduxjs/toolkit';
import natsReducer from '../features/nats/natsSlice';

export const store = configureStore({
  reducer: {
    nats: natsReducer
  },
});
