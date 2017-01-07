var mqtt = require('mqtt')

class Mqtt {

    constructor(host, username, password, prefix, subscriptions) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.prefix = prefix;
        this.subscriptions = subscriptions;
        this.connect();
    }

    connect(){
        this.client = mqtt.connect('mqtt://' + this.host,{
            "username": this.username,
            "password": this.password,
            "reconnectPeriod": 100,
            "will":{
                "topic": this.prefix + 'online',
                "payload": "false",
                "retain" : true
            }
        })

        this.client.on('connect', () => {
            console.log("Connected");
            this.client.publish(this.prefix + 'online', 'true', {"retain": true})
            var subs = [];
            for (var sub of this.subscriptions) {
                subs.push(this.prefix + sub.topic);
            }
            this.client.subscribe(subs);
        });

        this.client.on('message', (topic, message) => {
            for (var sub of this.subscriptions) {
                if (this.prefix + sub.topic == topic){
                    sub.callback(message.toString());
                }
            }
            console.log("Received message ", message.toString(), "for topic", topic);
        });
    }   

    send(messages){
        for (var msg of messages) {
            this.client.publish(this.prefix + msg.topic, String(msg.message), {"retain": true});  
        }
        this.client.publish(this.prefix + "updated", String(Date.now()), {"retain": true});
        console.log("sent", messages);
    }
}

module.exports = Mqtt