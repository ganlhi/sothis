#include <AccelStepper.h>

// LEDs pin
#define LEDS_PIN 3
#define PWM_MAX 168

// Motor pin definitions
#define MOTOR_PIN_1  9      // IN1 on the ULN2003 driver 1
#define MOTOR_PIN_2  10     // IN2 on the ULN2003 driver 1
#define MOTOR_PIN_3  11     // IN3 on the ULN2003 driver 1
#define MOTOR_PIN_4  12     // IN4 on the ULN2003 driver 1
#define HALFSTEP 8
#define CAP_CLOSED_POS 0
#define CAP_OPENED_POS 3072 // 0.75 revolution

// Initialize with pin sequence IN1-IN3-IN2-IN4 for using the AccelStepper with 28BYJ-48
AccelStepper stepper(HALFSTEP, MOTOR_PIN_1, MOTOR_PIN_3, MOTOR_PIN_2, MOTOR_PIN_4);

// Modes:
// 0 -> cap closed, leds off
// 1 -> cap closed, leds on
// 2 -> cap open, leds off
int mode = 0;
int nextMode = 0;

void setup() {
  stepper.setMaxSpeed(1000.0);
  stepper.setAcceleration(100.0);
  stepper.setSpeed(200);
  stepper.moveTo(CAP_CLOSED_POS);
  
  pinMode(LEDS_PIN, OUTPUT);
  analogWrite(LEDS_PIN, 0);

  Serial.begin(9600);
}

void loop() {

  // When ongoing movement is finished send mode number
  if (nextMode != mode) {
    if (stepper.distanceToGo() == 0) {
      mode = nextMode;
      Serial.write(mode);
    }
  }

  // Handle incoming messages
  if (Serial.available() > 0) {
    String msg = Serial.readString();

    switch (msg) {
      case "?":
        Serial.println(mode);
        break;
      case "1":
        stepper.moveTo(CAP_CLOSED_POS);
        analogWrite(LEDS_PIN, 0);
        nextMode = 1;
        break;
      case "2":
        stepper.moveTo(CAP_CLOSED_POS);
        analogWrite(LEDS_PIN, PWM_MAX);
        nextMode = 2;
        break;
      case "3":
        stepper.moveTo(CAP_OPENED_POS);
        analogWrite(LEDS_PIN, 0);
        nextMode = 3;
        break;
    }
  }

  stepper.run();
}
