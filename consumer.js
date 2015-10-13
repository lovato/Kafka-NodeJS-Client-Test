//~/kafka/bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic TutorialTopic1

var uuid = require('uuid');

var kafkacluster = process.env.KAFKACLUSTER || 'localhost';

var topic = process.argv[2] || 'TutorialTopic';
var partition = process.argv[3] || 0;
var groupId = process.argv[4] || 'kafka-node-group';

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(kafkacluster, uuid.v1()),
    offset = new kafka.Offset(client);

var libPath = process.env['KAFKA_COV'] ? './node_modules/kafka-node/lib-cov/' : './node_modules/kafka-node/lib/',
    TopicsNotExistError = require(libPath + 'errors').TopicsNotExistError;

var consumer = new Consumer(
    client, [{
        topic: topic,
        partition: partition
    }], {
        groupId: groupId,
        autoCommit: true
    }
);

consumer.on('error', function(err) {
    if (err instanceof TopicsNotExistError) {
        console.log("Faltou criar o TOPICO antes");
        process.exit(1);
    } else {
        console.log("ERROR consumo");
        console.log(err);
        process.exit(1);
    }
});

consumer.on('message', function(message) {
    console.log("SUCCESS consumo");
    console.log(message);
});

process.on('uncaughtException', function ( err ) {
    console.error('An uncaughtException was found, the program will end.');
    console.log(err);
    //hopefully do some logging.
    process.exit(1);
});

