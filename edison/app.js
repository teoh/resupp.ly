const Cylon = require('cylon');
const childProcess = require('child_process');
const imgur = require('imgur-node-api'),
    path = require('path');
const fs = require('fs');


const imageName = "image.png";
imgur.setClientID("f1adc9604875526");


Cylon.robot({
    connections: {
        edison: {adaptor: 'intel-iot'}
    },
    devices: {
        button: {driver: 'button', pin: 8, connection: 'edison'},
        led: {driver: 'led', pin: 13}
    },
    isEnabled: true,
    reset: function () {
        this.led.turnOff();
    },
    work: function (my) {
        my.button.on('push', () => {
            my.led.turnOn();
            setTimeout(() => {
                childProcess.exec('/home/root/bin/ffmpeg/ffmpeg -f video4linux2  -s 1920x1080 -i /dev/video0 -vframes 1 ' + imageName, (error, stdout, stderr) => {

                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }

                    fs.readFile(imageName, function (err, original_data) {
                        var base64Image = original_data.toString('base64');

                    });

                    imgur.upload(path.join(__dirname, imageName), function (err, res) {
                        console.log(res.data.link); // Log the imgur url
                    });

                    setTimeout(() => {

                        my.led.turnOff();
                    }, 1000);
                })
            }, 1000)
        });
    }
}).start();
