class Waveform
{
    #waveform;
    #samplerate;
    #length;
    #id;

    constructor(id)
    {
        this.#id = id;
        this.setWaveform(440, 10, 44100, "sine", 1);
    }

    get samplerate()
    {
        return this.#samplerate;
    }

    get id()
    {
        return this.#id;
    }

    get length()
    {
        return this.#waveform.length;
    }

    get waveform()
    {
        return this.#waveform;
    }

    setSamples(waveform, samplerate = 44100)
    {
        this.#waveform = waveform;
        this.#samplerate = samplerate;
    }

    setWaveform(frequency, duration, samplerate, shape, amplitude = 1)
    {
        if (duration < 1/samplerate) return;

        const pcmArray = new Int16Array(samplerate*duration);
        if (shape == "sine")
        {
            for (let i = 0; i < samplerate*duration; i++) {
                const sample = Math.sin((2 * Math.PI * frequency * i) / samplerate);
                pcmArray[i] = Math.floor(sample * 32768 * amplitude); 
            }
        }

        this.#waveform = pcmArray;
        this.#samplerate = samplerate;
    }

    /*

  toArrayBuffer() {

    */
    getWAVBlob()
    {
        const buffer = new ArrayBuffer(44 + this.length*2); // Ensure size includes PCM data
        console.log(44 + this.length*2);
        const view = new DataView(buffer);
        let offset = 0;
    
        function writeString(view, offset, string) {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }
    
        writeString(view, offset, "RIFF"); offset += 4;
        view.setUint32(offset, 36+this.length*2, true); offset += 4;
        writeString(view, offset, "WAVE"); offset += 4;
    
        writeString(view, offset, "fmt "); offset += 4;
        view.setUint32(offset, 16, true); offset += 4;
        view.setUint16(offset, 1, true); offset += 2;
        view.setUint16(offset, 1, true); offset += 2;
        view.setUint32(offset, this.samplerate, true); offset += 4;
        view.setUint32(offset, this.samplerate*2, true); offset += 4;
        view.setUint16(offset, 2, true); offset += 2;
        view.setUint16(offset, 16, true); offset += 2;
    
        writeString(view, offset, "data"); offset += 4;
        view.setUint32(offset, this.length*2, true); offset += 4;
    
        // Write PCM data properly
        const dataView = new Int16Array(buffer, offset, this.length);
        dataView.set(this.#waveform);
    
        const buf = buffer;
        return new Blob([buf], { type: "audio/wav" });
    }
}

