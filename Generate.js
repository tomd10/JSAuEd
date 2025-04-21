class Generate
{
    #shapeSelect;

    #freqInput;
    #amplInput;
    #durInput;
    #phaseInput;
    #srInput;

    #wfs1
    //Module 3
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Generate", "generate", "src");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();

        const txt1 = HTMLDrawer.getHelpText("Store ");

        this.#shapeSelect = HTMLDrawer.getSelect(["sine", "square", "triangle", "sawtooth", "noise", "silence"]);

        const txt2 = HTMLDrawer.getHelpText("with frequency");
        this.#freqInput = HTMLDrawer.getTextInput("440");

        const txt3 = HTMLDrawer.getHelpText("Hz, amplitude");
        this.#amplInput = HTMLDrawer.getTextInput("1");

        const txt31 = HTMLDrawer.getHelpText(", phase")
        this.#phaseInput = HTMLDrawer.getTextInput("0");

        const txt4 = HTMLDrawer.getHelpText("degrees , duration ");
        this.#durInput = HTMLDrawer.getTextInput("1");

        const txt5 = HTMLDrawer.getHelpText("s and sample rate ");
        this.#srInput = HTMLDrawer.getTextInput("44100");

        const txt6 = HTMLDrawer.getHelpText(" Hz into waveform ");     
        this.#wfs1 = HTMLDrawer.getWaveformSelect();

        
        const storeButton = HTMLDrawer.getCommandButton("Store!", () => {this.store()});

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(txt1);
        lineDiv1.appendChild(this.#shapeSelect);
        lineDiv1.appendChild(txt2);
        lineDiv1.appendChild(this.#freqInput);
        lineDiv1.appendChild(txt3);
        lineDiv1.appendChild(this.#amplInput);
        lineDiv1.appendChild(txt31);
        lineDiv1.appendChild(this.#phaseInput);
        lineDiv1.appendChild(txt4);
        lineDiv1.appendChild(this.#durInput);
        lineDiv1.appendChild(txt5);
        lineDiv1.appendChild(this.#srInput);
        lineDiv1.appendChild(txt6);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(storeButton);

        wrapper.appendChild(lineDiv1);
    }

    store()
    {
        const val = this.#wfs1.value;
        const waveform = WaveformCollection.getWaveform(val);
        if (waveform == null) return;

        const shape = this.#shapeSelect.value;
        if (shape == "" || shape == null) return;

        let freq = parseFloat(this.#freqInput.value);
        if (freq > 20000 || freq < 1 || isNaN(freq)) return;

        let amplitude = parseFloat(this.#amplInput.value);
        if (amplitude > 1.0 || amplitude < 0 || isNaN(amplitude)) return;

        let phase = parseFloat(this.#phaseInput.value);
        if (phase < 0.0 || phase > 360.0 || isNaN(phase)) return;

        let duration = parseFloat(this.#durInput.value);
        if (duration < 0.005 || duration > 3600 || isNaN(duration)) return;

        let samplerate = parseInt(this.#srInput.value);
        if (samplerate < 8000 || samplerate > 96000 || isNaN(samplerate)) return;

        waveform.setWaveform(freq, duration, samplerate, shape, amplitude, phase);
        WaveformCollection.redraw();

    }
}