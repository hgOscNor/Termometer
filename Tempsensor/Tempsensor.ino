#include <Wire.h>
#include <AM2320.h>

AM2320 sensor;

float SensorTemp;
float SensorHum;
float Temp;
float Hum;

void setup() {
    Serial.begin(9600);
    Wire.begin(14, 12);
    delay(5000);
}

void getTempHum() {
    if (sensor.measure()) {
        SensorTemp = sensor.getTemperature();

       

        
        if (SensorTemp > 27) {
            Serial.println("Dålig andedräkt!!!!");
        }

        SensorHum = sensor.getHumidity();
        
    } else {
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
    Serial.print(Hum);
    delay(100);
}
