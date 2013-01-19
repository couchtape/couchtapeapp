var socket = io.connect("/");

socket.on('enqueue', function (data) {
    console.log(data);
    if (document.onEnqueue) {
        onEnqueue(data);
    }
});

socket.on('next', function (data) {
    if (document.onNextSong) {
        onNextSong();
    }
});

function next() {
    socket.emit('nextsong', CONFIG.session);
}



