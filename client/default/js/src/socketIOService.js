
angular.module('couchtapeParty').service('SocketIO', [function () {

    // socket address
    var address = '/' + CONFIG.session;

    // connect with socket io
    var socket = io.connect(address);

    // registered event callbacks
    var registeredEvents = {};

    // socket events
    var events = {
        // event name for listening : event name on server
        connect: 'connect',
        enqueue: 'enqueue',
        nextSong: 'next'
    };

    // loop through all events for socket listening
    angular.forEach(events, function (socketEvent, internalEvent) {
        socket.on(socketEvent, function (data) {
            triggerEvent(internalEvent, data)
        });
    });

    function triggerEvent (eventName, data) {
        console.log('socket.on "' + eventName + '"', data);
        if (data && data[address]) {
            data = data[address];
        }
        if (registeredEvents[eventName]) {
            angular.forEach(registeredEvents[eventName], function (func) {
                func(data);
            });
        }
    }

    // emit to socket server
    function emit(eventName, triggerEventInternal) {
        if (triggerEventInternal) {
            triggerEvent(eventName);
        }
        socket.emit(eventName, CONFIG.session);
    }

    var s = {
        /**
         * Adds callback functions for specified eventName
         *
         * @param {String} eventName
         * @param {Function} func
         */
        on: function (eventName, func) {
            console.log(eventName + ' registered!');
            if (!registeredEvents[eventName]) {
                registeredEvents[eventName] = [];
            }
            registeredEvents[eventName].push(func);
        },

        /**
         * emit to socket, that the next song is playing
         */
        nextSong: function (triggerEventInternal) {
            emit('nextSong', triggerEventInternal);
        }
    };

    // add callback for socket connect event
    s.on('connect', function () {
        console.log("Connected");
    });

    return s;

}]);