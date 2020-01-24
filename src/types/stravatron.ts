// https://developers.strava.com/docs/reference/#api-models-LatLng
export interface StravaNativeLatLng {
  latlng: number[];
}

// https://developers.strava.com/docs/reference/#api-models-PolylineMap
export interface StravaNativePolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}


export type StravatronSegmentEffortsForSegment = StravatronSegmentEffort[];

export interface StravatronDetailedActivityData {
  detailedActivityAttributes: StravatronActivity;
  allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[];
  streams: StravatronActivityStreams;
  segments: StravatronDetailedSegment[];
}

export interface StravatronAthlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravatronDetailedSegment {
  id: number;
  name: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
  activityType: string;
  climbCategory: number;
  startLatlng: StravaNativeLatLng;
  endLatlng: StravaNativeLatLng;
  athletePrEffort?: any; // ****
  totalElevationGain: number;
  map: StravaNativePolylineMap;
  effortCount: number;
  allEffortsLoaded: boolean;
}

export interface StravatronAchievement {
  achievementType: string;
  rank: number;
  typeId: number;
}

export interface StravatronSegmentEffort {
  id: number;
  segmentId: number;
  name: string;
  activityId: number;
  elapsedTime: number;
  movingTime: number;
  startDateLocal: Date;
  distance: number;
  averageWatts?: number;
  prRank: number;
  achievements: StravatronAchievement[];
  averageCadence: number;
  averageHeartrate: number;
  deviceWatts: boolean;
  maxHeartrate: number;
  startDate: Date;
  komRank?: number;
  startIndex?: number;
  endIndex?: number;
  normalizedPower?: number;
  intensityFactor?: number;
  trainingStressScore?: number;
}

export interface StravatronStream {
  data: any[];
  originalSize: number;
  resolution: string;
  seriesType: string;
  type: string;
}

export interface StravatronActivityStreams {
  activityId: number;
  time: any[];
  location: any[];
  elevation: any[];
  distance: any[];
  gradient: any[];
  cadence: any[];
  heartrate: any[];
  watts: any[];
}

export interface StravatronSummaryActivity {
  achievementCount: number;
  athleteId: number;
  averageCadence: number;
  averageHeartrate: number;
  averageSpeed: number;
  averageTemp?: number;
  averageWatts?: number;
  city?: string;
  country: string;
  deviceWatts?: boolean;
  distance: number;
  elapsedTime: number;
  elevHigh?: number;
  elevLow?: number;
  endLatlng: StravaNativeLatLng;
  hasHeartrate: boolean;
  id: number;
  kilojoules?: number;
  map: StravaNativePolylineMap; // does not include polyline
  maxHeartrate: number;
  maxWatts: number;
  maxSpeed: number;
  movingTime: number;
  name: string;
  prCount: number;
  resourceState: number;
  startDate: Date;
  startDateLocal: Date;
  startLatitude: number;
  startLatlng: StravaNativeLatLng;
  startLongitude: number;
  timezone: string;
  totalElevationGain: number;
  type: string;
  utcOffset: number;
  weightedAverageWatts?: number;
}

export interface StravatronActivity extends StravatronSummaryActivity {
  calories?: number;
  description?: string;
  deviceName?: string;
  segmentEfforts?: StravatronSegmentEffort[];
  bestEfforts?: any; // DetailedSegmentEffort or DetailedSegmentEffort[] ??
  normalizedPower?: number;
  intensityFactor?: number;
  trainingStressScore?: number;
}

export interface ZwiftSegmentSpec {
  name: string;
  id: number;
}

export interface PowerData {
  normalizedPower: number;
  intensityFactor: number;
  trainingStressScore: number;
}
