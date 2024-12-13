
import { Database } from "jsr:@db/sqlite@0.11";
import { create, extract } from "jsr:@quentinadam/zip";

export interface IAnkiDbService {
    init(): void;
    compressAnki(): Promise<boolean>;
    getDeck(): void;
};

export class AnkiDbService implements IAnkiDbService {
    private anki: Database | undefined;


    constructor() {
        this.init();
    }

    async init() {
        const ankiFile = await Deno.readFile("./db/testDeck.apkg");
        const files = await extract(ankiFile);
        files.find( async (file) => {
            if(file.name === "collection.anki2") await Deno.writeFile("./tmp/collection.anki2", file.data);
        });
        this.anki = new Database("collection.anki2");
    }

    async compressAnki(): Promise<boolean> {
        const zip = new AdmZip();
        zip.addLocalFolder("./tmp");
        const newAnki = Deno.readDir("./tmp");
        return await create("./updatedDeck/Slalom-TechVocab.apkg", newAnki);
    }

    getDeck(): void {

    }
}