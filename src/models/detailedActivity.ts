import { cloneDeep } from 'lodash';
import { 
  StravatronActivity, 
  DetailedActivityAttributesMap, 
 } from '../types';
import { StravaModelBaseAction, DetailedActivityAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
// export const ADD_DETAILED_ACTIVITY = 'ADD_DETAILED_ACTIVITY';
export const ADD_DETAILED_ACTIVITY_ATTRIBUTES = 'ADD_DETAILED_ACTIVITY_ATTRIBUTES';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialDetailedActivityDescription = Partial<StravatronActivity>;

export interface AddDetailedActivityAttributesPayload {
  activityId: string;
  detailedActivityAttributes: StravatronActivity;
}

export const addDetailedActivityAttributes = (
  activityId: number,
  detailedActivityAttributes: StravatronActivity
): any => {
  return {
    type: ADD_DETAILED_ACTIVITY_ATTRIBUTES,
    payload: {
      activityId,
      detailedActivityAttributes,
    },
  };
};

// export const addDetailedActivity = (
//   detailedActivityId: string,
//   detailedActivity: DetailedActivity
// ): DetailedActivityAction<AddDetailedActivityPayload> => {

//   return {
//     type: ADD_DETAILED_ACTIVITY,
//     payload: {
//       detailedActivityId,
//       detailedActivity,
//     },
//   };
// };

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DetailedActivityAttributesMap = {};

export const detailedActivityReducer = (
  state: DetailedActivityAttributesMap = initialState,
  action: StravaModelBaseAction<PartialDetailedActivityDescription & AddDetailedActivityAttributesPayload>
): DetailedActivityAttributesMap => {
  switch (action.type) {
    case ADD_DETAILED_ACTIVITY_ATTRIBUTES: {
      const newState = cloneDeep(state);
      const { activityId, detailedActivityAttributes: detailedActivity } = action.payload;
      newState[activityId] = detailedActivity;
      return newState;
    }
    default:
      return state;
  }
};

