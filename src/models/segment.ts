import { cloneDeep } from 'lodash';
import { 
  SegmentsMap, 
  StravatronDetailedSegment 
} from '../types';
import { StravaModelBaseAction, SegmentAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT = 'ADD_SEGMENT';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialSegmentDescription = Partial<StravatronDetailedSegment>;

export interface AddSegmentPayload {
  segmentId: number;
  segment: StravatronDetailedSegment;
}

export const addSegment = (
  segmentId: number,
  segment: StravatronDetailedSegment
): SegmentAction<AddSegmentPayload> => {

  return {
    type: ADD_SEGMENT,
    payload: {
      segmentId,
      segment,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentsMap = {};

export const segmentReducer = (
  state: SegmentsMap = initialState,
  action: StravaModelBaseAction<PartialSegmentDescription & AddSegmentPayload>
): SegmentsMap => {
  switch (action.type) {
    case ADD_SEGMENT: {
      const newState = cloneDeep(state);
      const { segmentId, segment } = action.payload;
      newState[segmentId] = segment;
      return newState;
    }
    default:
      return state;
  }
};

