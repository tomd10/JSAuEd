class Amplify
{
    #wfs1;
    #valueInput;
    #amplifySelect;
    //Module 7
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Amplify", "amplify");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();
        const helpDiv1 = HTMLDrawer.getHelpText("Amplify waveform ");
        
        this.#wfs1 = HTMLDrawer.getWaveformSelect();
        const helpDiv2 = HTMLDrawer.getHelpText(" by "); 
        this.#valueInput = HTMLDrawer.getTextInput("0.5");
        this.#amplifySelect = HTMLDrawer.getSelect(["relative", "dB"]);      
        const amplifyButton = HTMLDrawer.getCommandButton("Amplify!", () => {this.amplify()} );

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv2);
        lineDiv1.appendChild(this.#valueInput);
        lineDiv1.appendChild(this.#amplifySelect);
        lineDiv1.appendChild(amplifyButton);

        wrapper.appendChild(lineDiv1);
    }


    amplify()
    {
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) {HTMLDrawer.showPopup("ERROR", ["Waveform error!"], "error"); return;}

        const amplify = this.#amplifySelect.value;
        if (amplify == "" || amplify == null) {HTMLDrawer.showPopup("ERROR", ["Amplification factor input format error!"], "error"); return;}

        const factor = parseFloat(this.#valueInput.value);
        console.log(factor);
        if (isNaN(factor)) {HTMLDrawer.showPopup("ERROR", ["Amplification factor input format error!"], "error"); return;}
        
        const isRelative = amplify == "relative";
        if (isRelative && factor < 0) {HTMLDrawer.showPopup("ERROR", ["Relative amplification factor input format error!"], "error"); return;}

        waveform.amplify(factor, isRelative);
        WaveformCollection.redraw();
    }
}