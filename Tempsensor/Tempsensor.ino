#include <Wire.h>
#include <AM2320.h>

AM2320 sensor;

#define NUM_SAMPLES 10
float SensorTemp;
float SensorHum;
float Temp;
float Hum;
float TempArray[NUM_SAMPLES];
float HumArray[NUM_SAMPLES];
int currentIndexTemp = 0;
int currentIndexHum = 0;



float calculateAverage(const float Values[NUM_SAMPLES]){ //räkna medelvärde
  float sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++){
    sum += Values[i];

  }
  return sum / NUM_SAMPLES;
}

void shiftArrayRight(float array[], int size){
  for(int i = size - 1; i > 0; i--){
    array[i] = array[i - 1];
  }
}

void resetArray(float Array[]) {
  int filledCount = 0;

  // Count the number of non-zero elements
  for (int i = 0; i < NUM_SAMPLES; i++) {
    if (Array[i] != 0) {
      filledCount++;
    }
  }

  // Reset only if there are NUM_SAMPLES or more non-zero elements
  if (filledCount >= NUM_SAMPLES) {
    for (int i = 0; i < NUM_SAMPLES; i++) {
      Array[i] = 0;
      yield();
    }
  }
}

void setup() {
    Serial.begin(9600);
    Wire.begin(14, 12);
    delay(5000);
}


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



void loop() {
    
    getTemp();
    getHum();

    Serial.print("Temp: ");
    Serial.print(Temp);
    Serial.print("°C");
    Serial.print(" Average Temp: ");
    Serial.print(calculateAverage(TempArray));
    Serial.print("°C");
    Serial.print(" Hum: ");
    Serial.print(Hum);
    Serial.print("%");
    Serial.print(" Average Hum: ");
    Serial.print(calculateAverage(HumArray));
    Serial.print("%");
    Serial.println();

    
    delay(500);
}