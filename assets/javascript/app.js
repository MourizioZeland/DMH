
$(document).ready(function () {
  
  
  // var of location banks
var hospital = ["Banner Good Samaritan Hospital " , "St. Joseph's Hospital", "Phoenix Memorial Hospital", "Arizona Heart Hospital", "MIHS", "Honorhealth John C. Lincoln", "Phoenix Indian Hosptial", "Banner Estrella", "Honorhealth Deer Valley", "Abrazo Central Campus", "Valley Hospital", "St. Luke's Hosptial"];
var shelter = ["Homeward Bound", "Church on the Street ", "The Respite Shelter for Homeless Men", "Homebase Youth Services" , "Arizona Coalition to End Homelessness" , "Andre House", "Vista Colina Emergency Family Shelter", "Justa Center", "Homeless ID Project","Lodestar Day Resource Center", "Brian Garcia Welcome Center", "Central AZ Shelter Services","House Of Refuge Sunnyslope","Gift of Mary Womens Shelter","Phoenix Rescue Mission","Tumbleweed Phoenix Resource Center", "Terros Safe Haven Shelter", "Kaiser Family Crisis Shelter", "Elim House Shelter", "UMOM Family Shelter", "Family Promise of Greater Phoenix" ,"La Mesita Family Homeless Shelter", "East Valley Men's Center (EVMC) Shelter", "Save the Family", "East Valley Women's Shelter"];
var foodBank = ["St. Mary's Food Bank","Cultral Cup Food Bank","Valley Christian Centers","St Stephen's Episcopal Church","Tanner Chapel A.M.E. Church","St Gregory's - St Vincent de Paul","South Mountain Community College","Rio Vista Center","Operation Care-Valley Heights","Open Door Fellowship Church","Mount of Olives Lutheran Church Food Pantry","Neighborhood Ministries Inc.","Manzanita Senior Center", "Living Streams Church Food Pantry", "Life Bridge Resource Center","Joshua Tree Feeding Program","Highways and Hedges Ministries", "Friendly House", "First Southern Baptist Church Benevolence Center","First Pentecostal Church Community Center","FIBCO Family Services", "Desert West Senior Services", "Desert Christian Fellowship" ,"Deer Valley Senior Center","Circle of Life Development","Cultural Cup Food Bank", "Church on Fillmore", "Central AZ Shelter Services (CASS)", "Carl Hayden Veterans Hospital", "Black Family and Child Services", "Bethel Lutheran Church", "All Tribes Assembly of God Church", "Agape Network", "ICM Food and Clothing Bank", "Gateway Church of God", "Desert Mission Food Bank","Covenant of Grace Ministries" ,"Phoenix Rescue Mission", "Northminster Food Bank", "Mom's Pantry"]


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

