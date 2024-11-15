#include <FirebaseESP8266.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiGratuitous.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <WiFiServer.h>
#include <WiFiServerSecure.h>
#include <WiFiUdp.h>

#include <Wire.h>
#include <AM2320.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
AM2320 sensor;

#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3c
#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels


Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define timeBetweenUploads 10
#define NUM_SAMPLES 10    // Number of values when calculating average
float SensorTemp;
float SensorHum;
float Temp;
float Hum;
float TempArray[NUM_SAMPLES];
float HumArray[NUM_SAMPLES];
int currentIndexTemp = 0;
int currentIndexHum = 0;
int a = 0;
bool isRegular;

enum class DataType { Hum, Temp, HumAvg, TempAvg, HumIrr, TempIrr};

FirebaseData firebaseData;

void wifiSetup(){
  


  #define STASSID "Hitachigymnasiet_2.4"  //ssid
  #define STAPSK "mittwifiarsabra"        //wifi password

  Serial.print("Connecting to");
  Serial.print(STASSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void firebaseSetup(){
  #define FIREBASE_HOST "https://i-hetaste-laget-ead3c-default-rtdb.europe-west1.firebasedatabase.app/"  // Din databas URL
  #define FIREBASE_AUTH "AIzaSyCQDevcOGsNzQTy0F63KP5b3DJQOjmH3jk"     // Din API-nyckel

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  
  }

void setup() {
    Serial.begin(9600);
    Wire.begin(14, 12);
    wifiSetup();
    firebaseSetup();

   // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.display();
  delay(1000);
  display.clearDisplay();
}

void firebaseUploadData(float data){
   if (Firebase.setInt(firebaseData, "/sensor/value", data)) {
    Serial.println("Data skickat till Firebase");
  } else {
    Serial.print("Failed to send data: ");
    Serial.println(firebaseData.errorReason());
  }
  }

void firebaseUploadTempAVG(float data){
   if (Firebase.setInt(firebaseData, "/sensor/TempAVG", data)) {
    Serial.println("Data skickat till Firebase");
  } else {
    Serial.print("Failed to send data: ");
    Serial.println(firebaseData.errorReason());
  }
  }

void firebaseUploadHumAVG(float data){
   if (Firebase.setInt(firebaseData, "/sensor/HumAVG", data)) {
    Serial.println("Data skickat till Firebase");
  } else {
    Serial.print("Failed to send data: ");
    Serial.println(firebaseData.errorReason());
  }
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

void tempSerial(){
  Serial.print("Temp: ");
  Serial.print(Temp);
  Serial.print("°C");
}

void humSerial(){
  Serial.print(" Hum: ");
  Serial.print(Hum);
  Serial.print("%");
}

void tempAvgSerial(){
  Serial.print(" Average Temp: ");
  Serial.print(calculateAverage(TempArray));
  Serial.print("°C");
}

void humAvgSerial(){
  Serial.print(" Average Hum: ");
  Serial.print(calculateAverage(HumArray));
  Serial.print("%");
}

bool checkForIrregularValue(const float list[NUM_SAMPLES], const float otherValue, DataType dataType) {
    // Beräkna medelvärdet av de första tre elementen
    float value = (list[0] + list[1] + list[2]) / 3;

    // Räkna ut absolutvärdet av skillnaden manuellt
    float difference = value - otherValue;
    if (difference < 0) {
        difference = -difference;
    }

    // Kontrollera om skillnaden är mindre än eller lika med 1.0
    if (difference >= 1.0 && dataType == DataType::Temp) {
      Serial.println();
      Serial.print("Irregular temp: ");
      Serial.print(difference);
      Serial.print("C");
      return true;
    }
    else if (difference >= 5.0 && dataType == DataType::Hum) {
      Serial.println();
      Serial.print("Irregular hum: ");
      Serial.print(difference);
      Serial.print("%");
      return true;
    }
    else{
      return false;
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
  checkForIrregularValue(TempArray, calculateAverage(TempArray), DataType::Temp);
  checkForIrregularValue(HumArray, calculateAverage(HumArray), DataType::Hum);
  Serial.println();
    if(a >= NUM_SAMPLES){
       firebaseUploadTempAVG(calculateAverage(TempArray));
       firebaseUploadHumAVG(calculateAverage(HumArray));
       a = 0;
      }
    else{a++;}
  Serial.print("it works")
  
    
 
  delay(1000);
}
