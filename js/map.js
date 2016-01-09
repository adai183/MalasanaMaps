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
        name: "La Catrina",
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
        name: "Toma Café",
        lat: 40.426464, 
        lng: -3.705959,
        description: "Best coffee in town",
        icon: 'img/marker.svg',
        tag: "hardcoded",
        visible: true
      },
      {
        name: "La Pescadería",
        lat: 40.422898, 
        lng: -3.703014,
        description: "Awesome mediterranean fish restaurant",
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
                        var comment;
                        if (data.data[i].caption !== null){
                            comment = data.data[i].caption.text;
                        }else {
                            comment = "";
                        }
                        console.log(location);
                        var instlocation = {
                            name:location.name ,
                            lat: location.latitude,
                            lng: location.longitude,
                            description: "<img class='img-responsive' style='width:300px; height: 300px;' src='"+data.data[i].images.standard_resolution.url + "''><br><h4>" + comment + "</h4>",
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
        var weather;
        // create observables to controle weather animation
        self.sunny = ko.observable(false);
        self.cloudy = ko.observable(false);
        self.rainy = ko.observable(false);
        self.snowy = ko.observable(false);
        self.rainbow = ko.observable(false);
        self.starry = ko.observable(false);
        self.stormy = ko.observable(false);
       

        // Create place object. Push to array.
        place.forEach(function(item) {
            this.placeList.push(new Place(item));
        }, this);

    
        // set first place
        this.currentPlace = ko.observable(this.placeList()[0]);

        var hideNavbar = function() {
            
            $("#wrapper").attr("class","toggled");
            $("#menu-toggle").attr("class", "");
        };

        // list click
        this.setPlace = function(clickedPlace) {
            google.maps.event.trigger(clickedPlace.marker, 'click');           
            // hide sidebar and weather animation when place gets clicked for better UX
            hideNavbar();
            $(".weather").hide();
            $("#weather-button").text("show weather");
            weatherChecker = false;
            
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
            }
        };


        function toggleBounce(myMarker) {
            myMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                myMarker.setAnimation(null);
            }, 2500);
        }
        this.createEventListener = function(location) {
            location.marker.addListener('click', function () {
                self.foursquareCall(location);
                toggleBounce(location.marker);
                self.currentPlace(location);
                //self.updateContent(location);
                // hide sidebar and weather animation when place gets clicked for better UX
                hideNavbar();
                $(".weather").hide();
                $("#weather-button").text("show weather");
                weatherChecker = false;
                 
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
            // call openweather api
            $.getJSON(url, function(data){ 
                console.log(data);
                weather = data.weather[0].description;
                // set weather animation on map
                switch (weather) {
                  case "Sky is Clear":
                    self.sunny(true);
                    break;
                  case "few clouds":
                    self.sunny(true);
                    self.cloudy(true);
                    break;
                  case "scattered clouds":
                    self.sunny(true);
                    self.cloudy(true);
                    break;
                  case "broken clouds":
                    self.sunny(true);
                    self.cloudy(true);
                    break;
                  case "overcast clouds":
                    self.cloudy(true);
                    break;
                   case "light intensity drizzle":
                    self.cloudy(true);
                    break;
                  case "drizzle":
                    self.cloudy(true);
                    break;
                  case "light intensity drizzle":
                    self.cloudy(true);
                    break;
                  case "moderate rain":
                    self.rainy(true);
                    break;
                  case "rain":
                    self.cloudy(true);
                    self.rainy(true);
                    break;
                   case "Thunderstorm":
                    self.cloudy(true);
                    self.rainy(true);
                    self.stormy(true);
                    break;
                   case "snow":
                    self.cloudy(true);
                    self.snowy(true);
                    break;
                   case "mist":
                    self.cloudy(true);
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




    // Instagram API
    ViewModel.prototype.foursquareCall = function(location) {
        var self = this;

        $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                data: true,
                url: 'https://api.foursquare.com/v2/venues/search?client_id=OLSA1F5F10UDHTESHULYSQGJ23SI0IWQOVF4IP5GUI5Z2AMK%20&client_secret=WJWCDE3DQNUPSNQ0DN5TF3LFRCERFPRDCZAEGVRIXGEFTZAU%20&v=20130815%20&ll=' +location.lat+',%20'+location.lng+'%20',
                success: function(data) { 
                    //console.log("foursquare  ",data);
                    var venues = data.response.venues;
                    for (var i = 0; i < venues.length; i++){
                        // check wether if there is data on foursquare for this location
                        if (location.name === venues[i].name){
                            // get unique venue id
                            location.foursquareId = venues[i].id;
                        }
                    }
                }
            }).done(function(){
                $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                data: true,
                url: 'https://api.foursquare.com/v2/venues/'+location.foursquareId+'/photos?client_id=OLSA1F5F10UDHTESHULYSQGJ23SI0IWQOVF4IP5GUI5Z2AMK%20&client_secret=WJWCDE3DQNUPSNQ0DN5TF3LFRCERFPRDCZAEGVRIXGEFTZAU%20&v=20130815%20',
                success: function(data) {  
                   var item = data.response.photos.items[0];
                   location.photoUrl = item.prefix + "width300" + item.suffix;
                   console.log(location.photoUrl);

                }
            });
        });   
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
      '<img src="'+ place.photoUrl+ '">'+
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