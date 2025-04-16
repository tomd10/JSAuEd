class Waveform
{
    #waveform;
    #samplerate;
    #length;
    #id;

    constructor(id)
    {
        this.#id = id;
        this.setWaveform(440, 1, 44100, "sine", 1);
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

    getSample(i)
    {
        return this.#waveform[i];
    }

    getFloatSample(i)
    {
        return this.#waveform[i] / 32768;
    }

    getInvertedSample(i)
    {
        return -1 * this.#waveform[i] - 1;
    }

    getRectifiedSample(i, trim = false)
    {
        
        if (this.#waveform[i] >= 0) return this.getSample(i);
        else 
        {
            if (!trim) return this.getInvertedSample(i);
            else return 0;
            
        }
    }

    getTime()
    {
        return Math.floor(1000*this.#waveform.length/this.#samplerate);
    }

    setSamples(waveform, samplerate = 44100)
    {
        this.#waveform = waveform;
        this.#samplerate = samplerate;
    }

    setWaveform(frequency, duration, samplerate, shape, ampl = 1, phase = 0)
    {
        if (duration < 1/samplerate) return;

        let amplitude = 0.9999*ampl;

        const length = samplerate*duration;
        const pcmArray = new Int16Array(length);
        const samplesPerPeriod = samplerate / frequency;
        const initialSample = Math.floor((phase/360)*samplesPerPeriod);

        if (shape == "sine")
        {
            for (let i = initialSample; i < length + initialSample; i++) {
                const sample = Math.sin((2 * Math.PI * frequency * i) / samplerate);
                pcmArray[i - initialSample] = Math.floor(sample * 32768 * amplitude); 
            }
        }
        if (shape == "square")
        {
            for (let i = initialSample; i < length + initialSample; i++) {
                let sample;
                if (i % samplesPerPeriod < samplesPerPeriod / 2)
                {
                    sample = -32768 * amplitude;
                }
                else
                {
                    sample = 32767 * amplitude;
                }
                pcmArray[i - initialSample] = sample;
            }
        }
        if (shape == "sawtooth")
        {
            for (let i = initialSample; i < length + initialSample; i++) {
                let sample =Math.floor((amplitude * -32768) + (i % samplesPerPeriod) *((amplitude * 65535) / (samplesPerPeriod)));
                pcmArray[i - initialSample] = sample;
            }
        }
        if (shape == "noise")
        {
            for (let i = 0; i < length; i++) {
                let sample =Math.floor(amplitude*(Math.random() * 65535 - 32768));
                pcmArray[i] = sample;
            }
        }
        if (shape == "triangle")
        {
            for (let i = initialSample; i < length + initialSample; i++) {

                let sample;
                if (i % samplesPerPeriod < samplesPerPeriod / 2)
                {
                    sample = Math.floor((amplitude * -32768) + (i % samplesPerPeriod) *((2*amplitude * 65535) / (samplesPerPeriod)));
                }
                else
                {   
                    sample = 0;
                    sample = Math.floor((amplitude * 32768) - (i % samplesPerPeriod - (samplesPerPeriod/2)) *((2*amplitude * 65535) / (samplesPerPeriod)));
                }

                if (sample > 32767) sample = 32767;
                if (sample < -32768) sample = - 32768;

                pcmArray[i - initialSample] = sample;
            }
        }
        if (shape == "silence")
        {
            for (let i = 0; i < length; i++) {
                pcmArray[i] = 0;
            }
        }
        this.#waveform = pcmArray;
        this.#samplerate = samplerate;
    }

    invert()
    {
        for (let i = 0; i < this.#waveform.length; i++)
        {
            this.#waveform[i] = -1 * this.#waveform[i] - 1;
        }
    }

    reverse()
    {
        this.#waveform.reverse();
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

    add(wf1, wf2, wrap, positive)
    {
        if (wf1.samplerate != wf1.samplerate) return;


        let pcmArray; 

        //wrap no effect
        if (wf2.length >= wf1.length)
        {
            pcmArray = new Int16Array(wf2.length);

            for (let i = 0; i < wf2.length; i++)
            {
                let sample;
                if (i < wf1.length)
                {
                    if (positive) sample = wf2.getSample(i) + wf1.getSample(i);
                    else sample = wf2.getInvertedSample(i) + wf1.getSample(i);
                    
                    if (sample > 32767) sample = 32767;
                    if (sample < -32768) sample = -32768; 
                }
                else
                {
                    if (positive) sample = wf2.getSample(i);
                    else sample = wf2.getInvertedSample(i);
                    
                }
                pcmArray[i] = sample;
            }
        }
        else
        {
            pcmArray = new Int16Array(wf1.length);
            if (wrap)
            {
                for (let i = 0; i < wf1.length; i++)
                {   
                    let sample;
                    if (positive) sample = wf1.getSample(i) + wf2.getSample(i % wf2.length);
                    else sample = wf1.getSample(i) + wf2.getInvertedSample(i % wf2.length);

                    if (sample > 32767) sample = 32767;
                    if (sample < -32768) sample = -32768;
                    pcmArray[i] = sample;
                }
            }
            else
            {
                for (let i = 0; i < wf1.length; i++)
                    {
                        let sample;
                        if (i < wf2.length)
                        {
                            if (positive) sample = wf1.getSample(i) + wf2.getSample(i);
                            else sample = wf1.getSample(i) + wf2.getInvertedSample(i);
                        }
                        else sample = wf1.getSample(i);
                        
                        if (sample > 32767) sample = 32767;
                        if (sample < -32768) sample = -32768;
                        pcmArray[i] = sample;
                    }
            }
        }

        this.setSamples(pcmArray, this.#samplerate);
    }

    amplify(factor, isRelative)
    {
        let computedFactor;
        if (isRelative) computedFactor = factor;
        else
        {
            computedFactor = Math.pow(10, factor/20);
        }

        for (let i = 0; i < this.#waveform.length; i++)
        {       
            let sample = Math.floor(this.#waveform[i] * computedFactor);
            if (sample > 32767) sample = 32767;
            if (sample < -32768) sample = -32768;
            this.#waveform[i] = sample;
        }
    }

    cut(mms, sss, mss, mme, sse, mse)
    {
        let startSamples = Math.floor(this.#samplerate * (60*mms + sss + mss/1000));
        let endSamples = Math.floor(this.#samplerate * (60*mme + sse + mse/1000));

        console.log(startSamples, endSamples);
        console.log(this.#waveform);

        let pcmSamples = new Int16Array(this.#waveform.length - (endSamples - startSamples));
        let addedSamples = 0;

        for (let i = 0; i < this.#waveform.length; i++)
        {
            if (i < startSamples || i > endSamples)
            {
                //console.log(this.#waveform[i]);
                pcmSamples[addedSamples] = this.#waveform[i];
                addedSamples = addedSamples + 1;
            } 
        }

        console.log(pcmSamples);
        console.log(this.#waveform.length);
        this.#waveform = pcmSamples;


        //this.#waveform.splice(startSamples, (endSamples - startSamples) + 1);
    }

    modulate(waveform, depth, wrap)
    {
        let end = this.#waveform.length;
        if (!wrap && this.#waveform.length > waveform.length) end = waveform.length;

        for (let i = 0; i < end; i++)
            {
                this.#waveform[i] = Math.floor(this.#waveform[i] * (((waveform.getSample(i % waveform.length)+32768)/65535)*depth + 1 - depth));

            }

        return;
    }

    rectify(trim)
    {
        for (let i = 0; i < this.#waveform.length; i++)
        {
            this.#waveform[i] = this.getRectifiedSample(i, trim);
        }
    }

    offset(offset)
    {
        for (let i = 0; i < this.#waveform.length; i++)
        {
            let sample = this.#waveform[i] + (32767 * offset);
            if (sample > 32767) sample = 32767;
            if (sample < -32768) sample = -32768;
            this.#waveform[i] = sample;
        }
    }

    freqModulate(freq, depth, waveform)
    {
        const length = waveform.length;
        const pcmArray = new Int16Array(length);
        const samplerate = waveform.samplerate;

        let currentPhase = 0;
        for (let i = 0; i < length; i++)
        {
            let currentFrequency = freq + ((32768+waveform.getSample(i))/65536) * depth;

            let currentSPP = samplerate / currentFrequency;
            let currentPhaseIncrement = 360 / currentSPP;

            let currentSample = Math.floor(
                Math.sin((currentPhase*Math.PI)/(180)) * 32768
            );

            pcmArray[i] = currentSample;
            currentPhase = currentPhase + currentPhaseIncrement;
        }
        this.setSamples(pcmArray, waveform.samplerate);
    }

    phaseModulate(freq, depth, waveform)
    {
        const length = waveform.length;
        const pcmArray = new Int16Array(length);
        const samplerate = waveform.samplerate;
        const SPP = samplerate / freq;
        const phaseIncrement = 360 / SPP;

        let currentPhase = 0;
        for (let i = 0; i < length; i++)
        {
            let phaseDiff = ((32768+waveform.getSample(i))/65536) * depth;

            let currentSample = Math.floor(
                Math.sin(((currentPhase+phaseDiff)*Math.PI)/(180)) * 32768
            );

            pcmArray[i] = currentSample;
            currentPhase = currentPhase + phaseIncrement;
        }
        this.setSamples(pcmArray, waveform.samplerate);
    }
}

