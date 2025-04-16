class WaveformViewer {
    #waveform;
    #scale = 2000;
    #canvas;
    #position = 0;
    #milis = 0;

    #divTimestamp0;
    #divTimestamp1;
    #divTimestamp2;
    #divTimestamp3;
    #divTimestamp4;
    #divScale;
    #divSamplerate;

    //#visible = 1;
    #audio;
    constructor(_waveform) {
        this.#waveform = _waveform;
        
        const hdr = HTMLDrawer.getHeader("Waveform " + this.#waveform.id, "wf" + this.#waveform.id, true);
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];

        const canvasWrapper = document.createElement("div");
        canvasWrapper.classList.add("canwasWrapper");

        this.#canvas = HTMLDrawer.getCanvas();
        canvasWrapper.appendChild(this.#canvas);

        

        const dashboard = document.createElement("div");
        dashboard.classList.add("dashboard");

        const btnZoomIn = HTMLDrawer.getAuxButton("Zoom In", () => { this.zoomIn();});
        const btnZoomOut = HTMLDrawer.getAuxButton("Zoom Out", () => {this.zoomOut(); });
        const btnShiftLeft = HTMLDrawer.getAuxButton("Shift Left",() => {this.shiftLeft();});
        const btnShiftRight = HTMLDrawer.getAuxButton("Shift Right", () => {this.shiftRight();});

        const btnPlay = HTMLDrawer.getAuxButton("Play audio", () => {this.play();});
        const btnStop = HTMLDrawer.getAuxButton("Stop audio", () => {this.stop();});

        dashboard.appendChild(btnZoomIn);
        dashboard.appendChild(btnZoomOut);
        dashboard.appendChild(btnShiftLeft);
        dashboard.appendChild(btnShiftRight);
        dashboard.appendChild(btnPlay);
        dashboard.appendChild(btnStop);

        const data = document.createElement("div");
        data.classList.add("waveform-data");

        this.#divScale = document.createElement("div");
        this.#divScale.classList.add("miscChar");
        this.#divScale.classList.add("scale");
        this.#divScale.id = "wf"+this.#waveform.id + "scale";
        data.appendChild(this.#divScale);

        this.#divTimestamp0 = document.createElement("div");
        this.#divTimestamp0.classList.add("timestamp");
        this.#divTimestamp0.classList.add("notch1");
        this.#divTimestamp0.id = "wf"+this.#waveform.id + "timestamp0";
        data.appendChild(this.#divTimestamp0);

        this.#divTimestamp1 = document.createElement("div");
        this.#divTimestamp1.classList.add("timestamp");
        this.#divTimestamp1.classList.add("notch2");
        this.#divTimestamp1.id = "wf"+this.#waveform.id + "timestamp1";
        data.appendChild(this.#divTimestamp1);

        this.#divTimestamp2 = document.createElement("div");
        this.#divTimestamp2.classList.add("timestamp");
        this.#divTimestamp2.classList.add("notch3");
        this.#divTimestamp2.id = "wf"+this.#waveform.id + "timestamp2";
        data.appendChild(this.#divTimestamp2);

        this.#divTimestamp3 = document.createElement("div");
        this.#divTimestamp3.classList.add("timestamp");
        this.#divTimestamp3.classList.add("notch4");
        this.#divTimestamp3.id = "wf"+this.#waveform.id + "timestamp3";
        data.appendChild(this.#divTimestamp3);

        this.#divTimestamp4 = document.createElement("div");
        this.#divTimestamp4.classList.add("timestamp");
        this.#divTimestamp4.classList.add("notch5");
        this.#divTimestamp4.id = "wf"+this.#waveform.id + "timestamp4";
        data.appendChild(this.#divTimestamp4);

        this.#divSamplerate = document.createElement("div");
        this.#divSamplerate.classList.add("miscChar");
        this.#divSamplerate.classList.add("samplerate");
        this.#divSamplerate.id = "wf"+this.#waveform.id + "samplerate";
        data.appendChild(this.#divSamplerate);

        canvasWrapper.appendChild(data);

        wrapper.appendChild(canvasWrapper);
        wrapper.appendChild(dashboard);
        

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        this.#milis = (1000 * this.#waveform.length) / this.#waveform.samplerate;
        this.draw();
    }

    play()
    {
        AudioWrapper.PlayAudio(this.#waveform.waveform, this.#waveform.samplerate);
    }

    /*
    pause()
    {
        AudioWrapper.PausePlay();
    }
    */

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
        this.#divScale.innerHTML = this.getScale();
        this.#divTimestamp0.innerHTML = this.getTimestamps()[0];
        this.#divTimestamp1.innerHTML = this.getTimestamps()[1];
        this.#divTimestamp2.innerHTML = this.getTimestamps()[2];
        this.#divTimestamp3.innerHTML = this.getTimestamps()[3];
        this.#divTimestamp4.innerHTML = this.getTimestamps()[4];
        this.#divSamplerate.innerHTML = this.#waveform.samplerate + " Hz";
    }

    setScale(scale)
    {
        this.#scale = scale;
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