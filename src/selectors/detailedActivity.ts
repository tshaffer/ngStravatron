import { 
  StravaModelState, 
  StravatronActivity, 
  StravatronSummaryActivity, 
} from '../types';

export const getStravatronDetailedActivityAttributes = (state: StravaModelState, activityId: number): StravatronActivity => {
  const activity: StravatronSummaryActivity = state.activities[activityId];
  const detailedActivity: StravatronActivity = state.detailedActivities[activityId];
  const fullActivity = Object.assign({}, activity, detailedActivity);
  return fullActivity;
};

