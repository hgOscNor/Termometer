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
  94.63, 95.63, 96.34, 97.23, 98.74, 99.21, 99.67, 100.00
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
function getHistory(){

}

const dbRootRef = ref(db);

let latestTimestamp = null;
let latestMeasurement = null;

onChildAdded(dbRootRef, (snapshot) => {
  const value = snapshot.val();
  if (value.online == true) {
    return 0;
  }
  console.log("rådata", value);

  let currentTime = getTime();
  let i = 100;
  let l = 0;
  let tempArray = {}
  let humArray = {}
  let timeArray = {}

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
    let latestYear = l;
    l = 0;
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
    let latestMonth = l;
    l = 0;
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
    let latestDay = l;
    l = 0;
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
    let latestHour = l;
    l = 0;
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
    let latestMinute = l;
    l = 0;
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
    let latestSecond = l;
    console.log("Found second:", currentTime.second - latestSecond);
  
    // Hämta det senaste värdet
    const latestData =
      value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond];
  
    if (latestData.humAvg !== undefined) {
      if(humArray.lenght > 100){
        humArray.shift
      }
      console.log(latestData.humAvg + "%");
    }
    if (latestData.humIrr !== undefined) {
      if(humArray.lenght > 100){
        humArray.shift
      }
      console.log(latestData.humIrr + "irr");
    }
    if (latestData.tempAvg !== undefined) {
      tempArray.push = latestData.tempAvg;
      if(tempArray.lenght > 100){
        tempArray.shift
      }
      console.log(latestData.tempAvg + "C");
    }
    if (latestData.tempIrr !== undefined) {
      if(tempArray.lenght > 100){
        tempArray.shift
      }
      console.log(latestData.tempIrr + "irr");
    }
    
    
    humArray
    timeArray

    // Avsluta loopen
    i--
  }
  
})


