import { Action } from 'redux';

export interface StravaBaseAction extends Action {
  type: string;
  payload: {} | null;
}

export interface StravaModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  error?: boolean;
  meta?: {};
}

export interface ActivityAction<T> extends StravaBaseAction {
  payload: T;
}

export interface DetailedActivityAction<T> extends StravaBaseAction {
  payload: T;
}

export interface SegmentEffortAction<T> extends StravaBaseAction {
  payload: T;
}

export interface SegmentAction<T> extends StravaBaseAction {
  payload: T;
}

export interface StreamsAction<T> extends StravaBaseAction {
  payload: T;
}

