//~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --new-produr --topic TutorialTopic1  > /dev/null

var kafkacluster = process.env.KAFKACLUSTER || 'localhost';

var uuid = require('uuid');

var topic = process.argv[2] || 'TutorialTopic';
var partition = process.argv[3] || 0;
var key = process.argv[4] || 'some_key';
var message = process.argv[5] || 'some_message';

var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(kafkacluster, uuid.v1()),
    producer = new HighLevelProducer(client, {
        requireAcks: 1,
        ackTimeoutMs: 100
    }),
    payload = {
        id: uuid.v1(),
        type: 'TBD',
        payload: message,
        timestamp: new Date().toString()
    },
    km = new KeyedMessage(key, JSON.stringify(payload)),
    payloads = [{
        topic: topic,
        messages: [km],
        partition: partition
    }];

producer.on('ready', function() {
    var req1 = producer.send(payloads, function(err, data) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            process.exit(1);
            //catch for LeaderNotAvailable
            //producer.createTopics(['new-topic'])
        } else {
            console.log("SUCCESS");
            console.log(JSON.stringify(data));
            producer.close();
        }
    });
});

producer.on('error', function(err) {
    console.log("-----------------> OnERROR");
    console.log(err);
    process.exit(1);
})

