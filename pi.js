var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var DHTDigitalSensor = GrovePi.sensors.DHTDigital
var GenericDigitalOutputSensor = GrovePi.sensors.DigitalOutput

class Pi {
    constructor() {
        var that = this;
        this.board = new Board({
            debug: true,
            onError: function(err) {
                console.log('Something wrong just happened... ', err)
            },
            onInit: function(res) {
                if (res) {
                    that.light = new LightAnalogSensor(0);
                    that.temp = new DHTDigitalSensor(4, DHTDigitalSensor.VERSION.DHT22, DHTDigitalSensor.CELSIUS)
                    that.relay = new GenericDigitalOutputSensor(7)
                }
            }
        })
        this.board.init();
    }

    getData(){
        var tempData = this.temp.read();
        return {
            "light": this.light.read(),
            "temp": tempData[0],
            "humidity": tempData[1]
        }
    }

    setRelay(status){
        if (status){
            this.relay.turnOn();
        }
        else{
            this.relay.turnOff();
        }

    }
}

module.exports = Pi