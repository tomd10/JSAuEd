class Init
{
    static init()
    {


    }
}

const sample = new Array();
for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 50000; i++) {
        sample.push(Math.floor(32767 * Math.sin(i * 0.1)));
    }
    for (let i = 0; i < 50000; i++) {
        sample.push(Math.floor(10000 * Math.sin(i * 0.1)));
    }
}

const sample2 = new Array()
{
    for (let i = 0; i < 2000000; i++)
    {
        if (i % 100 > 50) sample2.push(i % 30000);
        else sample2.push(-1*(i %30000));
    }
}

AudioWrapper.Init();
WaveformCollection.init();
ModuleCollection.init();
HTMLDrawer.draw();


/*

const waveform1 = new Waveform(44100);
const waveform2 = new Waveform(44100);

waveform1.setSamples(sample, 44100);
waveform2.setWaveform(440, 20, 44100, "sine");

const wave = new WaveformViewer("waveform1", waveform1);
wave.draw();

const wave2 = new WaveformViewer("waveform2", waveform2,96000);
wave2.draw();

const url = URL.createObjectURL(waveform1.getWAVBlob());  
const a = document.createElement("a");
a.href = url;
a.download = "pokus.wav";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
*/