/**
 * Model for neighborhood places
 */
var iniplaces = [
  {
    name: "Cuervo Store",
    lat: 40.426808,
    long: -3.703256,
    description: "cool clothes and music. If you like garage Rock like Burger records"
  },
  {
    name: "La Catrina - Mezcalería",
    lat: 40.425271,
    long: -3.702007,
    description: "Mezcal, good Mexican food in a colorful cantina full of Mexican folklore. The owner has good taste in music."
  },
  {
    name: "Federal Café",
    lat: 40.427005,
    long: -3.709271,
    description: "Good open workplace with creative breakfasts and Scandinavian design furniture"
  },
  {
    name: "Mongo Scifi & Exotic Bar",
    lat: 40.425136, 
    long: -3.704312,
    description: "Great place to party"
  },
  {
    name: "Café Pepe Botella",
    lat: 40.426588, 
    long: -3.703641,
    description: "Good coffe and jazz music"
  },
];



var ViewModel = function() {
  var self = this;
  var markers = [];
  var infowindows = [];

  
  //Create a place object
  var Place = function(data){
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.description = data.description;

    name_string = String(data.name);

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.long),
      title: name_string,
      map: map,
      draggable: false,
      icon:   'http://www.google.com/mapfiles/arrow.png',
      shadow: 'http://www.google.com/mapfiles/arrowshadow.png',      
      animation: google.maps.Animation.DROP
    });

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">'+
      this.name +'</h4>'+
      '<div id="bodyContent">'+
      '<p>'+ this.description +'</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
    content: contentString
    });

    function toggleBounce() {
        // stop all other markers from beeing animated
        for (var i = 0; i < markers.length; i++) {
          markers[i].setAnimation(null);
        }
        // animate marker
        marker.setAnimation(google.maps.Animation.BOUNCE);    
    }

    google.maps.event.addListener(marker, 'click', function(){    
      // close all other info windows to avoid multiple windows beeing open simultaniously
      for (var i = 0; i < infowindows.length; i++) {
        infowindows[i].close();
      }
      // open selected infowindow
      infowindow.open(map, marker);
      // animate selected marker
      toggleBounce();
    });


    markers.push(marker);
    infowindows.push(infowindow);
  };


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
  initializeMap();

  //Push the Trails into a list of viewmodel trail objects
  self.placeList = ko.observableArray([]);

  iniplaces.forEach(function(placeitem){
    self.placeList.push(new Place(placeitem));
  });

  //Create a binding to listen to the click on the list
  self.clickMarker = function(place){
    var placeName = place.name;
    for (var i in markers){
      if (markers[i].title === placeName) {
        google.maps.event.trigger(markers[i], 'click');
      }
    }
  };


};


$(document).ready(function(){
    ko.applyBindings(new ViewModel());
});