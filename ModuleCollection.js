class ModuleCollection
{
    static #modules = [];
    constructor()
    {

    }


    static init()
    {
        //let mod0 = new Play();
        //this.#modules.push(mod0);
        let mod1 = new ImportExport();
        this.#modules.push(mod1);
        let mod2 = new Record();
        this.#modules.push(mod2);
        let mod3 = new Generate();
        this.#modules.push(mod3);
        let mod4 = new Invert();
        this.#modules.push(mod4);
        let mod5 = new Reverse();
        this.#modules.push(mod5);
        let mod6 = new AddSubtract();
        this.#modules.push(mod6);
        let mod7 = new Amplify();
        this.#modules.push(mod7);
        let mod8 = new Cut();
        this.#modules.push(mod8);
        let mod9 = new AM();
        this.#modules.push(mod9);
        let mod10 = new Rectify();
        this.#modules.push(mod10);
        let mod11 = new DCOffset();
        this.#modules.push(mod11);
        let mod11_1 = new FM();
        this.#modules.push(mod11_1);
        let mod11_2 = new PM();
        this.#modules.push(mod11_2);
        let mod11_3 = new XYPlotter();
        this.#modules.push(mod11_3);
        let mod12 = new ScriptRectifier();
        this.#modules.push(mod12);
        let mod13 = new ScriptSquare();
        this.#modules.push(mod13);
        let mod14 = new ScriptTremolo();
        this.#modules.push(mod14);
        let mod15 = new ScriptThreePhase();
        this.#modules.push(mod15);
        let mod16 = new ScriptModulations();
        this.#modules.push(mod16);
        //let mod12 = new AM();
        //this.#modules.push(mod12);
    }
}