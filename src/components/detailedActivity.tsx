import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import * as Converters from '../utilities/converters';

import {
  loadDetailedActivity,
  forceReloadEfforts,
  getMmpData,
} from '../controllers';
import {
  SegmentsMap,
  StravatronDetailedSegment,
  StravatronSegmentEffort,
  StravatronActivity,
} from '../types';
import {
  getStravatronDetailedActivityAttributes,
  getSegmentEffortsForActivity,
  getSegments,
} from '../selectors';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

type Order = 'asc' | 'desc';
interface DetailedActivityData {
  name: string;
  movingTime: number;
  distance: number;
  speed: number;
  averageGrade: number;
  totalElevationGain: number;
  normalizedPower: number;
  averageWatts: number;
  averageHeartrate: number;
  maxHeartrate: number;
}

interface HeadCell {
  id: keyof DetailedActivityData;
  label: string;
  numeric: boolean;
  width: string;
}

const activityColumnCells: HeadCell[] = [
  { id: 'name', numeric: false, label: 'Name', width: '192px' },
  { id: 'movingTime', numeric: true, label: 'Riding Time', width: '64px' },
  { id: 'distance', numeric: true, label: 'Distance', width: '64px' },
  { id: 'speed', numeric: true, label: 'Speed', width: '64px' },
  { id: 'totalElevationGain', numeric: true, label: 'Elevation', width: '64px' },
  { id: 'normalizedPower', numeric: true, label: 'NP', width: '64px' },
  { id: 'averageWatts', numeric: true, label: 'Average Watts', width: '64px' },
  { id: 'averageHeartrate', numeric: true, label: 'Average Heartrate', width: '64px' },
  { id: 'maxHeartrate', numeric: true, label: 'Max Heartrate', width: '64px' },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableColumnMediumWidth: {
      width: '64px',
    },
    tableColumnWideWidth: {
      width: '192px',
    },
    sideBySideBoxes: {
      display: 'table',
      clear: 'both',
      width: '100%'
    },
    leftBox: {
      float: 'left',
      width: '45%',
      height: '300px',
      backgroundColor: 'lightGray'
    },
    rightBox: {
      float: 'left',
      height: '300px',
      width: '50%',
      backgroundColor: 'lightGray',
      paddingLeft: '8px'
    },
    verticalLine: {
      float: 'left',
      height: '300px',
      borderLeft: '4px solid darkGray'
    },
    boldParagraph: {
      fontWeight: 'bold',
      marginTop: '4px',
      marginBottom: '4px'
    }
  }),
);

export interface DetailedActivityProps {
  activityId: number;
  detailedActivity: StravatronActivity;
  segmentEfforts: StravatronSegmentEffort[];
  segmentsMap: SegmentsMap;
  onLoadDetailedActivity: (activityId: number) => any;
  onForceReloadEfforts: (activityId: number) => any;
  onGetMmpData: (activityId: number) => any;
  classes: ReturnType<typeof useStyles>;
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DetailedActivityData) => void;
}

const DetailedActivity = (props: DetailedActivityProps) => {

  console.log('DetailedActivity invoked');

  const [initialized, setInitialized] = React.useState(false);

  const classes = useStyles();

  const { onLoadDetailedActivity, onForceReloadEfforts, onGetMmpData, segmentsMap, segmentEfforts } = props;

  if (!initialized) {
    console.log('invoke onLoadDetailedActivity');
    onLoadDetailedActivity(props.activityId);
    setInitialized(true);
  }

  const handleFetchEfforts = (activityId: number) => {
    console.log('handleFetchEfforts: ', activityId);
    onForceReloadEfforts(activityId);
  };

  const handleGetMmpData = (activityId: number) => {
    console.log('handleGetMmpData: ', activityId);
    onGetMmpData(activityId);
  };

  const buildSegmentEffortRow = (segmentEffort: StravatronSegmentEffort) => {

    // TEDTODO - id confusion
    const segmentId = segmentEffort.segmentId;
    // const segment: Segment = this.props.segmentsMap[segmentId];
    const segment: StravatronDetailedSegment = segmentsMap[segmentId];
    const speed = segmentEffort.distance / segmentEffort.movingTime;

    let averageGrade = '';
    if (segment && segment.averageGrade) {
      averageGrade = segment.averageGrade.toFixed(1) + '%';
    }

    let totalElevationGain = '';
    if (segment && segment.totalElevationGain) {
      totalElevationGain = Converters.metersToFeet(segment.totalElevationGain).toFixed(0) + 'ft';
    }

    const { averageWatts, normalizedPower } = segmentEffort;
    const normalizedPowerLbl = isNil(normalizedPower) ? '' : normalizedPower.toFixed(1);
    const averageWattsLbl = isNil(averageWatts) ? 0 : averageWatts;

    return (
      <TableRow key={segmentEffort.id}>
        <TableCell style={{ width: '192px' }}>
          {segmentEffort.name}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {Converters.getMovingTime(segmentEffort.movingTime)}
        </TableCell>
        <TableCell>
          {Converters.metersToMiles(segmentEffort.distance).toFixed(1)} mi
        </TableCell>
        <TableCell>
          {Converters.metersPerSecondToMilesPerHour(speed).toFixed(1)} mph
        </TableCell>
        <TableCell>
          {averageGrade}
        </TableCell>
        <TableCell>
          {totalElevationGain}
        </TableCell>
        <TableCell>
          {normalizedPowerLbl}
        </TableCell>
        <TableCell>
          {averageWattsLbl}
        </TableCell>
        <TableCell>
          {segmentEffort.averageHeartrate}
        </TableCell>
        <TableCell>
          {segmentEffort.maxHeartrate}
        </TableCell>
        <TableCell>
          <Link to={'/segmentEffortResults/' + segmentEffort.segmentId.toString() + '/' + props.activityId.toString()}>All Results</Link>
        </TableCell>
      </TableRow>
    );
  };

  const buildSegmentEffortRows = (allSegmentEfforts: StravatronSegmentEffort[]) => {

    const sortedSegmentEffortRows: StravatronSegmentEffort[] = allSegmentEfforts.concat();
    sortedSegmentEffortRows.sort((a, b) => {
      const aStartTime = a.startDate;
      const bStartTime = b.startDate;

      if (aStartTime > bStartTime) {
        return 1;
      }
      if (aStartTime < bStartTime) {
        return -1;
      }
      return 0;
    });

    const segmentEffortRows = sortedSegmentEffortRows.map((segmentEffort) => {
      const segmentEffortRow = buildSegmentEffortRow(segmentEffort);
      return segmentEffortRow;
    });
    return segmentEffortRows;
  };

  const buildSegmentEffortsTable = () => {

    console.log(segmentEfforts);

    const segmentEffortRows = buildSegmentEffortRows(segmentEfforts);

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '192px' }}>Name</TableCell>
              <TableCell style={{ width: '64px' }}>Time</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Average Grade</TableCell>
              <TableCell>Elevation Gain</TableCell>
              <TableCell>NP</TableCell>
              <TableCell>Average Watts</TableCell>
              <TableCell>Average Heartrate</TableCell>
              <TableCell>Max Heartrate</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {segmentEffortRows}
          </TableBody>
        </Table>
      </div>
    );
  };

  const getSummaryDataTable = () => {

    const { detailedActivity } = props;

    const averageWatts = isNil(detailedActivity.averageWatts) ? 0 : detailedActivity.averageWatts;

    return (
      <div style={{ marginTop: '16px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Maximum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  Power
                </TableCell>
                <TableCell>
                  {averageWatts}
                </TableCell>
                <TableCell>
                  {detailedActivity.maxWatts}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Heart Rate
                </TableCell>
                <TableCell>
                  {detailedActivity.averageHeartrate}
                </TableCell>
                <TableCell>
                  {detailedActivity.maxHeartrate}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const getSummaryContainer = () => {

    const { detailedActivity } = props;

    const np = isNil(detailedActivity.normalizedPower) ? '' : detailedActivity.normalizedPower.toFixed(1);
    const calories = isNil(detailedActivity.kilojoules) ? '' : detailedActivity.kilojoules.toFixed(0);
    const tss = isNil(detailedActivity.trainingStressScore) ? '' : detailedActivity.trainingStressScore.toFixed(1);

    const summaryDataTable = getSummaryDataTable();

    return (
      <div className={classes.sideBySideBoxes}>
        <div className={classes.leftBox}>
          <h1>{props.detailedActivity.name}</h1>
          <h4>{Converters.getDateTime(detailedActivity.startDateLocal)}</h4>
          <h4>Elapsed time: {Converters.getMovingTime(detailedActivity.movingTime)}</h4>
          <h4>Distance: {Converters.metersToMiles(detailedActivity.distance).toFixed(1)} mi</h4>
        </div>
        <div className={classes.verticalLine}></div>
        <div className={classes.rightBox}>
          <p className={classes.boldParagraph}>Normalized Power: {np}</p>
          <p className={classes.boldParagraph}>Calories: {calories}</p>
          <p className={classes.boldParagraph}>Training Stress Score: {tss}</p>
          <p className={classes.boldParagraph}>Elevation Gain: {Converters.metersToFeet(detailedActivity.totalElevationGain).toFixed(0)} ft</p>
          {summaryDataTable}
        </div>
      </div>
    );
  };

  const activity = props.detailedActivity;

  console.log('detailedActivityAttributes');
  console.log(activity);

  console.log('segmentEfforts');
  console.log(segmentEfforts);

  if (isNil(activity)) {
    return <div>Loading...</div>;
  }

  const summaryContainer = getSummaryContainer();
  const segmentEffortsTable = buildSegmentEffortsTable();

  return (
    <div>
      <Link to='/' style={{ marginRight: '12px' }}>Home</Link>
      <Link to='/activities' style={{ marginRight: '12px' }}>Back</Link>
      <button style={{ marginRight: '12px' }} onClick={() => handleFetchEfforts(activity.id)}>Refresh efforts</button>
      <button style={{ marginRight: '12px' }} onClick={() => handleGetMmpData(activity.id)}>Get MMP Data</button>
      <br />
      {summaryContainer}
      {segmentEffortsTable}
    </div >
  );
};

function mapStateToProps(state: any, ownProps: any) {

  console.log(state);
  console.log(ownProps);

  return {
    activityId: parseInt(ownProps.match.params.id, 10),
    detailedActivity: getStravatronDetailedActivityAttributes(state, parseInt(ownProps.match.params.id, 10)),
    segmentEfforts: getSegmentEffortsForActivity(state, parseInt(ownProps.match.params.id, 10)),
    segmentsMap: getSegments(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadDetailedActivity: loadDetailedActivity,
    onForceReloadEfforts: forceReloadEfforts,
    onGetMmpData: getMmpData,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivity);
