var app = angular.module('Persica');
app.service('daemonService', ['$http', function ($http) {
	

    this.connectToDaemon = function (did, divID) {
        var socket = io('/term_control?did=' + did, {forceNew: true});
        socket.on('connect', function() {
           var term = new Terminal({
            cols: 80,
            rows: 16,
            useStyle: true,
            screenKeys: true,
            cursorBlink: false
        });

           term.on('data', function (data) {
            socket.emit('daemon-data', {did: did, data: data});
            });

           socket.emit('daemon-data', {did: did, data:'\n'});

           term.open(document.getElementById(divID));
           socket.on('daemon-online', function (data) {
            console.log('ello a daemon came online', data);
                if (data.did === did) {
                   term.write('\x1b[31Welcome to Persica terminal!\x1b[m\r\n');
                }
           });

           socket.on('daemon-offline', function (data) {
            console.log('a daemon went offline', data);
                if (data.did === did) {
                   term.write('\x1b[31Device Offline!\x1b[m\r\n');

                }
           });
           socket.on('daemon-data', function(data) {
            if (data.did === did) {
                term.write(data.data);
            }
        });

           socket.on('disconnect', function() {
            term.destroy();
        });
       });



    };




}]);