export default class MetaInfoCache {
  cache = {};
  urlQueue = [];
  maxSize = 50;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  add(metaInfo) {
    const url = metaInfo['video_url'];
    if (this.contains(url)) return;

    // Overwrite first added URL in cache if max size exceeded
    if (Object.keys(this.cache).length >= this.maxSize) {
      delete this.cache[this.urlQueue.shift()];
    }

    this.cache[url] = metaInfo;
    this.urlQueue.push(url);
  }

  remove(url) {
    if (!this.contains(url)) {
      return false;
    }

    delete this.cache[url];
    return true;
  }

  get(url) {
    if (!this.contains(url)) return null;
    return this.cache[url];
  }

  contains(url) {
    return this.cache.hasOwnProperty(url);
  }
}
