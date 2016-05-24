var expect = require('chai').expect;
var should = require('should');
var io = require('socket.io-client');

var options = {
    transports: ['websocket'],
    'force new connection': true
};

function randomDid() {
    return '' + Math.round(Math.random() * 1000);
}

/* control tests */
it('Should connect to control namespace', function(done) {
    var c1 = io.connect('ws://localhost:3000/control', options);
    c1.on('connect', function() {
        c1.disconnect();
        done();
    });
});

it('Should notify control of new device when device connects', function(done) {
    // Control connects
    var control = io.connect('ws://localhost:3000/control');
    control.on('connect', function() {
        // Once control connected, a device connects    
        var did = randomDid();
        var d1 = io.connect('ws://localhost:3000/device?did=' + did, options);

        control.on('device-connected', function(data) {
            expect(data).to.have.a.property('did', did);
            d1.disconnect();
            control.disconnect();
            done();
        });
    });


});

it('Should notify control of already connected devices', function(done) {
    // Device connects
    var did = randomDid();
    var d1 = io.connect('ws://localhost:3000/device?did=' + did, options);
    d1.on('connect', function() {
        // Then control connects
        var control = io.connect('ws://localhost:3000/control');
        control.on('connect', function() {
            // Once control connected, we require that we are notified of the already connected device
            control.on('device-connected', function(data) {
                expect(data).to.have.a.property('did', did);
                d1.disconnect();
                control.disconnect();
                done();
            });
        });
    });


});

/* device tests */
it('Should connect to device namespace', function(done) {
    var did = randomDid();
    var d1 = io.connect('ws://localhost:3000/device?did=' + did, options);
    d1.on('connect', function() {
        d1.disconnect();
        done();
    });
});