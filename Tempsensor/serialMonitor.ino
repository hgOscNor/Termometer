


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