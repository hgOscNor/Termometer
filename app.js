import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, onValue, ref, child, push, update, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQDevcOGsNzQTy0F63KP5b3DJQOjmH3jk",
    authDomain: "i-hetaste-laget-ead3c.firebaseapp.com",
    databaseURL: "https://i-hetaste-laget-ead3c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "i-hetaste-laget-ead3c",
    storageBucket: "i-hetaste-laget-ead3c.firebasestorage.app",
    messagingSenderId: "96796478648",
    appId: "1:96796478648:web:3ae32b69593d060c97b84d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const randomArray = [
  10.11, 11.34, 12.34, 14.56, 15.14, 16.28, 17.65, 18.23, 19.23, 19.84, 
  20.14, 22.47, 23.45, 24.67, 25.67, 26.78, 27.34, 28.39, 29.65, 29.87, 
  30.48, 31.45, 32.17, 33.34, 33.67, 34.56, 34.98, 35.23, 36.78, 37.54, 
  38.49, 39.47, 40.12, 41.23, 42.31, 43.21, 44.34, 44.91, 45.12, 45.28, 
  46.21, 47.21, 48.12, 49.82, 50.14, 50.76, 51.29, 52.36, 53.21, 54.98, 
  55.12, 56.78, 60.45, 61.74, 62.34, 63.45, 64.89, 65.43, 67.29, 67.89, 
  68.94, 69.39, 71.65, 72.19, 73.45, 74.29, 74.82, 75.34, 76.91, 77.66, 
  78.12, 79.38, 80.34, 81.45, 82.67, 83.95, 84.12, 85.23, 86.34, 87.65, 
  87.91, 88.02, 88.47, 89.76, 90.21, 90.23, 91.08, 92.03, 92.10, 93.72, 
  94.63, 95.63, 96.34, 97.23, 98.74, 99.21, 99.67, "2024-11-27 13:28.10"
];

let xAxisLenght

var options = {
  chart: {
    type: 'line',
    id: 'fb',
    group: 'social',
    type: 'line',
    height: 160
  },
  series: [{
    data: randomArray,
    name: 'Temp',

  }],
  xaxis: {
    categories: randomArray
  }
}

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

var optionsLine2 = {
  chart: {
  id: 'tw',
  group: 'social',
  type: 'line',
  height: 160
},
series: [{
  data: randomArray,
  name: 'Temp',

}],
colors: ['#ff7713']
};

var chartLine2 = new ApexCharts(document.querySelector("#chart-line2"), optionsLine2);
chartLine2.render();

// ... rest of your code

function getTime(){
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth() + 1;
let day = now.getDate();
let hour = now.getHours();
let minute = now.getMinutes();
let second = now.getSeconds();
let currentTime = { year, month, day, hour, minute, second };
console.log(currentTime)
return currentTime
}
function mathRound(number, round){
  number = Math.round(round)
  return number
}

const dbRootRef = ref(db, "sensor");

let latestTimestamp = null;
let latestMeasurement = null;
let tempArray = []
let humArray = []
let timeArray = []

onValue(dbRootRef, (snapshot) => {
  const value = snapshot.val();
  console.log("rådata", value);

  let currentTime = getTime();
  let i = 100;
  let l = -5;
  let yearString
  let monthString
  let dayString
  let hourString
  let minuteString
  let secondsString
  let latestYear = 0
  let latestMonth = 0
  let latestDay = 0
  let latestHour = 0
  let latestMinute = 0
  let latestSecond = 0

  while (0 < i) {
    console.log("has entered while");
  
    const maxIterations = 10000; // Säkerhetsgräns för att undvika oändliga loopar
    let iterationCount = 0;
  
    // Leta efter senaste året
    while (value[currentTime.year - l] === undefined) {
      l++;
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding year");
        return;
      }
    }
    latestYear = l;
    l = -5;
    console.log("Found year:", currentTime.year - latestYear);
  
    // Leta efter senaste månaden
    iterationCount = 0;
    while (value[currentTime.year - latestYear][currentTime.month - l] === undefined) {
      l++;
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding month");
        return;
      }
    }
    latestMonth = l;
    l = -5;
    console.log("Found month:", currentTime.month - latestMonth);
  
    // Leta efter senaste dagen
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - l] === undefined
    ) {
      l++;
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding day");
        return;
      }
    }
    latestDay = l;
    l = -5;
    console.log("Found day:", currentTime.day - latestDay);
  
    // Leta efter senaste timmen
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - l] === undefined
    ) {
      l++;
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding hour");
        return;
      }
    }
    latestHour = l;
    l = -5;
    console.log("Found hour:", currentTime.hour - latestHour);
  
    // Leta efter senaste minuten
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - l] === undefined
    ) {
      l++;
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding minute");
        return;
      }
    }
    latestMinute = l;
    l = -5;
    console.log("Found minute:", currentTime.minute - latestMinute);
  
    // Leta efter senaste sekunden
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - l] === undefined
    ) {
      l++;
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding second");
        return;
      }
    }
    latestSecond = l;
    console.log("Found second:", currentTime.second - latestSecond);
  
    // Hämta det senaste värdet
    const latestData =
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond];
  

    Object.keys(value).forEach((key) => {
      if (key == currentTime.year - latestYear) {
        yearString = key.toString()
    }});

    Object.keys(value[currentTime.year - latestYear]).forEach((key) => {
      if (key == currentTime.month - latestMonth) {
        monthString = key.toString()
    }});

    Object.keys(value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay]).forEach((key) => {
      if (key == currentTime.day - latestDay) {
        dayString = key.toString()
    }});

    Object.keys(value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour]).forEach((key) => {
      if (key == currentTime.hour - latestHour) {
        hourString = key.toString()
    }});

    Object.keys(value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute]).forEach((key) => {
      if (key == currentTime.minute - latestMinute) {
        monthString = key.toString()
    }});

    Object.keys(value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond]).forEach((key) => {
      if (key == currentTime.second - latestSecond) {
        secondsString = key.toString()
    }});


    if (latestData.humAvg !== undefined) {
      humArray.push(latestData.humAvg)
      if(humArray.lenght > xAxisLenght){
        humArray.shift
      }
      console.log(humArray, "%");
    }
    if (latestData.humIrr !== undefined) {
      humArray.push(latestData.humIrr)
      if(humArray.lenght > xAxisLenght){
        humArray.shift
      }
      console.log(humArray, "% irr");
    }
    if (latestData.tempAvg !== undefined) {
      tempArray.push(latestData.tempAvg)
      if(tempArray.lenght > xAxisLenght){
        tempArray.shift
      }
      console.log(tempArray, "C");
    }
    if (latestData.tempIrr !== undefined) {
      tempArray.push(latestData.tempIrr)
      if(tempArray.lenght > xAxisLenght){
        tempArray.shift
      }
      console.log(tempArray, "C irr");
    }

    if (humArray.length < tempArray.length){
      humArray[tempArray.length - 1] = humArray[humArray.length - 1]
      console.log("corrected humArray", humArray)
    }
    if (tempArray.length < humArray.length){
      tempArray[humArray.length - 1] = tempArray[tempArray.length - 1]
      console.log("corrected tempArray", tempArray)
    }


    yearString = [currentTime.year - latestYear].toString()
    monthString = [currentTime.month - latestMonth].toString()
    dayString = [currentTime.day - latestDay].toString()
    hourString = [currentTime.hour - latestHour].toString()
    minuteString = [currentTime.minute - latestMinute].toString()
    secondsString = [currentTime.second - latestSecond].toString()

    console.log(yearString + "-" + monthString + "-" + dayString + " " + hourString + ":" + minuteString + "." + secondsString)

    // Avsluta loopen
    if(timeArray.lenght > 100){
      i = 0
    }
    i = 0
  }
})