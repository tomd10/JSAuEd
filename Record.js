class Record
{
    constructor()
    {
        //operationWrapperDiv
            //operationHeaderDiv
            //operationDiv

            //pomocny text helptextDiv
            //select pro wf waveformSelect
            //accept nebo doSomething buttons commandButton
        const mainWrapper = document.createElement("div");
        mainWrapper.classList.add("operationWrapperDiv");

        const wrapper = document.createElement("div");
        wrapper.classList.add("operationDiv");
        
        const header = document.createElement("div");
        header.innerHTML = "Record";
        header.classList.add("operationHeaderDiv");
        header.addEventListener("click", () => {
            if (wrapper.classList.contains("invisible"))
            {
                wrapper.classList.remove("invisible");
            }
            else wrapper.classList.add("invisible");
        });
    
        //Line 1
        const lineDiv1 = document.createElement("div");
        lineDiv1.classList.add("operationLineDiv");

        const startRecButton = document.createElement("button");
        startRecButton.classList.add("auxButton");
        startRecButton.innerHTML = "Start recording";
        startRecButton.addEventListener("click", () => {this.startRecord()}); 

        const stopRecButton = document.createElement("button");
        stopRecButton.classList.add("auxButton");
        stopRecButton.innerHTML = "Stop recording";
        stopRecButton.addEventListener("click", () => {this.stopRecord()});       
        
        //Line 2
        const lineDiv2 = document.createElement("div");
        lineDiv2.classList.add("operationLineDiv");

        const helpDiv1 = document.createElement("div");
        helpDiv1.id = "recLengthDiv";
        helpDiv1.classList.add("helptextDiv");
        helpDiv1.innerHTML = "Store recording to waveform ";
        

        const wfSelect1 = document.createElement("select");
        wfSelect1.classList.add("waveformSelect");
        wfSelect1.id = "mod1_0WaveformSelect";
        WaveformCollection.setWaveformSelect(wfSelect1);
        
        const storeButton = document.createElement("button");
        storeButton.classList.add("commandButton");
        storeButton.innerHTML = "Store!";
        storeButton.addEventListener("click", () => {this.storeRecord()});
        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(startRecButton);
        lineDiv1.appendChild(stopRecButton);

        lineDiv2.appendChild(helpDiv1);
        lineDiv2.appendChild(wfSelect1);
        lineDiv2.appendChild(storeButton);

        wrapper.appendChild(lineDiv1);
        wrapper.appendChild(lineDiv2);
        document.getElementById("modules").appendChild(mainWrapper);
    }


    startRecord()
    {
        AudioWrapper.RecordAudio();
    }

    stopRecord()
    {
        AudioWrapper.StopRecord();

        if (AudioWrapper.recordedWaveform == null) return;

        let time = Math.floor(AudioWrapper.recordedWaveform.length / AudioWrapper.samplerate);

        document.getElementById("recLengthDiv").innerHTML = "Store " + time + " sec recording to waveform";
    }

    storeRecord()
    {
        const waveform = WaveformCollection.getWaveform(document.getElementById("mod1_0WaveformSelect").value);
        if (waveform == null) return;

        if (AudioWrapper.recordedWaveform == null) return;

        waveform.setSamples(AudioWrapper.recordedWaveform, AudioWrapper.samplerate);
    }
}