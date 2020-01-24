import { StravaModelState, ActivitiesMap } from '../types';

export const getActivities = (state: StravaModelState): ActivitiesMap => {
  return state.activities;
};

