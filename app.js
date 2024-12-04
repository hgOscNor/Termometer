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
const xAxisLength = 200
let tempArray = [null]
let humArray = [null]
let datestampArray = [];
let timestampArray = [];
let hasBeenRenderd = false
let firstFetch = true
let timestamps = []
const randomArray = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100) + 1);
const randomArray2 = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100) + 1);
const randomArray3 = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100) + 1);
console.log(randomArray)
var optionsTemp = {
  chart: {
    type: 'area',
    id: 'fb',
    group: 'social',
    // type: 'line',
    height: 250,
    dynamicAnimation: {
      enabled: true,
      speed: 350
    }
  },
  stroke:{
    curve: "smooth"
  },
  dataLabels: {
    enabled: false
  },
  series: [{
    data: tempArray,
    name: 'Temp',

  }],
  title: {
    text: "Tempature"
  },
  xaxis: {
      categories: timestampArray,
      type: "dateTime",
  },
  colors: ['#ff7713'],

}
var optionsHum = {
  chart: {
  id: 'tw',
  group: 'social',
  type: 'area',
  height: 250,
  dynamicAnimation: {
    enabled: true,
    speed: 350
  }
},
stroke:{
  curve: "smooth"
},
dataLabels: {
  enabled: false
},
series: [{
  data: humArray,
  name: 'Hum',

}],
title: {
  text: "Humidity"
},
xaxis: {
  categories: timestampArray,
  type: "dateTime",
}
};
var optionsHumCombo = {
  series: [{
    name: "Highest",
    type: "column",
    data: randomArray
  },{
    name: "Lowest",
    type: "column",
    data: randomArray2
  },{
    name: "Avreage",
    type: "line",
    data: randomArray3,
  }],
    chart: {
      type: "line",
      height: 250,
    },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: "Humidity's past"
  },
  stroke:{
    curve: "smooth"
  },
  colors:['#F44336', '#E91E63', '#9C27B0'],

}
var optionsTempCombo = {
  series: [{
    name: "Highest",
    type: "column",
    data: randomArray2
  },{
    name: "Lowest",
    type: "column",
    data: randomArray3
  },{
    name: "Avreage",
    type: "line",
    data: randomArray,
  }],
    chart: {
      type: "line",
      height: 250,
    },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: "Tempature's past"
  },
  stroke:{
    curve: "smooth"
  },
  
}
var chartLine2 = new ApexCharts(document.querySelector("#chart-line2"), optionsHum);
var chart = new ApexCharts(document.querySelector("#chart"), optionsTemp);
var humComboChart = new ApexCharts(document.querySelector("#humComboChart"), optionsHumCombo);
var tempComboChart = new ApexCharts(document.querySelector("#tempComboChart"), optionsTempCombo);


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

function updateCharts() {

  chart.updateSeries([{data: tempArray}]);
  chartLine2.updateSeries([{ data: humArray }]);
  console.log("has updated charts")
}

function decrementTime(currentTime) {
  let { year, month, day, hour, minute, second } = currentTime;

  second--;
  if (second < 0) {
    second = 59;
    minute--;
  }

  if (minute < 0) {
    minute = 59;
    hour--;
  }

  if (hour < 0) {
    hour = 23;
    day--;
  }

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

function findLatestData(value, currentTime, xAxisLength) {
  const maxIterations = 100000;
  let iterationCount = 0;
  let { year, month, day, hour, minute, second } = currentTime;
  let foundHum = false
  let foundTemp = false


  while (tempArray.length < xAxisLength && iterationCount < maxIterations) {
    try {
      const dataAtTimestamp = value?.[year]?.[month]?.[day]?.[hour]?.[minute]?.[second];
      
      if (dataAtTimestamp) {
        function processData(data) {
          // Humidity processing
          if (!isNaN(data.humIrr)) {
            if (foundHum === false){humArray = []; foundHum = true}
            humArray.unshift(Math.round(data.humIrr));
          }
          else if (!isNaN(data.humAvg)) {
            if (foundHum === false){humArray = []; foundHum = true}
            humArray.unshift(Math.round(data.humAvg));
          }

          // Temperature processing
          if (!isNaN(data.tempIrr)) {
            if (foundTemp === false){tempArray = []; foundTemp = true}
            tempArray.unshift(Math.round(data.tempIrr));
          }
          else if (!isNaN(data.tempAvg)) {
            if (foundTemp === false){tempArray = []; foundTemp = true}
            tempArray.unshift(Math.round(data.tempAvg));
          }

          while(tempArray.length < humArray.length){
            if (firstFetch === true) {
              tempArray.unshift(tempArray[0])
            }
            else {
              tempArray.push(tempArray[tempArray.length - 1])
            }
          }
          if (data.humIrr === undefined && data.humAvg === undefined) {
            while(humArray.length < tempArray.length){
              if (firstFetch === true) {
                if (!isNaN(humArray[0])) {
                  humArray.unshift(humArray[0])
                }
                else{
                  humArray.unshift(null)
                }
              }
              else {
                if (!isNaN(humArray[humArray.length - 1])) {
                  humArray.push(humArray[humArray.length - 1])
                }
                else{
                  humArray.push(null)
                }
              }
            }
          }
          // Timestamp processing - format as HH:MM:SS
          const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
          timestampArray.unshift(formattedTime);
        }

        processData(dataAtTimestamp);
      }
    } catch (error) {
      console.error("Error processing timestamp data:", error);
    }

    // Decrement time
    
    ({ year, month, day, hour, minute, second } = decrementTime({ 
      year, month, day, hour, minute, second 
    }));
    

    iterationCount++;
  }

  // Ensure arrays don't exceed xAxisLength
  tempArray = tempArray.slice(0, xAxisLength);
  humArray = humArray.slice(0, xAxisLength);
  timestampArray = timestampArray.slice(0, xAxisLength);

  console.log(`Processed ${iterationCount} iterations`);
  return { 
    tempArray, 
    humArray, 
    timestampArray
  };
}

onValue(dbSensorRef, (snapshot) => {
  const value = snapshot.val();
  console.log("rawData", value)
  const result = findLatestData(value, getTime(), xAxisLength);
  
  tempArray = result.tempArray;
  humArray = result.humArray;
  timestampArray = result.timestampArray;

  document.getElementById("currentHum").innerHTML = "Current humidity: " + humArray[humArray.length - 1] + "%"
  document.getElementById("currentTemp").innerHTML = "Current tempature: " + tempArray[tempArray.length - 1] + "&deg;C"

  // Ensure charts are rendered and data is complete
  if (firstFetch === true && humArray.length === xAxisLength && tempArray.length === xAxisLength) {
    chart.render();
    chartLine2.render();
    humComboChart.render();
    tempComboChart.render();
    hasBeenRenderd = true;
    updateCharts();
    firstFetch = false;
  }
  else if (firstFetch === false && humArray.length === xAxisLength && tempArray.length === xAxisLength) {
    updateCharts();
  }
})