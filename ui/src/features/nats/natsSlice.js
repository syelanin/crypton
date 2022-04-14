import {createSlice} from '@reduxjs/toolkit';
import {
    clientConnect,
    clientClose,
    subjectSubscribe,
    subjectUnsubscribe,
    channelSubscribe,
    channelUnsubscribe,
    makeSubject
} from './natsAPI';


const initialState = {
    connected: false,
    status: '',
    error: '',
    subjects: {},
    channels: {}
}

const sliceName = 'nats';

export const natsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        setStatus: (state, action) => {
            const {status} = action.payload;

            state.status = status;
        },
        setError: (state, action) => {
            const {error} = action.payload;

            state.error = error;
        },
        addSubjectMessage: (state, action) => {
            const {subject, message} = action.payload;

            if (!state.subjects[subject]) {
                state.subjects[subject] = {
                    subject,
                    message
                };
            } else {
                state.subjects[subject].message = message;
            }            
        },
        addChannelMessage: (state, action) => {
            const {type, symbol, timeframe, message} = action.payload;

            const subject = makeSubject({type, symbol, timeframe});

            if (!state.channels[subject]) {
                state.channels[subject] = {
                    type,
                    symbol,
                    timeframe,
                    message
                };
            } else {
                state.channels[subject].message = message;
            }            
        }
    }
});


// Selectors

const sliceState = (state) => state[sliceName];

export const selectConnected = (state) => sliceState(state).connected;
export const selectStatus = (state) => sliceState(state).status;
export const selectError = (state) => sliceState(state).error;
export const selectSubject = (subject) => (state) => sliceState(state).subjects[subject];
export const selectChannel = ({type, symbol, timeframe}) => (state) => {
    const subject = makeSubject({type, symbol, timeframe});
    return sliceState(state).channels[subject];
};


// Actions

export const {
    setConnected,
    setStatus,
    setError,
    addSubjectMessage,
    addChannelMessage
} = natsSlice.actions;


// API actions, Thunks

export const apiConnect = () => async (dispatch, getState) => {

    try {
        await clientConnect();

        dispatch(setConnected(true));
        dispatch(setStatus({status: 'connected'}));
    }
    catch (error) {
        dispatch(setStatus({status: 'failed to connect'}));
        dispatch(setError({error: error.message}));
    }
    
}

export const apiClose = () => async (dispatch, getState) => {

    try {
        await clientClose();

        dispatch(setConnected(false));
        dispatch(setStatus({status: 'disconnected'}));
    }
    catch (error) {
        dispatch(setStatus({status: 'failed to disconnect'}));
        dispatch(setError({error: error.message}));
    }
    
}


export const apiSubjectSubscribe = (subject) => (dispatch, getState) => {

    try {
        subjectSubscribe({
            subject,
            cb: (error, message) => {
                if (error) {
                    dispatch(setError({error: error.message}));
                    return;
                }
                
                dispatch(addSubjectMessage({subject, message}));
            }
        });

        dispatch(setStatus({status: `subscribed to subject: ${subject}`}));
    }
    catch (error) {
        dispatch(setStatus({status: `failed to subscribe to subject: ${subject}`}));
        dispatch(setError({error: error.message}));
    }
}


export const apiSubjectUnsubscribe = (subject) => (dispatch, getState) => {

    try {
        subjectUnsubscribe(subject);

        dispatch(setStatus({status: `unsubscribed from subject: ${subject}`}));
    }
    catch (error) {
        dispatch(setStatus({status: `failed to unsubscribe from subject: ${subject}`}));
        dispatch(setError({error: error.message}));
    }
}


export const apiChannelSubscribe = ({type, symbol, timeframe}) => async (dispatch, getState) => {

    const subject = makeSubject({type, symbol, timeframe});

    try {
        
        channelSubscribe({
            type,
            symbol,
            timeframe,
            cb: {
                onstatus: (status) => {
                    if (status.success) {
                        dispatch(setStatus({status: `channel status: ok`}));
                    }
                    else {
                        dispatch(setStatus({status: `channel status: error: ${status.error}`}));
                    }
                },
                onmessage: (error, message) => {
                    if (error) {
                        dispatch(setError({error: error.message}));
                        return;
                    }
                    
                    dispatch(addChannelMessage({type, symbol, timeframe, message}));
                }
            }            
        });

        dispatch(setStatus({status: `subscribed to channel: ${subject}`}));
    }
    catch (error) {
        dispatch(setStatus({status: `failed to subscribe to channel: ${subject}`}));
        dispatch(setError({error: error.message}));
    }
}


export const apiChannelUnsubscribe = ({type, symbol, timeframe}) => async (dispatch, getState) => {

    const subject = makeSubject({type, symbol, timeframe});

    try {
        
        channelUnsubscribe({
            type,
            symbol,
            timeframe,
            cb: {
                onstatus: (status) => {
                    if (status.success) {
                        dispatch(setStatus({status: `channel status: ok`}));
                    }
                    else {
                        dispatch(setStatus({status: `channel status: error: ${status.error}`}));
                    }
                }
            }            
        });

        dispatch(setStatus({status: `unsubscribed from channel: ${subject}`}));
    }
    catch (error) {
        dispatch(setStatus({status: `failed to unsubscribe from channel: ${subject}`}));
        dispatch(setError({error: error.message}));
    }
}


// Reducer

export default natsSlice.reducer;