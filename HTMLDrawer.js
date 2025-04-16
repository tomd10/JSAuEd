class HTMLDrawer
{
    static #waveformSelects = [];
    static #lineDivs = [];
    static #helpTexts = [];
    static #commandButtons = [];
    static #auxButtons = [];
    static #headers = [];
    static #textInputs = [];
    static #selects = [];
    static #checkboxes = [];
    static #canvases = [];

    static getWaveformSelect()
    {
        const wfSelect = document.createElement("select");
        wfSelect.classList.add("waveformSelect");
        WaveformCollection.setWaveformSelect(wfSelect);
        this.#waveformSelects.push(wfSelect);
        return wfSelect;
    }

    static getCanvas()
    {
        const canvas = document.createElement("canvas");
        canvas.classList.add("waveformCanvas");
        this.#canvases.push(canvas);
        return canvas
    }

    static getLineDiv()
    {
        const lineDiv = document.createElement("div");
        lineDiv.classList.add("operationLineDiv");
        this.#lineDivs.push(lineDiv);
        return lineDiv;
    }

    static getHelpText(txt)
    {
        const div = document.createElement("div");
        div.classList.add("helptextDiv");
        div.innerHTML = txt;

        this.#helpTexts.push(div);
        return div;
    }

    static getCommandButton(txt, func)
    {
        const button = document.createElement("button");
        button.classList.add("commandButton");
        button.type="button";
        button.innerHTML = txt;
        button.addEventListener("click", func);

        this.#commandButtons.push(button);
        return button;
    }

    static getAuxButton(txt, func)
    {
        const button = document.createElement("button");
        button.classList.add("auxButton");
        button.type="button";
        button.innerHTML = txt;
        button.addEventListener("click", func);

        this.#auxButtons.push(button);
        return button;
    }

    static getHeader(txt, id, isWaveform = false)
    {
        const mainWrapper = document.createElement("div");
        mainWrapper.id = id;
        if (isWaveform)
        {
            mainWrapper.classList.add("waveformWrapperDiv");
        }
        else
        {
            mainWrapper.classList.add("operationWrapperDiv");
        }
        
        mainWrapper.addEventListener("dragover", (ev) => {ev.preventDefault();});

        mainWrapper.addEventListener("drop", (ev) => {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            HTMLDrawer.swap(data, id);        
        });

        const wrapper = document.createElement("div");
        if (isWaveform)
        {
            wrapper.classList.add("waveformDiv");
        }
        else
        {
            wrapper.classList.add("operationDiv");
        }
        
        //if (hiddenByDefault) wrapper.classList.add("invisible");
        
        const header = document.createElement("div");
        header.id = id + "header";
        header.innerHTML = txt;

        if (isWaveform)
        {
            header.classList.add("waveformHeaderDiv");
        }
        else
        {
            header.classList.add("operationHeaderDiv");
        }

        
        header.addEventListener("click", () => {
            if (wrapper.classList.contains("invisible"))
            {
                wrapper.classList.remove("invisible");
            }
            else wrapper.classList.add("invisible");
        });

        header.addEventListener("dblclick", () => {
            HTMLDrawer.moveTop(id);
        });
        header.setAttribute("draggable", "true");
        header.addEventListener("dragstart", (ev) => {ev.dataTransfer.setData("text", id);});

        let headerRet = [mainWrapper, wrapper, header];
        this.#headers.push(headerRet);
        return headerRet;
    }

    static getTextInput(defaultVal)
    {
        const input = document.createElement("input");
        input.classList.add("textInput");
        input.type = "text";
        input.value = defaultVal;

        this.#textInputs.push(input);
        return input;
    }

    static getSelect(options)
    {
        const select = document.createElement("select");
        select.classList.add("select");

        options.forEach(((val) => {
            const option = document.createElement("option");
            option.innerHTML = val;
            option.value = val;
            select.appendChild(option);
        }));
        
        this.#selects.push(select);
        return select;
    }

    static getCheckbox(val)
    {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = val;
        //input.value = val;

        this.#checkboxes.push(input);
        return input;
    }

    static swap(idSrc, idDst)
    {
        if (idSrc == idDst) return;
        if (idSrc.startsWith("wf") && !idDst.startsWith("wf")) return;
        if (idDst.startsWith("wf") && !idSrc.startsWith("wf")) return;

        let indexSrc, indexDst;
        let src;
        for (let i = 0; i < HTMLDrawer.#headers.length; i++)
        {
            if (HTMLDrawer.#headers[i][0].id == idSrc) {indexSrc = i; src = this.#headers[i];}
            if (HTMLDrawer.#headers[i][0].id == idDst) indexDst = i;
        }

        this.#headers.splice(indexSrc, 1);
        this.#headers.splice(indexDst, 0, src);
        
        this.draw();
    }

    static draw()
    {
        const container = document.getElementById("container");
        container.innerHTML = "";

        const waveforms = document.createElement("div");
        waveforms.id = "waveforms";
        const favOps = document.createElement("div");
        favOps.id = "favOps";
        const ops = document.createElement("div");
        ops.id = "ops";

        let count = 0;
        for (let i = 0; i < HTMLDrawer.#headers.length; i++)
        {
            if (HTMLDrawer.#headers[i][0].id.startsWith("wf"))
            {
                waveforms.appendChild(HTMLDrawer.#headers[i][0]);
            }
            else
            {
                if (count < 5)
                {
                    favOps.appendChild(HTMLDrawer.#headers[i][0]);
                    count = count + 1;
                }
                else
                {
                    ops.appendChild(HTMLDrawer.#headers[i][0]);
                }
            }
        }
    

        container.appendChild(waveforms);
        container.appendChild(favOps);
        container.appendChild(ops);

        for (let i = 0; i < HTMLDrawer.#canvases.length - 1; i++)
        {
            HTMLDrawer.#canvases[i].width = 0.9*HTMLDrawer.#canvases[i].parentElement.getBoundingClientRect().width;
            HTMLDrawer.#canvases[i].height = 0.19*HTMLDrawer.#canvases[i].parentElement.getBoundingClientRect().width;
        }

        HTMLDrawer.#canvases[HTMLDrawer.#canvases.length-1].width = 0.9*HTMLDrawer.#canvases[HTMLDrawer.#canvases.length-1].parentElement.getBoundingClientRect().width;
        HTMLDrawer.#canvases[HTMLDrawer.#canvases.length-1].height = 0.9*HTMLDrawer.#canvases[HTMLDrawer.#canvases.length-1].parentElement.getBoundingClientRect().width;
        WaveformCollection.redraw();
    }

    static moveTop(id)
    {
        let indexSrc;
        let src;
        for (let i = 0; i < HTMLDrawer.#headers.length; i++)
        {
            if (HTMLDrawer.#headers[i][0].id == id) {indexSrc = i; src = this.#headers[i];}
        }

        this.#headers.splice(indexSrc, 1);
        this.#headers.unshift(src);
        
        this.draw();
    }

    static hidePopup()
    {
        document.getElementsByTagName('body')[0].classList.remove('modalOpen');
        document.getElementsByTagName('html')[0].classList.remove('modalOpen');
        document.getElementsByClassName("popUp-overlay")[0].classList.add("invisible");
    }

    static showPopup(header, text, type)
    {
        document.getElementsByTagName('body')[0].classList.add('modalOpen');
        document.getElementsByTagName('html')[0].classList.add('modalOpen');
        document.getElementsByClassName("popUp-overlay")[0].classList.remove("invisible");

        document.getElementById("popupHeader").innerHTML = header;
        document.getElementById("popupContent").innerHTML = text;

        if (type == "info") document.getElementById("popupWrapper").style.backgroundColor = "#cfffdb";
        else if (type == "error") document.getElementById("popupWrapper").style.backgroundColor = "#ffd4cc";
        
        document.getElementById("popupButton").focus();
    }
}