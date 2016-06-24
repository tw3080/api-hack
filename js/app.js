/*
Instagram access token: 12026246.e899233.1086d94709f141a1b483c6c135202080
*/

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
    getLocationId(lat, lng);
    // console.log(lat);
    // console.log(lng);
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

/* Convert lat/long returned by geocodeAddress() to a location-id for use with
   instagram API */
function getLocationId(lat, long) {
  var locationId = 'lat=' + lat + '&lng=' + lng;
  var accessToken = '12026246.e899233.1086d94709f141a1b483c6c135202080';
  var url = 'https://api.instagram.com/v1/locations/search?' + locationId + '&access_token=' + accessToken;
  $.ajax({
    url: url,
    dataType: "jsonp",
    type: "GET",
    distance: 0,
    success: function(response) {
      console.log(response);
    }
  });
}

// Gets Instagram posts by location
function getPosts(location) {
  var locationId = location;
  var accessToken = '12026246.e899233.1086d94709f141a1b483c6c135202080';
  var url = 'https://api.instagram.com/v1/locations/' + locationId + '/media/recent?access_token=' + accessToken;
  $.ajax({
    url: url,
    dataType: "jsonp",
    type: "GET",
    success: function(response) {
      console.log(response);
    }
  });
}

$(function() {
  $('.search-bar').submit(function(e) {

  });
});
