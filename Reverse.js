class Reverse
{
    #wfs1;
    //Module 5
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Reverse");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();
        const helpDiv1 = HTMLDrawer.getHelpText("Reverse waveform ");
        
        this.#wfs1 = HTMLDrawer.getWaveformSelect();
        
        const reverseButton = HTMLDrawer.getCommandButton("Reverse!", () => {this.reverse()});
        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(reverseButton);

        wrapper.appendChild(lineDiv1);
        document.getElementById("modules").appendChild(mainWrapper);
    }


    reverse()
    {
        const val = this.#wfs1.value;
        const waveform = WaveformCollection.getWaveform(val);
        if (waveform == null) return;

        waveform.reverse();
        WaveformCollection.redraw();
    }
}