var map;
/**
 * Model for neighborhood places
 */
var place = [{
    name: "Cuervo Store",
    lat: 40.426808,
    lng: -3.703256,
    description: "cool clothes and music. If you like garage Rock like Burger records",
    icon: 'img/guitar.png',
    tag: "hardcoded",
    visible: true
}, {
    name: "La Catrina",
    lat: 40.425271,
    lng: -3.702007,
    description: "Mezcal, good Mexican food in a colorful cantina full of Mexican folklore. The owner has good taste in music.",
    icon: 'img/drink.png',
    tag: "hardcoded",
    visible: true
}, {
    name: "Federal Café",
    lat: 40.427005,
    lng: -3.709271,
    description: "Good open workplace with creative breakfasts and Scandinavian design furniture",
    icon: 'img/laptop.png',
    tag: "hardcoded",
    visible: true
}, {
    name: "Toma Café",
    lat: 40.426464,
    lng: -3.705959,
    description: "Best coffee in town",
    icon: 'img/coffee.svg',
    tag: "hardcoded",
    visible: true
}, {
    name: "La Pescadería",
    lat: 40.422898,
    lng: -3.703014,
    description: "Awesome mediterranean fish restaurant",
    icon: 'img/food.png',
    tag: "hardcoded",
    visible: true
}, ];

// constructor for Place objects
var Place = function(data) {
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.description = data.description;
    this.photoUrl = data.photoUrl;
    this.icon = data.icon;
    this.tag = data.tag;
    this.visible = data.visible;
};


// Call instagram api to load external data into place model
// initialise map when finished on line 96
var instagramCall = function() {
    $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            data: true,
            url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=460702240.2045934.b1d27f475b81420ea53c8671507c7b3f',
        })
        .done(function(data) {
            console.log("instagram ", data);
            // add external data to place model
            for (var i = 0; i < data.data.length; i++) {
                var location = data.data[i].location;
                var comment;
                if (data.data[i].caption !== null) {
                    comment = data.data[i].caption.text;
                } else {
                    comment = "";
                }
                console.log(location);
                var instlocation = {
                    name: location.name,
                    lat: location.latitude,
                    lng: location.longitude,
                    icon: "img/instagram-icon.svg",
                    description: "latest instagram post:<br>" + comment + '<img class="instagramPhoto img-responsive" style="width:150px; height: 150px; margin-top: 2%;" src="' + data.data[i].images.standard_resolution.url + '">',
                    photoUrl: data.data[i].images.standard_resolution.url,
                    tag: "instagram",
                    visible: false
                };
                place.push(instlocation);
            }
        })
        .fail(function() {
            alert("Sorry, failed to load data from instagram api");
        })
        .always(function() {
            // initialize app
            initMap();
            ko.applyBindings(new ViewModel());
        });
}();

// Google Maps API
var initMap = function() {
    var styleArray = [{
        "featureType": "landscape.fill",
        "elementType": "geometry.fill",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#e0efef"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
            "visibility": "on"
        }, {
            "hue": "#1900ff"
        }, {
            "color": "#c0e8e8"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "lightness": 100
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "on"
        }, {
            "lightness": 700
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#7dcdcd"
        }]
    }];
    // check if google is defined for error handling
    if ((typeof google !== 'undefined')) {
        // This next line makes `malasana` a new Google Map JavaScript Object
        var malasana = new google.maps.LatLng(40.426394, -3.704878);
        // instantiate map object
        map = new google.maps.Map(document.getElementById('map'), {
            center: malasana,
            zoom: 16,
            mapTypeControl: false,
            scrollwheel: false,
            styles: styleArray,
            streetViewControl: false
        });
    } else {
        alert('Google Maps Error');
    }
};


var ViewModel = function() {
    var self = this;
    this.placeList = ko.observableArray([]);
    this.igImages = ko.observableArray([]);
    this.search = ko.observable('');
    self.showInstList = ko.observable(false);
    self.hideInstList = ko.observable(true);
    var weather;
    self.weatherChecker = ko.observable(true);
    // create observables to controle weather animation
    self.sunny = ko.observable(false);
    self.cloudy = ko.observable(false);
    self.rainy = ko.observable(false);
    self.snowy = ko.observable(false);
    self.rainbow = ko.observable(false);
    self.starry = ko.observable(false);
    self.stormy = ko.observable(false);
    self.weatherButton = ko.observable('hide weather');


    // Create place object. Push to array.
    place.forEach(function(item) {
        this.placeList.push(new Place(item));
    }, this);




    // set first place
    this.currentPlace = ko.observable(this.placeList()[0]);

    var hideNavbar = function() {

        $("#wrapper").attr("class", "toggled");
        $("#menu-toggle").attr("class", "");
    };

    // list click
    this.setPlace = function(clickedPlace) {
        google.maps.event.trigger(clickedPlace.marker, 'click');
        // hide sidebar and weather animation when place gets clicked for better UX
        hideNavbar();
        self.weatherChecker(false);
        self.weatherButton("show weather");

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
            if (arrayInput[i].visible === false) {
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

    // Foursquare API
    self.foursquareCall = function(location) {
    // load in foursquare api data into model
        // get all data for neighborhood
        $.ajax({
                dataType: 'json',
                async: true,
                data: true,
                url: 'https://api.foursquare.com/v2/venues/search?client_id=OLSA1F5F10UDHTESHULYSQGJ23SI0IWQOVF4IP5GUI5Z2AMK%20&client_secret=WJWCDE3DQNUPSNQ0DN5TF3LFRCERFPRDCZAEGVRIXGEFTZAU%20&v=20130815%20&ll=' + location.lat + ',%20' + location.lng + '%20',
            })
            .done(function(data) {

                var venues = data.response.venues;
                for (var i = 0; i < venues.length; i++) {
                    // check wether there is data on foursquare for this location
                    if (location.name === venues[i].name) {
                        // get unique venue id
                        location.foursquareId = venues[i].id;
                        self.foursquarePhotos(location); //GET PHOTOS HERE -- ONLY IF HAVE ID
                    }
                }
            })
            .fail(function() {
                alert("Sorry. Failed to load data from foursquare api");
            });
    };



    //SEPARATE FUNCTION TO GET PHOTOS FROM FOURSQUARE
    self.foursquarePhotos = function(place) {
        // call foursquare again to get photos for specific venues
        $.ajax({
                dataType: 'json',
                async: true,
                data: true,
                url: 'https://api.foursquare.com/v2/venues/' + place.foursquareId + '/photos?client_id=OLSA1F5F10UDHTESHULYSQGJ23SI0IWQOVF4IP5GUI5Z2AMK%20&client_secret=WJWCDE3DQNUPSNQ0DN5TF3LFRCERFPRDCZAEGVRIXGEFTZAU%20&v=20130815%20',
            })
            .done(function(data) {
                // add photo url to infowindow
                var item = data.response.photos.items[0];
                place.photoUrl = item.prefix + "width300" + item.suffix;
                console.log(place.photoUrl);
                $("#photo-container").append('<img class="foursquarePhoto img-responsive" style="width:150px; height: 150px;" src="' + place.photoUrl + '">');
            })
            .fail(function() {
                alert("Sorry. Failed to load photos from foursquare api");
            });
    };



    this.createEventListener = function(location) {
        location.marker.addListener('click', function() {
            self.foursquareCall(location);
            toggleBounce(location.marker);
            self.currentPlace(location);
            self.updateContent(location);
            // hide sidebar and weather animation when place gets clicked for better UX
            hideNavbar();
            self.weatherChecker(false);
            self.weatherButton("show weather");
            // recenter map for better UX
            map.setCenter(location.marker.getPosition());
            map.panBy(0,-200);

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
   
    this.renderMarkers(self.placeList());

    // instantiate infowindow object
    this.infowindow = new google.maps.InfoWindow({
        maxWidth: 150
    });

    // API calls

    // Logic to hide weather animation or show updated weather animation
    self.openweatherCall = function(lat, lng) {
        var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&appid=186b68b9f2c87ea71239b8d2dac0b380";

        // call openweather api
        $.getJSON(url, function(data) {
            var weather = data.weather[0].description;
            console.log("weather: ", weather);
            $(".weather-container").show();
            self.sunny(false);
            self.cloudy(false);
            self.rainy(false);
            self.snowy(false);
            self.stormy(false);
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
                case "fog":
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
                case "light rain":
                    self.rainy(true);
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

        }).fail(function() {
            alert('Weather API Error');
        });
    };

    // inicial call to openweather api and set weather animation on map 
    self.openweatherCall(40.426394, -3.704878);

    // update weather when the user changes map center
    map.addListener('center_changed', function() {
        var lat,
            lng;
        // use setTimeout to avoid unnecessary api calls
        setTimeout(function() {
            lat = map.getCenter().lat();
            lng = map.getCenter().lng();
            self.openweatherCall(lat, lng);
        }, 250);
    });

    // Toggle functionality for weather button
    self.toggleWeather = function() {
        self.weatherChecker(!self.weatherChecker());
        //console.log(self.weatherChecker());

        if (self.weatherChecker()) {
            self.weatherButton("hide weather");
            // close sidebar for better UX
            $("#wrapper").toggleClass("toggled");
            $("#menu-toggle").toggleClass("active");
        } else {
            self.weatherButton("show weather");
        }
    };

    // add functionalty to hide or show instagram posts on sidebar list and on map
    var instPostChecker = true;
    self.toggleInstPosts = function() {
        if (instPostChecker) {
            // handle visibilty of instagram posts in sidebar list
            self.hideInstList(false);
            self.showInstList(true);

            // handle visibilty of each instagram post's marker on map
            for (var i = 0; i < self.placeList().length; i++) {
                self.placeList()[i].marker.setVisible(true);
            }
            instPostChecker = false;
            $("#post-button").text("hide posts");
        } else {
            // handle visibilty of instagram posts in sidebar list
            self.hideInstList(true);
            self.showInstList(false);

            // handle visibilty of each instagram post's marker on map
            for (var i = 0; i < self.placeList().length; i++) {
                if (self.placeList()[i].tag === "instagram") {
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
    var html = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h4 id="firstHeading" class="firstHeading">' +
        place.name + '</h4>' +
        '<div id="bodyContent">' +
        '<p>' + place.description + '</p>' +
        '<div id="photo-container"></div>' +
        '</div>' +
        '</div>';

    this.infowindow.setContent(html);
};