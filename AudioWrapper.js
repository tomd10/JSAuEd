class AudioWrapper
{
    constructor()
    {
        
    }

    static isPlaying = false;
    static isPaused = false;
    static audioContext = null;
    static source = null;

    static #stream = null;
    static #mediaRecorder = null;
    static recordedWaveform = null;
    static #recording = false;

    static samplerate = 44100;
    static recordingAvailable = true;
    static #audioChunks;
    static #initialized = false;

    static async Init()
    {
        if (!this.#initialized)
        {
            await this.InitAudio();
            await this.InitRecording();
            this.#initialized = true;
        }

    }

    static async InitAudio()
    {
        //PLAYING
        if (this.audioContext == null) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        //RECORDING
        await navigator.mediaDevices.getUserMedia({ audio: true })
        .then(response => {this.#stream = response; this.recordingAvailable = true;})
        .catch(err => {console.log(err); this.recordingAvailable = false;});
        console.log("initA finished");

    }

    static async InitRecording()
    {
                
        if (!this.recordingAvailable || this.#stream == null)
            {
                console.log("returning, no available or null");
                return;
            } 

        console.log(this.#stream);

        this.#mediaRecorder = new MediaRecorder(this.#stream);
        console.log(this.#mediaRecorder);
        this.#audioChunks = [];
      
        this.#mediaRecorder.ondataavailable = (event) => {
            this.#audioChunks.push(event.data);
        };

        this.#mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.#audioChunks, { type: "audio/webm" });
            const arrayBuffer = await audioBlob.arrayBuffer();
      
            // Decode WebM/OGG into PCM using AudioContext
            
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            //const sampleRate = stream.getAudioTracks()[0].getSettings().sampleRate;
            this.recordedWaveform = this.#float32ToInt16(audioBuffer.getChannelData(0));
            this.samplerate = this.#stream.getAudioTracks()[0].getSettings().sampleRate;
              console.log("16-bit PCM Data:", this.recordedWaveform);
              console.log(this.samplerate);
        };
    }


    static PlayAudio(samples, sampleRate)
    {
        this.StopRecord();

        console.log(samples);
        console.log(sampleRate);
        console.log(!this.isPlaying && !this.isPaused);
        if (!this.isPlaying && !this.isPaused) {
            let float32Array = new Float32Array(samples.length);
            for (let i = 0; i < samples.length; i++) {
                float32Array[i] = (samples[i] - 32768) / 32768;
            }
            let audioBuffer = this.audioContext.createBuffer(1, float32Array.length, sampleRate);
            audioBuffer.getChannelData(0).set(float32Array);


            this.source = this.audioContext.createBufferSource();
            this.source.buffer = audioBuffer;
            this.source.connect(this.audioContext.destination);
            this.source.onended = () => {
                this.isPlaying = false;
                this.source = null;
            }

            if (this.audioContext.state == "suspended") this.audioContext.resume();

            this.isPlaying = true;
            this.isPaused = false;
            this.source.start();            
        }
        else if (!this.isPlaying && this.isPaused)
        {
            console.log(this.audioContext.state);
            this.audioContext.resume();
            this.isPaused = false;
            this.isPlaying = true;
        }
    }

    static PausePlay()
    {
        if (this.isPlaying && !this.isPaused)
        {
            this.audioContext.suspend();
            this.isPlaying = false;
            this.isPaused = true;
        }
    }

    static StopPlay()
    {
        if (this.isPlaying || this.isPaused)
        {
            if (this.audioContext.state == "suspended")
            {
                this.audioContext.resume();
            }
            this.source.stop();
            this.isPlaying = false;
            this.isPaused = false;
            this.source = null;
        }
    }

    static RecordAudio()
    {
        if (!this.recordingAvailable) return;
        if (this.#recording == true) return;
        this.#recording = true;
        this.StopPlay();
        this.#audioChunks = [];
        this.#mediaRecorder.start();
        console.log("Recording started");
    }

    static StopRecord()
    {
        if (!this.recordingAvailable) return;
        if (this.#recording == false) return;
        this.#recording = false;
        this.#mediaRecorder.stop();
        console.log("Recording stopped");
    }

    static #float32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
      
        for (let i = 0; i < float32Array.length; i++) {
            let sample = float32Array[i];
      
            // Clamp between -1 and 1
            sample = Math.max(-1, Math.min(1, sample));
      
            // Convert to Int16 range (-32768 to 32767)
            int16Array[i] = sample < 0 ? sample * 32768 : sample * 32767;
        }
      
        return int16Array;
      }
}