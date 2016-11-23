var $ = require('jquery');
var mapprApp = require('./app');
var customMapStyles = require('./custom-map-styles');
// var fontAwesomeMarkers = require('fontawesome-markers');

$(document).ready(function() {
    mapprApp();
    customMapStyles();
    fontAwesomeMarkers();
});
