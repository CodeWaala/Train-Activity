$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB1KjogUfX13xwU4iSUWOKAqwm1PICVkPM",
        authDomain: "train-time-270f6.firebaseapp.com",
        databaseURL: "https://train-time-270f6.firebaseio.com",
        projectId: "train-time-270f6",
        storageBucket: "",
        messagingSenderId: "1749150628"
    };
    
    firebase.initializeApp(config);

    //Code goes here.

    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var nextArrival = "";
    var minutesAway = "";

    $('#Submit').on("click", function () {

        event.preventDefault();

        trainName = $('#trainName').val().trim();
        destination = $('#destination').val().trim();
        firstTrainTime = $('#firstTrainTime').val().trim();
        frequency = $('#frequency').val().trim();

        database.ref().push({

            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
            //nextArrival: nextArrival
        });

    });



database.ref().on("child_added", function (childSnapshot) {

        var tableRow = $('<tr>');
        console.log(childSnapshot);
        firstTrainTime = childSnapshot.val().firstTrainTime;
        frequency = childSnapshot.val().frequency;

        nextArrival = NextArrivalTime(firstTrainTime, frequency).nextArrival;
        frequency =  NextArrivalTime(firstTrainTime, frequency).frequency;
       
        var tableCols = $('<td>' + childSnapshot.val().trainName + '</td>' + '<td>' + childSnapshot.val().destination + '</td>' + '<td>' + childSnapshot.val().frequency + '</td>' + '<td>' + nextArrival + '</td>' + '<td>' + minutesAway + '</td>');

        var tableBody = $('.tableBody')
        tableRow.append(tableCols)
        tableBody.append(tableRow);

    });

    $('#clearAll').on("click", function (event) {

        event.preventDefault();
        $('#trainName').val("");
        $('#destination').val("");
        $('#firstTrainTime').val("");
        $('#frequency').val("");

    });

    function NextArrivalTime(firstTrainTime, frequency) {

        firstTrainTime = firstTrainTime;
        frequency = frequency;
        var timeRemainder = moment().diff(moment(firstTrainTime, 'HH:mm'), 'm') % frequency;
        if (timeRemainder > 0) {
            minutesAway = Math.abs(frequency - (moment().diff(moment(firstTrainTime, 'HH:mm'), 'm') % frequency));
            console.log(Math.abs(frequency - minutesAway));
            nextArrival = moment().add(Math.abs(frequency - timeRemainder), 'minutes').format('hh:mm A');
            console.log(nextArrival);
        }
        else if (timeRemainder < 0) {
            nextArrival = moment(firstTrainTime, 'HH:mm').format('hh:mm A');
            minutesAway = Math.abs(moment().diff(moment(firstTrainTime, 'HH:mm'), 'm'));

        } else if (timeRemainder = 0) {
            nextArrival = moment(firstTrainTime, 'HH:mm').format('hh:mm A');
            minutesAway = 0;
        }

        var trainObj = {
            nextArrival : nextArrival, 
            minutesAway : minutesAway 
        }
        return  trainObj; 
    }

});