class AM
{

    #wfs1;
    #wfs2;
    #depthInput;
    #wrapChk;
    //MODULE 9
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Amplitude modulation", "amplitudemodulation");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
        
        const lineDiv1 = HTMLDrawer.getLineDiv();

        const helpDiv1 = HTMLDrawer.getHelpText("Modulate waveform ");
        this.#wfs1 = HTMLDrawer.getWaveformSelect();     
        const helpDiv2 = HTMLDrawer.getHelpText(" by waveform ");
        this.#wfs2 = HTMLDrawer.getWaveformSelect();
        const helpDiv3 = HTMLDrawer.getHelpText(" with modulation depth ");
        this.#depthInput = HTMLDrawer.getTextInput("1");

        const lineDiv2 = HTMLDrawer.getLineDiv();
        this.#wrapChk = HTMLDrawer.getCheckbox(true);
        const helpDiv4 = HTMLDrawer.getHelpText("Wrap around");
        const modulateButton = HTMLDrawer.getCommandButton("Modulate!", () => {this.modulate()});



        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv2);
        lineDiv1.appendChild(this.#wfs2);
        lineDiv1.appendChild(helpDiv3);
        lineDiv1.appendChild(this.#depthInput);

        lineDiv2.appendChild(this.#wrapChk);
        lineDiv2.appendChild(helpDiv4);
        lineDiv1.appendChild(modulateButton);

        wrapper.appendChild(lineDiv1);
        wrapper.appendChild(lineDiv2);
    }

    modulate()
    {
        const waveform1 = WaveformCollection.getWaveform(this.#wfs1.value);
        const waveform2 = WaveformCollection.getWaveform(this.#wfs2.value);
        if (waveform1 == null || waveform2 == null) {HTMLDrawer.showPopup("ERROR", ["Waveform loading error!"], "error"); return;}

        if (waveform1.samplerate != waveform2.samplerate) {HTMLDrawer.showPopup("ERROR", ["Waveform samplerate mismatch!"], "error"); return;}

        let depth = parseFloat(this.#depthInput.value);
        if (depth > 1 || depth < 0 || isNaN(depth)) {HTMLDrawer.showPopup("ERROR", ["Modulation depth input format error!"], "error"); return;}

        let wrap = this.#wrapChk.checked;

        waveform1.modulate(waveform2, depth, wrap);
        WaveformCollection.redraw();
    }
}