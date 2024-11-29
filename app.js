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
let xAxisLength = 101
let tempArray = []
let humArray = []
let timeArray = []

onValue(dbRootRef, (snapshot) => {
  
  const value = snapshot.val();
  console.log("rådata", value);

  let currentTime = getTime();
  let i = 100;
  let l = -5;
  let yearString, monthString, dayString, hourString, minuteString, secondsString = ""
  let latestYear, latestSecond, latestMonth, latestDay, latestHour, latestMinute = 0

  // const maxIterations = 1000; // Säkerhetsgräns för att undvika oändliga loopar
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
  function secondFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime){
    iterationCount = 0;
    console.log(typeof(value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond]))
    while (value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond - 1] === undefined) {
      iterationCount++;
      latestSecond++;
      if (iterationCount > maxIterations) {
        console.error("Exceeded max iterations while finding second");
        minuteFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
        return;
      }
    }
    //latestSecond--;
    latestSecond--;
    const latestHistoryData = value[currentTime.year - latestYear][currentTime.month - latestMonth][currentTime.day - latestDay][currentTime.hour - latestHour][currentTime.minute - latestMinute][currentTime.second - latestSecond]
    console.log(latestHistoryData)
    console.log(typeof(latestHistoryData))
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
    }
    // latestMinute--;
    latestMinute--;
    secondFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
    return
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
    }
    latestHour--;
    latestHour--;
    minuteFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
    return;
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
    }
    latestDay--;
    latestDay--;
    hourFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
    return;
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
    }
    latestMonth--;
    latestMonth--;
    dayFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
    return;
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
    }
    latestYear--;
    latestYear--;
    monthFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime)
    return;
  }

  const maxIterations = 100000; // Säkerhetsgräns för att undvika eviga loopar

  // Funktion för att gå bakåt i tid
  function decrementTime(currentTime) {
      let { year, month, day, hour, minute, second } = currentTime;
  
      // Minska sekunden
      second--;
      if (second < 0) {
          second = 59;
          minute--;
      }
  
      // Minska minuten
      if (minute < 0) {
          minute = 59;
          hour--;
      }
  
      // Minska timmen
      if (hour < 0) {
          hour = 23;
          day--;
      }
  
      // Minska dagen
      if (day < 1) {
          month--;
          if (month < 1) {
              month = 12;
              year--;
          }
          const daysInMonth = new Date(year, month, 0).getDate();
          day = daysInMonth;
      }
  
      return { year, month, day, hour, minute, second };
  }
  
  // Funktion för att hitta och spara senaste data och tider
  function findLatestDataArray(value, currentTime, maxResults) {
      const dataArray = [];
      const timestampArray = [];
      let iterationCount = 0;
  
      while (dataArray.length < maxResults && iterationCount < maxIterations) {
          const { year, month, day, hour, minute, second } = currentTime;
  
          // Kontrollera om data finns på denna tidpunkt
          if (
              value[year] &&
              value[year][month] &&
              value[year][month][day] &&
              value[year][month][day][hour] &&
              value[year][month][day][hour][minute] &&
              value[year][month][day][hour][minute][second] !== undefined
          ) {
              // Hämta data och tidsstämpel
              const data = value[year][month][day][hour][minute][second];
              const timestamp = `${year}-${month.toString().padStart(2, '0')}-${day
                  .toString()
                  .padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute
                  .toString()
                  .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  
              // Lägg till i arrayerna
              function valueToString(data){
                if (data.humAvg !== undefined) {
                  humArray.push(data.humAvg)
                  if(humArray.length>= xAxisLength){
                    humArray.shift()
                  }
                  console.log(humArray, "%");
                }
                if (data.humIrr !== undefined) {
                  humArray.push(data.humIrr)
                  if(humArray.length>= xAxisLength){
                    humArray.shift()
                  }
                  console.log(humArray, "% irr");
                }
                if (data.tempAvg !== undefined) {
                  tempArray.push(data.tempAvg)
                  if(tempArray.length>= xAxisLength){
                    tempArray.shift()
                  }
                  console.log(tempArray, "C");
                }
                if (data.tempIrr !== undefined) {
                  tempArray.push(data.tempIrr)
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
              valueToString(data);
              dataArray.push(data);
              timestampArray.push(timestamp);
          }
  
          // Gå bakåt i tiden
          currentTime = decrementTime(currentTime);
          iterationCount++;
      }
  
      if (iterationCount >= maxIterations) {
          console.error("Exceeded max iterations.");
      }
  
      return { dataArray, timestampArray };
  }
  
  const maxResults = 100;
  const result = findLatestDataArray(value, currentTime, maxResults);
  
  console.log("Latest data array:", result.dataArray);
  console.log("Latest timestamp array:", result.timestampArray);
  


    // valueToString(latestData);
    // timeToString();

  // while(timeArray < xAxisLength){
  //   secondFindHistory(value, latestYear, latestMonth, latestDay, latestHour, latestMinute, latestSecond, currentTime);
  // }
    
        // Avsluta loopen
    if(timeArray.length > 100){
      i = 0
    }
    i = 0
  }
)

