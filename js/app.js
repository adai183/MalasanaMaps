/**
 * Knockout.js viewmodel
 */
var ViewModel = function() {
    var self = this;
    self.placeList = ko.observableArray([]);
    self.igImages = ko.observableArray([]);
    self.search = ko.observable('');
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
    self.showInfoWindow =  ko.observable(false);
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
        self.placeList.push(new Place(item));
    }, this);


    // set first place
    this.currentPlace = ko.observable(this.placeList()[0]);

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





    this.createEventListener = function(location) {
        location.marker.addListener('click', function() {
            // hide image first to make sure the previous image is not shown while the new one loads in from foursquare
            // handle click event if location is coming from instagram

              self.showInfoWindow(true);


            self.updateContent(location);
            toggleBounce(location.marker);
            self.currentPlace(location);
            self.currentPlaceName(location.name);
            self.currentPlaceDescription(location.description);

            // handle click event if location coming from instagram and use pre-loaded instagram photo url
            if (location.tag === "instagram") {
                self.currentPlacePhotoUrl(location.photoUrl);
                // handle click event if location is hardcoded and get photo url from foursquare
            }

            // close sidebar for better UX on medium and small devices
            if (window.innerWidth < 1000) {
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
                self.showInfoWindow(false);
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
                        if (item.tag === "instagram") {
                            // check wether instagram posts are visible see line 512
                            if (!instPostChecker) {
                                // handle visibilty of instagram posts in sidebar list
                                self.hideInstList(false);
                                self.showInstList(true);
                                item.marker.setVisible(true); // show the map marker
                            }
                        } else if (item.tag === "hardcoded")
                            item.marker.setVisible(true); // show the map marker
                    }
                    return item.name.toLowerCase().indexOf(searchTerm) !== -1; // return filtered location list
                });
        }

    });

    this.renderMarkers(self.placeList());

    // API calls




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
            if (window.innerWidth < 1000) {
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
