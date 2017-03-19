const Cylon = require('cylon');
const childProcess = require('child_process');
    path = require('path');
const fs = require('fs');
var request = require("request");


const imageName = "image.png";


Cylon.robot({
    connections: {
        edison: {adaptor: 'intel-iot'}
    },
    devices: {
        button: {driver: 'button', pin: 8, connection: 'edison'},
        led: {driver: 'led', pin: 13}
    },
    isRunning: false,
    reset: function () {
        this.led.turnOff();
    },
    uploadImage: function () {
        const options = {
            method: 'POST',
            url: 'http://52.228.33.184:6000/new_image',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            },
            formData: {
                file: {
                    value: fs.createReadStream(imageName),
                    options: {filename: imageName, contentType: null}
                }
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    }, work: function (my) {
        my.button.on('push', () => {
            if(my.isRunning){
                return
            }else {
                my.isRunning = true
            }
            my.led.turnOn();
            console.log("led on");
            setTimeout(() => {
                console.log("running ffmpeg");

                childProcess.exec('/home/root/bin/ffmpeg/ffmpeg -f video4linux2  -s 1920x1080 -i /dev/video0 -vframes 1 -vf vflip -c:a copy -y ' + imageName, (error, stdout, stderr) => {
                    console.log("done ffmpeg");

                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }

                    setTimeout(() => {
                        my.led.turnOff();
                        my.isRunning = false;
                    }, 1000);

                    my.uploadImage();
                })
             }, 1000)
        });
    }
}).start();
