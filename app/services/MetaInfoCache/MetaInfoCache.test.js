import MetaInfoCache from './MetaInfoCache';

test('add item to empty cache', () => {
  const cache = new MetaInfoCache();
  cache.add({ video_url: 'test' });
  expect(cache.get('test')).toMatchObject({ video_url: 'test' });
});

test('adding item to full cache replaces oldest item in cache', () => {
  const cache = new MetaInfoCache(2);
  cache.add({ video_url: 'test' });
  cache.add({ video_url: 'test2' });
  cache.add({ video_url: 'replacement' });

  expect(cache.get('test')).toBeNull();
  expect(cache.get('replacement')).toMatchObject({ video_url: 'replacement' });
});
