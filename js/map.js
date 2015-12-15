/*function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
              // How zoomed in you want the map to start at (always required)
              zoom: 16,

              // The latitude and longitude to center the map (always required)
              center: new google.maps.LatLng(40.424430, -3.701449), // New York

              // How you would like to style the map. 
              // This is where you would paste any style found on Snazzy Maps.
              styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]}]
                };

  var map = new google.maps.Map(mapCanvas, mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);
*/
   
////////////// Try markers ////////////

var malasana = new google.maps.LatLng(40.424430, -3.701449)
 
var places = [
  new google.maps.LatLng(40.427149, -3.703609),
  new google.maps.LatLng(40.426806, -3.708587),
  new google.maps.LatLng(40.424254, -3.706639),
  new google.maps.LatLng(40.423515, -3.702312),
  new google.maps.LatLng(40.426088, -3.709495)
  ];
 
var markers = [];
var iterator = 0;
var map;
 
  function initialize() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
      zoom: 16,
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
      styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]}]
                

    };
 
    map = new google.maps.Map(mapCanvas, mapOptions);
  }
google.maps.event.addDomListener(window, 'load', initialize);

function drop() {
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