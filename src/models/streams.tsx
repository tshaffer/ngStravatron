import { 
  StravatronActivityStreams, 
   
} from '../types';
import { StravaModelBaseAction, StreamsAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_STREAMS = 'ADD_STREAMS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddStreamsPayload {
  streams: StravatronActivityStreams;
}

export const addStreams = (
  streams: StravatronActivityStreams
): StreamsAction<AddStreamsPayload> => {

  return {
    type: ADD_STREAMS,
    payload: {
      streams,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: StravatronActivityStreams = {
  activityId: 0,
  time: [],
  location: [],
  elevation: [],
  distance: [],
  gradient: [],
  cadence: [],
  heartrate: [],
  watts: [],
};

export const streamsReducer = (
  state: StravatronActivityStreams = initialState,
  action: StravaModelBaseAction<StravatronActivityStreams & AddStreamsPayload>
): StravatronActivityStreams => {
  switch (action.type) {
    case ADD_STREAMS: {
      const newState = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

