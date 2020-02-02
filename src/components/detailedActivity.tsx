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
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DetailedActivityData>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { onLoadDetailedActivity, onForceReloadEfforts, onGetMmpData, effortsForSegments, segmentsMap, segmentEfforts } = props;

  React.useEffect(() => {
    onLoadDetailedActivity(props.activityId);
  });

  const handleFetchEfforts = (activityId: number) => {
    console.log('handleFetchEfforts: ', activityId);
    onForceReloadEfforts(activityId);
  };

  const handleGetMmpData = (activityId: number) => {
    console.log('handleGetMmpData: ', activityId);
    onGetMmpData(activityId);
  };

  const buildRideSummaryHeader = (detailedActivity: StravatronActivity) => {

    if (isNil(detailedActivity)) {
      return <div>Loading</div>;
    }

    let calories = '';
    if (detailedActivity.kilojoules) {
      calories = detailedActivity.kilojoules.toFixed(0);
    }

    const averageWatts = isNil(detailedActivity.averageWatts) ? 0 : detailedActivity.averageWatts;
    const np = isNil(detailedActivity.normalizedPower) ? '' : detailedActivity.normalizedPower.toFixed(1);
    const tss = isNil(detailedActivity.trainingStressScore) ? '' : detailedActivity.trainingStressScore.toFixed(1);

    return (
      <div id='RideSummary'>
        <TableContainer>
          <Table className='summaryTable'>

            <TableHead>
              <TableRow className='summaryLabels'>
                <TableCell style={{ width: '192px' }}>{Converters.getDateTime(detailedActivity.startDateLocal)}</TableCell>
                <TableCell style={{ width: '64px' }}>Time</TableCell>
                <TableCell>Elevation</TableCell>
                <TableCell>Distance</TableCell>
                <TableCell>Kilojoules</TableCell>
                <TableCell>NP</TableCell>
                <TableCell>TSS</TableCell>
                <TableCell>Average Watts</TableCell>
                <TableCell>Max Watts</TableCell>
                <TableCell>Average Heart Rate</TableCell>
                <TableCell>Max Heart Rate</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow className='summaryDataRow'>
                <TableCell style={{ width: '192px' }}>{detailedActivity.name}</TableCell>
                <TableCell style={{ width: '64px' }}>{Converters.getMovingTime(detailedActivity.movingTime)}</TableCell>
                <TableCell>{Converters.metersToFeet(detailedActivity.totalElevationGain).toFixed(0)} ft</TableCell>
                <TableCell>{Converters.metersToMiles(detailedActivity.distance).toFixed(1)} mi</TableCell>
                <TableCell>{calories}</TableCell>
                <TableCell>{np}</TableCell>
                <TableCell>{tss}</TableCell>
                <TableCell>{averageWatts}</TableCell>
                <TableCell>{detailedActivity.maxWatts}</TableCell>
                <TableCell>{detailedActivity.averageHeartrate}</TableCell>
                <TableCell>{detailedActivity.maxHeartrate}</TableCell>
              </TableRow>
            </TableBody>

          </Table>
        </TableContainer>
      </div >
    );
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

  const activity = props.detailedActivity;

  console.log('detailedActivityAttributes');
  console.log(activity);

  console.log('segmentEfforts');
  console.log(segmentEfforts);

  if (isNil(activity)) {
    return <div>Loading...</div>;
  }

  const rideSummaryHeader = buildRideSummaryHeader(activity);
  const segmentEffortsTable = buildSegmentEffortsTable();
  // return (
  //   <div>
  //     <Link to='/activities' id='backFromDetailedActivityButton'>Back</Link>
  //     <br />
  //     {rideSummaryHeader}
  //     <button onClick={() => this.handleFetchEfforts(activity.id)}>Refresh efforts</button>
  //     <br />
  //     {segmentEffortsTable}
  //   </div>
  // );

  // <Link to='/activities' id='backFromDetailedActivityButton'>Back</Link>
  return (
    <div>
      <Link to='/'>Home</Link>
      <br />
      <Link to='/activities' id='backFromDetailedActivityButton'>Back</Link>
      <br />
      {rideSummaryHeader}
      <br />
      <button onClick={() => handleFetchEfforts(activity.id)}>Refresh efforts</button>
      <br />
      <button onClick={() => handleGetMmpData(activity.id)}>Get MMP Data</button>
      <br />
      <br />
      <br />
      {segmentEffortsTable}
    </div>
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
