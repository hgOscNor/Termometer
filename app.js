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
const xAxisLength = 50
let tempArray = []
let humArray = []
let humAvgArray = []
let humHighArray = []
let humLowArray = []
let tempAvgArray = []
let tempHighArray = []
let tempLowArray = []
let timestampArray = [];
let historyDatesArray = []
let firstFetch = true
let numberOfUpdates = 0

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
  stroke: {
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
  stroke: {
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
  }, {
    name: "Lowest",
    type: "line",
    data: humLowArray
  }, {
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
  stroke: {
    curve: "smooth"
  },
  colors: ['#0a0d76', '#66ccff', '#0099cc'],
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
  }, {
    name: "Lowest",
    type: "line",
    data: tempLowArray
  }, {
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
  stroke: {
    curve: "smooth"
  },
  xaxis: {
    categories: historyDatesArray,
    type: "dateTime",
  },
  fill: {
    opacity: 1
  },
  colors: ["#ff3300", "#3399ff", "#ff7713"]
}

var chartLine2 = new ApexCharts(document.querySelector("#chart-line2"), optionsHum);
var chart = new ApexCharts(document.querySelector("#chart"), optionsTemp);
var humComboChart = new ApexCharts(document.querySelector("#humComboChart"), optionsHumCombo);
var tempComboChart = new ApexCharts(document.querySelector("#tempComboChart"), optionsTempCombo);


function getTime() {
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
  chart.updateSeries([{ data: tempArray}]);
  chartLine2.updateSeries([{ data: humArray }]);

  console.log(humArray, "%")
  console.log(tempArray, "C")
  console.log(timestampArray)
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


function hasValidTempValues(value) {
  return value?.tempIrr || value?.tempAvg;
}
function hasValidHumValues(value) {
  return value?.humIrr || value?.humAvg;
}

function getTempValue(value) {
  if(hasValidTempValues(value)){
    if(value.tempIrr){
      return value.tempIrr
    }
    else{
      return value.tempAvg
    }
  }
  if (tempArray.length > 0) {
    return tempArray[tempArray.length -1]
  }
  else {
   return null
  }
}
function getHumValue(value) {
  if(hasValidHumValues(value)){
    if(value.humIrr){
      return value.humIrr
    }
    else{
      return value.humAvg
    }
  }
  if (humArray.length > 0){
    return humArray[humArray.length - 1]
  }
  else {
    return null
  }
}
function findLatestData(value, currentTime, xAxisLength) {
  const maxIterations = 100000;
  let iterationCount = 0;
  let { year, month, day, hour, minute, second } = currentTime;

  while (tempArray.length - numberOfUpdates < xAxisLength && iterationCount < maxIterations) {

      const dataAtTimestamp = value?.[year]?.[month]?.[day]?.[hour]?.[minute]?.[second];

    if (firstFetch === false) {
      if (dataAtTimestamp) {
        tempArray.push(getTempValue(dataAtTimestamp))
        if (tempArray.length > xAxisLength) {
          tempArray.shift()
        }
        humArray.push(getHumValue(dataAtTimestamp))
        if (humArray.length > xAxisLength) {
          humArray.shift()
        }
        
        // Timestamp processing - format as HH:MM:SS
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
        timestampArray.push(formattedTime);
        if (timestampArray.length > xAxisLength) {
          timestampArray.shift()

          break;
        }
      }
    }
      else{ //run at startup
        if (dataAtTimestamp) {
          if(timestampArray.length>=xAxisLength){ 
              break
            }
          tempArray.unshift(getTempValue(dataAtTimestamp))
          if (tempArray.length > xAxisLength) {
            tempArray.pop()
          }
          humArray.unshift(getHumValue(dataAtTimestamp))
          if (humArray.length > xAxisLength) {
            humArray.pop()
          }
          
          // Timestamp processing - format as HH:MM:SS
          const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
          timestampArray.unshift(formattedTime);
          if (timestampArray.length > xAxisLength) {
            timestampArray.pop();
        }
      }
    

    // Decrement time

    ({ year, month, day, hour, minute, second } = decrementTime({
      year, month, day, hour, minute, second
    }));


    iterationCount++;
  }}

  numberOfUpdates = 1

  console.log(`Processed ${iterationCount} iterations`);
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


});

async function timeout(time) {
  setTimeout(time)
}

onValue(dbSensorRef, (snapshot) => {
  const value = snapshot.val();
  console.log("rawSensorData", value)
  findLatestData(value, getTime(), xAxisLength);

  // tempArray = result.tempArray;
  // humArray = result.humArray;
  // timestampArray = result.timestampArray;

  document.getElementById("currentHum").innerHTML = "Current humidity: " + humArray[humArray.length - 1] + "%"
  document.getElementById("currentTemp").innerHTML = "Current tempature: " + tempArray[tempArray.length - 1] + "&deg;C"

  // Ensure charts are rendered and data is complete
  if (firstFetch === true && humArray.length === xAxisLength && tempArray.length === xAxisLength) {
    chart.render();
    chartLine2.render();
    humComboChart.render();
    tempComboChart.render();
    updateCurrentCharts();
    collectAndSavePreviousDaySummary(db, tempArray, humArray);
    firstFetch = false;
  }
  else if (firstFetch === false && humArray.length === xAxisLength && tempArray.length === xAxisLength) {
    updateCurrentCharts();
  }
  let t = timeout(1000)
  t.then
})