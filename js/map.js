/**
 * Model for neighborhood places
 */
var iniplaces = [
  {
    name: "Cuervo Store",
    latitude: 40.426808,
    longitude: -3.703256,
    description: "cool clothes and music. If you like garage Rock like Burger records"
  },
  {
    name: "La Catrina - Mezcalería",
    latitude: 40.425271,
    longitude: -3.702007,
    description: "Mezcal, good Mexican food in a colorful cantina full of Mexican folklore. The owner has good taste in music."
  },
  {
    name: "Federal Café",
    latitude: 40.427005,
    longitude: -3.709271,
    description: "Good open workplace with creative breakfasts and Scandinavian design furniture"
  },
  {
    name: "Mongo Scifi & Exotic Bar",
    latitude: 40.425136, 
    longitude: -3.704312,
    description: "Great place to party"
  },
  {
    name: "Café Pepe Botella",
    latitude: 40.426588, 
    longitude: -3.703641,
    description: "Good coffe and jazz music"
  },
];


var ViewModel = function() {
  var self = this;
  var map;
  var markers = [];
  var infowindows = [];
  var weather;
  var locationURLList = [];
  self.search = ko.observable('');
  self.placeList = ko.observableArray([]);
  
  
  //Create a place object
  var Place = function(data){
    this.name = data.name;
    this.lat = data.latitude;
    this.long = data.longitude;
    this.description = data.description;

    name_string = String(data.name);
    // create marker
    if (typeof google != "undefined"){
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.latitude, data.longitude),
        title: name_string,
        map: map,
        draggable: false,
        icon:   'img/marker.svg', 
        animation: google.maps.Animation.DROP
      });
    }

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">'+
      this.name +'</h4>'+
      '<div id="bodyContent">'+
      '<p>'+ this.description +'</p>'+
      '</div>'+
      '</div>';
    
    if (typeof google != "undefined"){
      var infowindow = new google.maps.InfoWindow({
      content: contentString
      });
    }

    function toggleBounce() {
        // stop all other markers from beeing animated
        for (var i = 0; i < markers.length; i++) {
          markers[i].setAnimation(null);
        }
        // animate marker
        marker.setAnimation(google.maps.Animation.BOUNCE);    
    }

    google.maps.event.addListener(this.marker, 'click', function(){    
      // close all other info windows to avoid multiple windows beeing open simultaniously
      for (var i = 0; i < infowindows.length; i++) {
        infowindows[i].close();
      }
      // open selected infowindow
      infowindow.open(map, marker);
      // animate selected marker
      toggleBounce();
    });


    markers.push(this.marker);
    infowindows.push(infowindow);
  };


  function initializeMap() {
    var malasana;
    
    try {
        // This next line makes `malasana` a new Google Map JavaScript Object
        malasana = new google.maps.LatLng(40.426394, -3.704878);
      } catch (err) {
        //if google map api didnt respond
        $('#map').hide();
        $('#map-error').html('<h5>There is problem to retrieve data from google map</br>Please try again later</h5>');
      }
    
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
      zoom: 17,
      center: malasana,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
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
        styles: [{"featureType":"landscape.fill","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]


      };
    if (typeof google != "undefined"){
      map = new google.maps.Map(mapCanvas, mapOptions);
    }
  }
  initializeMap();

  //Push the Trails into a list of viewmodel trail objects
  if (typeof google != "undefined"){
    iniplaces.forEach(function(placeitem){
      self.placeList.push(new Place(placeitem));
    });
  }

  //Create a binding to listen to the click on the list
  self.clickMarker = function(place){
    var placeName = place.name;
    for (var i in markers){
      if (markers[i].title === placeName) {
        google.maps.event.trigger(markers[i], 'click');
      }
    }
  };

  // API calls
  var flickrCall = function(){
    var url = "https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=97d1c372b413a02c10ef47541ba743a8&user_id=137064132@N04&format=json&jsoncallback=?"; 

    $.getJSON(url
        ).success(
          function(data) {
            console.log('yessss');

            console.log("flickr", data);
          }).fail(
              function(e) {
              console.log('nooooo...%o', e);
          });

          console.log('sent');         
    };

    var facebookCall = function () {
     
    };

// call openweather api and set weather animation on map canvas
  var setWeather = function(){
    var url = "http://api.openweathermap.org/data/2.5/weather?lat=40.424430&lon=-3.701449&units=metric&appid=186b68b9f2c87ea71239b8d2dac0b380";
    var weather;
    // call openweather api
    $.getJSON(url, function(data){
        console.log("openweather ", data);
        weather = data.weather[0].description;
        console.log(weather);
        // set weather animation on map
        switch (weather) {
          case "Sky is Clear":
            $(".sunny").show();
            break;
          case "few clouds":
            $(".sunny").show();
            $(".cloudy").show();
            break;
          case "Scattered Clouds":
            $(".sunny").show();
            $(".cloudy").show();
            break;
          case "broken clouds":
            $(".sunny").show();
            $(".cloudy").show();
            break;
          case "overcast clouds":
            $(".cloudy").show();
            break;
          case "rain":
            $(".rainy").show();
            $(".cloudy").show();
            break;
           case "Thunderstorm":
            $(".rainy").show();
            $(".cloudy").show();
            break;
           case "snow":
            $(".snowy").show();
            $(".cloudy").show();
            break;
           case "mist":
            $(".cloudy").show();
            break;
          default:
            console.log("Sorry, " + weather + "does not match any coded weather description.");
        }
      }); 
    };

  var instagramCall = function(){
    // find location ID within 700 meters of the neighborhood's coordinates
    var igLat = 40.426394;
    var igLng = -3.704878;

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      data: true,
      url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=460702240.2045934.b1d27f475b81420ea53c8671507c7b3f'
      }).done(function(data) {
        console.log("instagram ",data);
        for (var i = 0; i < data.data.length; i++){
          console.log(data.data[i]);
          
          


        }
    });
  };
  instagramCall();
  setWeather();
  flickrCall();
  facebookCall();

  
  self.hideWeather = function(){
    $(".weather").hide();
  };


  // Search Function

  self.filteredItems = ko.computed(function() {
            var searchTerm = self.search().toLowerCase();
            // is the search term undefined or empty?
            if (!searchTerm || searchTerm === '') {
                // for each location
                for (var i = 0; i < self.placeList().length; i++) {
                    // does the map marker exist?
                    if (self.placeList()[i].marker !== undefined) {
                        self.placeList()[i].marker.setVisible(true); // show the map marker
                    }
                }
                return self.placeList(); // return location list
            } else {
                return ko.utils.arrayFilter(self.placeList(),
                    function(item) {
                        // does the place name contain the search term?
                        if (item.name.toLowerCase().indexOf(searchTerm) < 0) {
                            item.marker.setVisible(false); // hide the map marker
                            
                        } else {
                            item.marker.setVisible(true); // show the map marker
                        }
                        return item.name.toLowerCase().indexOf(searchTerm) !== -1; // return filtered location list
                    });

            }
        });

  
  
};


$(document).ready(function(){
    ko.applyBindings(new ViewModel());
});