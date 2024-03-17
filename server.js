var http = require('http');
var Server = require('socket.io');
var express = require('express');
var app = express();

const port = 3000;

const server = http.createServer(app);
const io =  Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


app.get('/broadcast', (req, res) => {
    var returnResp
    var params = req.query

    if(params.channel && params.message) {
        var socket = app.get('WebSocket')

        console.log('Broadcasting to', params.channel, 'with message', params.message)
        var b = socket.broadcast.emit(params.channel, params.message) && socket.emit(params.channel, params.message)
        returnResp = {'status': b, 'message': 'Broadcast success'}
    } else {
        returnResp = {'status': false, 'message': 'Invalid Request'}
    }

    return res.json(returnResp).status(200)
});

io.on('connection', (socket) => {
    //Assign the socket variable to WebSocket variable so we can use it the GET method
    app.set('WebSocket', socket)

    console.log('a user connected');
    socket.on('sendNotificationToUser', (obj) => {
        socket.emit('receiveNotificationToUser_'+obj.user, obj.message)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(port, () => {
    console.log('Server listening on port', port);
});
