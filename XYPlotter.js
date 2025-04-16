class XYPlotter
{

    #wfs1;
    #wfs2;
    #canvas;
    //MODULE 9
    constructor()
    {
        const hdr = HTMLDrawer.getHeader("XY Plotter", "xyplotter");
        const mainWrapper = hdr[0];
        const wrapper = hdr[1];    
        const header = hdr[2];
        
        const lineDiv1 = HTMLDrawer.getLineDiv();

        const helpDiv1 = HTMLDrawer.getHelpText("X axis waveform: ");
        this.#wfs1 = HTMLDrawer.getWaveformSelect();     
        const helpDiv2 = HTMLDrawer.getHelpText("Y axis waveform ");
        this.#wfs2 = HTMLDrawer.getWaveformSelect();  
        const plotButton = HTMLDrawer.getCommandButton("Plot!", () => {this.plot()});

        this.#canvas = HTMLDrawer.getCanvas();

        mainWrapper.appendChild(header);
        mainWrapper.appendChild(wrapper);

        lineDiv1.appendChild(helpDiv1);
        lineDiv1.appendChild(this.#wfs1);
        lineDiv1.appendChild(helpDiv2);
        lineDiv1.appendChild(this.#wfs2);
        lineDiv1.appendChild(this.#canvas);
        lineDiv1.appendChild(plotButton);

        wrapper.appendChild(lineDiv1);
    }

    plot()
    {
        const waveform1 = WaveformCollection.getWaveform(this.#wfs1.value);
        const waveform2 = WaveformCollection.getWaveform(this.#wfs2.value);
        if (waveform1 == null || waveform2 == null) return;

        const width = this.#canvas.width;
        const height = this.#canvas.height;
        const ctx = this.#canvas.getContext('2d');

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.lineWidth = 3;

        ctx.strokeStyle = 'gray';
        ctx.moveTo(0.25 * width, 0);
        ctx.lineTo(0.25 * width, height);
        ctx.moveTo(0.5 * width, 0);
        ctx.lineTo(0.5 * width, height);
        ctx.moveTo(0.75 * width, 0);
        ctx.lineTo(0.75 * width, height);
        ctx.moveTo(0, 0.5 * height);
        ctx.lineTo(width, 0.5 * height);
        ctx.moveTo(0, 0.25*height);
        ctx.lineTo(width, 0.25*height);
        ctx.moveTo(0, 0.75*height);
        ctx.lineTo(width, 0.75*height);
        ctx.stroke();

        ctx.fillStyle = "blue";

        const pointCount = Math.min(waveform1.length, waveform2.length);
        
        for (let i = 0; i < pointCount; i++)
        {
            const xCoord = 0.98*width * ((waveform1.getSample(i) + 32768)/65536) + 0.01*width;
            const yCoord = 0.98*height * ((waveform2.getSample(i) + 32768)/65536) + 0.01*height;

            ctx.fillRect(xCoord, yCoord, 2, 2);
        }
    }
}