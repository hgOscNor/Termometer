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

float calculateAverage(const float Values[NUM_SAMPLES]) { // Räkna medelvärde
  float sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    sum += Values[i];
  }
  return sum / NUM_SAMPLES;  // Ändrat från 10 till NUM_SAMPLES
}

void resetArray(float Array[], int Size) { // Reset array
  for (int i = 0; i < Size; i++) {
    Array[i] = 0;
  }
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
    currentIndexTemp = (currentIndexTemp + 1) % NUM_SAMPLES;  // Hantera indexcirkulering

    HumArray[currentIndexHum] = SensorHum;
    currentIndexHum = (currentIndexHum + 1) % NUM_SAMPLES;  // Hantera indexcirkulering
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

  Serial.print("Temp: ");
  Serial.print(Temp);
  Serial.print(" Average Temp: ");
  Serial.print(calculateAverage(TempArray));
  Serial.print(" Hum: ");
  Serial.print(Hum);
  Serial.print(" Average Hum: ");
  Serial.print(calculateAverage(HumArray));
  Serial.println();

  delay(500);
}
