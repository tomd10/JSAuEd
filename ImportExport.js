class ImportExport
{
    constructor()
    {
        const mainWrapper = document.createElement("div");
        mainWrapper.classList.add("operationWrapperDiv");

        const wrapper = document.createElement("div");
        wrapper.classList.add("operationDiv");
        

        const header = document.createElement("div");
        header.innerHTML = "Import & Export";
        header.classList.add("operationHeaderDiv");
        header.addEventListener("click", () => {
            if (wrapper.classList.contains("invisible"))
            {
                wrapper.classList.remove("invisible");
            }
            else wrapper.classList.add("invisible");
        });
        
        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);
        
        const importDiv = document.createElement("div");
        importDiv.classList.add("helptextDiv");
        importDiv.innerHTML = "Export waveform ";
        wrapper.appendChild(importDiv);

        const wfSelect1 = document.createElement("select");
        wfSelect1.classList.add("waveformSelect");
        wfSelect1.id = "exportWaveformSelect";
        WaveformCollection.setWaveformSelect(wfSelect1);
        wrapper.appendChild(wfSelect1);

        const exportButton = document.createElement("button");
        exportButton.classList.add("commandButton");
        exportButton.innerHTML = "Export!";
        exportButton.addEventListener("click", () => {this.exportFile()});
        wrapper.appendChild(exportButton);


        document.getElementById("modules").appendChild(mainWrapper);
    }


    exportFile()
    {
        const waveform = WaveformCollection.getWaveform(document.getElementById("exportWaveformSelect").value);
        if (waveform == null) return;

        const blob = waveform.getWAVBlob();
        const url = URL.createObjectURL(blob);  
        const a = document.createElement("a");
        a.href = url;
        a.download = "pokus.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importFile(waveform)
    {
        
    }
}