import { cloneDeep } from 'lodash';
import { SegmentEffortsMap, StravatronSegmentEffort } from '../types';
import { StravaModelBaseAction, SegmentEffortAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT_EFFORT = 'ADD_SEGMENT_EFFORT';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialSegmentEffortDescription = Partial<StravatronSegmentEffort>;

export interface AddSegmentEffortPayload {
  segmentEffortId: number;
  segmentEffort: StravatronSegmentEffort;
}

export const addSegmentEffort = (
  segmentEffortId: number,
  segmentEffort: StravatronSegmentEffort
): SegmentEffortAction<AddSegmentEffortPayload> => {

  return {
    type: ADD_SEGMENT_EFFORT,
    payload: {
      segmentEffortId,
      segmentEffort,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentEffortsMap = {};

export const segmentEffortReducer = (
  state: SegmentEffortsMap = initialState,
  action: StravaModelBaseAction<PartialSegmentEffortDescription & AddSegmentEffortPayload>
): SegmentEffortsMap => {
  switch (action.type) {
    case ADD_SEGMENT_EFFORT: {
      const newState = cloneDeep(state);
      const { segmentEffortId, segmentEffort } = action.payload;
      newState[segmentEffortId] = segmentEffort;
      return newState;
    }
    default:
      return state;
  }
};

