//require('look').start();

var topic = process.argv[2] || 'TutorialTopic';
var partitions = process.argv[3] || 1;
var number_of_messages = process.argv[4] || partitions;

var producer = require('./producer.js');
var next_partition = 0;

var success_callbacks = 0;

for (var i = 0; i < number_of_messages; i++) {
	next_partition = (next_partition + 1) % partitions;

	producer.produce(topic, next_partition, 'message ', function(err, data) {
		if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data));
            success_callbacks++;

            if (success_callbacks == number_of_messages) {
            	producer.closeproducer();
            }
        }
	});
}
