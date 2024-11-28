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
function valueToString(latestData){
  if (latestData.humAvg !== undefined) {
    humArray.push(latestData.humAvg)
    if(humArray.length>= xAxisLength){
      humArray.shift()
    }
    console.log(humArray, "%");
  }
  if (latestData.humIrr !== undefined) {
    humArray.push(latestData.humIrr)
    if(humArray.length>= xAxisLength){
      humArray.shift()
    }
    console.log(humArray, "% irr");
  }
  if (latestData.tempAvg !== undefined) {
    tempArray.push(latestData.tempAvg)
    if(tempArray.length>= xAxisLength){
      tempArray.shift()
    }
    console.log(tempArray, "C");
  }
  if (latestData.tempIrr !== undefined) {
    tempArray.push(latestData.tempIrr)
    if(tempArray.length>= xAxisLength){
      tempArray.shift()
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
}





const dbRootRef = ref(db, "sensor");
let xAxisLength = 100
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
  const maxIterations = 1000; // Säkerhetsgräns för att undvika oändliga loopar
  let iterationCount = 0;
  
  function timeToString(){
    yearString = [currentTime.year - latestYear].toString()
    monthString = [currentTime.month - latestMonth].toString()
    if (monthString.length=== 1){
      monthString = "0" + monthString
    }
    dayString = [currentTime.day - latestDay].toString()
    if (dayString.length=== 1){
      dayString = "0" + dayString
    }
    hourString = [currentTime.hour - latestHour].toString()
    if (hourString.length=== 1){
      hourString = "0" + hourString
    }
    minuteString = [currentTime.minute - latestMinute].toString()
    if (minuteString.length=== 1){
      minuteString = "0" + minuteString
    }
    secondsString = [currentTime.second - latestSecond].toString()
    if (secondsString.length=== 1){
      secondsString = "0" + secondsString
    }
    console.log(yearString + "-" + monthString + "-" + dayString + " " + hourString + ":" + minuteString + "." + secondsString)
    return yearString + "-" + monthString + "-" + dayString + " " + hourString + ":" + minuteString + "." + secondsString
  }
  

  while (0 < i) {
    console.log("has entered while");
  
    
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

    valueToString(latestData);
    timeToString();

    
    
    function secondFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond - 1] === undefined
    ) {
      iterationCount++;
      latestSecond++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding second");
        minuteFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
        return;
      }
    }
    latestSecond--;
    const latestHistoryData = value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond]
    console.log(latestHistoryData)
    function historyValueToString(latestHistoryData){
      if (latestHistoryData.humAvg !== undefined) {
        humArray.unshift(latestHistoryData.humAvg)
        if(humArray.length>= xAxisLength){
          humArray.shift()
        }
        console.log(humArray, "%");
      }
      if (latestHistoryData.humIrr !== undefined) {
        humArray.unshift(latestHistoryData.humIrr)
        if(humArray.length>= xAxisLength){
          humArray.shift()
        }
        console.log(humArray, "% irr");
      }
      if (latestHistoryData.tempAvg !== undefined) {
        tempArray.unshift(latestHistoryData.tempAvg)
        if(tempArray.length>= xAxisLength){
          tempArray.shift()
        }
        console.log(tempArray, "C");
      }
      if (latestHistoryData.tempIrr !== undefined) {
        tempArray.unshift(latestHistoryData.tempIrr)
        if(tempArray.length>= xAxisLength){
          tempArray.shift()
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
    }
    historyValueToString(latestHistoryData);
    timeToString();
    return 
  }
  function minuteFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    // Leta efter senaste minuten
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute - 1] === undefined
    ) {
      iterationCount++;
      latestMinute++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding minute");
        hourFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
        return;
      }
      if(value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute - 1] !== undefined){
        latestMinute--;
        secondFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
        return
      }
    }
  }
  function hourFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    // Leta efter senaste timmen
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour - 1] === undefined
    ) {
      iterationCount++;
      latestHour++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding hour");
        dayFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
        return;
      }
      if (value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour - 1] !== undefined){
        latestHour--;
        minuteFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
        return;
    }
    }
  }
  function dayFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    // Leta efter senaste dagen
    iterationCount = 0;
    while (
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay - 1] === undefined
    ) {
      iterationCount++;
      latestDay++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding day");
        monthFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
        return;
      }
      if (value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay - 1] !== undefined){
        latestDay--;
        hourFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
        return;
      }
    }
  }
  function monthFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    // Leta efter senaste månaden
    iterationCount = 0;
    while (value[currentTime.year - latestYear][currentTime.month - latestMonth - 1] === undefined) {
      iterationCount++;
      latestMonth++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding month");
        yearFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
        return;
      }
      if (value[currentTime.year - latestYear][currentTime.month - latestMonth - 1] !== undefined){
        latestHour--;
        dayFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
        return;
      }
    }
  }
  function yearFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    // Leta efter senaste året
    while (value[currentTime.year - latestYear - 1] === undefined) {
      iterationCount++;
      latestYear++;
      if (iterationCount > maxIterations) {
        console.error("You have reached the end of time");
        return;
      }
      if (value[currentTime.year - latestYear - 1] !== undefined){
        latestYear--;
        monthFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
        return;
      }
    }
  }

    // Avsluta loopen
    if(timeArray.length > 100){
      i = 0
    }
    else if (timeArray.length < 100){
      secondFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
    }
    i = 0
  }
})

