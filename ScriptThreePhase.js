class ScriptThreePhase
{
    #state = -1;
    #stateDiv;
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Script 4: Three phase AC", "scriptThreePhase", "script");
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

        this.#stateDiv = HTMLDrawer.getHelpText("Current state: Not initialized");
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);
        
        lineDiv1.appendChild(buttonInit);
        lineDiv1.appendChild(buttonHelp);
        lineDiv1.appendChild(buttonForward);
        lineDiv1.appendChild(buttonBackward);
        lineDiv1.appendChild(this.#stateDiv);
        
        wrapper.appendChild(lineDiv1);
    }

    init()
    {
        this.#state = 0;
        this.applyScenery(this.#state);
    }

    help()
    {
        HTMLDrawer.showPopup("Three phase AC script description", ["The Three phase AC script shows you that difference of two sinewaves with phase difference of 120 degrees gives greater amplitude (by factor of sqrt(3)). The steps are:", "0 and 120 degrees phase", "Difference of waveforms from previous step", "120 and 240 degrees", "Difference of waveforms from previous step", "240 and 0 degrees", "Difference of waveforms from previous step"], "info");

    }

    forward()
    {
        if (this.#state >= 0 && this.#state < 5)
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
        this.#stateDiv.innerHTML = "Current state: " + step;
        WaveformCollection.redraw();
    }

    scenery = [
        function () {
            WaveformCollection.viewers[0].setScale(100);
            WaveformCollection.viewers[1].setScale(100);

            WaveformCollection.waveforms[0].setWaveform(50, 2, 44100, "sine", 0.5, 0);
            WaveformCollection.waveforms[1].setWaveform(50, 2, 44100, "sine", 0.5, 120);
        },
        function () {
            WaveformCollection.waveforms[0].add(WaveformCollection.waveforms[0], WaveformCollection.waveforms[1], false, false);
        },
        function () {
            WaveformCollection.waveforms[0].setWaveform(50, 2, 44100, "sine", 0.5, 0);
            WaveformCollection.waveforms[1].setWaveform(50, 2, 44100, "sine", 0.5, 240);
        },
        function () {
            WaveformCollection.waveforms[0].add(WaveformCollection.waveforms[0], WaveformCollection.waveforms[1], false, false);
        },
        function () {
            WaveformCollection.waveforms[0].setWaveform(50, 2, 44100, "sine", 0.5, 120);
            WaveformCollection.waveforms[1].setWaveform(50, 2, 44100, "sine", 0.5, 240);
        },
        function () {
            WaveformCollection.waveforms[0].add(WaveformCollection.waveforms[0], WaveformCollection.waveforms[1], false, false);
        }
    ];

}