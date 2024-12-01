import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, onValue, ref, child, push, update, onChildAdded, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";




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
const dbSensorRef = ref(db, "sensor");
const dbRootRef = ref(db, "/")
const xAxisLength = 100
let tempArray = [0]
let humArray = [0]
let datestampArray = [];
let timestampArray = [];
let historyDatestampArray = [];
let hasBeenRenderd = false
let firstFetch = true

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

var chartLine2 = new ApexCharts(document.querySelector("#chart-line2"), optionsLine2);
var chart = new ApexCharts(document.querySelector("#chart"), options);

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


onValue(dbSensorRef, (snapshot) => {
  
  const value = snapshot.val();
  console.log("rådata", value);

  let currentTime = getTime();
  const maxIterations = 1000000;


  // hitta historien
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
      day = 32  
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
      const daysInMonth = new Date(year, month, 0).getDate();
      day = daysInMonth;
    }
    // console.log("year:" + year + " month:" + month + " day:" + day + " hour:" + hour + " minute:" + minute + " second:" + second)
    return { year, month, day, hour, minute, second };
  }
  
  // hitta data och tider
  function findLatestData(value, currentTime, xAxisLength) {
    const dataArray = [];

    let iterationCount = 0;

    while (tempArray.length + 1 < xAxisLength && iterationCount < maxIterations) {
      const { year, month, day, hour, minute, second } = currentTime;

      // Kontrollera om data finns på denna tidpunkt
      if (
        value[year] &&
        value[year][month] &&
        value[year][month][day] &&
        value[year][month][day][hour] &&
        value[year][month][day][hour][minute] &&
        value[year][month][day][hour][minute][second] !== undefined) {
        // console.log("found data at", value[year][month][day][hour][minute][second])
        // Hämta data och tidsstämpel
        const data = value[year][month][day][hour][minute][second];
        const timestamp = `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

        // Lägg till i arrayerna
        function valueToString(data){
          
            // console.log(humArray, "%");
          
          if (data.humIrr !== undefined) {
            humArray.push(Math.round(data.humIrr))
            if(humArray.length>= xAxisLength){
              humArray.shift()
            }
          }
          else if (data.humAvg !== undefined) {
          humArray.push(Math.round(data.humAvg))
          if(humArray.length>= xAxisLength){
            humArray.shift()
            } // console.log(humArray, "% irr");
          }
          
          if (data.tempIrr !== undefined) {
            tempArray.push(Math.round(data.tempIrr))
            if(tempArray.length>= xAxisLength){
              tempArray.shift()
            }
            // console.log(tempArray, "C irr");
          }
          else if (data.tempAvg !== undefined) {
            tempArray.push(Math.round(data.tempAvg))
            if(tempArray.length>= xAxisLength){
              tempArray.shift()
            }
            // console.log(tempArray, "C");
          }
        
          if (humArray.length < tempArray.length){
            humArray[tempArray.length - 1] = humArray[humArray.length - 1]
            // console.log("corrected humArray", humArray)
          }
          if (tempArray.length < humArray.length){
            tempArray[humArray.length - 1] = tempArray[tempArray.length - 1]
            // console.log("corrected tempArray", tempArray)
          }
        }
        valueToString(data);
        dataArray.unshift(data);
        // console.log(data)
        datestampArray.unshift(timestamp.slice(0, 10));
        timestampArray.unshift(timestamp.slice(11, 99))
        
      }

      // Gå bakåt i tiden
      currentTime = decrementTime(currentTime);
      iterationCount++;
    }

    if (iterationCount >= maxIterations) {
      console.error("Exceeded max iterations.");
    }
    console.log(iterationCount)
    return { dataArray, datestampArray };
  }
  
  const result = findLatestData(value, currentTime, xAxisLength);
  
  console.log("Latest data array:", result.dataArray);
  console.log("Latest timestamp array:", result.datestampArray);
  
  if (hasBeenRenderd === false){
    chartLine2.render();
    chart.render();
    hasBeenRenderd = true
  }
  else if (firstFetch === false){
    updateChartsData(timestamp, humArray, tempArray);
  }
  firstFetch = false

let firstTimestamp = new Date(datestampArray[0])
for (let i = 1; i < 20; i++) {
  console.log("enterd for loop" + firstTimestamp)
  if(firstTimestamp.getDate - i !== undefined){
    function decrementTimeInHistory(firstTimestamp, second, minute, hour, day, month, year) {

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
      }
      // console.log("year:" + year + " month:" + month + " day:" + day + " hour:" + hour + " minute:" + minute + " second:" + second)
      return { year, month, day, hour, minute, second };
    }
    function findAndUploadHistoryData(value, firstTimestamp) {
      const dataArray = [];
      const maxHistoryIterations = 86399
      let iterationCount = 0;
      let historyHumArray = []
      let historyTempArray = []
      let second = 59
      let minute = 59 
      let hour = 23
      let day = firstTimestamp.getDate() - i
      console.log("test day " + firstTimestamp.getDate())
      let month = firstTimestamp.getMonth() + 1
      let year = firstTimestamp.getFullYear()
  
      while (iterationCount < maxHistoryIterations) {
        
  
        // Kontrollera om data finns på denna tidpunkt
        if (
          value[year] &&
          value[year][month] &&
          value[year][month][day] &&
          value[year][month][day][hour] &&
          value[year][month][day][hour][minute] &&
          value[year][month][day][hour][minute][second] !== undefined) {
          console.log("found data at", value[year][month][day][hour][minute][second])
          // Hämta data och tidsstämpel
          const data = value[year][month][day][hour][minute][second];
          const timestamp = `${year}-${month.toString().padStart(2, '0')}-${day
            .toString()
            .padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  
          // Lägg till i arrayerna
          function historyValueToString(data){
            if (data.humAvg !== undefined) {
              historyHumArray.push(Math.round(data.humAvg))
              // console.log(humArray, "history %");
            }
            if (data.humIrr !== undefined) {
              historyHumArray.push(Math.round(data.humIrr))
              // console.log(humArray, "history % irr");
            }
            if (data.tempAvg !== undefined) {
              historyTempArray.push(Math.round(data.tempAvg))
  
              // console.log(tempArray, "history C");
            }
            if (data.tempIrr !== undefined) {
              historyTempArray.push(Math.round(data.tempIrr))
  
              // console.log(tempArray, "history C irr");
            }
          }
          historyValueToString(data);
          dataArray.unshift(data);
          // console.log(data)
          historyDatestampArray.unshift(timestamp.slice(0, 10));
        }
  
        // Gå bakåt i tiden
        ({ year, month, day, hour, minute, second } = decrementTimeInHistory(firstTimestamp, second, minute, hour, day, month, year));
        iterationCount++;
      }
      function historyArraysUpload(historyDatestampArray, historyHumArray, historyTempArray){
        console.log("has enterd upload")
        const historyRef = ref(db, `history/${historyDatestampArray[historyDatestampArray.length - 1]}`)
        console.log("has found path ", historyDatestampArray[historyDatestampArray.length - 1])
        let averageHum  = 0
        let averageTemp = 0

        historyHumArray.sort(function(a, b){return a - b})
        const highestHum  = historyHumArray[historyHumArray.length - 1]
        const lowestHum = historyHumArray[0]
        console.log(highestHum + " h hum ", lowestHum + " l hum")
        set(ref(db, "history/" + historyDatestampArray[historyDatestampArray.length - 1].toString() + "/highestHum"), highestHum);
        set(ref(db, "history/" + historyDatestampArray[historyDatestampArray.length - 1].toString() + "/lowestHum"), lowestHum);

        

        historyTempArray.sort(function(a, b){return a - b})
        const highestTemp = historyTempArray[historyTempArray.length - 1]
        const lowestTemp = historyTempArray[0]
        set(ref(db, "history/" + historyDatestampArray[historyDatestampArray.length - 1].toString() + "/highestTemp"), highestTemp)
        set(ref(db, "history/" + historyDatestampArray[historyDatestampArray.length - 1].toString() + "/lowestTemp"), lowestTemp)

        for(let i = 0; i < historyHumArray.length; i++){
          averageHum  = averageHum  + historyHumArray[i]
        }
        averageHum  = averageHum  / historyHumArray.length
        set(ref(db, "history/" + historyDatestampArray[historyDatestampArray.length - 1].toString() + "/averageHum"), Math.round(averageHum))

        for(let i = 0; i < historyTempArray.length; i++){
          averageTemp = averageTemp + historyTempArray[i]
        }
        averageTemp = averageTemp / historyTempArray.length
        set(ref(db, "history/" + historyDatestampArray[historyDatestampArray.length - 1].toString() + "/avregeTemp"), Math.round(averageTemp))
      }
      if (iterationCount >= maxHistoryIterations) {
        historyArraysUpload(historyDatestampArray, historyHumArray, historyTempArray)
      }
      console.log(iterationCount)
    }
    findAndUploadHistoryData(value, firstTimestamp)
  }
}
  
})