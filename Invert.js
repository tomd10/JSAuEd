class Invert
{
    #wfs1;
    //Module 4
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Invert", "invert");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();
        const helpDiv1 = HTMLDrawer.getHelpText("Invert waveform ");
        
        this.#wfs1 = HTMLDrawer.getWaveformSelect();;       
        const invertButton = HTMLDrawer.getCommandButton("Invert!", () => {this.invert()} );

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(invertButton);

        wrapper.appendChild(lineDiv1);
        document.getElementById("modules").appendChild(mainWrapper);
    }


    invert()
    {
        const val = this.#wfs1.value;
        const waveform = WaveformCollection.getWaveform(val);
        if (waveform == null) return;

        waveform.invert();
        WaveformCollection.redraw();
    }
}