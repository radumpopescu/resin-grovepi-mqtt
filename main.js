let host = process.env.MQTT_HOST;
let user = process.env.MQTT_USER;
let password = process.env.MQTT_PASS;
let prefix = process.env.MQTT_PREFIX;

let Pi = require('./pi.js');
let Mqtt = require('./mqtt.js');

var pi = new Pi()
var mqtt = new Mqtt(host, user, password, prefix, [
		{
			"topic": "relay",
			"callback": relayCB
		}
	]);

function relayCB(message){
	if (message === "on"){
		pi.setRelay(true);
		console.log("Turning on");
	}
	else{
		pi.setRelay(false);
		console.log("Turning off");
	}
}


setInterval(update, 5000);

function update(){
	data = pi.getData();
	mqtt.send([
		{
			"topic": "light",
			"message": data.light
		}, 
		{
			"topic": "temperature",
			"message": data.temp
		}, 
		{
			"topic": "humidity",
			"message": data.humidity
		}
	]);
}



