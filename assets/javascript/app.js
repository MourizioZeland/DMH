
$(document).ready(function () {


    //Timeout function displays our logo in the center of the screen for 3 seconds before
    //hiding the element and running the geoFindMe function, which generates the map using the users
    //location, as well as running the loopMe function which populates the dropdown menus with resources.
    setTimeout(function () {
        $('#logo').hide();
        geoFindMe();
    }, 3000);

    // Arrays of location banks, and empty vairables declaring to work around any scope issues when used in
    //the following functions.
    var hospital = ["Banner Good Samaritan Hospital ", "St. Joseph\'s Hospital and Medical Center", "Phoenix Memorial Hospital",

        "Arizona Heart Hospital", "Maricopa Intergrated Health System ", "Honorhealth John C. Lincoln", "Phoenix Indian Hosptial", "Banner Estrella", "Honorhealth Deer Valley",
        "Abrazo Central Campus", "Valley Hospital Phoenix ", "St. Luke\'s Medical Center "
    ];
    var shelter = ["Homeward Bound Arizona ", "Church on the Street ", "The Respite Shelter for Homeless Men", "Homebase Youth Services",
        "Arizona Coalition to End Homelessness", "Andre House", "Vista Colina Emergency Family Shelter", "Justa Center", "Homeless ID Project",
        "The Lodestar Day Resource Center", "Central AZ Shelter Services", "House Of Refuge Sunnyslope",
        "Gift of Mary Womens Shelter","Tumbleweed Center for Youth Development",
         "UMOM Family Shelter", "Family Promise of Greater Phoenix",
        "La Mesita Family Homeless Shelter", "East Valley Men's Center (EVMC) Shelter", "Save the Family", 
    ];
    var foodBank = ["St. Mary's Food Bank", "Cultral Cup Food Bank", "Valley Christian Centers", "St Stephen's Episcopal Church",
        "Tanner Chapel A.M.E. Church", "St Gregory Catholic Parish Phoenix", "South Mountain Community College", "Rio Vista Center",
        "Operation Care Phoenix", "Open Door Fellowship Church", "Mount of Olives Lutheran Church Food Pantry",
        "Neighborhood Ministries Phoenix", "Helen Drake Senior Center", "Living Streams Church Food Pantry", "Life Bridge Community Alliance",
        "Joshua Tree Feeding Program", "Friendly House Phoenix",
        "First Pentecostal Church Phoenix", "FIBCO Family Services", "Desert West Senior Services", "Desert Christian Fellowship",
        "Phoenix Deer Valley Senior Center", "Circle of Life Development", "Cultural Cup Food Bank", "Church on Fillmore",
        "Central AZ Shelter Services (CASS)", "Phoenix Va Health Care System", "Black Family and Child Services",
        "Phoenix All Tribes Assembly ", "ICM Food and Clothing Bank",
        "Desert Mission Food Bank", "Covenant of Grace Christian Flshp", "Mom\'s Pantry Phoenix"

    ];
    var map;
    var service;
    var infowindow;
    var userLoc;
    var thisThing;
    var coordLat;
    var coordLong;
    var changeCheck = false;
    var userCheck = true;
    var markers = [];
    var counter = 10;

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


            if (userCheck) {
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

                userCheck = false;
            }
            else {

            }
        });
    }

    //This is the logic defining how the googleMaps Places API is searched.
    function resourceMarker() {

        infowindow = new google.maps.InfoWindow();

        //Object created to contain the search term as well as the parameters.
        var request = {
            query: thisThing,
            fields: ['name', 'formatted_address', 'user_ratings_total', 'geometry',
             'opening_hours', 'formatted_phone_number'],
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
        markers.push(marker);
        //Adds a listener for when an item is clicked, displays the place name.
        google.maps.event.addListener(marker, 'click', function () {
           console.log(place);
           console.log(place.url);
            var spacer = document.createElement("p");
            
            var placeIcon = document.createElement("img").setAttribute("url", place.icon);
            infowindow.setContent('<div>' + '<h3>' + place.name + '</h3><br><p>' + 
            place.formatted_address + '</br><a href = '+ place.url + '>Website</a>' +
            '</p>Rating: ' + place.rating + '/5</p>');

            
            //infowindow.appendChild(spacer);
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

            initMap();
        }

        //If the coordinates are not provided by the user, lets the user know of such, otherwise runs the success function
        function error() {
            geoFindMe()
            // status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {

            //status.textContent = 'Geolocation is not supported by your browser';
        } else {
            //status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }

    function changeRow() {
        if (changeCheck) {
            $("#map").show();
            $("#docRow").hide();
            $("#clearButton").show();
            changeCheck = false;
            $("#docButton").text("Doctor Find");
        }
        else {
            $("#map").hide();
            $("#docRow").show();
            $("#clearButton").hide();
            changeCheck = true;
            $("#docButton").text("Close");
            docQuery();
        }

    
    }


    function docQuery() {

        $("#docRow").empty();

        var apiKey = "03625cc189bac3ceaaf4f0a216c15dbe";

        var link = "https://api.betterdoctor.com/2016-03-01/doctors?location=33.6050991%2C-112.4052392%2C25&skip=0&limit=10&user_key=" + apiKey;

        $.ajax({
            url: link,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            var result = response.data;

            for (i = 0; i < result.length; i++) {
                var card = $("<div>").addClass("card").css("width", "25rem");
                var cardBody = $("<div>").addClass("card-body");
                var cardTitle = $("<h5>").addClass("card-title").text("Dr. " + result[i].profile.first_name + " " + result[i].profile.last_name);
                var cardSubtitle = $("<h6>").addClass("card-subtitle").addClass("mb-2").addClass("text-muted").text(result[i].specialties["0"].actor);
                var cardText = $("<p>").addClass("card-text").text(result[i].profile.bio);
                var space = $("<br>");

                var address = result[i].practices;

                cardBody.append(cardTitle).append(cardSubtitle).append(cardText);

                for (j = 0; j < address.length; j++) {

                    var office = $("<p>").text(address[j].visit_address.street + " " + address[j].visit_address.street2 + " " +
                        address[j].visit_address.city + ", " + address[j].visit_address.state + " " +
                        address[j].visit_address.zip).addClass("dropdown-iten");
                    var space = $("<br>");
                    var phone = address[j].phones;

                    cardBody.append(office);

                    for (k = 0; k < phone.length; k++) {
                        var number = $("<a>").attr("href", "tel:+1" + phone[k].number).text(phone[k].type + " " + phone[k].number);
                        var space = $("<br>");
                        var space2 = $("<br>");

                        cardBody.append(number).append(space).append(space2);
                    };
                    cardBody.append(space).append(space);
                }

                card.append(cardBody);

                $("#docRow").append(card);
            }

            var card2 = $("<div>").addClass("card").css("width", "25rem");
            var cardBody2 = $("<div>").addClass("card-body");
            var more = $("<button>").text("More").addClass("moreButton").css("margin", "auto").css("margin-left", "40%").addClass("btn").addClass("btn-primary").addClass("btn-lg");

            cardBody2.append(more);
            card2.append(cardBody2);
            $("#docRow").append(card2);
        });
    }

    function moreQuery() {

        counter += 10;

        $("#docRow").empty();

        var apiKey = "03625cc189bac3ceaaf4f0a216c15dbe";

        var link = "https://api.betterdoctor.com/2016-03-01/doctors?location=33.6050991%2C-112.4052392%2C25&skip=0&limit=" + counter + "&user_key=" + apiKey;

        $.ajax({
            url: link,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            var result = response.data;

            for (i = 0; i < result.length; i++) {
                var card = $("<div>").addClass("card").css("width", "25rem");
                var cardBody = $("<div>").addClass("card-body");
                var cardTitle = $("<h5>").addClass("card-title").text("Dr. " + result[i].profile.first_name + " " + result[i].profile.last_name);
                var cardSubtitle = $("<h6>").addClass("card-subtitle").addClass("mb-2").addClass("text-muted").text(result[i].specialties["0"].actor);
                var cardText = $("<p>").addClass("card-text").text(result[i].profile.bio);
                var space = $("<br>");

                var address = result[i].practices;

                cardBody.append(cardTitle).append(cardSubtitle).append(cardText);

                for (j = 0; j < address.length; j++) {

                    var office = $("<p>").text(address[j].visit_address.street + " " + address[j].visit_address.street2 + " " +
                        address[j].visit_address.city + ", " + address[j].visit_address.state + " " +
                        address[j].visit_address.zip).addClass("dropdown-iten");
                    var space = $("<br>");
                    var phone = address[j].phones;

                    cardBody.append(office);

                    for (k = 0; k < phone.length; k++) {
                        var number = $("<a>").attr("href", "tel:+1" + phone[k].number).text(phone[k].type + " " + phone[k].number);
                        var space = $("<br>");
                        var space2 = $("<br>");

                        cardBody.append(number).append(space).append(space2);
                    };
                    cardBody.append(space).append(space);
                }

                card.append(cardBody);

                $("#docRow").append(card);
            }

            var card2 = $("<div>").addClass("card").css("width", "25rem");
            var cardBody2 = $("<div>").addClass("card-body");
            var more = $("<button>").text("More").addClass("moreButton").css("margin", "auto").css("margin-left", "40%").addClass("btn").addClass("btn-primary").addClass("btn-lg");

            cardBody2.append(more);
            card2.append(cardBody2);
            $("#docRow").append(card2);
        });
    }

    function clearMarkers() {
        setMapOnAll(null);
        markers = [];
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    //Event listener waiting for a click on any of the dropdown items, to run the clicked function
    $(document).on("click", ".moreButton", moreQuery);
    $(document).on("click", "#clearButton", clearMarkers);
    $(document).on("click", ".dropdown-item", clicked);
    $(document).on("click", "#docButton", changeRow);

    loopMe();
});