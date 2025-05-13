class DCOffset
{
    #wfs1;
    #valueInput;
    //Module 7
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("DC Offset", "dcoffset");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();
        const helpDiv1 = HTMLDrawer.getHelpText("Offset waveform ");
        
        this.#wfs1 = HTMLDrawer.getWaveformSelect();
        const helpDiv2 = HTMLDrawer.getHelpText(" by "); 
        this.#valueInput = HTMLDrawer.getTextInput("0.5");
        const helpDiv3 = HTMLDrawer.getHelpText(" relative. ")   
        const offsetButton = HTMLDrawer.getCommandButton("Offset!", () => {this.offset()} );

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv2);
        lineDiv1.appendChild(this.#valueInput);
        lineDiv1.appendChild(helpDiv3);
        lineDiv1.appendChild(offsetButton);

        wrapper.appendChild(lineDiv1);
    }


    offset()
    {
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) return;

        const offset = parseFloat(this.#valueInput.value);
        if (isNaN(offset) || offset > 2.0 || offset < -2.0) {HTMLDrawer.showPopup("ERROR", ["Incorrect offset value"], "error"); return;}
        

        waveform.offset(offset);
        WaveformCollection.redraw();
    }
}