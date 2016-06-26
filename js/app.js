// Initialize variables
var map;
var inputLocation = '';
var photoGallery = [];
var gallery = $('#gallery');
var search = $('.get-location');
var latLng = [47.60621, -122.332071]; // Default lat/lng to Seattle, WA
var googleKey = 'AIzaSyBW-hUSjC0jN5IKre7PDMWgBBO2YV8EMng';
var flickrKey = 'bd5883080cd861f2e51ffc57c3e6b717';
var radius = 1; // Default search radius of 1 mile
var accuracy = 12; // Default accuracy, city level
var perPage = 10; // Default number of pictures to display per page in gallery
var page = 1; // Flickr page number

// Initialize map
function initMap() {
  var mapProp = {
    // Center initializes to Seattle, WA
    /* TODO: possibly use user's geolocation to initially center map? Or just
       don't show a map before initial search? */
    center: new google.maps.LatLng(latLng[0], latLng[1]),
    zoom: 12 // Zoom defaults to city-level
  };
  map = new google.maps.Map(document.getElementById('map'), mapProp);
}

// Gets geocode based on location which the user inputted
function geocodeAddress(location) {
  var params = {
    key: googleKey,
    address: location
  };

  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    type: 'GET',
    data: params
  })
  .success(function(response) {
    // console.log(response);
    latLng = [];
    latLng.push(response.results[0].geometry.location.lat);
    latLng.push(response.results[0].geometry.location.lng);
    initMap();
    getPhotos(latLng);
  })
  // TODO: Add a more descriptive error alert/message
  .fail(function(jqXHR, error) {
    console.log('fail');
  });
}

// Gets flickr photos (public only) based on location inputted by the user
function getPhotos(coordinate) {
  var params = {
    format: 'json',
    method: 'flickr.photos.search',
    api_key: flickrKey,
    nojsoncallback: 1,
    accuracy: accuracy,
    has_geo: 1,
    lat: coordinate[0],
    lon: coordinate[1],
    radius: radius,
    radius_units: 'mi',
    extras: 'geo',
    per_page: perPage,
    page: page
  };

  $.ajax({
    url: 'https://api.flickr.com/services/rest/',
    type: 'GET',
    data: params,
  })
  .success(function(response) {
    // console.log(response);
    var infoWindow = new google.maps.InfoWindow();
    $.each(response.photos.photo, function(i, item) {
      var url = 'http://farm' +
        item.farm +
        '.staticflickr.com/' +
        item.server +
        '/' +
        item.id +
        '_' +
        item.secret +
        '.jpg';
      // TODO: Replace URL with my own expanded gallery view
      // Appends photos to #gallery
      var a = $('<a>').attr('href', url);
      var img = $('<img>').attr('src', url);
      a.append(img);
      gallery.append(a);
      // Store latitude and longitude of each item in variable
      lat = item.latitude;
      lng = item.longitude;
      // Create a marker on map for each photo
      var myLatLng = new google.maps.LatLng(lat,lng);
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        // title: 'Photo'
      });
      /* Clicking a marker triggers an event which opens a info window
         displaying the details of a picture */
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent('lol');
        infoWindow.open(map, marker);
      });
    });
    // Arranges images in a justified Gallery
    gallery.justifiedGallery();
  })
  // TODO: Add a more descriptive error alert/message
  .fail(function(jqXHR, error) {
    console.log('fail');
  });
}

// Execute on page load
$(function() {
  search.submit(function(e) {
    e.preventDefault();
    inputLocation = $(this).find('#address').val();
    gallery.html(''); // Clears the gallery upon new search
    geocodeAddress(inputLocation);
  });
});
