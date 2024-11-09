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