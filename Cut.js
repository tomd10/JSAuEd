class Cut
{

    #wfs1;
    #startInput;
    #endInput;

    //MODULE 8
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Cut", "cut");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
        
        const lineDiv1 = HTMLDrawer.getLineDiv();
        const helpDiv1 = HTMLDrawer.getHelpText("Cut waveform ");
        this.#wfs1 = HTMLDrawer.getWaveformSelect();  
        
        const lineDiv2 = HTMLDrawer.getLineDiv();
        const helpDiv2 = HTMLDrawer.getHelpText("from ");
        this.#startInput = HTMLDrawer.getTextInput("00:00:000");
        const startButton = HTMLDrawer.getAuxButton("Start", () => {this.loadStart()});

        const lineDiv3 = HTMLDrawer.getLineDiv();
        const helpDiv3 = HTMLDrawer.getHelpText("to ");
        this.#endInput = HTMLDrawer.getTextInput("00:03:000");
        const endButton = HTMLDrawer.getAuxButton("End", () => {this.loadEnd()});
   
        const cutButton = HTMLDrawer.getCommandButton("Cut", () => {this.cut()});

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);

        lineDiv2.appendChild(helpDiv2);
        lineDiv2.appendChild(this.#startInput);
        lineDiv2.appendChild(startButton);

        lineDiv3.appendChild(helpDiv3);
        lineDiv3.appendChild(this.#endInput);
        lineDiv3.appendChild(endButton);
        lineDiv3.appendChild(cutButton);

        wrapper.appendChild(lineDiv1);
        wrapper.appendChild(lineDiv2);
        wrapper.appendChild(lineDiv3);
        
    }

    loadStart()
    {
        this.#startInput.value = "00:00:000";
    }

    loadEnd()
    {
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) return;

        let mili = waveform.getTime();

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

        this.#endInput.value = mm + ":" + ss + ":" + mili;
    }

    cut()
    {
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) return;

        let mms, sss, mss;
        let mme, sse, mse;

        let arrS = this.#startInput.value.split(":");
        let arrE = this.#endInput.value.split(":");
        
        if (arrS.length != 3) return;
        if (arrE.length != 3) return;

        if (arrS[0].length != 2 || arrS[1].length !=2 || arrS[2].length != 3) return;
        if (arrE[0].length != 2 || arrE[1].length !=2 || arrE[2].length != 3) return; 
        
        mms = parseInt(arrS[0]); sss = parseInt(arrS[1]); mss = parseInt(arrS[2]);
        mme = parseInt(arrE[0]); sse = parseInt(arrE[1]); mse = parseInt(arrE[2]);

        if (isNaN(mms) || mms > 60 || mms < 0) return;
        if (isNaN(sss) || sss > 60 || sss < 0) return;
        if (isNaN(mss) || mss > 1000 || mss < 0) return;

        if (isNaN(mme) || mme > 60 || mme < 0) return;
        if (isNaN(sse) || sse > 60 || sse < 0) return;
        if (isNaN(mse) || mse > 1000 || mse < 0) return;

        const msStart = 60000 * mms + 1000 * sss + mss;
        const msEnd = 60000 * mme + 1000 * sse + mse;
        if (msEnd < msStart) return;
        if (msStart > waveform.getTime()) return;
        if (msEnd > waveform.getTime()) return;

        waveform.cut(mms, sss, mss, mme, sse, mse);
        WaveformCollection.redraw();
    }
}