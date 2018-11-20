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
//install cache
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(restaurantCache).then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
});
//use activate to update cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          //limits filter to only caches that start with //restaurant-
          return cacheName.startsWith('restaurant-') &&
            //ensure that it does not equal current static restaurantCache
            cacheName != restaurantCache;
          //maps it to Promises returned by caches and deletes the old ones
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
      //clones the response so there are two streams. thanks to Web Fundamentals
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response) {
        //ensures the response is valid and not an error
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

