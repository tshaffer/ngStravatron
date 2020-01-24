import { cloneDeep } from 'lodash';
import { StravatronSummaryActivity, ActivitiesMap } from '../types';
import { StravaModelBaseAction, ActivityAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ACTIVITY = 'ADD_ACTIVITY';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialActivityDescription = Partial<StravatronSummaryActivity>;

export interface AddActivityPayload {
  activityId: string;
  activity: StravatronSummaryActivity;
}

export const addActivity = (
  activityId: string,
  activity: StravatronSummaryActivity
): ActivityAction<AddActivityPayload> => {

  return {
    type: ADD_ACTIVITY,
    payload: {
      activityId,
      activity,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ActivitiesMap = {};

export const activityReducer = (
  state: ActivitiesMap = initialState,
  action: StravaModelBaseAction<PartialActivityDescription & AddActivityPayload>
): ActivitiesMap => {
  switch (action.type) {
    case ADD_ACTIVITY: {
      const newState = cloneDeep(state);
      const { activityId, activity } = action.payload;
      newState[activityId] = activity;
      return newState;
    }
    default:
      return state;
  }
};

