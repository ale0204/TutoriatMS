const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Display paths
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('process.cwd():', process.cwd());

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize error handling
const obGlobal = { obErori: null };
function initErori() {
    const eroriPath = path.join(__dirname, 'erori.json');
    const eroriData = JSON.parse(fs.readFileSync(eroriPath, 'utf-8'));
    
    // Setam calea absoluta in proprietatea imagine pentru fiecare eroare
    eroriData.info_erori.forEach(eroare => {
        // Folosim forward slash pentru URL-uri, indiferent de sistemul de operare
        eroare.imagine = `${eroriData.cale_baza}/${eroare.imagine}`;
    });
    
    // Setam si pentru eroarea default
    if (eroriData.eroare_default) {
        eroriData.eroare_default.imagine = `${eroriData.cale_baza}/${eroriData.eroare_default.imagine}`;
    }
    
    obGlobal.obErori = eroriData;
}
initErori();

/**
 * Funcție pentru afișarea paginilor de eroare
 * @param {object} res - Obiectul Response
 * @param {number} identificator - Codul numeric al erorii (ex: 404, 403)
 * @param {string} titlu - Titlul personalizat al erorii (opțional)
 * @param {string} text - Textul personalizat al erorii (opțional)
 * @param {string} imagine - Calea către imaginea personalizată a erorii (opțional)
 */
function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare;
    
    // Verificam daca s-a specificat un identificator
    if (identificator) {
        // Cautam eroarea cu identificatorul specificat
        eroare = obGlobal.obErori.info_erori.find(e => e.identificator === identificator);
    }
    
    // Daca nu am gasit eroarea sau nu s-a specificat identificator, folosim eroare_default
    if (!eroare) {
        eroare = obGlobal.obErori.eroare_default;
    }
    
    // Stabilim statusul HTTP: daca eroarea are proprietatea status=true, folosim identificatorul ca status, altfel 200
    const statusCode = (eroare.status && identificator) ? identificator : 200;
    
    // Randam pagina de eroare cu prioritate pentru argumentele functiei
    res.status(statusCode).render('pagini/eroare', {
        titlu: titlu || eroare.titlu,
        text: text || eroare.text,
        imagine: imagine || eroare.imagine
    });
}

// Middleware special pentru a intercepta fisierele .ejs - trebuie sa fie prima ruta definita
app.get('*.ejs', function(req, res) {
    console.log("Încercare de accesare directă a unui fișier .ejs (rută specifică):", req.path);
    afisareEroare(res, 400);
});

// Middleware pentru a bloca accesul direct la fisierele .ejs - eroare 400
// Acest middleware verifica toate cererile, indiferent de metoda sau cale
app.use((req, res, next) => {
    // Verificam daca cererea este pentru un fisier cu extensia .ejs
    if (req.path.endsWith('.ejs')) {
        console.log("Încercare de accesare directă a unui fișier .ejs (middleware general):", req.path);
        return afisareEroare(res, 400); // 400 Bad Request
    }
    next();
});

// Route for favicon (prioritizata inaintea altor rute)
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'resources', 'imagini', 'favicon', 'favicon.ico'));
});

// Middleware pentru a verifica accesul direct la directoare din /resurse/
app.all('/resurse/*', (req, res, next) => {
    // Verifica daca cererea este pentru un director (se termina cu /)
    if (req.path.endsWith('/')) {
        console.log("Încercare de accesare director din /resurse/:", req.path);
        
        // Extrage calea relativa din /resurse/
        const relativePath = req.path.substring('/resurse'.length);
        
        // Verificati daca exista un fisier index.html in directorul respectiv
        const indexPath = path.join(__dirname, 'resources', relativePath, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            // Exista un index.html, permitem accesul
            return next();
        } else {
            // Nu exista index.html, afisam eroarea 403 - Forbidden
            console.log("Acces interzis la directorul:", req.path);
            return afisareEroare(res, 403);
        }
    }
    next();
});

// Serve static files from the 'resources' folder
app.use('/resurse', express.static(path.join(__dirname, 'resources')));

// Serve static files for ch1, ch2, and ch3 folders
app.use('/ch1-integrala-riemann', express.static(path.join(__dirname, 'ch1-integrala-riemann')));
app.use('/ch2-integrale-improprii', express.static(path.join(__dirname, 'ch2-integrale-improprii')));
app.use('/ch3-integrale-curbilinii', express.static(path.join(__dirname, 'ch3-integrale-curbilinii')));
app.use('/ch4-integrale-duble', express.static(path.join(__dirname, 'ch4-integrale-duble')));

// Create required folders if they don't exist
const vect_foldere = ['temp', 'temp1']; // Am adaugat 'temp1' pentru testare
vect_foldere.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Created folder: ${folderPath}`);
    }
});

// Middleware to handle requests without .html extension
app.use((req, res, next) => {
    if (!path.extname(req.path) && req.path !== '/') {
        const filePath = path.join(__dirname, req.path + '.html');
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }
    next();
});

// Eliminam ruta '/:pagina' veche si o inlocuim cu ruta noastra catch-all '/*'

// ULTIMA RUTA: Catch-all route pentru orice alte cereri '/*'
app.get('/*', (req, res) => {
    let url = req.url;
    
    // Elimina slash-ul initial
    if (url.startsWith('/')) {
        url = url.substring(1);
    }
    
    // Daca URL-ul este gol, redirectioneaza catre pagina principala
    if (!url) {
        return res.render('pagini/index', { ip: req.ip });
    }
    
    // Incearca sa randeze fisierul EJS corespunzator folosind functia callback
    res.render(`pagini/${url}`, {}, function(eroare, rezultatRandare) {
        if (eroare) {
            if (eroare.message.startsWith('Failed to lookup view')) {
                // Pagina nu a fost gasita, afiseaza eroarea 404
                console.error(`Pagina ${url} nu a fost găsită.`);
                afisareEroare(res, 404);
            } else {
                // Alta eroare, afiseaza eroare generica
                console.error(`Eroare la randarea paginii ${url}:`, eroare);
                afisareEroare(res, 500);
            }
        } else {
            res.send(rezultatRandare);
        }
    });
});

// Pentru testarea explicita a erorii 400
app.get('/test-400', (req, res) => {
    console.log("Testare eroare 400");
    afisareEroare(res, 400);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});