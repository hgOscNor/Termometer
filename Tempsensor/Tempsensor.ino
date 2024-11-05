#include <Wire.h>
#include <AM2320.h>

AM2320 sensor;

float SensorTemp;
float SensorHum;

void setup() {
    Serial.begin(9600);
    Wire.begin(14, 12);
    delay(5000);
}

void getTempHum() {
    if (sensor.measure()) {
        SensorTemp = sensor.getTemperature();
        Serial.print("Temperature: ");
        Serial.println(SensorTemp);
        if (SensorTemp > 27) {
            Serial.println("Dålig andedräkt!!!!");
        }

        SensorHum = sensor.getHumidity();
        Serial.print("Humidity: ");
        Serial.println(SensorHum);
    } else {
        int errorCode = sensor.getErrorCode();
        switch (errorCode) {
            case 1: Serial.println("ERR: Sensor is offline"); break;
            case 2: Serial.println("ERR: CRC validation failed."); break;
        }
    }
}

void loop() {
    getTempHum();
    delay(500);
}
