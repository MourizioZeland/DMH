$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDQUbO3OSXjADp9D5pXOgoL4Hzbjim6CeE",
        authDomain: "projectconnect-21d4e.firebaseapp.com",
        databaseURL: "https://projectconnect-21d4e.firebaseio.com",
        projectId: "projectconnect-21d4e",
        storageBucket: "",
        messagingSenderId: "3572547268"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var map;
    // var googleAPI = "AIzaSyBdOM3mqG__SwwJQ7dhBNQNfE9SYuFIGw8";
    // var queryURL = "https://maps.googleapis.com/maps/api/js?key=" + googleAPI;
    var coordLat;
    var coordLong;

    // $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     })
    //     .then(function (res) {
    //         console.log(res);
    //     });

    function geoFindMe() {

        const status = document.querySelector('#status');
        const mapLink = document.querySelector('#map-link');

        //mapLink.href = '';
        //mapLink.textContent = '';

        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            //status.textContent = '';
            console.log(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
            var coordLat = `${latitude}`
            var coordLong = `${longitude}`

            database.ref().push({
                Coordinates_Latitude: coordLat,
                Coordinates_Longitude: coordLong
            })

            
            initMap();

        }

        function error() {
            // status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            //status.textContent = 'Geolocation is not supported by your browser';
        } else {
            //status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
        }

    }




    function initMap() {


        database.ref().on("child_added", function (childSnapshot) {

            coordLat = parseFloat(childSnapshot.val().Coordinates_Latitude);
            console.log(coordLat);
            coordLong = parseFloat(childSnapshot.val().Coordinates_Longitude);
            console.log(coordLong);
        });

        var userLoc = {
            lat: coordLat,//33.38093,
            lng: coordLong//-111.74727
        };

        var map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 13,
                center: userLoc
            });

        var marker = new google.maps.Marker({
            position: userLoc,
            map: map
        });
    }


    geoFindMe();
   // initMap();

    // mapStart();

});