var socket = io.connect(CONFIG.host);
console.log("gooo");
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});