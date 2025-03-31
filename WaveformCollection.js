class WaveformCollection
{
    static waveforms = [];
    static viewers = [];

    constructor()
    {

    }

    static clear(id)
    {
        this.viewers.forEach((wfv) => {
            if (wfv.getId() == id)
            {
                wfv.clear();
            }
        });
    }

    static getWaveform(id)
    {
        for (const wf of this.waveforms)
        {
            if (wf.id == id) return wf;
        }
        return null;
    }

    static addWaveform()
    {

    }



    static init()
    {
        let wf1 = new Waveform("0");
        let wf2 = new Waveform("1");

        let wv1 = new WaveformViewer(wf1);
        let wv2 = new WaveformViewer(wf2);

        this.waveforms.push(wf1);
        this.viewers.push(wv1);

        this.waveforms.push(wf2);
        this.viewers.push(wv2);

        this.redraw();
    }

    static setWaveformSelect(select)
    {
        select.innerHTML = "";
        this.waveforms.forEach((wfv) => {
            console.log(wfv.id);
            let opt = document.createElement("option");
            opt.innerHTML = wfv.id;
            opt.value = wfv.id;
            select.appendChild(opt);
        });
    }

    static setAllWaveformSelects()
    {

    }

    static redraw()
    {
        this.viewers.forEach((wfv) => wfv.draw());
    }
}