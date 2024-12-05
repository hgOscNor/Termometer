import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";




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
const dbHistoryRef = ref(db, "dailySummary")
const xAxisLength = 200
let tempArray = [null]
let humArray = [null]
let humAvgArray = []
let humHighArray = []
let humLowArray = []
let tempAvgArray = []
let tempHighArray = []
let tempLowArray = []
let datestampArray = [];
let timestampArray = [];
let historyDatesArray = []
let hasBeenRenderd = false
let firstFetch = true

var optionsTemp = {
  chart: {
    type: 'area',
    id: 'fb',
    group: 'live',
    height: 250,
    dynamicAnimation: {
      enabled: true,
      speed: 350
    },
    zoom: {
      allowMouseWheelZoom: false, 
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
  group: 'live',
  type: 'area',
  height: 250,
  dynamicAnimation: {
    enabled: true,
    speed: 350
  },
  zoom: {
    allowMouseWheelZoom: false, 
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
    type: "line",
    data: humHighArray
  },{
    name: "Lowest",
    type: "line",
    data: humLowArray
  },{
    name: "Avreage",
    type: "line",
    data: humAvgArray,
  }],
  
    chart: {
      type: "line",
      height: 250,
      group: "past",
      id: "humPast",
      zoom: {
        allowMouseWheelZoom: false, 
      }
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
  xaxis: {
    categories: historyDatesArray,
    type: "dateTime",
  },
  fill: {
    opacity: 1
  }

}
var optionsTempCombo = {
  series: [{
    name: "Highest",
    type: "line",
    data: tempHighArray
  },{
    name: "Lowest",
    type: "line",
    data: tempLowArray
  },{
    name: "Avreage",
    type: "line",
    data: tempAvgArray
  }],
  yaxis: {
    
  },
    chart: {
      type: "line",
      height: 250,
      group: "past",
      id: "tempPast",
      zoom: {
        allowMouseWheelZoom: false, 
      },
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
  xaxis: {
    categories: historyDatesArray,
    type: "dateTime",
  },
  fill: {
    opacity: 1
  },
  colors:["#ff3300", "#3399ff", "#ff7713"]
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

function updateCurrentCharts() {

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

function calculateDailySummary(tempArray, humArray) {
  // Filter out null values
  const validTemp = tempArray.filter(temp => temp !== null);
  const validHum = humArray.filter(hum => hum !== null);

  // Calculate summary statistics
  const dailySummary = {
    temperature: {
      average: validTemp.length > 0 
        ? Math.round(validTemp.reduce((a, b) => a + b, 0) / validTemp.length) 
        : null,
      lowest: validTemp.length > 0 
        ? Math.min(...validTemp) 
        : null,
      highest: validTemp.length > 0 
        ? Math.max(...validTemp) 
        : null
    },
    humidity: {
      average: validHum.length > 0 
        ? Math.round(validHum.reduce((a, b) => a + b, 0) / validHum.length) 
        : null,
      lowest: validHum.length > 0 
        ? Math.min(...validHum) 
        : null,
      highest: validHum.length > 0 
        ? Math.max(...validHum) 
        : null
    }
  };

  return dailySummary;
}

function saveDailySummaryToFirebase(db, date, summary) {
  // Create a reference to the daily summary in the database
  const dailySummaryRef = ref(db, `dailySummary/${date}`);

  // Save the summary
  set(dailySummaryRef, summary)
    .then(() => {
      console.log(`Previous day summary for ${date} saved successfully`);
    })
    .catch((error) => {
      console.error(`Error saving previous day summary for ${date}:`, error);
    });
}

function getPreviousDayDate() {
  // Create a date object for yesterday
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Format as YYYY-MM-DD
  return yesterday.toISOString().split('T')[0];
}

function collectAndSavePreviousDaySummary(db, tempArray, humArray) {
  // Get yesterday's date
  const previousDayDate = getPreviousDayDate();

  // Calculate daily summary
  const dailySummary = calculateDailySummary(tempArray, humArray);

  // Save to Firebase
  saveDailySummaryToFirebase(db, previousDayDate, dailySummary);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


onValue(dbHistoryRef, (snapshot) => {
  const value = snapshot.val();
  console.log("rawHistoryData", value);

  const { year, month, day } = getTime();
  const fixedDay = day.toString().padStart(2, "0");

  const currentDate = `${year}-${month.toString().padStart(2, "0")}-${fixedDay}`;
  const maxIterations = 100;
  let currentIterations = 0;

  let currentDateTime = new Date(currentDate);
  currentDateTime.setDate(currentDateTime.getDate() - 1); // Start en dag bakåt

  while (currentIterations < maxIterations) {
    const formattedDate = formatDate(currentDateTime);

    const historicalData = value[formattedDate];
    if (historicalData) {
      const dataHum = historicalData["humidity"];
      const dataTemp = historicalData["temperature"];

      if (dataHum) {
        if (!isNaN(dataHum.average)) humAvgArray.unshift(dataHum.average);
        if (!isNaN(dataHum.highest)) humHighArray.unshift(dataHum.highest);
        if (!isNaN(dataHum.lowest)) humLowArray.unshift(dataHum.lowest);
      }

      if (dataTemp) {
        if (!isNaN(dataTemp.average)) tempAvgArray.unshift(dataTemp.average);
        if (!isNaN(dataTemp.highest)) tempHighArray.unshift(dataTemp.highest);
        if (!isNaN(dataTemp.lowest)) tempLowArray.unshift(dataTemp.lowest);
      }

      historyDatesArray.unshift(formattedDate);
    }

    currentDateTime.setDate(currentDateTime.getDate() - 1); // Gå bakåt en dag
    currentIterations++;
  }

  console.log(humAvgArray, humHighArray, humLowArray, "hum");
  console.log(tempAvgArray, tempHighArray, tempLowArray, "temp");

  humComboChart.render();
  tempComboChart.render();
});

onValue(dbSensorRef, (snapshot) => {
  const value = snapshot.val();
  console.log("rawSensorData", value)
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
    
    hasBeenRenderd = true;
    updateCurrentCharts();
    collectAndSavePreviousDaySummary(db, tempArray, humArray);
    firstFetch = false;
  }
  else if (firstFetch === false && humArray.length === xAxisLength && tempArray.length === xAxisLength) {
    updateCurrentCharts();
  }
})