import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DLQueueRow from './DLQueueRow/DLQueueRow';


export default function DLQueue(props) {
  const rows = props.queueData.map(info => {
    return <DLQueueRow dlService={props.dlService} videoInfo={info} key={info.video_id} />
  });
  return (
    <Table size="sm">
      <thead>
        <tr>
          <th>Title</th>
          <th>Size</th>
          <th>Progress</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { rows }
      </tbody>
    </Table>
  )
}

DLQueue.defaultProps = {
  queueData: []
};
DLQueue.propTypes = {
  queueData: PropTypes.array,
  dlService: PropTypes.object
};

