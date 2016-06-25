// Initialize variables
var flickrKey = 'bd5883080cd861f2e51ffc57c3e6b717';
var radius = 1.5;
var gallery = $('#gallery');

// Initialize map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    // Center initializes to Seattle, WA
    // TODO: possibly use user's geolocation to initially center map?
    center: {lat: 47.60621, lng: -122.332071
},
    zoom: 12
  });
  var geocoder = new google.maps.Geocoder();
  // Submit button click event
  // TODO: pressing enter should have same affect as clicking button
  $('.search-bar').submit(function(e) {
    e.preventDefault();
    geocodeAddress(geocoder, map);
    // var location = $(this).find('#address').val();
  });
}

// Geocode address which user inputted
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    // Global latititude and longitude variables
    lat = results[0].geometry.location.lat();
    lng = results[0].geometry.location.lng();
    console.log(lat);
    console.log(lng);
    getPhotos(lat, lng);
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      // Adds marker for each searched address on map
      /*
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      */
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

/*
// Gets flickr photos (public only) based on the location inputted by the user
function getPhotos(lat, lng) {
  var params = {
    api_key: 'e4aee99e08367dcf3791594e042828f2',
    lat: lat,
    lon: lng,
    radius: '1.5',
    radius_units: 'mi',
    format: 'json',
    auth_token: '72157667454977864-f884690a7d37dfbf'
  };
  url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

  $.getJSON(url, params, function(data) {
    console.log(data);
  });
  */

// Gets flickr photos (public only) based on the location inputted by the user
function getPhotos(lat, lng) {
  var params = {
    format: 'json',
    method: 'flickr.photos.search',
    api_key: flickrKey,
    nojsoncallback: 1,
    lat: lat,
    lon: lng,
    radius: radius,
    radius_units: 'mi'
  };

  $.ajax({
    url: 'https://api.flickr.com/services/rest/',
    type: 'GET',
    data: params,
    success: function(response) {
      console.log(response);
    }
  })
  .fail(function(jqXHR, error) {
    console.log('fail');
  });
  /*
  .done(function(result) {
    console.log(result);
  });
  */
  /*
  var apiKey = 'e4aee99e08367dcf3791594e042828f2';
  var location = '&lat=' + lat + '&lon=' + lng;
  var radius = 1.5;
  var radiusUnits = 'mi';
  var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
  apiKey +
  location +
  '&radius=' +
  radius +
  '&radius_units=' +
  radiusUnits +
  '&format=json&auth_token=72157667454977864-f884690a7d37dfbf';
  var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e4aee99e08367dcf3791594e042828f2&lat=47.60621&lon=-122.332071&radius=1.5&radius_units=mi&format=json&auth_token=72157667454977864-f884690a7d37dfbf&api_sig=10aeed3cf8b26421294f569892559e0b';
  $.getJSON(url, function(data) {
    console.log(data);
  });
  */
}

$(function() {
  $('.search-bar').submit(function(e) {

  });
});
