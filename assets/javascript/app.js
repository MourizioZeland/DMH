$(document).ready(function () {

    //Timeout function displays our logo in the center of the screen for 3 seconds before
    //hiding the element and running the geoFindMe function, which generates the map using the users
    //location, as well as running the loopMe function which populates the dropdown menus with resources.
    setTimeout(function () {
        $('#logo').hide();
        geoFindMe();
        loopMe();
    }, 3000);

    // Arrays of location banks, and empty vairables declaring to work around any scope issues when used in
    //the following functions.
    var hospital = ["Banner Good Samaritan Hospital ", "St. Joseph\'s Hospital and Medical Center", "Phoenix Memorial Hospital",
        "Arizona Heart Hospital", "MIHS", "Honorhealth John C. Lincoln", "Phoenix Indian Hosptial", "Banner Estrella", "Honorhealth Deer Valley",
        "Abrazo Central Campus", "Valley Hospital", "St. Luke's Hosptial"
    ];
    var shelter = ["Homeward Bound", "Church on the Street ", "The Respite Shelter for Homeless Men", "Homebase Youth Services",
        "Arizona Coalition to End Homelessness", "Andre House", "Vista Colina Emergency Family Shelter", "Justa Center", "Homeless ID Project",
        "Lodestar Day Resource Center", "Brian Garcia Welcome Center", "Central AZ Shelter Services", "House Of Refuge Sunnyslope",
        "Gift of Mary Womens Shelter", "Phoenix Rescue Mission", "Tumbleweed Phoenix Resource Center", "Terros Safe Haven Shelter",
        "Kaiser Family Crisis Shelter", "Elim House Shelter", "UMOM Family Shelter", "Family Promise of Greater Phoenix",
        "La Mesita Family Homeless Shelter", "East Valley Men's Center (EVMC) Shelter", "Save the Family", "East Valley Women's Shelter"
    ];
    var foodBank = ["St. Mary's Food Bank", "Cultral Cup Food Bank", "Valley Christian Centers", "St Stephen's Episcopal Church",
        "Tanner Chapel A.M.E. Church", "St Gregory's - St Vincent de Paul", "South Mountain Community College", "Rio Vista Center",
        "Operation Care-Valley Heights", "Open Door Fellowship Church", "Mount of Olives Lutheran Church Food Pantry",
        "Neighborhood Ministries Inc.", "Manzanita Senior Center", "Living Streams Church Food Pantry", "Life Bridge Resource Center",
        "Joshua Tree Feeding Program", "Highways and Hedges Ministries", "Friendly House", "First Southern Baptist Church Benevolence Center",
        "First Pentecostal Church Community Center", "FIBCO Family Services", "Desert West Senior Services", "Desert Christian Fellowship",
        "Deer Valley Senior Center", "Circle of Life Development", "Cultural Cup Food Bank", "Church on Fillmore",
        "Central AZ Shelter Services (CASS)", "Carl Hayden Veterans Hospital", "Black Family and Child Services", "Bethel Lutheran Church",
        "All Tribes Assembly of God Church", "Agape Network", "ICM Food and Clothing Bank", "Gateway Church of God",
        "Desert Mission Food Bank", "Covenant of Grace Ministries", "Phoenix Rescue Mission", "Northminster Food Bank", "Mom's Pantry"
    ];
    var map;
    var service;
    var infowindow;
    var userLoc;
    var thisThing;
    var coordLat;
    var coordLong;

    //Creating the config for the firebase being used, and initializing it to be referenced later.
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

    //The function which loops through the arrays populating the dropdown menus, assigning them value attributes so that
    //they may be clicked and accessed through googleMaps API.
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

    //Defines the short logic of grabbing the value of whatever item in the dropdown menu is clicked, then runs
    //the function that creates a marker for whatever item is clicked on the map.
    function clicked() {
        thisThing = $(this).attr("value");
        resourceMarker();
    }

    
    //Logic in this function listens for a change in the firebase, uses those values, coordinates, to create a marker on the map
    //upon detecting that change, and centers the map on these coordinates and creates an corresponding marker on the map.
    function initMap() {

        database.ref().on("value", function (childSnapshot) {

            //Converts the stored Firebase values into intergers from a string, while maintaining the decimals
            coordLat = parseFloat(childSnapshot.child('location').val().Coordinates_Latitude);
            console.log(coordLat);
            coordLong = parseFloat(childSnapshot.child('location').val().Coordinates_Longitude);
            console.log(coordLong);

            //Creates an object holding the newly defined coordinates.
            userLoc = {
                lat: coordLat,
                lng: coordLong
            };

            //Grabs the appropriate display div where the map would go, and embeds a google Map.
            map = new google.maps.Map(
                document.getElementById('map'), {
                    zoom: 9,
                    center: userLoc
                });

            //Places a marker on the map corresponding to the user location.
            var marker = new google.maps.Marker({
                position: userLoc,
                map: map
            });

        });

    }

    //This is the logic defining how the googleMaps Places API is searched.
    function resourceMarker() {

        infowindow = new google.maps.InfoWindow();

        //Object created to contain the search term as well as the parameters.
        var request = {
            query: thisThing,
            fields: ['name', 'formatted_address', 'icon', 'user_ratings_total', 'geometry', 'phone number'],
        };

        service = new google.maps.places.PlacesService(map);

        //Textsearches the google Places API cdn using the request, and waits for results and status,
        //if the status returns as OK, the search completes, the results are looped through and for each result
        //the function that places a marker onto the map is called.
        service.textSearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    console.log(request.fields);
                }

                //Centers the map viewpoint on the first location in the results array.
                map.setCenter(results[0].geometry.location);
            }
        })
    }

    //function that is called throughout the file to create a marker for a location.
    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        
        //Adds a listener for when an item is clicked, displays the place name.
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            //infowindow.setAttribute("src", place.icon);
            infowindow.open(map, this);
        });
    }

    //On the call of this function, grabs the location, coordinates, of the user upon approval, pushes
    //these to firebase
    function geoFindMe() {

        function success(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            var coordLat = `${latitude}`
            var coordLong = `${longitude}`

            database.ref('location/').set({
                Coordinates_Latitude: coordLat,
                Coordinates_Longitude: coordLong,
            });

        }

        //If the coordinates are not provided by the user, lets the user know of such, otherwise runs the success function
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

    //Event listener waiting for a click on any of the dropdown items, to run the clicked function
    $(document).on("click", ".dropdown-item", clicked);
    //Calls the initMap function by itself to initialize the map.
    initMap();
});