// Initialize variables
var map;
var inputLocation = '';
var counter = 1; // Counter for changing pages when gallery arrows are clicked
var markers = []; // Array of map markers
var gallery = $('#gallery');
var search = $('.get-location');
var carouselNav = $('#carousel');
var leftArrow = $('#left-arrow');
var rightArrow = $('#right-arrow');
var latLng = [47.60621, -122.332071]; // Default lat/lng to Seattle, WA
var googleKey = 'AIzaSyBW-hUSjC0jN5IKre7PDMWgBBO2YV8EMng';
var flickrKey = 'bd5883080cd861f2e51ffc57c3e6b717';
var radius = 0.5; // Default search radius of 1 mile
var accuracy = 15; // Default accuracy, city level
var perPage = 5; // Default number of pictures to display per page in gallery
var page = 1; // Flickr page number

// Initialize map
function initMap() {
  // Map object
  var mapProp = {
    // Center initializes to Seattle, WA
    /* TODO: possibly use user's geolocation to initially center map? Or just
       don't show a map before initial search? */
    center: new google.maps.LatLng(latLng[0], latLng[1]),
    zoom: 15, // Zoom defaults to city-level
    mapTypeControl: false,
    streetViewControl: false
  };
  map = new google.maps.Map(document.getElementById('map'), mapProp);

  // Sets map styles
  map.setOptions({styles: styles});

  // Re-centers map on window resize
  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
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
    var infoWindow = new google.maps.InfoWindow();
    $.each(response.photos.photo, function(i, item) {
      // console.log(item);
      var url = 'http://farm' +
        item.farm +
        '.staticflickr.com/' +
        item.server +
        '/' +
        item.id +
        '_' +
        item.secret +
        '.jpg';
      // Appends photos to #gallery
      var thumbnail = $('<div class="thumbnail" style="background-image: url(' + url + ');"></div>');
      gallery.append(thumbnail);
      // Store latitude and longitude of each item in variable
      var lat = item.latitude;
      var lng = item.longitude;
      // Create a marker on map for each photo
      var myLatLng = new google.maps.LatLng(lat,lng);
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: {
          path: fontawesome.markers.MAP_MARKER,
          scale: 0.65,
          strokeWeight: 0.2,
          strokeColor: '#B300FF',
          strokeOpacity: 1,
          fillColor: '#B300FF',
          fillOpacity: 0.75,
        }
      });
      markers.push(marker);
      // Larger thumbnail image to display in infoWindow
      var lrgImg = $('<img src="' + url + '"/>');
      /* Clicking a marker triggers an event which opens an infoWindow
         displaying a larger version of each image */
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(lrgImg[0]);
        infoWindow.open(map, marker);
      });
      /* Clicking an image in the gallery also triggers the above marker click
         event to display a larger version of the image */
      $(thumbnail).click(function() {
        google.maps.event.trigger(marker, 'click');
        infoWindow.setContent(lrgImg[0]);
        infoWindow.open(map, marker);
      });
    });
  })
  // TODO: Add a more descriptive error alert/message
  .fail(function(jqXHR, error) {
    console.log('fail');
  });
}

// Removes all map markers
function removeMarkers() {
  for (i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// Execute on page load
$(function() {
  search.submit(function(e) {
    e.preventDefault();
    inputLocation = $(this).find('#address').val();
    gallery.html(''); // Clear the gallery upon each search
    geocodeAddress(inputLocation);
    carouselNav.removeClass('hide'); // Show gallery navigation
  });
  // Populates gallery with next page of photos on click
  rightArrow.on('click', function() {
    if (page >= 1) { // If gallery page is greater than or equal to 1
      leftArrow.removeClass('hide'); // Show the back arrow
    }
    removeMarkers(); // Remove all markers currently on map
    gallery.html(''); // Clear gallery
    counter++;
    page = counter;
    getPhotos(latLng);
    console.log(page);
  });
  // Populates the gallery with the previus set of photos on click
  leftArrow.on('click', function() {
    if (page <= 2) { // If gallery page is less than or equal to 2
      leftArrow.addClass('hide'); // Hide the back arrow
    }
    removeMarkers(); // Remove all markers currently on map
    gallery.html(''); // Clear gallery
    counter--;
    page = counter;
    getPhotos(latLng);
    console.log(page);
  });
});
