class ScriptRectifier
{
    #state = -1;
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Script 1: Rectifier", "scriptRectifier");
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
        HTMLDrawer.showPopup("Rectifier script description", "Description", "info");
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
            WaveformCollection.viewers[0].setScale(10);
            WaveformCollection.viewers[1].setScale(10);

            WaveformCollection.waveforms[0].setWaveform(200, 2, 44100, "sine", 0.8);
            WaveformCollection.waveforms[1].setWaveform(200, 2, 44100, "silence", 0.8);
        },
        function () {
            WaveformCollection.waveforms[1].setWaveform(200, 2, 44100, "sine", 0.8);
            WaveformCollection.waveforms[1].rectify(true);
        },
        function ()
        {
            WaveformCollection.waveforms[1].setWaveform(200, 2, 44100, "sine", 0.8);
            WaveformCollection.waveforms[1].rectify(false);
        },
        function ()
        {
            WaveformCollection.waveforms[1].setWaveform(200, 2, 44100, "silence", 0.8);
            WaveformCollection.waveforms[1].offset(0.8);
        }
    ];

}