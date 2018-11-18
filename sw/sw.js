self.addEventListener('install', function(event){
  var filesToCache= [
    css/styles.css,
    data/restaurants.json,
    img/1.jpg,
    img/2.jpg,
    img/3.jpg,
    img/4.jpg,
    img/5.jpg,
    img/6.jpg,
    img/7.jpg,
    img/8.jpg,
    img/9.jpg,
    img/10.jpg,
    index.html,
    js/dbhelper.js,
    js/main.js,
    js/restaurant_info.js,
    restaurant.html
  ]
  event.waitUntil(
    caches.open('restaurants-cache-v1').then(function(cache){
      return cache.addAll(filesToCache);
    });
  );

});

self.addEventListener('fetch', function(event){
  event.respondWith(
  caches.match(event.request).then(function(response){
    if(response) return response;
    return fetch(event.request);
  }).catch(function(err){
    console.log('Error');
  });
  );
});
