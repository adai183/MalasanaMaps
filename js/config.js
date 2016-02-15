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

/**
 * Represents a Place.
 * @constructor
 */
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


/**
Call instagram api to load external data into place model
*/
var instagramCall = function() {
    $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            data: true,
            url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=460702240.2045934.b1d27f475b81420ea53c8671507c7b3f',
        })
        .done(function(data) {
            // add external data to place model by calling my instagram developers sandbox
            for (var i = 0; i < data.data.length; i++) {
              if (data.data[i].location !== null){
                var location = data.data[i].location;
                var comment = data.data[i].caption ? data.data[i].caption.text : "";
                console.log(data);
                /**
                create new location for every instagram venue
                * @memberof instagramCall
                */
                var instlocation = {
                    name: location.name,
                    lat: location.latitude,
                    lng: location.longitude,
                    icon: "img/instagram-icon.svg",
                    description: "latest instagram post:" + comment,
                    photoUrl: data.data[i].images.standard_resolution.url,
                    tag: "instagram",
                    visible: false
                };
                // push instagram location to model
                place.push(instlocation);
            }
          }
        })
        .fail(function() {
            alert("Sorry, failed to load data from instagram api");
        })
        .always(function() {
            // instantiate Viewmodel when instagram data is loaded
            ko.applyBindings(new ViewModel());
        });
}();

/**
 * Configure and instantiate Google map
 */
var initMap = function() {
    /**
     * set styles for map
     * @memberof initMap
     * @type {object}
     */
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

    if ((typeof google !== 'undefined')) { // handle errors for google api
        // This next line makes `malasana` a new Google Map JavaScript Object
        var malasana = new google.maps.LatLng(40.426394, -3.704878);

        /** @global
         *
         */
        map = new google.maps.Map(document.getElementById('map'), {
            center: malasana,
            zoom: 16,
            mapTypeControl: false,
            scrollwheel: false,
            styles: styleArray,
            streetViewControl: false
        });

        /**
        @global
        */
        infowindow = new google.maps.InfoWindow({
            maxWidth: 150
        });
    } else {
        alert('Google Maps Error');
    }
};

/**
 * on error function to be excuted when google api fails
 */
function googleError() {
    alert('Google Maps Error');
}
