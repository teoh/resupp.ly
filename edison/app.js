var Cylon = require('cylon');
var io = require('socket.io-client');

Cylon.start();

Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },
  devices: {
    button: { driver: 'button', pin: 8, connection: 'edison'}
  },
  isEnabled: true,
  reset: function() {
    this.led.turnOff();
  },
  work: function(my) {
    my.button.on('push', function() {
        consoel.log("pushed")
    });
  }
});
