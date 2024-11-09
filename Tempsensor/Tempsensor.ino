#include <Wire.h>
#include <AM2320.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
AM2320 sensor;

#define OLED_RESET     -1
#define SCREEN_ADDRESS 0x3c
#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define NUM_SAMPLES 10    // Number of values when calculating average
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

void loop() {
    
  getTemp();
  getHum();
  displayValue();

  tempSerial();
  tempAvgSerial();
  humSerial();
  humAvgSerial();
  Serial.println();

    
 
  delay(500);
}