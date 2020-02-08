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
  StravatronSegmentEffortsBySegment,
  StravatronSegmentEffort,
  StravatronActivity,
} from '../types';
import {
  getStravatronDetailedActivityAttributes,
  getSegmentEffortsForActivity,
  getSegments,
  getEffortsForActivitySegments
} from '../selectors/detailedActivity';
import moment = require('moment');
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

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

function getSorting<K extends keyof any>(
  order: Order,
  orderBy: K,
): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

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
  effortsForSegments: StravatronSegmentEffortsBySegment;
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
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DetailedActivityData>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { onLoadDetailedActivity, onForceReloadEfforts, onGetMmpData, effortsForSegments, segmentsMap, segmentEfforts } = props;

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

  const analyzeEffortsForSegment = (effortsForSegment: StravatronSegmentEffort[]): any => {

    const effortsSortedByMovingTime: StravatronSegmentEffort[] = effortsForSegment.concat();
    const effortsSortedByDate: StravatronSegmentEffort[] = effortsForSegment.concat();

    // 'best time' by sorting efforts by movingTime
    effortsSortedByMovingTime.sort((a, b) => {

      const aMovingTime = Number(a.movingTime);
      const bMovingTime = Number(b.movingTime);

      if (aMovingTime > bMovingTime) {
        return 1;
      }
      if (aMovingTime < bMovingTime) {
        return -1;
      }
      return 0;
    });

    // most recent will be first in the array
    effortsSortedByDate.sort((a, b) => {

      const aDate = a.startDateLocal;
      const bDate = b.startDateLocal;

      if (aDate < bDate) {
        return 1;
      }
      if (aDate > bDate) {
        return -1;
      }
      return 0;
    });

    const analyzedEffortsForSegment =
    {
      effortsSortedByMovingTime,
      effortsSortedByDate
    };

    return analyzedEffortsForSegment;
  };

  // TEDTODO - come up with a better name - it's not just recent efforts
  const buildRecentEfforts = (segmentId: number): any => {

    // if (segmentId === 18385727) {
    //   debugger;
    // }

    let recentEffortsLbl: any;
    let effortsForSegmentLbl: any;

    if (!isNil(effortsForSegments)) {
      const stravatronEffortsForSegments: StravatronSegmentEffortsBySegment = effortsForSegments;
      if (stravatronEffortsForSegments.hasOwnProperty(segmentId)) {
        const effortsForSegment: StravatronSegmentEffort[] = stravatronEffortsForSegments[segmentId];
        const effortData = analyzeEffortsForSegment(effortsForSegment);

        const bestEffortTime = Converters.getMovingTime(effortData.effortsSortedByMovingTime[0].movingTime);
        const bestEffortDate = moment(effortData.effortsSortedByMovingTime[0].startDateLocal).format('YYYY-MM-DD');

        effortsForSegmentLbl =
          (
            <span>
              <span>{bestEffortTime}</span>
              <span className='smallDimDate'>{bestEffortDate}</span>
            </span>
          );

        if (!isNil(effortData.effortsSortedByMovingTime[1])) {
          const nextBestEffortTime = Converters.getMovingTime(effortData.effortsSortedByMovingTime[1].movingTime);
          const nextBestEffortDate =
            moment(effortData.effortsSortedByMovingTime[1].startDateLocal).format('YYYY-MM-DD');

          effortsForSegmentLbl =
            (
              <span>
                <span>{bestEffortTime}</span>
                <span> on </span>
                <span className='smallDimDate'>{bestEffortDate}</span>
                <span>, {nextBestEffortTime}</span>
                <span> on </span>
                <span className='smallDimDate'>{nextBestEffortDate}</span>
              </span>
            );
        }

        // effortsSortedByDate
        const recentEfforts = [];
        const recentEffort =
        {
          movingTime: '',
          date: '',
          separator: ''
        };

        recentEfforts.push(recentEffort);
        recentEfforts.push(recentEffort);
        recentEfforts.push(recentEffort);

        let index = 0;
        while (index < 3) {
          if (effortData.effortsSortedByDate.length > (index + 1)) {
            const effort = effortData.effortsSortedByDate[index + 1];
            recentEfforts[index] =
            {
              movingTime: effort.movingTime,
              date: effort.startDateLocal,
              separator: ', '
            };
          }
          index++;
        }

        recentEffortsLbl =
          (
            <span>
              <span>{Converters.elapsedTimeToTimeString(recentEfforts[0].movingTime)}</span>
              <span> on </span>
              <span className='smallDimDate'>{Converters.formatDate(recentEfforts[0].date)}</span>
              <span>{recentEfforts[1].separator}</span>
              <span>{Converters.elapsedTimeToTimeString(recentEfforts[1].movingTime)}</span>
              <span> on </span>
              <span className='smallDimDate'>{Converters.formatDate(recentEfforts[1].date)}</span>
              <span>{recentEfforts[2].separator}</span>
              <span>{Converters.elapsedTimeToTimeString(recentEfforts[2].movingTime)}</span>
              <span> on </span>
              <span className='smallDimDate'>{Converters.formatDate(recentEfforts[2].date)}</span>
            </span>
          );
      }
    }
    return { recentEffortsLbl, effortsForSegmentLbl };
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

    const effortsData = buildRecentEfforts(segmentId);
    const { recentEffortsLbl, effortsForSegmentLbl } = effortsData;
    /*
        <td>
          <button onClick={() => {
            self.handleAllActivitiesWithThisSegment(segment.id);
          }
          }>Show all...</button>
        </td>
    */

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
          {effortsForSegmentLbl}
        </TableCell>
        <TableCell>
          {recentEffortsLbl}
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
              <TableCell>Best Times</TableCell>
              <TableCell>Recent Efforts</TableCell>
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
    effortsForSegments: getEffortsForActivitySegments(state, parseInt(ownProps.match.params.id, 10)),
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
