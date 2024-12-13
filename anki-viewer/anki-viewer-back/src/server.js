import express from 'express';
import AdmZip from 'adm-zip';
import sqlite3 from 'sqlite3';
import { db, connectToDb } from './db.js';
import crypto from 'crypto';
import { Admin, ObjectId } from 'mongodb';
// import { Server } from 'http';

class AnkiCard {
    constructor(contents) {
        this.Japanese = contents[0];
        this.Reading = contents[1];
        this.Meaning = contents[2];
        this.Note = contents[3];
        this.Sentence = contents[4];
        this.Sentence_Meaning = contents[5];  
        this.Link = contents[6];
    }
}

const extractAnkiDb = (ankiFile) => {
    const zip = AdmZip(ankiFile);
    zip.extractEntryTo("collection.anki2", "./tmp", true, true);
    zip.extractEntryTo("media", "./tmp", true, true);
}

const getAnkiDb = (ankiFile) => {
    extractAnkiDb(ankiFile);
    return new sqlite3.Database("./tmp/collection.anki2");
}

const compressAnki = async () => {
    const zip = new AdmZip();
    zip.addLocalFolder("./tmp");
    return await zip.writeZipPromise("./updatedDeck/Slalom-TechVocab.apkg");
}

const ankiSqlDb = getAnkiDb('./db/testDeck.apkg');

const getCard = async (req, res, id) => {
    await ankiSqlDb.get(`SELECT flds, id FROM notes WHERE id = ${id} `, (err, item) => {
        if(!err && item.flds !== null) {
            const cardItems = item.flds.split("\x1f");
            const card = {
                "Id": item.id,
                "Japanese": cardItems[0],
                "Reading": cardItems[1],
                "Meaning": cardItems[2].replaceAll("<br>",""),
                "Note": cardItems[3],
                "Sentence": cardItems[4],
                "Sentence_Meaning": cardItems[5],
                // "Link": cardItems[6],
            };

            res.status(200).json(card);
        } else {
            res.sendStatus(404);
            console.log(err);
        }
    });
}

const getDeck = async (req, res) => {
    let deck = [];
    await ankiSqlDb.all("SELECT flds, id FROM notes", (err, items) => {
        items.forEach(item => {
            const cardItems = item.flds.split("\x1f");
            if(!err) {
                const card = {
                    "Id": item.id,
                    "Japanese": cardItems[0],
                    "Reading": cardItems[1],
                    "Meaning": cardItems[2].replaceAll("<br>",""),
                    "Note": cardItems[3],
                    "Sentence": cardItems[4],
                    "Sentence_Meaning": cardItems[5],
                    // "Link": cardItems[6],
                };
                deck.push(card);
            } else {
                console.log(err);
            }
           
        });
        if(deck.length > 0 ) res.status(200).json(deck);
        else res.sendStatus(404);
    });   
}

const app = express();
app.use(express.json());

app.head('/api/exportDeck', async (req, res) => {
    let status;
    await compressAnki().then(() => status = 200).catch(() => status = 409);
    res.send();
});

app.get('/api/downloadDeck', async (req, res) => {
    const ankiDeckPath = "./updatedDeck/Slalom-TechVocab.apkg";
    const ankiDeckFile = "Slalom-TechVocab.apkg";
    res.download(ankiDeckPath, ankiDeckFile, (err) => {
        if (err) console.log(err);
    });

});

app.get('/api/deck', async (req, res) => {    
    await getDeck(req, res);
})

app.get('/api/card/:id', async (req, res) => {    
    const { id } = req.params;
    await getCard(req, res, id);
});

const getRequestedCardList = async () => {
    const cards = await db.collection("cardRequests").find().toArray();
    const cardsWithNoLink = cards.map(({Link, ...card}) => card);
    return cardsWithNoLink;
}

app.get('/api/requestedCardList', async (req, res) => {
    const cards = await getRequestedCardList();
    if(cards === null || cards.length === 0) 
        return res.sendStatus(404);
    else 
        res.status(200).json(cards);
});

app.post('/api/addCard', async (req, res) => {

    const { Japanese } = req.body;
    const { Reading } = req.body;
    const { Meaning } = req.body;
    const { Note } = req.body;
    const { Sentence } = req.body;
    const { Sentence_Meaning } = req.body;
    const { Link } = req.body;

    await db.collection("cardRequests").insertOne({
            Japanese: Japanese,
            Reading: Reading,
            Meaning: Meaning,
            Note: Note,
            Sentence: Sentence,
            Sentence_Meaning: Sentence_Meaning,
            Link: Link,
    });
    res.sendStatus(200);
});

const genCardDue = () => {
    const duePromise = new Promise((resolve, reject) => {
        ankiSqlDb.get(`SELECT due FROM cards ORDER BY due DESC LIMIT 1`, (err, item) => {
            if(!err && item.due !== null) {
                resolve(item.due + 1);    
            } else {
                reject(err);
            }
        });
    });

    return duePromise;
}

const genGuid = () => {

    const _BASE91_EXTRA_CHARS = '!#$%&()*+,-./:;<=>?@[]^_`{|}~';
    const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const DIGITS = '0123456789';

    const divmod = (a, b) => {
        let remainder = a % b;
        let aIsInfinite = a === -Infinity || a === Infinity;
        let bIsInfinite = b === -Infinity || b === Infinity;
        let aIsNeg = a + 1 / a < 0;
        let bIsNeg = b + 1 / b < 0;
        return [
          (aIsInfinite !== bIsInfinite && a) ? aIsInfinite ? NaN : aIsNeg === bIsNeg ? 0 : -1 : Math.floor(a / b),
          (!a && b < 0) ? -0 : remainder + (remainder !== 0 && aIsNeg !== bIsNeg ? b : 0)
        ];
    }

    const genBase62 = (num /*: int*/, extra = "") => {
        const table = LETTERS + DIGITS + extra;
        let buf = "";
        while(num) {
            let mod = divmod(num, table.length);
            num = mod[0];
            buf = table[mod[1]] + buf;
        }
        return buf
    }

    const genBase91 = (num) => {
        //all printable characters minus quotes, backslash and separators
        return genBase62(num, _BASE91_EXTRA_CHARS)
    }

    const genRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return genBase91(genRandomInt(0, 2**64-1)).slice(0,5);
}

//const removeCardFromMongo = async (cardId) => {
    //const removeCard = { "_id": ObjectId(mongoCardId) };
    //db.collection("cardRequests").deleteOne(removeCard, (err, obj) => {
    //    if(err)
    //        console.log(err);
    //});
    
//}

app.post('/api/rejectCard', async (req, res) => {

    const mongoCardId = req.body._id;
    const removeCard = { "_id": ObjectId(mongoCardId) };
    await db.collection('cardRequests').deleteOne(removeCard).catch(err => console.log(err));

    const cards = await getRequestedCardList();
    res.status(200);
    res.json(cards)
    res.send();
})

app.post('/api/insertIntoAnki', async (req, res) => {
    const { Japanese } = req.body;
    const { Reading } = req.body;
    const { Meaning } = req.body;
    const { Note } = req.body;
    const { Sentence } = req.body;
    const { Sentence_Meaning } = req.body;  
    const { Link } = req.body;

    const noteId = Date.now(); //maybe create note first
    const card1Id = noteId+1;
    const card2Id = card1Id+1;

    //insert into notes
    const genFlds = () => {
        const sep = "\x1f";
        const flds = Japanese + sep +
        Reading + sep +
        Meaning + sep +
        Note + sep +
        Sentence + sep +
        Sentence_Meaning + sep +
        Link;

        return flds;
    };

    const flds = genFlds();
    const guid = genGuid();
    const mid = 1574656124441; //hard coded model id, need to get from table
    const noteMod = parseInt(Date.now() / 1000);
    const hash = crypto.createHash('sha1');
    const data = hash.update(String(noteId));
    const csum = data.digest().toString('hex').replace(/\D/g, '').slice(0,8);
    const note = [
        noteId,
        String(guid),
        mid,
        noteMod,
        0, //not fully understood used for syncing leave as 0
        "Common", //defaulting to common will change,
        flds,
        Japanese,
        csum, //field checksum, sha1 of first 8 digits of the first field
        0,
        "",
    ]
    
    //insert into cards
    
    //Note: This is hard coded from the anki.collection2 database as the deck id for the 
    //Anki deck being used.  Need to update this to parse it from the col tables decks column.
    const deckId = 1668480560025; 

    const cardDue = await genCardDue();
    const cardMod = parseInt(Date.now() / 1000);
    //make 2 of these where second one has ord set to 1
    const cardData1 = [
    card1Id,
    noteId,
    deckId,
    0,
    cardMod,
    -1, // -1 means needs to be updated in server.  I think this is neg one because new cards are not yet in the server
    0,
    0, // 0 = new
    cardDue,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    "",
    ];
    
    const cardData2 = [
        card2Id,
        noteId,
        deckId,
        1,
        cardMod,
        -1, // -1 means needs to be updated in server.  I think this is neg one because new cards are not yet in the server
        0,
        0, // 0 = new
        cardDue,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "",
    ];

    const insertIntoAnki = (sql, data) => {
        const insertPromise = new Promise((resolve, reject) => {
            ankiSqlDb.run(sql, data, (err) => {
                if(!err) resolve();
                else reject(err);
            });
        });

        return insertPromise;
    };
    //add to database
    const insertNote = 'INSERT INTO notes VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    const insertCard = 'INSERT INTO cards VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    
    res.status(200);

    insertIntoAnki(insertNote, note)
        .then(insertIntoAnki(insertCard, cardData1))
        .finally(insertIntoAnki(insertCard, cardData2))
        .catch((err) => { console.log(err); res.status(404);});

    const mongoCardId = req.body._id;
    const removeCard = { "_id": ObjectId(mongoCardId) };
    await db.collection('cardRequests').deleteOne(removeCard).catch(err => console.log(err));

    const cards = await getRequestedCardList();
    res.json(cards)
    res.send();
});



connectToDb(() => {
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    });
});


export default app;
//export default app.listen(8000, () => {
//    connectToDb();
//    console.log("Server is listening on port 8000");
//})

//process.on('exit', () => {
//    console.log("Server shutting down");
//    fs.removeSync("./tmp", {recursive: true, force: true});
//});

//catch ctrl+c
process.on('SIGINT', () => {
    console.log("Server shutting down");
    ankiSqlDb.close();
    //fs.removeSync("./tmp", {recursive: true, force: true});
    process.exit(2);
});

//catch uncaught exceptions
process.on('uncaughtException', (e) => {
    console.log("Uncaught Exception, server shutting down...");
    console.log(e.stack);
    ankiSqlDb.close();
    //fs.removeSync("./tmp", {recursive: true, force: true});
    process.exit(99);
});