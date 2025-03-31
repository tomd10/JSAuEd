class ImportExport
{
    static samplerate = null;
    static waveform = null;

    #wfs1;
    #wfs2;
    #inputFilename;
    //MODULE 0
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("Import & Export");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
        
        const lineDiv1 = HTMLDrawer.getLineDiv();

        const importDiv = HTMLDrawer.getHelpText("Export waveform ");


        this.#wfs1 = HTMLDrawer.getWaveformSelect();     
        const importDiv2 = HTMLDrawer.getHelpText(" as ");
        this.#inputFilename = HTMLDrawer.getTextInput("wave.wav");
        const exportButton = HTMLDrawer.getCommandButton("Export!", () => {this.exportFile()});

        //Line 2
        const lineDiv2 = HTMLDrawer.getLineDiv();

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
        const lineDiv3 = HTMLDrawer.getLineDiv();
        const storeDiv = HTMLDrawer.getHelpText("Store file to waveform ");
        this.#wfs2 = HTMLDrawer.getWaveformSelect();
        const storeButton = HTMLDrawer.getCommandButton("Import!", () => {this.importFile()});

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(importDiv);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(importDiv2);
        lineDiv1.appendChild(this.#inputFilename);
        lineDiv1.appendChild(exportButton);

        lineDiv2.appendChild(uploadDiv);

        lineDiv3.appendChild(storeDiv);
        lineDiv3.appendChild(this.#wfs2);
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
        const waveform = WaveformCollection.getWaveform(this.#wfs1.value);
        if (waveform == null) return;

        const blob = waveform.getWAVBlob();
        const url = URL.createObjectURL(blob);  
        const a = document.createElement("a");
        a.href = url;

        if (this.#inputFilename.value != "")
        {
            a.download = this.#inputFilename.value;
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
        const wf = WaveformCollection.getWaveform(this.#wfs2.value);
        if (wf == null) return;

        if (ImportExport.samplerate == null || ImportExport.waveform == null) return;
        wf.setSamples(ImportExport.waveform, ImportExport.samplerate);

        WaveformCollection.redraw();

    }
}