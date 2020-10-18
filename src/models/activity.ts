import { cloneDeep } from 'lodash';
import { StravatronSummaryActivity, ActivitiesMap } from '../types';
import { StravaModelBaseAction, ActivityAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const ADD_ACTIVITIES = 'ADD_ACTIVITIES';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialActivityDescription = Partial<StravatronSummaryActivity>;

export interface AddActivityPayload {
  activityId: string;
  activity: StravatronSummaryActivity;
}

export interface AddActivitiesPayload {
  activities: StravatronSummaryActivity[];
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

export const addActivities = (
  activities: StravatronSummaryActivity[]
): ActivityAction<AddActivitiesPayload> => {

  return {
    type: ADD_ACTIVITIES,
    payload: {
      activities,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ActivitiesMap = {};

export const activityReducer = (
  state: ActivitiesMap = initialState,
  action: StravaModelBaseAction<PartialActivityDescription & AddActivityPayload & AddActivitiesPayload>
): ActivitiesMap => {
  switch (action.type) {
    case ADD_ACTIVITY: {
      const newState = cloneDeep(state);
      const { activityId, activity } = action.payload;
      newState[activityId] = activity;
      return newState;
    }
    case ADD_ACTIVITIES: {
      const newState = cloneDeep(state);
      const { activities } = action.payload;
      activities.forEach((activity) => {
        newState[activity.id] = activity;
      });
      return newState;
    }
    default:
      return state;
  }
};

