class Init
{
    static init()
    {


    }
}




function debounce (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
    

window.addEventListener("resize", debounce(
    () => {HTMLDrawer.draw()}, 400
));

document.getElementById("popupButton").addEventListener("click", ()=>{
    HTMLDrawer.hidePopup();
});


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