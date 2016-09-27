#include<Wire.h>
#include<DHT.h>

#define EXTENDER_ADDR_LEDS 32
#define EXTENDER_ADDR_RELAYS 33
#define EXTENDER_ADDR_BUTTONS 37

#define ULTRA_1_TRIG 9
#define ULTRA_1_ECHO 10
#define ULTRA_2_TRIG 11
#define ULTRA_2_ECHO 12

#define DHT_READ_INTERVAL 10000;
#define DHT22_INT 6
#define DHT22_EXT 7
#define FAN_RELAY 8

#define ROOF_OPEN_RELAY 5
#define ROOF_CLOSE_RELAY 6
#define ROOF_LOCK_RELAY 7

enum RoofState { OPENED, CLOSED, OPENING, CLOSING };
RoofState roof_state = CLOSED;

byte relays_state[8] = { 0, 0, 0, 0, 0, 0, 0, 0 };
byte next_relays_state[8] = { 0, 0, 0, 0, 0, 0, 0, 0 };

long ultra_1_cm = 999;
long ultra_2_cm = 999;

DHT dht_int(DHT22_INT, DHT22);
DHT dht_ext(DHT22_EXT, DHT22);

unsigned long previousRead = 0;
float temp_int;
float hum_int;
float temp_ext;
float hum_ext;
byte fan_state;

void setup() {
  Serial.begin(9600);

  // Setup i2c connections
  Wire.begin();

  // Ultrasonic sensors
  pinMode(ULTRA_1_TRIG, OUTPUT); 
  digitalWrite(ULTRA_1_TRIG, LOW); 
  pinMode(ULTRA_1_ECHO, INPUT); 

  pinMode(ULTRA_2_TRIG, OUTPUT); 
  digitalWrite(ULTRA_2_TRIG, LOW); 
  pinMode(ULTRA_2_ECHO, INPUT); 

  // DHT22 sensors + fan relay
  dht_int.begin();
  dht_ext.begin();
  pinMode(FAN_RELAY, OUTPUT);

  // Init startup values
  set_relay(ROOF_CLOSE_RELAY, 1);
  set_relay(ROOF_LOCK_RELAY, 1);
}

void loop() {
  // Check if serial messages await


  // Check if i2c messages await
  poll_i2c_buttons();

  // Get temp and hum values
  read_dhts();

  // Check business rules
  check_hum_diff();
  check_roof_clearance();

  // Apply new state
  apply_state();
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

void apply_state() {
  memcpy(relays_state, next_relays_state, sizeof(next_relays_state));

  int msg = atoi(relays_state);

  Wire.beginTransmission(EXTENDER_ADDR_RELAYS);
  Wire.send(msg);
  Wire.endTransmission();

  Wire.beginTransmission(EXTENDER_ADDR_LEDS);
  Wire.send(msg);
  Wire.endTransmission();

  digitalWrite(FAN_RELAY, fan_state);
}

void read_ultras() {
  long echo;

  digitalWrite(ULTRA_1_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRA_1_TRIG, LOW);
  echo = pulseIn(ULTRA_1_ECHO, HIGH);
  ultra_1_cm = echo / 58;

  digitalWrite(ULTRA_2_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRA_2_TRIG, LOW);
  echo = pulseIn(ULTRA_2_ECHO, HIGH);
  ultra_2_cm = echo / 58;
}

void read_dhts() {
  float t;
  float h;

  unsigned long currentMillis = millis();

  if (currentMillis - previousRead >= DHT_READ_INTERVAL) {
    previousRead = currentMillis;

    // Interior
    t = dht_int.readTemperature();
    h = dht_int.readHumidity();
  
    if (!isnan(t) && !isnan(h)) {
      temp_int = t;
      hum_int = h;
    }

    // Exterior
    t = dht_ext.readTemperature();
    h = dht_ext.readHumidity();
  
    if (!isnan(t) && !isnan(h)) {
      temp_ext = t;
      hum_ext = h;
    }
  }
}

void check_hum_diff() {
  float diff = hum_int - hum_ext;
  fan_state = (diff >= 5) ? 1 : 0;
}

void check_roof_clearance() {
  if (next_relays_state[ROOF_CLOSE_RELAY] || next_relays_state[ROOF_OPEN_RELAY]) {
    read_ultras();
    if (ultra_1_cm < 100 || ultra_2_cm < 100) {
      set_relay(ROOF_CLOSE_RELAY, 0);
      set_relay(ROOF_OPEN_RELAY, 0);
    }
  }
}