/**
 * Model for neighborhood places
 */
var places = [
  new google.maps.LatLng(40.427149, -3.703609),
  new google.maps.LatLng(40.426806, -3.708587),
  new google.maps.LatLng(40.424254, -3.706639),
  new google.maps.LatLng(40.423515, -3.702312),
  new google.maps.LatLng(40.426088, -3.709495)
];
 

var ViewModel = function() {
  var self = this;
  var markers = [];
  var iterator = 0;
  
  self.drop = function() {
      for (var i = 0; i < places.length; i++) {
        setTimeout(function() {
          addMarker();
        }, i * 200);
      }
    };
   
  function addMarker() {
    markers.push(new google.maps.Marker({
      position: places[iterator],
      map: map,
      draggable: false,
      icon:   'http://www.google.com/mapfiles/arrow.png',
      shadow: 'http://www.google.com/mapfiles/arrowshadow.png',      
      animation: google.maps.Animation.DROP
    }));
    iterator++;
  }

  $(document).ready(function(){
    self.drop();
  });
};

/**
 * Initialize google MAP
 */

  function initializeMap() {
    var malasana = new google.maps.LatLng(40.424430, -3.701449)
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
      zoom: 15,
      center: malasana,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
      styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
    };
 
    map = new google.maps.Map(mapCanvas, mapOptions);
  }



// declares a global map variable
var map;

$(document).ready(function(){
    initializeMap();
    ko.applyBindings(new ViewModel());
});