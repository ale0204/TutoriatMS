/***************************************************************
 * SCRIPT ANIMAȚII PENTRU INTEGRALE IMPROPRII - VERSIUNEA FINALĂ
 * Acest script creează vizualizări îmbunătățite pentru 
 * cele două tipuri de integrale improprii:
 * 1. Intervalul de integrare este infinit
 * 2. Funcția nu este mărginită pe intervalul de integrare
 * 
 * Îmbunătățiri finale:
 * - Poziționare corectă a formulelor pentru a evita suprapunerea
 * - Titluri și etichete mai clare
 * - Separarea între formula principală și eticheta funcției
 ***************************************************************/

/***************************************************************
 * 1) INTERVAL INFINIT - Exponențială descrescătoare
 ***************************************************************/
let expDecaySketch = function(p) { 
    // Variabile pentru animație
    let t = 0;                // Parametru de timp
    let upperLimit = 0;       // Limita superioară animată
    let areaPoints = [];      // Puncte pentru zona de sub curbă
    let animating = true;     // Stare de animație
    let animationComplete = false; // Dacă animația s-a terminat
    let showAreaMessage = false;   // Afișează mesajul despre arie

    p.setup = function() {
        let canvas = p.createCanvas(600, 300);
        canvas.parent("curve1");
        
        // Container pentru butoane
        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '20px';
        buttonContainer.style.marginTop = '10px';
        document.getElementById("curve1").appendChild(buttonContainer);
        
        // Buton pentru resetarea animației
        let resetBtn = p.createButton('Resetează animația');
        resetBtn.parent(buttonContainer);
        resetBtn.mousePressed(() => {
            t = 0;
            upperLimit = 0;
            areaPoints = [];
            animating = true;
            animationComplete = false;
            showAreaMessage = false;
        });
        resetBtn.style('background-color', '#3a6d96');
        resetBtn.style('color', 'white');
        resetBtn.style('border', 'none');
        resetBtn.style('padding', '8px 16px');
        resetBtn.style('border-radius', '4px');
        resetBtn.style('cursor', 'pointer');
        
        // Buton pentru pornirea/oprirea animației
        let toggleBtn = p.createButton('Pornește/Oprește');
        toggleBtn.parent(buttonContainer);
        toggleBtn.mousePressed(() => {
            animating = !animating;
        });
        toggleBtn.style('background-color', '#3a6d96');
        toggleBtn.style('color', 'white');
        toggleBtn.style('border', 'none');
        toggleBtn.style('padding', '8px 16px');
        toggleBtn.style('border-radius', '4px');
        toggleBtn.style('cursor', 'pointer');
    };

    p.draw = function() {
        p.background(248, 249, 255);
        
        // Stilizare
        p.push();
        p.translate(80, 180);
        
        // Desenează grid-ul
        p.drawGrid();
        
        // Desenează axele
        p.drawAxes();
        
        // Desenează curba funcției f(x) = e^(-x/2)
        p.drawCurve();
        
        // Animație pentru limita superioară și aria de sub curbă
        if (animating && !animationComplete) {
            t += 0.5;
            upperLimit = p.min(t * 8, 400);
            
            // Calculează punctele pentru aria de sub curbă
            areaPoints = [];
            for (let x = 0; x <= upperLimit; x += 4) {
                let y = -80 * p.exp(-x / 100);
                areaPoints.push({x: x, y: y});
            }
            
            // Verifică dacă animația s-a terminat
            if (upperLimit >= 400) {
                animationComplete = true;
                showAreaMessage = true;
            }
        }
        
        // Desenează aria de sub curbă
        p.drawArea();
        
        // Desenează limita superioară animată
        p.drawUpperLimit();
        
        // Etichetă pentru formula integralei
        if (showAreaMessage) {
            // Caseta pentru formula principală
            p.push();
            p.fill(30, 100, 200, 230);
            p.noStroke();
            p.rect(50, -170, 300, 40, 8);
            p.fill(255);
            p.textSize(18);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("∫ₐ∞ e⁻ˣ/² dx = 2·e⁻ᵃ/²", 200, -150);
            p.pop();
            
            // Caseta separată pentru funcție
            p.push();
            p.fill(30, 100, 200, 180);
            p.noStroke();
            p.rect(130, -120, 140, 30, 5);
            p.fill(255);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("f(x) = e⁻ˣ/²", 200, -105);
            p.pop();
        }
        
        p.pop();
    };
    
    // Funcție pentru desenarea grid-ului
    p.drawGrid = function() {
        p.push();
        p.stroke(220);
        p.strokeWeight(1);
        
        // Linii verticale
        for (let x = 0; x <= 400; x += 50) {
            p.line(x, -200, x, 50);
        }
        
        // Linii orizontale
        for (let y = -200; y <= 50; y += 50) {
            p.line(0, y, 400, y);
        }
        p.pop();
    };
    
    // Funcție pentru desenarea axelor
    p.drawAxes = function() {
        p.push();
        p.stroke(0);
        p.strokeWeight(2);
        
        // Axa X
        p.line(0, 0, 420, 0);
        // Săgeată pentru axa X
        p.fill(0);
        p.triangle(420, 0, 415, -5, 415, 5);
        
        // Axa Y
        p.line(0, 50, 0, -200);
        // Săgeată pentru axa Y
        p.triangle(0, -200, -5, -195, 5, -195);
        
        // Etichetă pentru axa X
        p.textSize(12);
        p.textAlign(p.CENTER, p.TOP);
        p.noStroke();
        
        // Cerc pentru marcajul punctului a
        p.fill(255);
        p.stroke(0);
        p.ellipse(0, 0, 10, 10);
        
        // Etichetă pentru a (la stânga axei, nu pe ea)
        p.noStroke();
        p.fill(0);
        p.text("a", -15, 10);
        
        // Etichetă pentru infinit
        p.text("∞", 410, 10);
        
        p.pop();
    };
    
    // Funcție pentru desenarea curbei
    p.drawCurve = function() {
        p.push();
        p.stroke(30, 100, 200);
        p.strokeWeight(3);
        p.noFill();
        
        p.beginShape();
        for (let x = 0; x <= 400; x += 2) {
            let y = -80 * p.exp(-x / 100);
            p.vertex(x, y);
        }
        p.endShape();
        p.pop();
    };
    
    // Funcție pentru desenarea ariei de sub curbă
    p.drawArea = function() {
        if (areaPoints.length > 0) {
            p.push();
            p.noStroke();
            p.fill(30, 100, 200, 70);
            
            p.beginShape();
            p.vertex(0, 0);
            for (let point of areaPoints) {
                p.vertex(point.x, point.y);
            }
            p.vertex(upperLimit, 0);
            p.endShape(p.CLOSE);
            p.pop();
        }
    };
    
    // Funcție pentru desenarea limitei superioare animate
    p.drawUpperLimit = function() {
        if (upperLimit > 0 && upperLimit < 400) {
            p.push();
            p.stroke(255, 0, 0);
            p.strokeWeight(2);
            p.line(upperLimit, -150, upperLimit, 50);
            
            // Valoarea limitei superioare
            p.fill(255, 0, 0);
            p.noStroke();
            p.textAlign(p.CENTER, p.BOTTOM);
            p.textSize(14);
            p.text("b → ∞", upperLimit, 40);
            p.pop();
        }
    };
};

/***************************************************************
 * 2) FUNCȚIE NEMĂRGINITĂ - Funcție cu asimptotă verticală
 ***************************************************************/
let unboundedFunctionSketch = function(p) { 
    // Variabile pentru animație
    let t = 0;                // Parametru de timp
    let middlePoint = 200;    // Punctul cu asimptotă verticală
    let leftLimit = middlePoint;  // Limita stângă animată
    let rightLimit = middlePoint; // Limita dreaptă animată
    let areaPointsLeft = [];  // Puncte pentru aria din stânga
    let areaPointsRight = []; // Puncte pentru aria din dreapta
    let animating = true;     // Stare de animație
    let animationComplete = false; // Dacă animația s-a terminat
    let showAreaMessage = false;   // Afișează mesajul despre arie

    p.setup = function() {
        let canvas = p.createCanvas(600, 300);
        canvas.parent("curve2");
        
        // Container pentru butoane
        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '20px';
        buttonContainer.style.marginTop = '10px';
        document.getElementById("curve2").appendChild(buttonContainer);
        
        // Buton pentru resetarea animației
        let resetBtn = p.createButton('Resetează animația');
        resetBtn.parent(buttonContainer);
        resetBtn.mousePressed(() => {
            t = 0;
            leftLimit = middlePoint;
            rightLimit = middlePoint;
            areaPointsLeft = [];
            areaPointsRight = [];
            animating = true;
            animationComplete = false;
            showAreaMessage = false;
        });
        resetBtn.style('background-color', '#3a6d96');
        resetBtn.style('color', 'white');
        resetBtn.style('border', 'none');
        resetBtn.style('padding', '8px 16px');
        resetBtn.style('border-radius', '4px');
        resetBtn.style('cursor', 'pointer');
        
        // Buton pentru pornirea/oprirea animației
        let toggleBtn = p.createButton('Pornește/Oprește');
        toggleBtn.parent(buttonContainer);
        toggleBtn.mousePressed(() => {
            animating = !animating;
        });
        toggleBtn.style('background-color', '#3a6d96');
        toggleBtn.style('color', 'white');
        toggleBtn.style('border', 'none');
        toggleBtn.style('padding', '8px 16px');
        toggleBtn.style('border-radius', '4px');
        toggleBtn.style('cursor', 'pointer');
    };

    p.draw = function() {
        p.background(248, 249, 255);
        
        // Stilizare
        p.push();
        p.translate(80, 180);
        
        // Desenează grid-ul
        p.drawGrid();
        
        // Desenează axele
        p.drawAxes();
        
        // Desenează curba funcției f(x) = 1/(x-c)^2 - 1/16
        p.drawCurve();
        
        // Animație pentru limitele și aria de sub curbă
        if (animating && !animationComplete) {
            t += 0.5;
            
            // Calculează limitele animate
            let progress = p.min(t / 100, 1);
            leftLimit = p.lerp(middlePoint, 60, progress);
            rightLimit = p.lerp(middlePoint, 350, progress);
            
            // Calculează punctele pentru aria din stânga
            areaPointsLeft = [];
            for (let x = leftLimit; x <= middlePoint - 2; x += 1) {
                let dx = (x - middlePoint);
                let y = -1500 / (dx * dx) - 20;
                y = p.constrain(y, -200, 0);
                areaPointsLeft.push({x: x, y: y});
            }
            
            // Calculează punctele pentru aria din dreapta
            areaPointsRight = [];
            for (let x = middlePoint + 2; x <= rightLimit; x += 1) {
                let dx = (x - middlePoint);
                let y = -1500 / (dx * dx) - 20;
                y = p.constrain(y, -200, 0);
                areaPointsRight.push({x: x, y: y});
            }
            
            // Verifică dacă animația s-a terminat
            if (progress >= 1) {
                animationComplete = true;
                showAreaMessage = true;
            }
        }
        
        // Desenează ariile
        p.drawArea();
        
        // Desenează limitele animate
        p.drawLimits();
        
        // Etichetă pentru formula integralei
        if (showAreaMessage) {
            // Caseta pentru formula principală
            p.push();
            p.fill(200, 60, 60, 230);
            p.noStroke();
            p.rect(50, -170, 300, 40, 8);
            p.fill(255);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("∫ₐᵇ f(x) dx = lim(ε→0) [∫ₐᶜ⁻ᵋ + ∫ᶜ⁺ᵋᵇ] f(x) dx", 200, -150);
            p.pop();
            
            // Caseta separată pentru funcție
            p.push();
            p.fill(200, 60, 60, 180);
            p.noStroke();
            p.rect(115, -120, 170, 30, 5);
            p.fill(255);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("f(x) = 1/(x-c)² - 1/16", 200, -105);
            p.pop();
        }
        
        p.pop();
    };
    
    // Funcție pentru desenarea grid-ului
    p.drawGrid = function() {
        p.push();
        p.stroke(220);
        p.strokeWeight(1);
        
        // Linii verticale
        for (let x = 0; x <= 400; x += 50) {
            p.line(x, -200, x, 50);
        }
        
        // Linii orizontale
        for (let y = -200; y <= 50; y += 50) {
            p.line(0, y, 400, y);
        }
        p.pop();
    };
    
    // Funcție pentru desenarea axelor
    p.drawAxes = function() {
        p.push();
        p.stroke(0);
        p.strokeWeight(2);
        
        // Axa X
        p.line(0, 0, 420, 0);
        // Săgeată pentru axa X
        p.fill(0);
        p.triangle(420, 0, 415, -5, 415, 5);
        
        // Axa Y
        p.line(0, 50, 0, -200);
        // Săgeată pentru axa Y
        p.triangle(0, -200, -5, -195, 5, -195);
        
        // Marcaje pentru punctele a, c, b cu cercuri
        p.strokeWeight(1);
        
        // Punct a
        p.fill(255);
        p.stroke(0);
        p.ellipse(60, 0, 10, 10);
        
        // Punct c
        p.ellipse(middlePoint, 0, 10, 10);
        
        // Punct b
        p.ellipse(350, 0, 10, 10);
        
        // Etichete pentru punctele a, c, b deplasate sub axe
        p.noStroke();
        p.fill(0);
        p.textSize(14);
        p.textAlign(p.CENTER, p.TOP);
        p.text("a", 60, 15);
        p.text("c", middlePoint, 15);
        p.text("b", 350, 15);
        
        // Asimptota verticală
        p.strokeWeight(1);
        p.stroke(200, 0, 0, 150);
        p.drawingContext.setLineDash([5, 5]);
        p.line(middlePoint, -200, middlePoint, 50);
        p.drawingContext.setLineDash([]);
        
        p.pop();
    };
    
    // Funcție pentru desenarea curbei
    p.drawCurve = function() {
        p.push();
        p.stroke(200, 60, 60);
        p.strokeWeight(3);
        p.noFill();
        
        // Partea stângă a curbei
        p.beginShape();
        for (let x = 60; x < middlePoint - 2; x += 1) {
            let dx = (x - middlePoint);
            let y = -1500 / (dx * dx) - 20;
            y = p.constrain(y, -200, 0);
            p.vertex(x, y);
        }
        p.endShape();
        
        // Partea dreaptă a curbei
        p.beginShape();
        for (let x = middlePoint + 2; x <= 350; x += 1) {
            let dx = (x - middlePoint);
            let y = -1500 / (dx * dx) - 20;
            y = p.constrain(y, -200, 0);
            p.vertex(x, y);
        }
        p.endShape();
        p.pop();
    };
    
    // Funcție pentru desenarea ariilor
    p.drawArea = function() {
        p.push();
        p.noStroke();
        
        // Aria din stânga
        if (areaPointsLeft.length > 0) {
            p.fill(200, 60, 60, 70);
            p.beginShape();
            p.vertex(leftLimit, 0);
            for (let point of areaPointsLeft) {
                p.vertex(point.x, point.y);
            }
            p.vertex(areaPointsLeft[areaPointsLeft.length-1].x, 0);
            p.endShape(p.CLOSE);
        }
        
        // Aria din dreapta
        if (areaPointsRight.length > 0) {
            p.fill(200, 60, 60, 70);
            p.beginShape();
            p.vertex(areaPointsRight[0].x, 0);
            for (let point of areaPointsRight) {
                p.vertex(point.x, point.y);
            }
            p.vertex(rightLimit, 0);
            p.endShape(p.CLOSE);
        }
        p.pop();
    };
    
    // Funcție pentru desenarea limitelor animate
    p.drawLimits = function() {
        p.push();
        
        // Limita din stânga
        if (leftLimit < middlePoint) {
            p.stroke(0, 150, 0);
            p.strokeWeight(2);
            p.line(leftLimit, -150, leftLimit, 50);
            
            p.fill(0, 150, 0);
            p.noStroke();
            p.textAlign(p.CENTER, p.BOTTOM);
            p.textSize(14);
            p.text("ε → 0", (leftLimit + middlePoint) / 2, -50);
            
            // Săgeată de la ε către c
            p.stroke(0, 150, 0);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([3, 3]);
            p.line((leftLimit + middlePoint) / 2, -60, (leftLimit + middlePoint) / 2 + 30, -60);
            p.drawingContext.setLineDash([]);
            p.triangle((leftLimit + middlePoint) / 2 + 30, -60, 
                     (leftLimit + middlePoint) / 2 + 25, -65, 
                     (leftLimit + middlePoint) / 2 + 25, -55);
        }
        
        // Limita din dreapta
        if (rightLimit > middlePoint) {
            p.stroke(0, 150, 0);
            p.strokeWeight(2);
            p.line(rightLimit, -150, rightLimit, 50);
            
            p.fill(0, 150, 0);
            p.noStroke();
            p.textAlign(p.CENTER, p.BOTTOM);
            p.textSize(14);
            p.text("ε → 0", (rightLimit + middlePoint) / 2, -50);
            
            // Săgeată de la ε către c
            p.stroke(0, 150, 0);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([3, 3]);
            p.line((rightLimit + middlePoint) / 2, -60, (rightLimit + middlePoint) / 2 - 30, -60);
            p.drawingContext.setLineDash([]);
            p.triangle((rightLimit + middlePoint) / 2 - 30, -60, 
                     (rightLimit + middlePoint) / 2 - 25, -65, 
                     (rightLimit + middlePoint) / 2 - 25, -55);
        }
        p.pop();
    };
};

// Inițializarea sketch-urilor
new p5(expDecaySketch);
new p5(unboundedFunctionSketch);