/***************************************************************
 * Example: Type II Region using Midpoint Rule for Rectangles
 * y in [yMin, yMax],  x in [g1(y), g2(y)]
 * ------------------------------------------------------------
 * - Boundary curves are drawn in purple.
 * - Rectangles are drawn using the midpoint rule in semi-transparent orange.
 * - All horizontal lines (subdivisions) are drawn in brown.
 * - Code is indented using 4 spaces.
 ***************************************************************/

// Define vertical bounds
const yMin = 50, yMax = 350;

// Left and right curves: x = g1(y), x = g2(y)
function g1(y) {
    // Example: wavy left boundary
    return 80 + 30 * Math.sin((y - 50) / 30);
}
function g2(y) {
    // Example: wavy right boundary
    return 400 + 20 * Math.cos((y - 50) / 40);
}

// p5 Sketch for Type II region
let typeIIRegionSketch = function(p) {
    let slider;
    let divisions = 10; // default number of subintervals in the y-direction

    p.setup = function() {
        let canvas = p.createCanvas(500, 400);
        canvas.parent("typeIIRegionCanvas");

        // Slider for the number of horizontal slices
        slider = p.createSlider(5, 80, divisions, 1);
        slider.parent("typeIISliderContainer");
    };

    p.draw = function() {
        p.background(240);
        divisions = slider.value();
        document.getElementById("typeIISubdivValue").textContent = divisions;

        // 1) Draw midpoint‑rule rectangles in semi‑transparent orange
        let dy = (yMax - yMin) / divisions;
        p.noStroke();
        p.fill(255, 165, 0); // orange fill

        for (let i = 0; i < divisions; i++) {
            let y0 = yMin + i * dy;
            let y1 = y0 + dy;
            let yMid = (y0 + y1) / 2;

            // Evaluate left and right boundaries at yMid
            let xLeft  = g1(yMid);
            let xRight = g2(yMid);

            // Convert to p5 canvas coordinates
            let topCanvasY = p.height - y1;
            let sliceHeight = y1 - y0;
            let sliceWidth  = xRight - xLeft;

            p.rect(xLeft, topCanvasY, sliceWidth, sliceHeight);
        }

        // 2) Draw boundary curves in purple
        p.stroke(128, 0, 128);  // purple
        p.strokeWeight(3);
        p.noFill();

        // Left boundary: x = g1(y)
        p.beginShape();
        for (let y = yMin; y <= yMax; y += 5) {
            p.vertex(g1(y), p.height - y);
        }
        p.endShape();

        // Right boundary: x = g2(y)
        p.beginShape();
        for (let y = yMin; y <= yMax; y += 5) {
            p.vertex(g2(y), p.height - y);
        }
        p.endShape();

        // 3) Draw all horizontal lines in the same color (brown)
        p.stroke(139, 69, 19); // brown
        p.strokeWeight(1);
        for (let i = 0; i <= divisions; i++) {
            let yVal = yMin + i * dy;
            let xLeft  = g1(yVal);
            let xRight = g2(yVal);
            let canvasY = p.height - yVal;
            if(i == 0 || i == divisions) {
                p.strokeWeight(3);
            }
            else {
                p.strokeWeight(1);
            }
            p.line(xLeft, canvasY, xRight, canvasY);
        }
    };
};

// Instantiate the Type II region sketch
new p5(typeIIRegionSketch);