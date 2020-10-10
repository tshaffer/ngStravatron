import { 
  StravaModelState, 
  StravatronSegmentEffort, 
} from '../types';

export const getSegmentEffortResults = (state: StravaModelState, segmentId: number):  StravatronSegmentEffort[] => {
  if (state.segmentEffortResults.hasOwnProperty(segmentId)) {
    return state.segmentEffortResults[segmentId];
  }
  return [];
};
