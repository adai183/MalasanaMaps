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
  var iterator = 0;
  
  //Create a place object
  var Place = function(data){
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.description = data.description;
  };


  self.drop = function() {
      for (var i = 0; i < iniplaces.length; i++) {
        setTimeout(function() {
          addMarker();
        }, i * 200);
      }
    };
   
  function addMarker() {
    markers.push(new google.maps.Marker({
      position: new google.maps.LatLng(iniplaces[iterator].lat, iniplaces[iterator].long),
      map: map,
      draggable: false,
      icon:   'http://www.google.com/mapfiles/arrow.png',
      shadow: 'http://www.google.com/mapfiles/arrowshadow.png',      
      animation: google.maps.Animation.DROP
    }));
    iterator++;
  }

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

  $(document).ready(function(){
    self.drop();
});
};


$(document).ready(function(){
    ko.applyBindings(new ViewModel());
});