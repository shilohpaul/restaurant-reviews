var restaurantCache = 'restaurant-cache-v1'
var filesToCache= [
  '/css/styles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/index.html',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/restaurant.html'
];
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(restaurantCache).then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
            cacheName != restaurantCache;
          }).map(function (cacheName) {
            return cache.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response) {
        return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(restaurantCache).then(function(cache) {
            cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
