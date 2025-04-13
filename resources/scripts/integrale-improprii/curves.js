/***************************************************************
 * 1) FIRST CURVE - Exponential Decay Function
 ***************************************************************/
let expDecaySketch = function(p) { 
    p.setup = function() {
        let canvas = p.createCanvas(400, 200);
        canvas.parent("curve1");
        p.drawCurve();
    };

    p.drawCurve = function() {
        p.background(255);
        p.push();
        p.translate(50, 150);
        p.stroke(0);
        p.line(0, 0, 300, 0); // x-axis
        p.line(0, -50, 0, 50); // y-axis

        p.noFill();
        p.stroke(0);
        p.beginShape();
        for (let x = 0; x < 300; x += 1) {
            let y = -50 * Math.exp(-x / 100);
            p.vertex(x, y);
        }
        p.endShape();

        p.fill(0);
        p.text("a", -10, 10);
        p.text("f(x)", 150, -40);
        p.pop();
    };
};
new p5(expDecaySketch);

/***************************************************************
 * 2) SECOND GRAPH - Parabola Segment & Logarithm Function 
 *    with Vertical Asymptote + Points a, b
 *    (Merged version)
 ***************************************************************/
let combinedSketch = function(p) { 
    p.setup = function() {
        let canvas = p.createCanvas(400, 200);
        canvas.parent("curve2");
        p.drawCurve();
    };

    p.drawCurve = function() {
        p.background(255);

        // Move the origin so (0,0) is near bottom-left
        p.push();
        p.translate(50, 150);

        // ------------------------------------------------
        // 1) Draw Axes
        // ------------------------------------------------
        p.stroke(0);
        // x-axis (extends from x=0 to x=300 in local coords)
        p.line(0, 0, 300, 0);
        // y-axis (extends upward/downward)
        p.line(0, -120, 0, 20);

        // ------------------------------------------------
        // 2) Parabola from x=0 to x=125
        //    Same formula you used before: y = 0.02*(x-125)^2 - 40
        // ------------------------------------------------
        p.noFill();
        p.beginShape();
        for (let x = 0; x <= 125; x++) {
            let y = 0.02 * (x - 125) * (x - 125) - 40;
            p.vertex(x, -y);  // invert y so upward is positive
        }
        p.endShape();

        // ------------------------------------------------
        // 3) Logarithm from x=126 to x=250
        //    Vertical asymptote at x=125
        // ------------------------------------------------
        p.beginShape();
        for (let x = 126; x <= 250; x++) {
            // Tweak scaling as needed
            let y = 20 * Math.log(x - 125) + 10;
            p.vertex(x, -y);
        }
        p.endShape();

        // ------------------------------------------------
        // 4) Vertical Asymptote at x=125 (dashed line)
        // ------------------------------------------------
        p.stroke(100);
        p.drawingContext.setLineDash([5, 5]);  // dashed pattern
        p.line(125, -120, 125, 20);
        p.drawingContext.setLineDash([]);

        // ------------------------------------------------
        // 5) Mark & Label a (x=0) and b (x=250) on the x-axis
        // ------------------------------------------------
        p.stroke(0);
        // Ticks at x=0 and x=250
        p.line(0, -5, 0, 5);      
        p.line(250, -5, 250, 5);

        // Text labels
        p.noStroke();
        p.fill(0);
        p.text("a", -5, 15);    // near (0,0)
        p.text("b", 245, 15);   // near (250,0)

        // Optional label for the function
        p.text("f(x)", 130, -60);

        p.pop();
    };
};

new p5(combinedSketch);