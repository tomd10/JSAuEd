class WaveformViewer {
    #waveform;
    #scale = 2000;
    #id;
    #canvas;
    #position = 0;
    #milis = 0;

    #audio;
    constructor(_id, _waveform) {
        this.#id = _id;
        this.#waveform = _waveform;
        this.#canvas = document.getElementById(this.#id + "Canvas");

        document.getElementById(this.#id + "zoomIn").addEventListener("click", () => {
            this.zoomIn();
        });
        document.getElementById(this.#id + "zoomOut").addEventListener("click", () => {
            this.zoomOut();
        });
        document.getElementById(this.#id + "timeLeft").addEventListener("click", () => {
            this.shiftLeft();
        });
        document.getElementById(this.#id + "timeRight").addEventListener("click", () => {
            this.shiftRight();
        });

        document.getElementById(this.#id + "play").addEventListener("click", () => {
            this.play();
        });
        
        document.getElementById(this.#id + "pause").addEventListener("click", () => {
            this.pause();
        });
        
        document.getElementById(this.#id + "stop").addEventListener("click", () => {
            this.stop();
        });
        this.#milis = (1000 * this.#waveform.length) / this.#waveform.samplerate;
        this.draw();
    }

    play()
    {
        AudioWrapper.PlayAudio(this.#waveform.waveform, this.#waveform.samplerate);
    }

    pause()
    {
        AudioWrapper.PausePlay();
    }

    stop()
    {
        AudioWrapper.StopPlay();
    }


    setWaveform(waveform) {
        this.#waveform = waveform;
        this.#scale = 2000;
        this.#position = 0;
        this.#milis = (1000 * this.#waveform.length) / this.#waveform.samplerate;
        this.draw();
    }

    zoomIn() {
        if (this.#scale == 1) return;
        else {
            if (("" + this.#scale)[0] == '5') {
                this.#scale = Math.floor(this.#scale / 2.5);
                this.#position = Math.floor(this.#position * 2.5);
            }
            else {
                this.#scale = this.#scale / 2;
                this.#position = Math.floor(this.#position * 2);
            }
        }
        this.draw();
    }

    zoomOut() {
        if (this.#scale == 100000) return;
        else {
            if (("" + this.#scale)[0] == '2') {
                this.#scale = Math.floor(this.#scale * 2.5);
                this.#position = Math.floor(this.#position / 2.5);
            }
            else {
                this.#scale = this.#scale * 2;
                this.#position = Math.floor(this.#position / 2);
            }
        }

        this.draw();
    }

    shiftLeft() {
        if (this.#position == 0) return;
        this.#position = this.#position - 1;
        this.draw();
    }

    shiftRight() {
        if (this.#milis > (this.#position + 1) * 4 * this.#scale) {
            this.#position = this.#position + 1;
            this.draw();
        }
    }

    draw(color = 'blue') {
        console.log(this.getTimestamps());
        const width = this.#canvas.width;
        const height = this.#canvas.height;
        const ctx = this.#canvas.getContext('2d');

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.lineWidth = 3;

        const positionOffset = Math.floor(this.#position * this.#scale * this.#waveform.samplerate / 250);

        let canvasXPos = 0;
        let scaler = 1;
        if ((this.#waveform.samplerate / 250) * this.#scale < 10000) {
            scaler = 1;
        }
        else if ((this.#waveform.samplerate / 250) * this.#scale < 100000) {
            scaler = 8;
        }
        else if ((this.#waveform.samplerate / 250) * this.#scale < 1000000) {
            scaler = 16;
        }
        else {
            scaler = 64;
        }

        //GRID
        ctx.strokeStyle = 'gray';
        ctx.moveTo(0.25 * width, 0);
        ctx.lineTo(0.25 * width, height);
        ctx.moveTo(0.5 * width, 0);
        ctx.lineTo(0.5 * width, height);
        ctx.moveTo(0.75 * width, 0);
        ctx.lineTo(0.75 * width, height);
        ctx.moveTo(0, 0.5 * height);
        ctx.lineTo(width, 0.5 * height);
        ctx.stroke();


        //WAVEFORM
        ctx.beginPath();
        ctx.strokeStyle = color;
        console.log("Drawing from pts " + positionOffset + " to " + Math.floor(positionOffset + (this.#waveform.samplerate / 250) * this.#scale));
        for (let i = positionOffset; i < Math.floor(positionOffset + (this.#waveform.samplerate / 250) * this.#scale); i++) {
            if (i % scaler == 0) {
                let actualXPos = Math.floor(canvasXPos);
                let actualYPos = height / 2; //= Math.floor(this.#canvas.height*(dataSubset[i]+32768)/65535);
                if (i >= this.#waveform.length) {
                    continue;
                }

                actualYPos = Math.floor(height * (this.#waveform.waveform[i] + 32768) / 65535);
                if (i == positionOffset) {
                    ctx.moveTo(actualXPos, actualYPos);
                } else {
                    ctx.lineTo(actualXPos, actualYPos);
                }

                canvasXPos = canvasXPos + (scaler * width / ((this.#waveform.samplerate / 250) * this.#scale));
                //console.log(canvasXPos);
            }

        }

        ctx.stroke();

        //Scale and timestamp labels
        document.getElementById(this.#id+"scale").innerHTML = this.getScale();
        document.getElementById(this.#id+"ts0").innerHTML = this.getTimestamps()[0];
        document.getElementById(this.#id+"ts1").innerHTML = this.getTimestamps()[1];
        document.getElementById(this.#id+"ts2").innerHTML = this.getTimestamps()[2];
        document.getElementById(this.#id+"ts3").innerHTML = this.getTimestamps()[3];
        document.getElementById(this.#id+"ts4").innerHTML = this.getTimestamps()[4];
    }

    getScale() {
        if (this.#scale < 1000) {
            return this.#scale + " ms/div";
        }
        else {
            return Math.floor(this.#scale / 1000) + " s/div";
        }
    }

    getTimestamps() {
        let base = this.#position * 4 * this.#scale;
        return [
            this.#convertMiliseconds(base + 0 * this.#scale),
            this.#convertMiliseconds(base + 1 * this.#scale),
            this.#convertMiliseconds(base + 2 * this.#scale),
            this.#convertMiliseconds(base + 3 * this.#scale),
            this.#convertMiliseconds(base + 4 * this.#scale)
        ];
    }

    #convertMiliseconds(ms) {
        let mili = ms;

        let mm = Math.floor(mili / 60000);
        mili = mili - 60000 * mm;

        let ss = Math.floor(mili / 1000);
        mili = mili - 1000 * ss;

        if (mm < 10) mm = "0" + mm;
        else mm = "" + mm;

        if (ss < 10) ss = "0" + ss;
        else ss = "" + ss;

        if (mili < 10) mili = "00" + mili;
        else if (mili < 100) mili = "0" + mili;
        else mili = "" + mili;

        return (mm + ":" + ss + ":" + mili);
    }

}