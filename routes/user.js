'use strict';

var express = require('express'),
    router = express.Router(),
    multer  = require('multer'),
    config = require('config');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.get('upload_path'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.txt')
    }
});

var uploadToDisk = multer({storage: storage }).single('file');

router.post('/:uid/dataFile', function (req, res) {
    uploadToDisk(req, res, function (err) {
        if (err) {
            log.info('Error occured during file upload.');
            res.send('Oops, something went wrong.').status(500);
        }
        console.log('Data file correctly uploaded for user ' + req.params.uid);
        res.send('file uploaded');
    })
});

module.exports = router;
