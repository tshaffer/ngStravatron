/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { StravaModelState } from '../types';

import { activityReducer } from './activity';
import { detailedActivityReducer } from './detailedActivity';
import { segmentEffortReducer } from './segmentEffort';
import { segmentReducer } from './segment';
import { streamsReducer } from './streams';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<StravaModelState>({
  activities: activityReducer,
  detailedActivities: detailedActivityReducer,
  segmentEfforts: segmentEffortReducer,
  segments: segmentReducer,
  streams: streamsReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

