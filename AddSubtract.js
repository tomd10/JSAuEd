class AddSubtract
{
    #wfs1;
    #wfs2;
    #wfs3;

    #opSelect;
    #wrapChk;
    //Module 6
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Add/Subtract", "addsubtract");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();

        this.#wfs1 = HTMLDrawer.getWaveformSelect();

        const helpDiv1 = HTMLDrawer.getHelpText(" = ");

        this.#wfs2 = HTMLDrawer.getWaveformSelect();

        this.#opSelect = HTMLDrawer.getSelect(["+", "-"]);
        
        this.#wfs3 = HTMLDrawer.getWaveformSelect();

        const operateButton = HTMLDrawer.getCommandButton("Add/Subtract!", () => {this.operate()});

        
        const lineDiv2 = HTMLDrawer.getLineDiv();

        this.#wrapChk = HTMLDrawer.getCheckbox(true);
        const helpDiv2 = HTMLDrawer.getHelpText("Wrap around");

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs2);
        lineDiv1.appendChild(this.#opSelect);
        lineDiv1.appendChild(this.#wfs3);
        lineDiv1.appendChild(operateButton);

        lineDiv2.appendChild(this.#wrapChk);
        lineDiv2.appendChild(helpDiv2);

        wrapper.appendChild(lineDiv1);
        wrapper.appendChild(lineDiv2);

        document.getElementById("modules").appendChild(mainWrapper);
    }


    operate()
    {
        const waveform1 = WaveformCollection.getWaveform(this.#wfs1.value);
        const waveform2 = WaveformCollection.getWaveform(this.#wfs2.value);
        const waveform3 = WaveformCollection.getWaveform(this.#wfs3.value);
        if (waveform1 == null || waveform2 == null || waveform3 == null) return;

        if (this.#opSelect.value == "+")
        {
            waveform1.add(waveform2, waveform3, this.#wrapChk.checked, true);
        }

        if (this.#opSelect.value == "-")
        {
            waveform1.add(waveform2, waveform3, this.#wrapChk.checked, false);
        }

        WaveformCollection.redraw();
    }
}