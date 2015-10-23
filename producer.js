//~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --new-produr --topic TutorialTopic1  > /dev/null

var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
var uuid = require('uuid');

var kafkacluster = process.env.KAFKACLUSTER || 'dev-scamall-01.br.rd.hpicorp.net'; // TODO remove this hardcoded sensitive info

var client = new kafka.Client(kafkacluster, uuid.v1());
var producer = new HighLevelProducer(client, {
    requireAcks: 1,
    ackTimeoutMs: 100
});

exports.closeproducer = function (){
    producer.close();
}


exports.produce = function (topic, partition, message, callback) {
    // Just copied this here to keep the old functionality

    //console.log('Producing message : ' + message + ' on partition ' + partition);

    var key = 'some_key';
    var count = 10, rets = 0;

    var payload = {
            id: uuid.v1(),
            type: 'TBD',
            payload: message,
            timestamp: new Date().toString()
        };
    var km = new KeyedMessage(key, JSON.stringify(payload));

    var payloads = [{
        topic: topic,
        messages: [km],
        partition: partition
    }];

    producer.on('ready', function() {
        var req1 = producer.send(payloads, function(err, data) {
            callback(err, data);
//            producer.close();
        });
    });

    producer.on('error', function(err) {
        console.log("-----------------> OnERRORe");
        console.log(err);
        // process.exit(1);
    })
};

// var kafkacluster = process.env.KAFKACLUSTER || 'localhost';

// var uuid = require('uuid');

// var topic = process.argv[2] || 'TutorialTopic';
// var partition = process.argv[3] || -1;
// var key = process.argv[4] || 'some_key';
// var message = process.argv[5] || 'some_message';

// var count = 10, rets = 0;

// var kafka = require('kafka-node'),
//     HighLevelProducer = kafka.HighLevelProducer,
//     KeyedMessage = kafka.KeyedMessage,
//     client = new kafka.Client(kafkacluster, uuid.v1()),
//     producer = new HighLevelProducer(client, {
//         requireAcks: 1,
//         ackTimeoutMs: 100
//     }),
//     payload = {
//         id: uuid.v1(),
//         type: 'TBD',
//         payload: message,
//         timestamp: new Date().toString()
//     },
//     km = new KeyedMessage(key, JSON.stringify(payload));

// if (partition > -1) {
//     payloads = [{
//         topic: topic,
//         messages: [km],
//         partition: partition
//     }];
// } else {
//     payloads = [{
//         topic: topic,
//         messages: [km]
//     }];
// }

// producer.on('ready', function() {
//     var req1 = producer.send(payloads, function(err, data) {
//         if (err) {
//             console.log("ERROR");
//             console.log(err);
//             process.exit(1);
//             //catch for LeaderNotAvailable
//             //producer.createTopics(['new-topic'])
//         } else {
//             console.log("SUCCESS");
//             console.log(JSON.stringify(data));
//             producer.close();
//         }
//     });
// });

// producer.on('error', function(err) {
//     console.log("-----------------> OnERRORa");
//     console.log(err);
//     process.exit(1);
// })
