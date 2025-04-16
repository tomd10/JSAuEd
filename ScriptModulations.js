class ScriptModulations
{
    #state = -1;
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Script 5: Modulations", "scriptTremolo");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
    
        //Line 1
        const lineDiv1 = HTMLDrawer.getLineDiv();
        //const helpDiv1 = HTMLDrawer.getHelpText("Reverse waveform ");
        const buttonInit = HTMLDrawer.getCommandButton("Initialize", () => {this.init();});
        const buttonForward = HTMLDrawer.getCommandButton("Forward", () => {this.forward();});
        const buttonBackward = HTMLDrawer.getCommandButton("Backward", () => {this.backward();});
        const buttonHelp = HTMLDrawer.getAuxButton("Help", () => {this.help();});


        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);
        
        lineDiv1.appendChild(buttonInit);
        lineDiv1.appendChild(buttonHelp);
        lineDiv1.appendChild(buttonForward);
        lineDiv1.appendChild(buttonBackward);

        wrapper.appendChild(lineDiv1);
    }

    init()
    {
        this.#state = 0;
        this.applyScenery(this.#state);
    }

    help()
    {

    }

    forward()
    {
        if (this.#state >= 0 && this.#state < 3)
        {
            this.#state = this.#state + 1;
            this.applyScenery(this.#state);
        }
    }

    backward()
    {
        if (this.#state > 0)
        {
            this.#state = this.#state - 1;
            this.applyScenery(this.#state);
        }
    }

    applyScenery(step)
    {
        for (let i = 0; i <= step; i++ )
        {
            this.scenery[i]();
        }
        WaveformCollection.redraw();
    }

    scenery = [
        function () {
            WaveformCollection.viewers[0].setScale(1000);
            WaveformCollection.viewers[1].setScale(1000);

            WaveformCollection.waveforms[0].setSamples(sampleData2, 44100);
            WaveformCollection.waveforms[1].setWaveform(1000, 15, 44100, "sine", 0.9);
        },
        function () {
            WaveformCollection.waveforms[1].modulate(WaveformCollection.waveforms[0], 0.9, true);
        },
        function () {
            WaveformCollection.waveforms[1].freqModulate(440, 440, WaveformCollection.waveforms[0]);
        },
        function () {
            WaveformCollection.waveforms[1].phaseModulate(440, 180, WaveformCollection.waveforms[0]);
        }
    ];

}