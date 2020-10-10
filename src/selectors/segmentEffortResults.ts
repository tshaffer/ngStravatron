import { 
  StravaModelState, 
  StravatronSegmentEffort, 
} from '../types';

export const getSegmentEffortResults = (state: StravaModelState, segmentId: number):  StravatronSegmentEffort[] => {
  return state.segmentEffortResults[segmentId];
};
