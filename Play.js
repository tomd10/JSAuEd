class Play
{
    #wfs1;
    //Module 2
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Play audio", "playaudio");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
        

        const lineDiv1 = HTMLDrawer.getLineDiv();

        this.#wfs1 = HTMLDrawer.getWaveformSelect();

        const playButton = HTMLDrawer.getCommandButton("Play", () => {this.play()});
        const pauseButton = HTMLDrawer.getCommandButton("Pause", () => {this.pause()});
        const stopButton = HTMLDrawer.getCommandButton("Stop", () => {this.stop()});

        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(playButton);
        lineDiv1.appendChild(pauseButton);
        lineDiv1.appendChild(stopButton);

        wrapper.appendChild(lineDiv1);
    }

    play()
    {
        
        const val = this.#wfs1.value;
        const waveform = WaveformCollection.getWaveform(val);
        if (waveform == null) return;

        AudioWrapper.PlayAudio(waveform.waveform, waveform.samplerate);
    }

    pause()
    {
        return;
        AudioWrapper.PausePlay();
    }

    stop()
    {
        AudioWrapper.StopPlay();
    }
}