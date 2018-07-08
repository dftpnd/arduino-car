#include "ArduinoJson.h"

char dataString[50] = {0};
 

#define SPEED_1      5 
#define DIR_1        4
 
#define SPEED_2      6
#define DIR_2        7

void setup() {

Serial.begin(9600);

  
for(int i = 4; i < 8; i++)     
      pinMode(i, OUTPUT); 
}
  
void loop() {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(Serial);


  int signal = root["signal"];
  int leftSpeed = root["leftSpeed"];
  int rightSpeed = root["rightSpeed"];
  int leftDirection = root["leftDirection"];
  int rightDirection = root["rightDirection"];

  if(signal > 0)
  {
    analogWrite(SPEED_1,  rightSpeed);  
    analogWrite(SPEED_2,  leftSpeed);

    if(leftDirection == 1)
      digitalWrite(DIR_1, HIGH);

    if(leftDirection == 2)
      digitalWrite(DIR_1, LOW);


    if(rightDirection == 1)
      digitalWrite(DIR_2, HIGH);

    if(rightDirection == 2)
      digitalWrite(DIR_2, LOW);
    
  }
  
}
