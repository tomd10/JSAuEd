class WaveformCollection
{
    static waveforms = [];
    static viewers = [];

    constructor()
    {

    }

    static addWaveform()
    {

    }

    static init()
    {
        let wf1 = new Waveform();
        let wf2 = new Waveform();

        let wv1 = new WaveformViewer("0", wf1);
        let wv2 = new WaveformViewer("1", wf2);

        this.waveforms.push(wf1);
        this.viewers.push(wv1);

        this.waveforms.push(wf2);
        this.viewers.push(wv2);

        this.redraw();
    }

    static redraw()
    {
        this.viewers.forEach((wfv) => wfv.draw());
    }
}