#include <Wire.h>
#include <AM2320.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
AM2320 sensor;

#define OLED_RESET     -1
#define SCREEN_ADDRESS 0x3c
#define NUM_SAMPLES 10 // Number of values when calculating average
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
float SensorTemp;
float SensorHum;
float Temp;
float Hum;
float TempArray[NUM_SAMPLES];
float HumArray[NUM_SAMPLES];
int currentIndexTemp = 0;
int currentIndexHum = 0;


void setup() {
    Serial.begin(9600);
    Wire.begin(14, 12);

      // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.display();
  delay(1000);
  display.clearDisplay();
}



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

void displayValue(){
  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 0);
  display.print(Temp);
  display.print("C");
  display.setCursor(10, 20);
  display.print(Hum);
  display.print("%");
  display.display();
}

void loop() {
    
    getTemp();
    getHum();
    displayValue();

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