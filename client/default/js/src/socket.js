var socket = io.connect("/"+CONFIG.session);

socket.on('connect', function(){
    console.log("Connected");
})

socket.on('enqueue', function (data) {
    var address = "/"+CONFIG.session;
    console.log(data);
    console.log(data[address]);
    if (document.onEnqueue) {
        document.onEnqueue(data[address]);
    }
});

socket.on('next', function (data) {
    console.log("NEXT!!");
    if (document.onNextSong) {
        document.onNextSong();
    }
});

function next() {
    socket.emit('nextsong', CONFIG.session);
}



