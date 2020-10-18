import { cloneDeep } from 'lodash';
import { SegmentEffortsMap, StravatronSegmentEffort } from '../types';
import { StravaModelBaseAction, SegmentEffortAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT_EFFORT = 'ADD_SEGMENT_EFFORT';
export const ADD_SEGMENT_EFFORTS = 'ADD_SEGMENT_EFFORTS';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialSegmentEffortDescription = Partial<StravatronSegmentEffort>;

export interface AddSegmentEffortPayload {
  segmentEffortId: number;
  segmentEffort: StravatronSegmentEffort;
}

export interface AddSegmentEffortsPayload {
  segmentEfforts: StravatronSegmentEffort[];
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

export const addSegmentEfforts = (
  segmentEfforts: StravatronSegmentEffort[]
): SegmentEffortAction<AddSegmentEffortsPayload> => {

  return {
    type: ADD_SEGMENT_EFFORTS,
    payload: {
      segmentEfforts,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentEffortsMap = {};

export const segmentEffortReducer = (
  state: SegmentEffortsMap = initialState,
  action: StravaModelBaseAction<PartialSegmentEffortDescription & AddSegmentEffortPayload & AddSegmentEffortsPayload>
): SegmentEffortsMap => {
  switch (action.type) {
    case ADD_SEGMENT_EFFORT: {
      const newState = cloneDeep(state);
      const { segmentEffortId, segmentEffort } = action.payload;
      newState[segmentEffortId] = segmentEffort;
      return newState;
    }
    case ADD_SEGMENT_EFFORTS: {
      const newState = cloneDeep(state);
      const { segmentEfforts } = action.payload;
      segmentEfforts.forEach((segmentEffort) => {
        newState[segmentEffort.id] = segmentEffort;
      });
      return newState;
    }
    default:
      return state;
  }
};

