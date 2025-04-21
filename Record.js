class Record
{
    #wfs1;
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Record", "record", "src");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();

        const startRecButton = HTMLDrawer.getAuxButton("Start recording", () => {this.startRecord()});
        const stopRecButton = HTMLDrawer.getAuxButton("Stop recording", () => {this.stopRecord()});
   
        
        //Line 2
        const lineDiv2 = HTMLDrawer.getLineDiv();

        const helpDiv1 = HTMLDrawer.getHelpText("Store recording to waveform ");

        

        this.#wfs1 = HTMLDrawer.getWaveformSelect();
        
        const storeButton = HTMLDrawer.getCommandButton("Store", () => {this.storeRecord()});

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(startRecButton);
        lineDiv1.appendChild(stopRecButton);

        lineDiv2.appendChild(helpDiv1);
        lineDiv2.appendChild(this.#wfs1);
        lineDiv2.appendChild(storeButton);

        wrapper.appendChild(lineDiv1);
        wrapper.appendChild(lineDiv2);
    }


    startRecord()
    {
        AudioWrapper.RecordAudio();
    }

    async stopRecord()
    {
        await AudioWrapper.StopRecord();

        if (AudioWrapper.recordedWaveform == null) return;

        let time = Math.floor(AudioWrapper.recordedWaveform.length / AudioWrapper.samplerate);

        document.getElementById("recLengthDiv").innerHTML = "Store " + time + " sec recording to waveform";
        console.log(document.getElementById("recLengthDiv"));
    }

    storeRecord()
    {
        const val = this.#wfs1.value;
        const waveform = WaveformCollection.getWaveform(val);
        if (waveform == null) return;

        if (AudioWrapper.recordedWaveform == null) return;

        waveform.setSamples(AudioWrapper.recordedWaveform, AudioWrapper.samplerate);
        WaveformCollection.clear(val);
    }
}