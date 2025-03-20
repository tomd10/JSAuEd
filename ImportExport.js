class ImportExport
{
    static exportFile(waveform)
    {
        const blob = waveform.getWAVBlob();
        const url = URL.createObjectURL(waveform1.getWAVBlob());  
        const a = document.createElement("a");
        a.href = url;
        a.download = "pokus.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static importFile(waveform)
    {
        
    }
}