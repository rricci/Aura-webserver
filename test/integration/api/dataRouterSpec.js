'use strict';
const fs = require('fs');

var assert = require('chai').assert,
    sinon = require('sinon'),
    request = require('supertest'),
    path = require('path'),
    appAura = require('../../../app.js');

var dirname = path.dirname(__dirname);

describe('dataRouterSpec', function(){

    var log;
    var mockedDate;

    var dataFilePath = dirname + '/resources/fileToUpload.txt';
    var uploadsPath = path.dirname(__dirname + '/../../../uploads');
    var uploadedFile = '/file-now.txt';

    before(function () {
        if(fs.existsSync(uploadsPath + uploadedFile)){
            fs.unlink(uploadsPath + uploadedFile);
        }
    });

    beforeEach(function () {
        sinon.stub(console, 'error');
        log = sinon.spy(console, 'log');
        mockedDate = sinon.stub(Date, 'now').returns('now');
    });
    afterEach(function () {
        if(fs.existsSync(uploadsPath + uploadedFile)){
            fs.unlink(uploadsPath + uploadedFile);
        }
        console.error.restore();
        console.log.restore();
        Date.now.restore();
    });

    describe('/POST /data/file', function(){
        var apiUserDataUrl = '/users/12/dataFile';

        it('should save file and return 200 if successful', function(done){
            request(appAura)
                .post(apiUserDataUrl)
                .field('name', 'file')
                .attach('file', dataFilePath)
                .end(function (err, res) {
                    assert.equal(err, null);
                    assert.isTrue(log.calledWith('Data file correctly uploaded for user 12'));
                    assert.isTrue(fs.existsSync(uploadsPath));
                    assert.equal(res.statusCode, 200);
                    done();
                });
        });

    })

});