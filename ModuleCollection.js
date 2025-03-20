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
    }
}