var Cylon = require('cylon');
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
        console.log("pushed")
    });
  }
}).start();
