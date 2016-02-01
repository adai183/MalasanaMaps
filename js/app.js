/**
 * Knockout.js Viewmodel
 */
var ViewModel = function() {
    var self = this;
    this.placeList = ko.observableArray([]);
    this.igImages = ko.observableArray([]);
    this.search = ko.observable('');
    self.showInstList = ko.observable(false);
    self.hideInstList = ko.observable(true);
    self.currentPlaceName = ko.observable('');
    self.currentPlaceDescription = ko.observable('');
    self.currentPlacePhotoUrl = ko.observable('');
    self.menuClass = ko.observable('active');
    self.wrapperClass = ko.observable('');
    self.postButton = ko.observable('show posts');
    var weather;
    self.weatherChecker = ko.observable(true);
    self.menuChecker = ko.observable(true);
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

    this.setPlace = function(clickedPlace) {
        google.maps.event.trigger(clickedPlace.marker, 'click');
        // hide weather animation when place gets clicked for better UX on medium and small devices
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
        // call the api with my neighborhood's coordinates as parameters 
        $.ajax({
                dataType: 'json',
                async: true,
                data: true,
                url: 'https://api.foursquare.com/v2/venues/search?client_id=OLSA1F5F10UDHTESHULYSQGJ23SI0IWQOVF4IP5GUI5Z2AMK%20&client_secret=WJWCDE3DQNUPSNQ0DN5TF3LFRCERFPRDCZAEGVRIXGEFTZAU%20&v=20130815%20&ll=' + location.lat + ',%20' + location.lng + '%20',
            })
            .done(function(data) {
                var venues = data.response.venues;
                // iterate through all venues from the foursquare response
                for (var i = 0; i < venues.length; i++) {
                    // check if there is data on foursquare for this location
                    if (location.name === venues[i].name) {
                        // get unique venue id
                        location.foursquareId = venues[i].id;
                        // GET PHOTOS HERE -- ONLY IF HAVE ID
                        // see self.foursquarePhotos at line 291
                        self.foursquarePhotos(location);
                    }
                }
            })
            .fail(function() {
                alert("Sorry. Failed to load data from foursquare api");
            });
    };



    //SEPARATE FUNCTION TO GET PHOTOS FROM FOURSQUARE
    self.foursquarePhotos = function(place) {
        // call foursquare again with venue-specific idea to get url for the first photo on foursquare
        $.ajax({
                dataType: 'json',
                async: true,
                data: true,
                url: 'https://api.foursquare.com/v2/venues/' + place.foursquareId + '/photos?client_id=OLSA1F5F10UDHTESHULYSQGJ23SI0IWQOVF4IP5GUI5Z2AMK%20&client_secret=WJWCDE3DQNUPSNQ0DN5TF3LFRCERFPRDCZAEGVRIXGEFTZAU%20&v=20130815%20',
            })
            .done(function(data) {
                // get first photo
                var item = data.response.photos.items[0];
                place.photoUrl = item.prefix + "width300" + item.suffix;
                // see data-binding for img in photo-container in index.html
                self.currentPlacePhotoUrl(place.photoUrl);
            })
            .fail(function() {
                alert("Sorry. Failed to load photos from foursquare api");
            });
    };


    this.createEventListener = function(location) {
        location.marker.addListener('click', function() {
            // hide image first to make sure the previous image is not shown while the new one loads in from foursquare
            // handle click event if location is coming from instagram
            self.updateContent(location);
            toggleBounce(location.marker);
            self.currentPlace(location);
            self.currentPlaceName(location.name);
            self.currentPlaceDescription(location.description);
            
            // handle click event if location coming from instagram and use pre-loaded instagram photo url    
            if (location.tag === "instagram") {
                self.currentPlacePhotoUrl(location.photoUrl);
            // handle click event if location is hardcoded and get photo url from foursquare    
            } else if (location.tag === "hardcoded") {
                self.foursquareCall(location);
            }

            
            // close sidebar for better UX on medium and small devices
            if(window.innerWidth < 1000) {
            hideNavbar();
            }
            // hide weather when location is clicked for better UX
            self.weatherChecker(false);
            self.weatherButton("show weather");
            // recenter map for better UX
            map.setCenter(location.marker.getPosition());
            map.panBy(0, -200);

            // does the infowindow exist?
            if (infowindow) {
                infowindow.close(); // close the infowindow
            }
            // open the infowindow with this map marker location
            infowindow.open(map, location.marker);
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
                    console.log(self.placeList()[i]);
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
                        if (item.tag === "instagram"){
                            // check wether instagram posts are visible see line 512
                            if (!instPostChecker){
                                // handle visibilty of instagram posts in sidebar list
                                self.hideInstList(false);
                                self.showInstList(true);
                                item.marker.setVisible(true); // show the map marker
                            }
                        } else if(item.tag === "hardcoded")
                        item.marker.setVisible(true); // show the map marker
                    }
                    return item.name.toLowerCase().indexOf(searchTerm) !== -1; // return filtered location list
                });
        }

    });

    this.renderMarkers(self.placeList());

    // API calls

    // Logic to hide weather animation or show updated weather animation

    self.openweatherCall = function(lat, lng) {
        var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&appid=186b68b9f2c87ea71239b8d2dac0b380";

        // call openweather api
        $.getJSON(url, function(data) {
            var weather = data.weather[0].description;
            console.log("weather: ", weather);
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


    /// UI ///

    var hideNavbar = function() {
        self.wrapperClass('toggled');
        self.menuClass('');
        self.menuChecker(!self.menuChecker());
    };

    // Toggle functionality side navigation menu
    self.toggleMenu = function() {
        if (self.menuChecker()) {
            hideNavbar();

        } else {
            self.wrapperClass('');
            self.menuClass('active');
            self.menuChecker(!self.menuChecker());
        }
    };

    // Toggle functionality for weather button
    self.toggleWeather = function() {
        self.weatherChecker(!self.weatherChecker());
        if (self.weatherChecker()) {
            self.weatherButton("hide weather");
            // close sidebar for better UX on medium and small devices
            if(window.innerWidth < 1000) {
            hideNavbar();
            }
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
            self.postButton("hide posts");
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
            self.postButton("show posts");
        }
    };

};



// infowindow content
ViewModel.prototype.updateContent = function(place) {
    setTimeout(function() {
        // get template from index html line 84
        infowindow.setContent($('.infowindow-template').html());
    }, 800);
};