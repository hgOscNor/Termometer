void getTemp(){
  if (sensor.measure()){
    SensorTemp = sensor.getTemperature();
        TempArray[0] = SensorTemp;
        Temp = SensorTemp;
      if (TempArray[0]!= 0){
        shiftArrayRight(TempArray, NUM_SAMPLES);
      } 
  }
  else{
    int errorCode = sensor.getErrorCode();
    switch (errorCode) {
     case 1: Serial.println("ERR: Sensor is offline"); break;
     case 2: Serial.println("ERR: CRC validation failed."); break;
    }  
  }
}

void getHum(){
  if (sensor.measure()){
    SensorHum = sensor.getHumidity();
      HumArray[0] = SensorHum;
      Hum = SensorHum;
    if (HumArray[0] != 0){
      shiftArrayRight(HumArray, NUM_SAMPLES);
    }
  }
  else{
    int errorCode = sensor.getErrorCode();
    switch (errorCode) {
     case 1: Serial.println("ERR: Sensor is offline"); break;
     case 2: Serial.println("ERR: CRC validation failed."); break;
    }  
  }
} 