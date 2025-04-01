class WaveformViewer {
    #waveform;
    #scale = 2000;
    #canvas;
    #position = 0;
    #milis = 0;

    //#visible = 1;
    #audio;
    constructor(_waveform) {
        this.#waveform = _waveform;
        
        const hdr = HTMLDrawer.getHeader("Waveform " + this.#waveform.id, "wf" + this.#waveform.id, false);
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];

        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 300;
        canvas.classList.add("waveformCanvas");
        wrapper.appendChild(canvas);

        this.#canvas = canvas;

        const btnZoomIn = HTMLDrawer.getAuxButton("Zoom In", () => { this.zoomIn();});
        wrapper.appendChild(btnZoomIn);

        const btnZoomOut = HTMLDrawer.getAuxButton("Zoom Out", () => {this.zoomOut(); });
        wrapper.appendChild(btnZoomOut);

        const btnShiftLeft = HTMLDrawer.getAuxButton("Shift Left",() => {this.shiftLeft();});
        wrapper.appendChild(btnShiftLeft);

        const btnShiftRight = HTMLDrawer.getAuxButton("Shift Right", () => {this.shiftRight();});
        wrapper.appendChild(btnShiftRight);

        const divScale = document.createElement("div");
        divScale.classList.add("scaleDiv");
        divScale.id = this.#waveform.id + "scale";
        wrapper.appendChild(divScale);

        const divTimestamp0 = document.createElement("div");
        divTimestamp0.classList.add("timestamp0Div");
        divTimestamp0.id = this.#waveform.id + "timestamp0";
        wrapper.appendChild(divTimestamp0);

        const divTimestamp1 = document.createElement("div");
        divTimestamp1.classList.add("timestamp1Div");
        divTimestamp1.id = this.#waveform.id + "timestamp1";
        wrapper.appendChild(divTimestamp1);

        const divTimestamp2 = document.createElement("div");
        divTimestamp2.classList.add("timestamp2Div");
        divTimestamp2.id = this.#waveform.id + "timestamp2";
        wrapper.appendChild(divTimestamp2);

        const divTimestamp3 = document.createElement("div");
        divTimestamp3.classList.add("timestamp3Div");
        divTimestamp3.id = this.#waveform.id + "timestamp3";
        wrapper.appendChild(divTimestamp3);

        const divTimestamp4 = document.createElement("div");
        divTimestamp4.classList.add("timestamp4Div");
        divTimestamp4.id = this.#waveform.id + "timestamp4";
        wrapper.appendChild(divTimestamp4);

        const divSamplerate = document.createElement("div");
        divSamplerate.classList.add("samplerateDiv");
        divSamplerate.id = this.#waveform.id + "samplerate";
        wrapper.appendChild(divSamplerate);

        document.getElementById("modules").appendChild(mainWrapper);

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);
        /*
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
        */
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

    clear()
    {
        this.#scale = 2000;
        this.#position = 0;
        this.draw();
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
        //console.log("Drawing from pts " + positionOffset + " to " + Math.floor(positionOffset + (this.#waveform.samplerate / 250) * this.#scale));
        for (let i = positionOffset; i < Math.floor(positionOffset + (this.#waveform.samplerate / 250) * this.#scale); i++) {
            if (i % scaler == 0) {
                let actualXPos = Math.floor(canvasXPos);
                let actualYPos = height / 2; //= Math.floor(this.#canvas.height*(dataSubset[i]+32768)/65535);
                if (i >= this.#waveform.length) {
                    continue;
                }

                actualYPos = height - (Math.floor(height * (this.#waveform.waveform[i] + 32768) / 65535));
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
        document.getElementById(this.#waveform.id + "scale").innerHTML = this.getScale();
        document.getElementById(this.#waveform.id + "timestamp0").innerHTML = this.getTimestamps()[0];
        document.getElementById(this.#waveform.id + "timestamp1").innerHTML = this.getTimestamps()[1];
        document.getElementById(this.#waveform.id + "timestamp2").innerHTML = this.getTimestamps()[2];
        document.getElementById(this.#waveform.id + "timestamp3").innerHTML = this.getTimestamps()[3];
        document.getElementById(this.#waveform.id + "timestamp4").innerHTML = this.getTimestamps()[4];
        document.getElementById(this.#waveform.id + "samplerate").innerHTML = this.#waveform.samplerate + " Hz";
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

    getId()
    {
        return this.#waveform.id;
    }

}

/*
    <div id="waveforms">
        <div id="waveform1">
            <div id="waveform1ts0"></div><div id="waveform1ts1"></div><div id="waveform1ts2"></div><div id="waveform1ts3"></div><div id="waveform1ts4"></div>
            <div id="waveform1scale"></div>
            <canvas id="waveform1Canvas" height="300" width="800"></canvas> <br>
    
            <button id="waveform1zoomIn">zoomIn</button> <button id="waveform1zoomOut">zoomOut</button> <br>
            <button id="waveform1timeLeft">timeLeft</button> <button id="waveform1timeRight">timeRight</button> <br>
            <button id="waveform1play">Play</button> <button id="waveform1pause">Pause</button> <button id="waveform1stop">Stop</button> <br>
        </div>
        <br>
        <div id="waveform2">
            <div id="waveform2ts0"></div><div id="waveform2ts1"></div><div id="waveform2ts2"></div><div id="waveform2ts3"></div><div id="waveform2ts4"></div>
            <div id="waveform2scale"></div>
            <canvas id="waveform2Canvas" height="300" width="800"></canvas> <br>
    
            <button id="waveform2zoomIn">zoomIn</button> <button id="waveform2zoomOut">zoomOut</button> <br>
            <button id="waveform2timeLeft">timeLeft</button> <button id="waveform2timeRight">timeRight</button> <br>
            <button id="waveform2play">Play</button> <button id="waveform2pause">Pause</button> <button id="waveform2stop">Stop</button> <br>
        </div>
    </div>
    
    <div id="operations">
    
    </div>

*/