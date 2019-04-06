$(document).ready(function () {
    setTimeout(function () {
        $('#logo').hide();
        geoFindMe();
        loopMe();
    }, 3000);

    // var of location banks
    var hospital = ["Banner Good Samaritan Hospital ", "St. Joseph\'s Hospital and Medical Center", "Phoenix Memorial Hospital", "Arizona Heart Hospital", "MIHS", "Honorhealth John C. Lincoln", "Phoenix Indian Hosptial", "Banner Estrella", "Honorhealth Deer Valley", "Abrazo Central Campus", "Valley Hospital", "St. Luke's Hosptial"];
    var shelter = ["Homeward Bound", "Church on the Street ", "The Respite Shelter for Homeless Men", "Homebase Youth Services", "Arizona Coalition to End Homelessness", "Andre House", "Vista Colina Emergency Family Shelter", "Justa Center", "Homeless ID Project", "Lodestar Day Resource Center", "Brian Garcia Welcome Center", "Central AZ Shelter Services", "House Of Refuge Sunnyslope", "Gift of Mary Womens Shelter", "Phoenix Rescue Mission", "Tumbleweed Phoenix Resource Center", "Terros Safe Haven Shelter", "Kaiser Family Crisis Shelter", "Elim House Shelter", "UMOM Family Shelter", "Family Promise of Greater Phoenix", "La Mesita Family Homeless Shelter", "East Valley Men's Center (EVMC) Shelter", "Save the Family", "East Valley Women's Shelter"];
    var foodBank = ["St. Mary's Food Bank", "Cultral Cup Food Bank", "Valley Christian Centers", "St Stephen's Episcopal Church", "Tanner Chapel A.M.E. Church", "St Gregory's - St Vincent de Paul", "South Mountain Community College", "Rio Vista Center", "Operation Care-Valley Heights", "Open Door Fellowship Church", "Mount of Olives Lutheran Church Food Pantry", "Neighborhood Ministries Inc.", "Manzanita Senior Center", "Living Streams Church Food Pantry", "Life Bridge Resource Center", "Joshua Tree Feeding Program", "Highways and Hedges Ministries", "Friendly House", "First Southern Baptist Church Benevolence Center", "First Pentecostal Church Community Center", "FIBCO Family Services", "Desert West Senior Services", "Desert Christian Fellowship", "Deer Valley Senior Center", "Circle of Life Development", "Cultural Cup Food Bank", "Church on Fillmore", "Central AZ Shelter Services (CASS)", "Carl Hayden Veterans Hospital", "Black Family and Child Services", "Bethel Lutheran Church", "All Tribes Assembly of God Church", "Agape Network", "ICM Food and Clothing Bank", "Gateway Church of God", "Desert Mission Food Bank", "Covenant of Grace Ministries", "Phoenix Rescue Mission", "Northminster Food Bank", "Mom's Pantry"];
    var map;
    var service;
    var infowindow;
    var userLoc;
    var thisThing;
    //var queryClick;
    var complete = false;
    // var googleAPI = "AIzaSyBdOM3mqG__SwwJQ7dhBNQNfE9SYuFIGw8";
    // var queryURL = "https://maps.googleapis.com/maps/api/js?key=" + googleAPI;
    var coordLat;
    var coordLong;
    var config = {
        apiKey: "AIzaSyAxEI6R_CI_JkT8CYRTiLEk3mL_IQwKhyc",
        authDomain: "projectconnect-956b5.firebaseapp.com",
        databaseURL: "https://projectconnect-956b5.firebaseio.com",
        projectId: "projectconnect-956b5",
        storageBucket: "projectconnect-956b5.appspot.com",
        messagingSenderId: "1018413889038"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // // loops for arrays
    function loopMe() {

        for (i = 0; i < foodBank.length; i++) {
            var foodDiv = $("<a>").addClass("dropdown-item").attr("value", foodBank[i]).text(foodBank[i]);
            $("#foodMenu").append(foodDiv);
        }

        for (j = 0; j < hospital.length; j++) {
            var hospitalDiv = $("<a>").addClass("dropdown-item").attr("value", hospital[j]).text(hospital[j]);
            $("#hospitalMenu").append(hospitalDiv);
        }

        for (k = 0; k < shelter.length; k++) {
            var shelterDiv = $("<a>").addClass("dropdown-item").attr("value", shelter[k]).text(shelter[k]);
            $("#shelterMenu").append(shelterDiv);
        }

        


    }

    function clicked(){
        thisThing = $(this).attr("value");
        console.log(thisThing);
        initMap();
    }

    $(document).on("click", ".dropdown-item", clicked);

    function initMap() {

        // function clicked() {

        //  var queryClick = thisThing;
        //   console.log(queryClick);
    
        // };

        // $(document).on("click", ".dropdown-item", clicked());

        database.ref().on("value", function (childSnapshot) {

            //if (childSnapshot.child("location").exists()) {

            coordLat = parseFloat(childSnapshot.child('location').val().Coordinates_Latitude);
            console.log(coordLat);
            coordLong = parseFloat(childSnapshot.child('location').val().Coordinates_Longitude);
            console.log(coordLong);
            //}
            userLoc = {
                lat: coordLat, //33.38093,
                lng: coordLong //-111.74727
            };

            map = new google.maps.Map(
                document.getElementById('map'), {
                    zoom: 9,
                    center: userLoc
                });

            var marker = new google.maps.Marker({
                position: userLoc,
                map: map
            });


            //var sydney = new google.maps.LatLng(-33.867, 151.195);

            infowindow = new google.maps.InfoWindow();

            // map = new google.maps.Map(
            //     document.getElementById('map'), {
            //         center: sydney,
            //         zoom: 15
            //     });

            var request = {
                query: thisThing,
                fields: ['name', 'geometry'],
            };

            service = new google.maps.places.PlacesService(map);

            service.textSearch(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }

                    //map.setCenter(results[0].geometry.location);
                }

            })

        });


      





    }

    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });


    }


    

    


    //LOOP IS EMPTY
    // loopMe();
    // loops for arrays
    // function loopMe() {

    //     for (var i = 0; i < hospital.length; i++); {
    //         console.log(hospital);

    //     }
    //     for (var i = 0; i < shelter.length; i++); {
    //         console.log(shelter);

    //     }
    //     for (var i = 0; i < foodBank.length; i++); {
    //         console.log(foodBank);


    //     }

    // THIS AJAX IS EMPTY
    // }
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

            database.ref('location/').set({
                Coordinates_Latitude: coordLat,
                Coordinates_Longitude: coordLong,
            });

            // complete = true;

            //initMap();

            // closeWindow();

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

    initMap();

    // mapStart();

    // THIS IS NOT WORKING

    // function closeWindow() {
    //     if (complete) {
    //         database.ref('location/').remove();
    //         complete = false;
    //     }
    // }
});