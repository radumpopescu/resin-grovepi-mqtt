var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var DHTDigitalSensor = GrovePi.sensors.DHTDigital

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
            // GenericDigitalOutputSensor has a bug so turning it manually
            this.board.pinMode(7, this.board.OUTPUT)
            this.board.writeBytes([2, 7, 1, 0]);
        }
        else{
            this.board.pinMode(7, this.board.OUTPUT)
            this.board.writeBytes([2, 7, 0, 0]);
        }

    }
}

module.exports = Pi