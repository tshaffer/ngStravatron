import {
  StravatronActivityStreams, 
  StravatronSummaryActivity, 
  StravatronActivity, 
  StravatronDetailedSegment, 
  StravatronSegmentEffort
} from './stravatron';

export interface StravaModelState {
  activities: ActivitiesMap;
  // detailedActivities: DetailedActivityAttributesMap;
  // segments: SegmentsMap;
  // segmentEfforts: SegmentEffortsMap;
  // streams: StravatronActivityStreams;
}

export interface ActivitiesMap {
  [id: string]: StravatronSummaryActivity; // activityid
}

export interface DetailedActivityAttributesMap {
  [id: string]: StravatronActivity; // activityId
}

export interface SegmentsMap {
  [id: string]: StravatronDetailedSegment; // segmentId
}

export interface SegmentEffortsMap {
  [id: string]: StravatronSegmentEffort; // segmentEffortId
}

export interface StravatronSegmentEffortsBySegment {
  [id: string]: StravatronSegmentEffort[]; // segmentId
}

