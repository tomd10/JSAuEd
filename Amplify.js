class Amplify
{
    #wfs1;
    #valueInput;
    #amplifySelect;
    //Module 7
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Amplify");
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
        document.getElementById("modules").appendChild(mainWrapper);
    }


    amplify()
    {
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) return;

        const amplify = this.#amplifySelect.value;
        if (amplify == "" || amplify == null) return;

        const factor = parseFloat(this.#valueInput.value);
        if (isNaN(factor)) return;
        
        const isRelative = amplify == "relative";

        if (isRelative && factor < 0) return; 

        waveform.amplify(factor, isRelative);
        WaveformCollection.redraw();
    }
}