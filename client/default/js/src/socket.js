var socket = io.connect("/");
socket.on('connect', function(){
    console.log("Connected");
})

socket.on('enqueue', function (data) {
    console.log(data);
    if (document.onEnqueue) {
        document.onEnqueue(data);
    }
});

socket.on('next', function (data) {
    if (document.onNextSong) {
        document.onNextSong();
    }
});

function next() {
    socket.emit('nextsong', CONFIG.session);
}



