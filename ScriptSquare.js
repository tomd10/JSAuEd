class ScriptSquare
{
    #state = -1;
    #stateDiv;
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Script 2: Square wave", "scriptSquare", "script");
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
        HTMLDrawer.showPopup("Square wave script description", ["The Square wave script shows you that square wave can be created by a sum of its harmonic series. The harmonics are always odd (3 times, 5 times, 7 times and so on the base frequency) and the amplitude of N-th harmonic is always 1/N times the base tone amplitude."], "info");
    }

    forward()
    {
        if (this.#state >= 0 && this.#state < 16)
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
        WaveformCollection.viewers[0].setScale(10);
        WaveformCollection.viewers[1].setScale(10);

        WaveformCollection.waveforms[0].setWaveform(200, 2, 44100, "sine", 0.8);
        WaveformCollection.waveforms[1].setWaveform(600, 2, 44100, "sine", 0.8/3);

        
        for (let i = 1; i <= step; i++ )
        {
            WaveformCollection.waveforms[0].add(WaveformCollection.waveforms[0], WaveformCollection.waveforms[1], true, true);
            WaveformCollection.waveforms[1].setWaveform(200 * (3 + 2*i), 2, 44100, "sine", 0.8/(3 + 2*i));
        }


        this.#stateDiv.innerHTML = "Current state: " + step;
        WaveformCollection.redraw();
    }
}