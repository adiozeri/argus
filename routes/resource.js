var express = require('express');
const {FileUtils} = require("../fileUtils");
var request = require('request');

var router = express.Router();
var file = new FileUtils('resource', '1234');
var instances = {'first_instance': '18.185.32.146', 'second_instance': '3.121.196.118'};

router.get('/', function (req, res) {
    let otherInstanceHostRequest = getOtherServerInstance(req.get('host').split(':')[0]);
    file.decryptAsync().then(function (resource) {
        res.send(resource)
    }).catch(function () {
        request('http://' + otherInstanceHostRequest + ':8080/api/resource/saved', function (error, otherInstanceRes,body) {
            if (error)
                res.send({success: false, message: "Something got wrong. Are you sure you already saved anything?"});
            res.send(body);
        });
    });
});

router.post('/', function (req, res) {
    file.encryptAsync(JSON.stringify(req.body)).then(function () {
        res.send({success: true, message: "Resource saved successfully"});
    }).catch(function () {
        res.send({success: false, message: "Something got wrong."});
    });
});

router.get('/saved', function (req, res) {
    file.decryptAsync().then(function (resource) {
        res.send(resource);
    }).catch(function () {
        res.send({success: false, errors: "There is no saved resource"})
    });
});

function getOtherServerInstance(instance) {
    if (instance === instances['first_instance'])
        return instances['second_instance'];
    else
        return instances['first_instance'];
}

module.exports = router;
