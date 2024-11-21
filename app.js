import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, onValue, ref, child, push, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

var options = {
  chart: {
    type: 'line'
  },
  series: [{
    name: 'sales',
    data: [30,40,35,50,49,60,70,91,125]
  }],
  xaxis: {
    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
  },
  stroke: {
    curve: 'smooth',
  },
  markers: {
    size: 5,
  }
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

// ... rest of your code
const dbRootRef = ref(db);
const dbSensorRef = ref(db, "sensor")
const dbDebugRef = ref(db, "Debug")
let humAvg

onValue(dbSensorRef, (snapshot) => {
  const data = snapshot.val();
  humAvg = parseFloat(data.HumAVG.toFixed(1))
  document.getElementById("hum").innerHTML = humAvg + "%"
  },
  (error) => {
  console.error("Error reading data:", error);
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let i = 0

async function voidLoop() {
  while(true == true){
    console.log(humAvg + " %")

    await delay(1000)
  }
}

voidLoop()