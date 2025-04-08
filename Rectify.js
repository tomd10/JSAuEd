class Rectify
{
    #wfs1;
    #trimChk;
    //Module 9
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Rectify", "rectify");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();
        const helpDiv1 = HTMLDrawer.getHelpText("Rectify waveform ");
        
        this.#wfs1 = HTMLDrawer.getWaveformSelect();

        const helpDiv2 = HTMLDrawer.getHelpText(" with trim "); 
        this.#trimChk = HTMLDrawer.getCheckbox(false);

        const rectifyButton = HTMLDrawer.getCommandButton("Rectify!", () => {this.rectify()} );

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv2);
        lineDiv1.appendChild(this.#trimChk);

        lineDiv1.appendChild(rectifyButton);

        wrapper.appendChild(lineDiv1);
    }


    rectify()
    {
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) return;

        waveform.rectify(this.#trimChk.checked);
        WaveformCollection.redraw();
    }
}