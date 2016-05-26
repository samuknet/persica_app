// Exported routes to Node
// They respect a last declared hiearchy, so the ones defined at
// the bottom may override the ones at the top.

module.exports = function(app) {
    
    // Test route to with request and response
    app.get('/test', function(req, res) {
        
        // Writing to the Header of the response
        res.writeHead(200);
        
        // Writing to the body of the response using Writeable interface
        // Look it takes HTML!
        res.write('<h1>I\'m HTML!</h1>');
        // Must always end the Writeable stream 
        res.end();
    });

    app.get('/index', function (req, res) {
        res.sendfile('web/public/index.html');
    });

    app.get('/login', function (req, res) {
        res.sendfile('web/public/login.html');
    });

    app.get('/device', function (req, res) {
        res.sendfile('web/public/device.html');
    });

    app.get('/song', function (req, res) {
        res.sendfile('song.mp3');
    })

    // // Wildcard route serving static html page
    // app.get('*', function(req, res) {
    //     res.send('M8 i have no idea what you just requested so im just gonna serve this message.  With love, Sam');
    // });
}