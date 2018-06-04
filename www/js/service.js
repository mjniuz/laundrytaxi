var marker = null;
var infowindow  = null;
var map = null;
var gmarkers = [];
uver.factory('pickUpPlace', function() {
    pickUpPlace = {};

    pickUpPlace.mapInit = function ($scope, $rootScope, location) {
        $scope.$on('mapInitialized', function(event, map) {
            var input = document.getElementById('pac-search');
            var searchBox = new google.maps.places.SearchBox(input);
            map.addListener('bounds_changed', function() {
                searchBox.setBounds(map.getBounds());
            });

            /*document.getElementById('my-button').onclick = function () {
                var input = document.getElementById('my-input');

                google.maps.event.trigger(input, 'focus');
                google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
            };*/
            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                console.log("place clicked");
                if (places.length === 0) {
                    return null;
                }

                marker      = placeMarker(places[0].geometry.location,map, $scope, $rootScope);
                //addInfoWindow(map,marker,$scope,$rootScope);
                map.setCenter(marker.getPosition());
                console.log("map changed");
            });
            map.addListener('click', function(event) {
                if (event.placeId) {
                    event.stop();
                }
                marker      = placeMarker(event.latLng, map, $scope, $rootScope);
                //addInfoWindow(map,marker,$scope,$rootScope);
            });

            document.getElementById("center-geolocation").onclick = function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        var latLng  = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        marker      = placeMarker(latLng,map, $scope, $rootScope);
                        map.setCenter(marker.getPosition());
                    });
                }
            };

            // get from storage
            if(localStorage.getItem('location') !== null){
                var latLng  = JSON.parse(localStorage.getItem('location'));
                marker      = placeMarker(latLng, map, $scope, $rootScope);
                //addInfoWindow(map,marker,$scope,$rootScope);
                map.setCenter(marker.getPosition());
            }else{
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        var latLng  = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        if(localStorage.getItem('location') === null){
                            marker      = placeMarker(latLng,map, $scope, $rootScope);
                            //addInfoWindow(map,marker,$scope,$rootScope);
                        }
                        map.setCenter(marker.getPosition());
                    });
                }
            }
        });
    };

    return pickUpPlace;
});

function placeMarker(location,map, $scope, $rootScope) {
    if(infowindow){
        infowindow.setMap(null);
    }

    for(i=0; i<gmarkers.length; i++){
        gmarkers[i].setMap(null);
    }

    marker = new google.maps.Marker({
        position: location,
        flat: false,
        map: map,
        draggable: true
    });


    localStorage.setItem('location', JSON.stringify(location));

    gmarkers.push(marker);

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'latLng': location
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                localStorage.setItem('full_address', results[0].formatted_address);

                addInfoWindow(map,marker,$scope, $rootScope);
            }
        }
    });

    return marker;
}

function addInfoWindow(map,marker,$scope, $rootScope) {
    infowindow          = new google.maps.InfoWindow();
    var full_address    =   localStorage.getItem('full_address');
    $scope.address_note = localStorage.getItem('address_note');

    var tooltipHtml = "<div id='open-package' style='width: 250px;height: 160px;'><p id='full-address'>"+ full_address +"</p>" +

        "<p><i class='fa fa-info'></i> <i class='info' id='address_note'>"+$scope.address_note+"</i>" +
        "<button type='button' ng-click='open()' class='button-clear color-uver uver-text-clear'>" +
            "<i class='fa fa-pencil'></i> Tambahkan detail alamat" +
        "</button>" +
        "</p>" +
        "<div style='text-align: center'><button class='button uver-btn btn-cancel btn-small' ng-click='profileField()'>Lanjutkan!</button></div></div>";
    var elTooltip = $rootScope(tooltipHtml)($scope);

    infowindow.setContent(elTooltip[0]);

    infowindow.open(map, marker);
}