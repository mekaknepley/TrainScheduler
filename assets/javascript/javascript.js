 // Initialize Firebase
var config = {
    apiKey: "AIzaSyCN5nBd8dxT-YkZK9ygPeFQkNIZn5YIoQo",
    authDomain: "firstproject-edb1c.firebaseapp.com",
    databaseURL: "https://firstproject-edb1c.firebaseio.com",
    projectId: "firstproject-edb1c",
    storageBucket: "firstproject-edb1c.appspot.com",
    messagingSenderId: "248900448098"
  };

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var frequency = 0;
var firstTime = "";
var minutesAway = "";

$("#addTrainForm").submit(function(event) {
      event.preventDefault();
      
      // Grabbed values from text-boxes
      trainName = $("#trainNameInput").val().trim();
      destination = $("#destinationInput").val().trim();
      frequency = $("#frequencyInput").val().trim();
      firstTime = $("#firstTrainTimeInput").val().trim();
    

      // Code for "Setting values in the database"
    //   database.ref(trainName).set({
    //     destination: destination,
    //     frequency: frequency,
    //     firstTime: firstTime
    //   });
 var newTrain = {
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTime: firstTime
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);
});

// // Firebase watcher + initial loader HINT: .on("value")
// database.ref().on("value", function(snapshot) {

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    var trainName = childSnapshot.val().trainName;
    var frequency = childSnapshot.val().frequency;
    var currentTime = moment();
    var nextArrival = moment(childSnapshot.val().firstTime, "HH:mm");
    //while next arrival is before current time add frequency to next arrival
    while (nextArrival.isBefore(currentTime)){
        nextArrival.add(frequency, 'minutes');
    }
    var minutesAway = nextArrival.diff(moment(), "minutes");
    var newHTML = 
    `<tr id='tableRow${trainName}'>
    <td>${trainName}</td>
    <td>${childSnapshot.val().destination}</td>
    <td>${childSnapshot.val().frequency}</td>
    <td>${nextArrival.format('HH:mm')}</td>
    <td>${minutesAway}</td>
    </tr>`

    console.log(newHTML);
    $("#trainList").append(newHTML);

      // Handle the errors
}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});