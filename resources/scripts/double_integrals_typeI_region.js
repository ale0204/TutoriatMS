/***************************************************************
 * Example: Type I Region using Midpoint Rule for Rectangles
 * x in [xMin, xMax],  y in [f1(x), f2(x)]
 * ------------------------------------------------------------
 * - Boundary curves drawn in green (strokeWeight 3).
 * - Rectangles drawn using the midpoint rule in semi‑transparent red.
 * - Outer vertical boundaries (at xMin and xMax) in red (strokeWeight 3).
 * - Inner vertical boundaries in blue (strokeWeight 1).
 ***************************************************************/

// Define horizontal bounds
const xMin = 50, xMax = 450;

// Lower and upper curves: y = f1(x), y = f2(x)
function f1(x) {
    // Example: a wavy lower boundary
    return 100 + 30 * Math.sin((x - 50) / 40);
}
function f2(x) {
    // Example: a wavy upper boundary, always above f1
    return 300 + 20 * Math.cos((x - 50) / 50);
}

// p5 Sketch for Type I region with midpoint-rule rectangles
let typeIRegionSketch = function(p) {
    let slider;
    let divisions = 10; // default number of subintervals

    p.setup = function() {
        let canvas = p.createCanvas(500, 400);
        canvas.parent("typeIRegionCanvas");

        // Slider to adjust the number of subintervals
        slider = p.createSlider(5, 80, divisions, 1);
        slider.parent("typeISliderContainer");
    };

    p.draw = function() {
        p.background(240); // light gray background
        divisions = slider.value();
        document.getElementById("typeISubdivValue").textContent = divisions;

        /************************************************
         * 1) Draw boundary curves in green with strokeWeight 3
         ************************************************/
        p.stroke(0, 128, 0); // green
        p.strokeWeight(3);
        p.noFill();

        // Lower boundary: f1(x)
        p.beginShape();
        for (let x = xMin; x <= xMax; x += 5) {
            p.vertex(x, p.height - f1(x));
        }
        p.endShape();

        // Upper boundary: f2(x)
        p.beginShape();
        for (let x = xMin; x <= xMax; x += 5) {
            p.vertex(x, p.height - f2(x));
        }
        p.endShape();

        /************************************************
         * 2) Draw midpoint‑rule rectangles in red
         ************************************************/
        let dx = (xMax - xMin) / divisions; // width of each subinterval
        p.noStroke();
        p.fill(255, 0, 0, 100); // semi‑transparent red

        for (let i = 0; i < divisions; i++) {
            let x0 = xMin + i * dx;
            let x1 = x0 + dx;
            let xMid = (x0 + x1) / 2;

            // Evaluate the curves at the midpoint
            let lowerVal = f1(xMid);
            let upperVal = f2(xMid);

            // Convert these to canvas coordinates
            let topY = p.height - upperVal;      // top edge
            let rectHeight = upperVal - lowerVal;  // total height

            // Draw the rectangle:
            //   left = x0, width = dx,
            //   top = topY, height = rectHeight
            p.rect(x0, topY, dx, rectHeight);
        }

        // 3) Draw all horizontal lines in the same color (blue)
        p.stroke(0, 0, 255);
        for (let i = 0; i <= divisions; i++) {
            let xPos = xMin + i * dx;
            // Evaluate the actual curves at xPos
            let yLower = p.height - f1(xPos);
            let yUpper = p.height - f2(xPos);

            if (i === 0 || i === divisions) {
                p.strokeWeight(3);
            } else {
                p.strokeWeight(1);
            }
            p.line(xPos, yLower, xPos, yUpper);
        }
    };
};

new p5(typeIRegionSketch);