var cluster = require('cluster');
var restify = require('restify');
var numberOfCores = require('os').cpus().length;

function power(req, res) {
    res.json({result: Math.pow(req.params.base, req.params.exp)});
}

if (cluster.isMaster) {
    for (var i = 0; i < numberOfCores; i++) {
        cluster.fork();
    }
} else {
    var server = restify.createServer();
    server.get('/power/:base/:exp', power);
    server.listen(8080);
}

cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
});