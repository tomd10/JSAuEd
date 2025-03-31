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

    static getWaveformSelect()
    {
        const wfSelect = document.createElement("select");
        wfSelect.classList.add("waveformSelect");
        WaveformCollection.setWaveformSelect(wfSelect);
        this.#waveformSelects.push(wfSelect);
        return wfSelect;
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
        button.innerHTML = txt;
        button.addEventListener("click", func);

        this.#commandButtons.push(button);
        return button;
    }

    static getAuxButton(txt, func)
    {
        const button = document.createElement("button");
        button.classList.add("auxButton");
        button.innerHTML = txt;
        button.addEventListener("click", func);

        this.#auxButtons.push(button);
        return button;
    }

    static getHeader(txt)
    {
        const mainWrapper = document.createElement("div");
        mainWrapper.classList.add("operationWrapperDiv");

        const wrapper = document.createElement("div");
        wrapper.classList.add("operationDiv");
        
        const header = document.createElement("div");
        header.innerHTML = txt;
        header.classList.add("operationHeaderDiv");
        header.addEventListener("click", () => {
            if (wrapper.classList.contains("invisible"))
            {
                wrapper.classList.remove("invisible");
            }
            else wrapper.classList.add("invisible");
        });

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
        input.setAttribute("checked", "");
        input.value = val;

        this.#checkboxes.push(input);
        return input;
    }
}