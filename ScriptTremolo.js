class ScriptTremolo
{
    #state = -1;
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Script 3: Tremolo", "scriptTremolo");
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
        if (this.#state >= 0 && this.#state < 1)
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
        async function () {
            WaveformCollection.viewers[0].setScale(1000);
            WaveformCollection.viewers[1].setScale(1000);

            WaveformCollection.waveforms[0].setSamples(sampleData1, 44100);
            WaveformCollection.waveforms[1].setWaveform(2.5, 4, 44100, "sine", 0.6);
        },
        function () {
            WaveformCollection.waveforms[0].modulate(WaveformCollection.waveforms[1], 0.8, true);
        }
        
    ];

}