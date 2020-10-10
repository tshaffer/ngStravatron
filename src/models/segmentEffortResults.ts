import { cloneDeep } from 'lodash';
import { 
  StravatronSegmentEffort,
  SegmentEffortResultsMap,
 } from 'src/types';
import { StravaModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT_EFFORT_RESULTS = 'ADD_SEGMENT_EFFORT_RESULTS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddSegmentEffortResultsPayload {
  segmentId: string;
  segmentEffortResults: StravatronSegmentEffort[];
}

export const addSegmentEffortResults = (
  segmentId: number,
  segmentEffortResults: StravatronSegmentEffort[]
): any => {
  return {
    type: ADD_SEGMENT_EFFORT_RESULTS,
    payload: {
      segmentId,
      segmentEffortResults,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentEffortResultsMap = {};

export const segmentEffortResultsReducer = (
  state: SegmentEffortResultsMap = initialState,
  action: StravaModelBaseAction<AddSegmentEffortResultsPayload>
): SegmentEffortResultsMap => {
  switch (action.type) {
    case ADD_SEGMENT_EFFORT_RESULTS: {
      const newState = cloneDeep(state);
      const { segmentId, segmentEffortResults } = action.payload;
      newState[segmentId] = segmentEffortResults;
      return newState;
    }
    default:
      return state;
  }
};
