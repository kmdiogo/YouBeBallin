import ytdl from 'ytdl-core';
import fs from 'fs';

export default class DLQueueService {
  queue = [];
  dlMap = {};
  constructor(outputPath) {
    this.outputPath = outputPath;
    this.onQueueChange = function() {};
    console.log("%c Download Queue Service Created", "background: green; color: white");
  }

  /**
   * Adds ytdl metainfo to queue. Automatically starts video download for front of queue.
   * @param {Object} videoInfo - ytdl-core metainfo (full) object
   */
  enqueue(videoInfo) {
    if (this.contains(videoInfo.video_id)) throw `Cannot enqueue duplicate video with ID ${videoInfo.video_id}`;

    // Create ytdl readable
    const stream = ytdl(videoInfo.video_url);

    // Attach stream to metaInfo for later use
    const videoObj = { ...videoInfo, stream };

    // Add info object to queue and map
    this.queue.push(videoObj);
    this.dlMap[videoObj.video_id] = videoObj;
    if (this.queue.length === 1) {
      console.log("%c First video added, starting queue...", "color: yellow; background: black");
      this.processDownload(this.queue[0])
    }
    this._emitChange();
  }

  /**
   * Begins download given a ytdl metainfo object.
   * @param videoInfo - ytdl-core metainfo (full) object
   */
  processDownload(videoInfo) {
    const fileName = `${ videoInfo.title }.mp4`;
    console.log(`%c Started Download for '${videoInfo.title}'`, "background: lightgray");
    const { stream } = videoInfo;

    // Start download
    stream.pipe(fs.createWriteStream(`${this.outputPath}/${fileName}`));
    stream.once('finish', () => {
      // Remove video info object from front of queue and start next video if available
      this._dequeue(0);
      console.log(`%c Finished download for '${videoInfo.title}'`, "background: lightgray");
      if (this.queue.length > 0) {
        this.processDownload(this.queue[0]);
      }
    });
  }

  /**
   * This callback executes after enqueue or dequeue finishes
   * @callback onQueueChangeCallback
   * @param {Object} queue
   */

  /**
   * Sets callback function that executes when enqueue or dequeue finishes.
   * @param {onQueueChangeCallback} onQueueChange - callback function
   */
  subscribe(onQueueChange) {
    console.log("%c React component subscribed to queue", "background: purple; color: white");
    this.onQueueChange = onQueueChange;
  }

  stop(video_id) {
    if (!this.contains(video_id)) throw `Video with ID ${video_id} does not exist in queue`;

    let queuePos;
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].video_id === video_id) {
        queuePos = i;
      }
    }
    this.queue[queuePos].stream.destroy();
    this._dequeue(queuePos);
  }

  /**
   * Checks if a given video_id exists in queue
   * @param {string} video_id
   * @returns {boolean}
   */
  contains(video_id) {
    return this.dlMap.hasOwnProperty(video_id);
  }

  /**
   * Executes when ytdl emits a progress event
   * @callback onProgressCallback
   * @param {Number} chunkLength
   * @param {Number} downloaded
   * @param {Number} total
   */

  /**
   * Executes when ytdl emits finish event
   * @callback onFinishCallback
   */

  /**
   *
   * @param {string} video_id
   * @param {onProgressCallback} onProgress
   * @param {onFinishCallback} onFinish
   */
  subscribeProgress(video_id, onProgress, onFinish = function() {}) {
    if (!this.dlMap.hasOwnProperty(video_id)) throw `Download Queue does not contain video with ID ${video_id}`;

    const videoInfo = this.dlMap[video_id];
    videoInfo.stream.on('progress', onProgress);
    console.log(`%c Subscribed to '${videoInfo.title}' download progress`, "background: yellow");
    // Using prepend to guarantee React related emitters will be done after
    videoInfo.stream.prependOnceListener('finish', () => {
      videoInfo.stream.removeListener('progress', onProgress);
      console.log(`%c Unsubscribed to ${videoInfo.title} progress`, "background: pink");
      onFinish();
    });
  }

  /**
   * Remove specified index item from queue and emits change
   * @param i
   * @private
   */
  _dequeue(i) {
    // Note: Do NOT call .removeAllListeners(). If done, ytdl-core teardown will not work properly
    const videoInfo = this.queue.splice(i, 1)[0];
    delete this.dlMap[videoInfo.video_id];
    this._emitChange();
  }

  /**
   * Calls onQueueChange callback and returns payload (excludes stream from payload)
   * @private
   */
  _emitChange() {
    // Must create array copy so React may detect changes
    const payload = this.queue.map(info => {
      const { stream, ...metaInfo } = info;
      return { ...metaInfo }
    });
    this.onQueueChange(payload);
  }
}
