class ModuleCollection
{
    static #modules = [];
    constructor()
    {

    }

    static init()
    {
        let mod1 = new ImportExport();
        this.#modules.push(mod1);
        let mod2 = new Record();
        this.#modules.push(mod2);
    }
}