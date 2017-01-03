#include<Wire.h>

#define EXTENDER_ADDR_LEDS 32
#define EXTENDER_ADDR_RELAYS 33
#define EXTENDER_ADDR_BUTTONS 37

#define ROOF_OPEN_RELAY 5
#define ROOF_CLOSE_RELAY 6

byte relays_state[8] = { 0, 0, 0, 0, 0, 0, 0, 0 };
byte next_relays_state[8] = { 0, 0, 0, 0, 0, 0, 0, 0 };

void setup() {
  Serial.begin(9600);

  // Setup i2c connections
  Wire.begin();
}

void loop() {
  // Check if serial messages await
  process_messages();

  // Check if i2c messages await
  poll_i2c_buttons();

  // Roof logic
  apply_roof_logic();

  // Apply new state
  apply_state();
}

void process_messages() {
  String msg;

  while (Serial.available() > 0) {
    msg = Serial.readString();

    for (int i = 0; i <= 7; i++) {
      if (msg == "?:" + i) {
        print_relay(i);
        break;
      }
      if (msg == "R:" + i + ":0") {
        set_relay(i, 0);
        break;
      }
      if (msg == "R:" + i + ":1") {
        set_relay(i, 1);
        break;
      }
    }
  }
}

void poll_i2c_buttons() {
  Wire.requestFrom(EXTENDER_ADDR_BUTTONS, 1);

  if (Wire.available())
  {
      byte msg = Wire.receive();

      if (msg & 1)   toggle_relay(0);
      if (msg & 2)   toggle_relay(1);
      if (msg & 4)   toggle_relay(2);
      if (msg & 8)   toggle_relay(3);
      if (msg & 16)  toggle_relay(4);
      if (msg & 32)  toggle_relay(5);
      if (msg & 64)  toggle_relay(6);
      if (msg & 128) toggle_relay(7);
  }
}

void toggle_relay(num) {
  set_relay(num, 1 - next_relays_state[num]);
}

void set_relay(num, status) {
  next_relays_state[num] = status;
}

void print_relay(num) {
  Serial.println("R:"+num+":"+relays_state[num]);
}

void apply_roof_logic() {
  // Only one active at a time
  if (relays_state[ROOF_OPEN_RELAY] == 1) {
    if (next_relays_state(ROOF_CLOSE_RELAY) == 1) {
      next_relays_state[ROOF_OPEN_RELAY] = 0;
    }
  }

  if (relays_state[ROOF_CLOSE_RELAY] == 1) {
    if (next_relays_state(ROOF_OPEN_RELAY) == 1) {
      next_relays_state[ROOF_CLOSE_RELAY] = 0;
    }
  }
}

void apply_state() {
  memcpy(relays_state, next_relays_state, sizeof(next_relays_state));

  int msg = atoi(relays_state);

  Wire.beginTransmission(EXTENDER_ADDR_RELAYS);
  Wire.send(msg);
  Wire.endTransmission();

  Wire.beginTransmission(EXTENDER_ADDR_LEDS);
  Wire.send(msg);
  Wire.endTransmission();

  for (int i = 0; i <= 7; i++) {
    print_relay(i);
  }
}
