// Initialize variables
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
var flickrPage = 1;

// Initialize map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    // Center initializes to Seattle, WA
    /* TODO: possibly use user's geolocation to initially center map? Or just
       don't show a map before initial search? */
    center: new google.maps.LatLng(latLng[0], latLng[1]),
    zoom: 12
  });
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
    console.log(response);
    latLng = [];
    latLng.push(response.results[0].geometry.location.lat);
    latLng.push(response.results[0].geometry.location.lng);
    getPhotos(latLng);
  })
  // TODO: Add a more descriptive error alert/message
  .fail(function(jqXHR, error) {
    console.log('fail');
  });
}

/*
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    // Global latititude and longitude variables
    lat = results[0].geometry.location.lat();
    lng = results[0].geometry.location.lng();
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
    //} else {
      //alert('Geocode was not successful for the following reason: ' + status);
    //}
//  });
//}

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
    page: flickrPage
  };

  $.ajax({
    url: 'https://api.flickr.com/services/rest/',
    type: 'GET',
    data: params,
  })
  .success(function(response) {
    // console.log(response);
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
      // Creates map marker for each photo on the page
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
