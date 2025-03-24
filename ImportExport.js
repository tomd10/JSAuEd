class ImportExport
{
    static samplerate = null;
    static waveform = null;
    //MODULE 0
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
        header.innerHTML = "Import & Export";
        header.classList.add("operationHeaderDiv");
        header.addEventListener("click", () => {
            if (wrapper.classList.contains("invisible"))
            {
                wrapper.classList.remove("invisible");
            }
            else wrapper.classList.add("invisible");
        });
        
        const lineDiv1 = document.createElement("div");
        lineDiv1.classList.add("operationLineDiv");

        const importDiv = document.createElement("div");
        importDiv.classList.add("helptextDiv");
        importDiv.innerHTML = "Export waveform ";

        const wfSelect1 = document.createElement("select");
        wfSelect1.classList.add("waveformSelect");
        wfSelect1.id = "mod0_0WaveformSelect";
        WaveformCollection.setWaveformSelect(wfSelect1);
        
        const importDiv2 = document.createElement("div");
        importDiv2.classList.add("helptextDiv");
        importDiv2.innerHTML = " as ";

        const inputFilename = document.createElement("input");
        inputFilename.type = "text";
        inputFilename.id = "fileDownloadInput";
        inputFilename.value = "wave.wav";

        const exportButton = document.createElement("button");
        exportButton.classList.add("commandButton");
        exportButton.innerHTML = "Export!";
        exportButton.addEventListener("click", () => {this.exportFile()});

        

        //Line 2
        const lineDiv2 = document.createElement("div");
        lineDiv2.classList.add("operationLineDiv");

        const uploadDiv = document.createElement("div");
        uploadDiv.id = "uploadWrapperDiv";

        const label = document.createElement("label");
        label.setAttribute("for", "fileUploadInput");
        label.id = "fileUploadLabel";
        label.innerHTML = "Upload WAV file";

        const input = document.createElement("input");
        input.type = "file";
        input.id = "fileUploadInput";
        input.name = "wavupload";
        input.addEventListener("change", this.uploaded);
        input.style.display = "none";


        uploadDiv.appendChild(label);
        uploadDiv.appendChild(input);



        //Line 3
        const lineDiv3 = document.createElement("div");
        lineDiv3.classList.add("operationLineDiv");

        const storeDiv = document.createElement("div");
        storeDiv.classList.add("helptextDiv");
        storeDiv.innerHTML = "Store file to waveform ";
        

        const wfSelect2 = document.createElement("select");
        wfSelect2.classList.add("waveformSelect");
        wfSelect2.id = "mod0_1WaveformSelect";
        WaveformCollection.setWaveformSelect(wfSelect2);
        

        const storeButton = document.createElement("button");
        storeButton.classList.add("commandButton");
        storeButton.innerHTML = "Import!";
        storeButton.addEventListener("click", () => {this.importFile()});

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(importDiv);
        lineDiv1.appendChild(wfSelect1);
        lineDiv1.appendChild(importDiv2);
        lineDiv1.appendChild(inputFilename);
        lineDiv1.appendChild(exportButton);

        lineDiv2.appendChild(uploadDiv);

        lineDiv3.appendChild(storeDiv);
        lineDiv3.appendChild(wfSelect2);
        lineDiv3.appendChild(storeButton);

        wrapper.appendChild(lineDiv1);
        wrapper.appendChild(lineDiv2);
        wrapper.appendChild(lineDiv3);
        
        document.getElementById("modules").appendChild(mainWrapper);
    }

    async uploaded()
    {
        const fileInput = document.getElementById("fileUploadInput");

        //Valid upload?
        if(fileInput.files.length == 0) return;

        let file = fileInput.files[0];
        
        //Header exists?
        if (file.size <= 44) return;

        const arrayBuffer = await file.arrayBuffer();
        const dataView = new DataView(arrayBuffer);

        //Header RIFF?
        if (dataView.getUint32(0, false) !== 1380533830) return;

        //File size OK?
        if (file.size - 8 != dataView.getUint32(4, true)) return;

        //Channel count 
        if (dataView.getUint16(22, true) != 1) return;

        //16 bit signed?
        if (dataView.getUint16(34, true) != 16) return;


        ImportExport.samplerate = dataView.getUint16(24, true);
        ImportExport.waveform = new Int16Array(arrayBuffer, 44, (file.size - 44)/2);
        
        console.log(ImportExport.samplerate);
        console.log(ImportExport.waveform);

        console.log("SAVED WAVEFORMS!!!");
        //console.log(this);
    }

    exportFile()
    {
        const waveform = WaveformCollection.getWaveform(document.getElementById("mod0_0WaveformSelect").value);
        if (waveform == null) return;

        const blob = waveform.getWAVBlob();
        const url = URL.createObjectURL(blob);  
        const a = document.createElement("a");
        a.href = url;

        if (document.getElementById("fileDownloadInput").value != "")
        {
            a.download = document.getElementById("fileDownloadInput").value;
        }
        else
        {
            a.download = "waveform.wav";
        }
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importFile()
    {
        console.log("storing");
        const wf = WaveformCollection.getWaveform(document.getElementById("mod0_1WaveformSelect").value);
        if (wf == null) return;

        console.log("got wf");

        console.log(this.samplerate);
        console.log(this.waveform);
        console.log(this);
        if (ImportExport.samplerate == null || ImportExport.waveform == null) return;
        wf.setSamples(ImportExport.waveform, ImportExport.samplerate);

        WaveformCollection.redraw();

    }
}