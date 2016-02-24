/**
 * Model for neighborhood places
 */
var place = [{
    name: "Centro Centro",
    lat: 40.418905,
    lng: -3.692120,
    description: "Kandinsky Ausstellung",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true

}, {
    name: "La Catrina",
    lat: 40.425271,
    lng: -3.702007,
    description: "Mezcal, good Mexican food in a colorful cantina full of Mexican folklore. The owner has good taste in music.",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
}, {
    name: "Federal Café",
    lat: 40.427005,
    lng: -3.709271,
    description: "Good open workplace with creative breakfasts and Scandinavian design furniture",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
}, {
    name: "Toma Café",
    lat: 40.426464,
    lng: -3.705959,
    description: "Best coffee in town",
    icon: 'img/marker.svg',
    tag: "hardcoded",
    visible: true
}, {
    name: "Cuervo Store",
    lat: 40.426808,
    lng: -3.703256,
    description: "cool clothes and music. If you like garage Rock like Burger records",
    icon: 'img/marker.svg',
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
            zoom: 14,
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
        ko.applyBindings(new ViewModel());
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
