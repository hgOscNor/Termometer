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
const dbRootRef = ref(db, "sensor");
let xAxisLength = 101
let tempArray = [0]
let humArray = [0]
let timeArray = []
let timeDatestampArray = []
let timestampArray = [];

var options = {
  chart: {
    type: 'line',
    id: 'fb',
    group: 'social',
    type: 'line',
    height: 200,
    padding: 20
  },
  series: [{
    data: tempArray,
    name: 'Temp',

  }],
  xaxis: {
      categories: timestampArray,
      type: "dateTime",
  }

}



var optionsLine2 = {
  chart: {
  id: 'tw',
  group: 'social',
  type: 'line',
  height: 200,
 
},
series: [{
  data: humArray,
  name: 'Hum',

}],
colors: ['#ff7713'],
xaxis: {
  categories: timestampArray,
  type: "dateTime",
}
};



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
function updateCharts() {
  var series1 = timestamps.map((timestamp, index) => [timestamp, data1[index]]);
  var series2 = timestamps.map((timestamp, index) => [timestamp, data2[index]]);

  chart.updateSeries([{ data: series1 }]);
  chartLine2.updateSeries([{ data: series2 }]);
}
function updateChartsData(timestamp, humArray, tempArray){
  timestamps.push(timestamp[timestamp.length - 1])
  data1.push(tempArray[tempArray.length - 1])
  data2.push(humArray[humArray.length - 1])
  updateCharts()
}






onValue(dbRootRef, (snapshot) => {
  
  const value = snapshot.val();
  console.log("rådata", value);

  let currentTime = getTime();
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
                  humArray.push(Math.round(data.humAvg))
                  if(humArray.length>= xAxisLength){
                    humArray.shift()
                  }
                  console.log(humArray, "%");
                }
                if (data.humIrr !== undefined) {
                  humArray.push(Math.round(data.humIrr))
                  if(humArray.length>= xAxisLength){
                    humArray.shift()
                  }
                  console.log(humArray, "% irr");
                }
                if (data.tempAvg !== undefined) {
                  tempArray.push(Math.round(data.tempAvg))
                  if(tempArray.length>= xAxisLength){
                    tempArray.shift()
                  }
                  console.log(tempArray, "C");
                }
                if (data.tempIrr !== undefined) {
                  tempArray.push(Math.round(data.tempIrr))
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
              dataArray.unshift(data);
              console.log(data)
              timeDatestampArray.unshift(timestamp);
              timestampArray.unshift(timestamp.slice(11, 99))
              
          }
  
          // Gå bakåt i tiden
          currentTime = decrementTime(currentTime);
          iterationCount++;
      }
  
      if (iterationCount >= maxIterations) {
          console.error("Exceeded max iterations.");
      }
  
      return { dataArray, timeDatestampArray };
  }
  
  const maxResults = 100;
  const result = findLatestDataArray(value, currentTime, maxResults);
  
  console.log("Latest data array:", result.dataArray);
  console.log("Latest timestamp array:", result.timeDatestampArray);
  
  var chartLine2 = new ApexCharts(document.querySelector("#chart-line2"), optionsLine2);
  chartLine2.render();
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  }
)

