import { cloneDeep } from 'lodash';
import { 
  SegmentsMap, 
  StravatronDetailedSegment 
} from '../types';
import { StravaModelBaseAction, SegmentAction } from './baseAction';
import { segmentEffortResultsReducer } from './segmentEffortResults';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT = 'ADD_SEGMENT';
export const ADD_SEGMENTS = 'ADD_SEGMENTS';

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

export interface AddSegmentsPayload {
  segments: StravatronDetailedSegment[];
}

export const addSegments = (
  segments: StravatronDetailedSegment[]
): SegmentAction<AddSegmentsPayload> => {

  return {
    type: ADD_SEGMENTS,
    payload: {
      segments,
    },
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentsMap = {};

export const segmentReducer = (
  state: SegmentsMap = initialState,
  action: StravaModelBaseAction<PartialSegmentDescription & AddSegmentPayload & AddSegmentsPayload>
): SegmentsMap => {
  switch (action.type) {
    case ADD_SEGMENT: {
      const newState = cloneDeep(state);
      const { segmentId, segment } = action.payload;
      newState[segmentId] = segment;
      return newState;
    }
    case ADD_SEGMENTS: {
      const newState = cloneDeep(state);
      const { segments } = action.payload;
      segments.forEach((segment) => {
        newState[segment.id] = segment;
      });
      return newState;
    }
    default:
      return state;
  }
};

