class PM
{

    #wfs1;
    #freqInput;
    #depthInput;
    #wfs2;
    //MODULE 9
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Phase modulation", "phasemodulation");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
        
        const lineDiv1 = HTMLDrawer.getLineDiv();

        const helpDiv1 = HTMLDrawer.getHelpText("Phase modulate sinewave of frequency ");
        this.#freqInput = HTMLDrawer.getTextInput("440");
        const helpDiv2 = HTMLDrawer.getHelpText(" Hz by waveform ")
        this.#wfs1 = HTMLDrawer.getWaveformSelect();     
        const helpDiv3 = HTMLDrawer.getHelpText(" with modulation depth ");
        this.#depthInput = HTMLDrawer.getTextInput("180");
        const helpDiv4 = HTMLDrawer.getHelpText(" degrees and store the result into ");
        this.#wfs2 = HTMLDrawer.getWaveformSelect();  
        const lineDiv2 = HTMLDrawer.getLineDiv();
        const modulateButton = HTMLDrawer.getCommandButton("Modulate!", () => {this.modulate()});



        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#freqInput);
        lineDiv1.appendChild(helpDiv2);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv3);
        lineDiv1.appendChild(this.#depthInput);
        lineDiv1.appendChild(helpDiv4);
        lineDiv1.appendChild(this.#wfs2);
        lineDiv1.appendChild(modulateButton);
       

        wrapper.appendChild(lineDiv1);
    }

    modulate()
    {
        const waveform1 = WaveformCollection.getWaveform(this.#wfs1.value);
        const waveform2 = WaveformCollection.getWaveform(this.#wfs2.value);
        if (waveform1 == null || waveform2 == null) return;


        let freq = parseFloat(this.#freqInput.value);
        if (freq < 0 || freq > 20000 || isNaN(freq)) {HTMLDrawer.showPopup("ERROR", ["Frequency input format error!"], "error"); return;}

        let depth = parseFloat(this.#depthInput.value);
        if (depth < 0 || depth >= 360 || isNaN(depth)) {HTMLDrawer.showPopup("ERROR", ["Depth input format error!"], "error"); return;}

        waveform2.phaseModulate(freq, depth, waveform1);
        WaveformCollection.redraw();
    }
}