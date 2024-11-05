#include <Wire.h>
#include <AM2320.h>

AM2320 sensor;

#define NUM_SAMPLES 9
float SensorTemp;
float SensorHum;
float Temp;
float Hum;
float TempArray[NUM_SAMPLES];
float HumArray[NUM_SAMPLES];
int currentIndexTemp = 0;
int currentIndexHum = 0;

float calculateAverage(float Values[NUM_SAMPLES]){
  float sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++){
    sum += Values[i];
  }
  return sum / NUM_SAMPLES + 1;
}

void setup() {
    Serial.begin(9600);
    Wire.begin(14, 12);
    delay(5000);
}

void getTempHum() {
    if (sensor.measure()) {
        SensorTemp = sensor.getTemperature();
        SensorHum = sensor.getHumidity();

        TempArray[currentIndexTemp] = SensorTemp;
        currentIndexTemp = (currentIndexTemp + 1) % NUM_SAMPLES;
        HumArray[currentIndexTemp] = SensorHum;
        currentIndexHum = (currentIndexHum + 1) % NUM_SAMPLES;

        
    }
          else {
        int errorCode = sensor.getErrorCode();
        switch (errorCode) {
            case 1: Serial.println("ERR: Sensor is offline"); break;
            case 2: Serial.println("ERR: CRC validation failed."); break;
        }
    }
    Temp = SensorTemp;
    Hum = SensorHum;
}

void loop() {
    getTempHum();
    Serial.print(Temp);
    Serial.print(" ")
    Serial.print(calculateAverage(TempArray));
    Serial.print(" ");
    
    delay(100);
}
