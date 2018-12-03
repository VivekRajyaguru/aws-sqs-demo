var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var aws = require('aws-sdk');

aws.config.update({region: 'us-west-2'});

var sqs = new aws.SQS();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())                                    
app.use(bodyParser.json({ type: 'application/json'}))  


// Creating Queue
app.get('/create/:name', (req, res) => {
    var params = {
        QueueName: req.params.name
    }
    sqs.createQueue(params, (err, data) => {
        if (err) res.send(err);
        else res.send(data);
    });
});

// List Queue
app.get('/listQueues', (req, res) => {
    sqs.listQueues((err, data) => {
        if (err) res.send(err);
        else res.send(data);
    });
});

// Sending Message To Queue
app.post('/send', (req, res) => {
    var params = {
        MessageBody: req.body.message,
        QueueUrl: req.body.queueUrl,
        DelaySeconds: req.body.deplaySeconds
    }
    sqs.sendMessage(params, (err, data) => {
        if (err) res.send(err);
        else res.send(data)
    });
});

// Receive Message From Queue
app.post('/readMessage', (req, res) => {
    var params = {
        QueueUrl: req.body.queueUrl,
        VisibilityTimeout: 600
    };
    sqs.receiveMessage(params, (err, data) => {
        if (err) res.send(err);
        else res.send(data);
    });
});

// Delete Message 
// When reading messages it will have ReceiptHandler in response use that to delete 
app.post('/delete', (req, res) => {
    var params = {
        QueueUrl: req.body.queueUrl,
        ReceiptHandle: req.body.receiptHandle
    }
    sqs.deleteQueue(params, (err, data) => {
        if (err) res.send(err);
        else res.send(data);
    });
});

var server = app.listen(8080, () => {});