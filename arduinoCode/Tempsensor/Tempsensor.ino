#include <FirebaseESP8266.h>
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <AM2320.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <string>
AM2320 sensor;

#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3c
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
WiFiUDP ntpUDP;
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define timeBetweenUploads 10
#define NUM_SAMPLES 10 // Number of values when calculating average
float SensorTemp;
float SensorHum;
float Temp;
float Hum;
float TempArray[NUM_SAMPLES];
float HumArray[NUM_SAMPLES];
float TempLatestThree[3];
float HumLatestThree[3];
int currentIndexTemp = 0;
int currentIndexHum = 0;
int a = 0;
int currentDay;
int currentHour;
int currentMin;
int monthDay;
int currentMonth;
int currentYear;
std::string currentDate;
int currentSec;
bool isRegular;

enum class DataType{
  Hum,
  Temp,
  HumAvg,
  TempAvg,
  HumIrr,
  TempIrr,
  DebugOnline
};

NTPClient timeClient(ntpUDP, "pool.ntp.org");
FirebaseData firebaseData;

void wifiSetup(){
#define STASSID "Hitachigymnasiet_2.4" // ssid
#define STAPSK "mittwifiarsabra"       // wifi password

  Serial.print("Connecting to");
  Serial.print(STASSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void firebaseSetup(){
#define FIREBASE_HOST "https://i-hetaste-laget-ead3c-default-rtdb.europe-west1.firebasedatabase.app/" // Din databas URL
#define FIREBASE_AUTH "AIzaSyCQDevcOGsNzQTy0F63KP5b3DJQOjmH3jk"                                       // Din API-nyckel

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void setup(){
  Serial.begin(9600);
  Wire.begin(14, 12);
  wifiSetup();
  firebaseSetup();
  timeClient.begin();
  timeClient.setTimeOffset(3600);
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS))
  {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ; // Don't proceed, loop forever
  }

  display.display();
  delay(1000);
  display.clearDisplay();
}

void firebaseUploadData(float data, DataType dataType){
  if(dataType == DataType::Hum){

  }
  else if(dataType == DataType::Temp){
    if (Firebase.setInt(firebaseData, "/sensor/temp", data))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
  else if(dataType == DataType::Hum){
    if (Firebase.setInt(firebaseData, "/sensor/"+ std::string(currentDate) +"/hum", data))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
  else if(dataType == DataType::TempAvg){
    if (Firebase.setInt(firebaseData, "/sensor/" + std::string(currentDate) + "/tempAvg", data))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
    else if(dataType == DataType::HumAvg){
    if (Firebase.setInt(firebaseData, "/sensor/" + std::string(currentDate) + "/humAvg", data))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
  else if(dataType == DataType::HumIrr){
    if (Firebase.setInt(firebaseData, "/sensor/" + std::string(currentDate) + "/humIrr", data))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
  else if(dataType == DataType::TempIrr){
    if (Firebase.setInt(firebaseData, "/sensor/" + std::string(currentDate) + "/tempIrr", data))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
    else if(dataType == DataType::DebugOnline){
    if (Firebase.setInt(firebaseData, "/debug/online", true))
    {
      Serial.println("Data skickat till Firebase");
    }
    else
    {
      Serial.print("Failed to send data: ");
      Serial.println(firebaseData.errorReason());
    }
  }
}

float calculateAverage(const int index, const float Values[NUM_SAMPLES]){ // räkna medelvärde
  float sum = 0;
  for (int i = 0; i < index; i++){
    sum += Values[i];
  }
  return sum / index;
}

void shiftArrayRight(float array[], int size){
  for (int i = size - 1; i > 0; i--)
  {
    array[i] = array[i - 1];
  }
}

void getTemp(){
  if (sensor.measure())
  {
    SensorTemp = sensor.getTemperature();
    TempArray[0] = SensorTemp;
    Temp = SensorTemp;
    if (TempArray[0] != 0)
    {
      shiftArrayRight(TempArray, NUM_SAMPLES);
      shiftArrayRight(TempLatestThree, 3);
    }
  }
  else
  {
    int errorCode = sensor.getErrorCode();
    switch (errorCode)
    {
    case 1:
      Serial.println("ERR: Sensor is offline");
      break;
    case 2:
      Serial.println("ERR: CRC validation failed.");
      break;
    }
  }
}

void getHum(){
  if (sensor.measure())
  {
    SensorHum = sensor.getHumidity();
    HumArray[0] = SensorHum;
    Hum = SensorHum;
    if (HumArray[0] != 0)
    {
      shiftArrayRight(HumArray, NUM_SAMPLES);
      shiftArrayRight(HumLatestThree, 3);
    }
  }
  else
  {
    int errorCode = sensor.getErrorCode();
    switch (errorCode)
    {
    case 1:
      Serial.println("ERR: Sensor is offline");
      break;
    case 2:
      Serial.println("ERR: CRC validation failed.");
      break;
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
  Serial.print(calculateAverage(NUM_SAMPLES, TempArray));
  Serial.print("°C");
}

void humAvgSerial(){
  Serial.print(" Average Hum: ");
  Serial.print(calculateAverage(NUM_SAMPLES, HumArray));
  Serial.print("%");
}

void updateTime(){
  timeClient.update();
  time_t epochTime = timeClient.getEpochTime();
  currentDay = timeClient.getDay();
  currentHour = timeClient.getHours();
  currentMin = timeClient.getMinutes();
  currentSec = timeClient.getSeconds();
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  monthDay = ptm->tm_mday;
  currentMonth = ptm->tm_mon+1;
  currentYear = ptm->tm_year+1900;
  currentDate = std::to_string(currentYear) +"/"+ std::to_string(currentMonth) +"/"+ std::to_string(monthDay) +"/"+ std::to_string(currentHour) +"/"+ std::to_string(currentMin) +"/"+ std::to_string(currentSec);
}

bool checkForIrregularValue(const float list[NUM_SAMPLES], const float otherValue, DataType dataType){
  // Beräkna medelvärdet av de första tre elementen
  float value = (list[0] + list[1] + list[2]) / 3;

  // Räkna ut absolutvärdet av skillnaden manuellt
  float difference = value - otherValue;
  if (difference < 0)
  {
    difference = -difference;
  }

  // Kontrollera om skillnaden är mindre än eller lika med 1.0
  if (difference >= 1.0 && dataType == DataType::Temp)
  {
    Serial.println();
    Serial.print("Irregular temp: ");
    Serial.print(difference);
    Serial.println("C");
    return true;
  }
  else if (difference >= 5.0 && dataType == DataType::Hum)
  {
    Serial.println();
    Serial.print("Irregular hum: ");
    Serial.print(difference);
    Serial.println("%");
    return true;
  }
  else
  {
    return false;
  }
}

void loop(){
  updateTime();
  getTemp();
  getHum();
  displayValue();
  tempSerial();
  tempAvgSerial();
  humSerial();
  humAvgSerial();
  if(checkForIrregularValue(TempArray, calculateAverage(NUM_SAMPLES, TempArray), DataType::Temp) == true){
    firebaseUploadData(Temp, DataType::TempIrr);
  }
  if(checkForIrregularValue(HumArray, calculateAverage(NUM_SAMPLES, HumArray), DataType::Hum) == true){
    firebaseUploadData(Hum, DataType::HumIrr);
  }
  Serial.println();
  if (a >= NUM_SAMPLES){
    firebaseUploadData(calculateAverage(NUM_SAMPLES, TempArray), DataType::TempAvg);
    firebaseUploadData(calculateAverage(NUM_SAMPLES, HumArray), DataType::HumAvg);
    a = 0;
  }
  else{
    a++;
  }
  firebaseUploadData(true, DataType::DebugOnline);
  delay(10000);
}

// :3
