
  
  
  
  $(document).ready( function(){
  
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

  var googleAPI = "AIzaSyBdOM3mqG__SwwJQ7dhBNQNfE9SYuFIGw8";
  var queryURL = "https://maps.googleapis.com/maps/api/js?key=" + googleAPI + "&callback=initMap";

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(res){
    console.log(res);
    })
  ;

function geoFindMe() {

    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
  
    //mapLink.href = '';
    //mapLink.textContent = '';
  
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      status.textContent = '';
      console.log(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
      var coord = `${latitude}, ${longitude} `
      
      database.ref().set({
         Coordinates: coord
      })
      
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if (!navigator.geolocation) {
      //status.textContent = 'Geolocation is not supported by your browser';
    } else {
      //status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
  }
  geoFindMe();

});