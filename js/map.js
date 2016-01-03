var map;
/**
 * Model for neighborhood places
 */
var place = [
  {
    name: "Cuervo Store",
    lat: 40.426808,
    lng: -3.703256,
    description: "cool clothes and music. If you like garage Rock like Burger records",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
  },
  {
    name: "La Catrina - Mezcalería",
    lat: 40.425271,
    lng: -3.702007,
    description: "Mezcal, good Mexican food in a colorful cantina full of Mexican folklore. The owner has good taste in music.",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
  },
  {
    name: "Federal Café",
    lat: 40.427005,
    lng: -3.709271,
    description: "Good open workplace with creative breakfasts and Scandinavian design furniture",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
  },
  {
    name: "Mongo Scifi & Exotic Bar",
    lat: 40.425136, 
    lng: -3.704312,
    description: "Great place to party",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
  },
  {
    name: "Café Pepe Botella",
    lat: 40.426588, 
    lng: -3.703641,
    description: "Good coffee and jazz music",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
  },
];

var Place = function(data) {
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.description = data.description;
    this.icon = data.icon;
    this.tag = data.tag;
    this.visible = data.visible;
};


// Call instagram api to load external data into place model
var instagramCall = function(){ 
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                data: true,
                url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=460702240.2045934.b1d27f475b81420ea53c8671507c7b3f',
                success: function(data) {
                    window.clearTimeout(i);
                    console.log("instagram ",data);
                    // add external data to place model
                    for (var i = 0; i < data.data.length; i++){
                        var location = data.data[i].location;
                        console.log(location);
                        var instlocation = {
                            name:location.name ,
                            lat: location.latitude,
                            lng: location.longitude,
                            description: "<img class='img-responsive' style='width:300px; height: 300px;' src='"+data.data[i].images.standard_resolution.url + "''>",
                            icon: "img/instagram-icon.svg",
                            tag: "instagram" ,
                            visible: false  
                        };
                    place.push(instlocation);
                    }
                    // clear fallback timeout when instagram api successfull
                    clearTimeout(fallback);
                    // initialize map after data has been added to place model
                    initMap();
                    }
            });
        }();    




var initMap = function() {
    var ViewModel = function() {
        var self = this;
        this.placeList = ko.observableArray([]);
        this.igImages = ko.observableArray([]);
        this.search = ko.observable('');
        self.showInstList = ko.observable(false);
        self.hideInstList = ko.observable(true);
       

        // Create place object. Push to array.
        place.forEach(function(item) {
            this.placeList.push(new Place(item));
        }, this);
        // set first place
        this.currentPlace = ko.observable(this.placeList()[0]);
        // list click
        this.setPlace = function(clickedPlace) {
            google.maps.event.trigger(clickedPlace.marker, 'click');
        };
        this.renderMarkers = function(arrayInput) {
            // use place array to create marker array
            for (var i = 0, len = arrayInput.length; i < len; i++) {
                var location = {
                    lat: arrayInput[i].lat,
                    lng: arrayInput[i].lng
                };
                
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: arrayInput[i].icon, 
                    animation: google.maps.Animation.DROP,
                    myPlace: arrayInput[i]
                    });
                
                // save the map marker as part of the location object
                arrayInput[i].marker = marker;

                // hide instagram markers
                if (arrayInput[i].visible === false){
                    arrayInput[i].marker.setVisible(false);
                } 
                // create event listener in external function
                self.createEventListener(arrayInput[i]);
            };
        };
        function toggleBounce(myMarker) {
            myMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                myMarker.setAnimation(null);
            }, 2500);
        }
        this.createEventListener = function(location) {
            location.marker.addListener('click', function () {
                toggleBounce(location.marker);
                self.currentPlace(location);
                self.updateContent(location);
                //self.instagramImg(location.lat, location.lng);
                // does the infowindow exist?
                if (self.infowindow) {
                    self.infowindow.close(); // close the infowindow
                }
                // open the infowindow with this map marker location
                self.infowindow.open(map, location.marker);
            });
        };
        this.filteredItems = ko.computed(function() {
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
        // Google Maps
        var styleArray = [{"featureType":"landscape.fill","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}];

        if(map = true){
            // This next line makes `malasana` a new Google Map JavaScript Object
            var malasana = new google.maps.LatLng(40.426394, -3.704878);
            map = new google.maps.Map(document.getElementById('map'), {
                center: malasana,
                zoom: 17,
                mapTypeControl: false,
                scrollwheel: false,
                styles: styleArray,
                streetViewControl: false
            });
        } else {
            alert('Google Maps Error');
        }

        this.infowindow = new google.maps.InfoWindow({
            maxWidth: 300
        });
        this.renderMarkers(self.placeList());

        // API calls
        
        // Logic to hide weather animation or show updated weather animation
        var weatherChecker = false;
        self.toggleWeather = function(){
            if (weatherChecker){
            $(".weather").hide();
            $("#weather-button").text("show weather");
            weatherChecker = false;
            
            }else {
            var url = "http://api.openweathermap.org/data/2.5/weather?lat=40.424430&lon=-3.701449&units=metric&appid=186b68b9f2c87ea71239b8d2dac0b380";
            var weather;
            // call openweather api
            $.getJSON(url, function(data){ 
                weather = data.weather[0].description;
                // set weather animation on map
                switch (weather) {
                  case "Sky is Clear":
                    $(".sunny").show();
                    break;
                  case "few clouds":
                    $(".sunny").show();
                    $(".cloudy").show();
                    break;
                  case "scattered clouds":
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
                    $(".stormy").show();
                    break;
                   case "snow":
                    $(".snowy").show();
                    $(".cloudy").show();
                    break;
                   case "mist":
                    $(".cloudy").show();
                    break;
                  default:
                    console.log("Sorry, " + weather + " does not match any coded weather description.");
                }
                $("#weather-button").text("hide weather");
                weatherChecker = true;
              }).fail(function(){
                alert('Weather API Error');
            });
            }  
        };

        // inicial call to openweather api and set weather animation on map 
        self.toggleWeather();

        // add functionalty to hide or show instagram posts on sidebar list and on map
        var instPostChecker = true;
        self.toggleInstPosts = function(){
            if (instPostChecker){
                // handle visibilty of instagram posts in sidebar list
                    self.hideInstList(false);
                    self.showInstList(true);
                    
                // handle visibilty of each instagram post's marker on map
                for (var i = 0; i < self.placeList().length; i++) {
                    self.placeList()[i].marker.setVisible(true);
                }
                instPostChecker = false;
                $("#post-button").text("hide posts");
            }else{
                // handle visibilty of instagram posts in sidebar list
                    self.hideInstList(true);
                    self.showInstList(false);
                    
                // handle visibilty of each instagram post's marker on map
                for (var i = 0; i < self.placeList().length; i++) {
                    if (self.placeList()[i].tag === "instagram"){
                        self.placeList()[i].marker.setVisible(false);
                    }
                }
                instPostChecker = true;
                $("#post-button").text("show posts");
            }
        };

    };
    // infowindow content
    ViewModel.prototype.updateContent = function(place) {
        var html =  '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">'+
      place.name +'</h4>'+
      '<div id="bodyContent">'+
      '<p>'+ place.description +'</p>'+
      '</div>'+
      '</div>';
        this.infowindow.setContent(html);
    };

 
       
    
   
    ko.applyBindings(new ViewModel());
};

// set fallback to make sure app loads even when instagram api fails
var fallback = setTimeout(function(){
        initMap();
        alert("Failed to get data from Instagram API");
    }, 8000);