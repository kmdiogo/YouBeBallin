// @flow
import React, { useEffect, useState } from 'react';
import styles from './Home.css';
import { Container, Row } from 'react-bootstrap';
import PreviewCard from './PreviewCard/PreviewCard';
import MetaInfoCache from '../../services/MetaInfoCache/MetaInfoCache';
import ytdl from "ytdl-core";
import URLForm from './URLForm/URLForm';
import DLQueue from './DLQueue/DLQueue';
import DLQueueService from '../../services/DLQueueService/DLQueueService';
const { app } = require('electron').remote;

const cache = new MetaInfoCache();
const queueService = new DLQueueService(app.getPath('downloads'));

export default function Home(props) {
  const [videoInfo, setVideoInfo] = useState({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [dlService] = useState(queueService);

  function handleQueueChange(queue) {
    setQueueData(queue);
  }
  useEffect(() => {
    queueService.subscribe(handleQueueChange);
    console.log("Subscribed to service");
  }, [dlService]);


  async function handleValidURL(url) {
    if (isPreviewLoading) return;

    // Retrieve video info from cache
    if (cache.contains(url)) {
      setVideoInfo(cache.get(url));
      return;
    }

    setIsPreviewLoading(true);
    let info;
    try {
      info = await ytdl.getInfo(url);
    } catch(e) {
      setIsPreviewLoading(false);
      setVideoInfo({});
    }
    setIsPreviewLoading(false);

    setVideoInfo(info);
    cache.add(info);
  }

  function handleDownloadClick(videoInfo) {
    if (!queueService.contains(videoInfo.video_id)) {
      queueService.enqueue(videoInfo);
    }
  }

  // test url: https://www.youtube.com/watch?v=x7Xzvm0iLCI
  // test url 2: https://www.youtube.com/watch?v=DH0QIr5kowY
  // TODO: Add notification system when downloads finish usign toast
  const previewCard = (
    <div style={{width: '450px'}}>
      <PreviewCard videoInfo={videoInfo} isLoading={isPreviewLoading} onDownloadClick={handleDownloadClick} />
    </div>
  );
  return (
    <main className="py-3">
      <Container>
        <Row className="justify-content-center">
          <nav className="text-center w-100">
            <h3>YouBeBallin</h3>
            <hr style={ { borderColor: 'white' } } />
          </nav>
        </Row>

        <Row className="mb-3">
          <URLForm onValidURL={handleValidURL} />
        </Row>

        <Row className="justify-content-center">
          { previewCard }
        </Row>
        
        <Row className="mb-3">
          <h5>Download Queue</h5>
          <DLQueue queueData={queueData} dlService={queueService} />
        </Row>
      </Container>
    </main>

  );
}
