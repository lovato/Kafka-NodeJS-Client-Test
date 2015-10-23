var topic = process.argv[2] || 'TutorialTopic';
var partitions = process.argv[3] || 1;
var number_of_messages = process.argv[4] || partitions;

var next_partition = 0;

var success_callbacks = 0;

var cluster = require('cluster');
var restify = require('restify');
var numberOfCores = require('os').cpus().length;
 
function handleRequest(req, res) {
    var producer = require('./producer.js');

    for (var i = 0; i < number_of_messages; i++) {
        next_partition = (next_partition + 1) % partitions;

        producer.produce(topic, next_partition, 'message', function(err, data) {
            if (err) {
                console.log(err);
            } else {
//                console.log(JSON.stringify(data));
                success_callbacks++;

                if (success_callbacks == number_of_messages) {
                    producer.closeproducer();
                  res.json({result: 'ok'});
                }
            }
        });
    }
}

if (cluster.isMaster) {
   for (var i = 0; i < numberOfCores; i++) {
       cluster.fork();
   }
} else {
   var server = restify.createServer();
   server.get('/produce', handleRequest);
   console.log('Started cluster worker');
   server.listen(8080);
}
 
cluster.on('exit', function(worker, code, signal) {
    console.log('exitou');
    // cluster.fork();
});