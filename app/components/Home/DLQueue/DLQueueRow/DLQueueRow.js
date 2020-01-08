import React, { useEffect, useState } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatBytes } from '../../../../utils/utils';

const PROGRESS_UPDATE_RATE = 100;

export default function DLQueueRow(props) {
  const [bytes, setBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(1);

  const handleProgress = throttle((chunkLength, downloaded, total) => {
    setBytes(downloaded);
    setTotalBytes(total);
  }, PROGRESS_UPDATE_RATE, { trailing: false });

  useEffect(() => {
    props.dlService.subscribeProgress(props.videoInfo.video_id, handleProgress);
  }, [props.dlService]);


  const size = <span>{formatBytes(bytes)} / {formatBytes(totalBytes)}</span>;
  return (
    <tr>
      <td>{ props.videoInfo.title }</td>
      <td>{ totalBytes === 1 ? '?' : size}</td>
      <td><ProgressBar animated now={bytes} max={totalBytes} label={`${Math.floor((bytes / totalBytes) * 100)}%`} /></td>
      <td><Button size="sm"><FontAwesomeIcon icon={faTimes} /></Button></td>
    </tr>
  )
}

DLQueueRow.propTypes = {
  dlService: PropTypes.object,
  videoInfo: PropTypes.object
};
