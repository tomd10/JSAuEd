class ModuleCollection
{
    static #modules = [];
    constructor()
    {

    }


    static init()
    {
        let mod0 = new Play();
        this.#modules.push(mod0);
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
    }
}