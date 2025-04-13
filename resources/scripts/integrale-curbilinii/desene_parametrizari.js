const sketch1 = (p) => {
    p.setup = function() {
        let canvas = p.createCanvas(450, 450);
        canvas.parent('circleCanvas');
        p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = function() {
        p.clear();
        p.translate(200, 200);

        // ---------------- AXES ----------------
        p.stroke(255, 165, 0); // orange
        p.strokeWeight(2);
        // X-axis
        p.line(-200, 0, 200, 0);
        // Y-axis
        p.line(0, -200, 0, 200);

        // Axis labels
        p.noStroke();
        p.fill(255, 120, 0);
        p.textSize(16);
        p.text('x', 190, 12);
        p.text('y', 8, -195);

        // ---------------- CIRCLE ----------------
        const R = 180;
        p.stroke(0);
        p.noFill();
        p.ellipse(0, 0, R * 2);

        // ---------------- ANGLE & RADIUS (example) ----------------
        // We'll keep the single radius line at 45° (π/4) as an example
        const angle = p.PI / 4;

        // Arc from x-axis to line
        p.stroke(128, 0, 128); // purple
        p.strokeWeight(2);
        p.noFill();
        // arc(cx, cy, w, h, startAngle, endAngle).
        // Negative angle so it goes 'up' in p5
        p.arc(0, 0, 60, 60, -angle, 0);

        // Radius line
        p.stroke(0, 150, 0); // green
        p.strokeWeight(3);
        const xVal = R * Math.cos(angle);
        const yVal = -R * Math.sin(angle);
        p.line(0, 0, xVal, yVal);

        // ---------------- PROJECTIONS ----------------
        // X-projection (blue)
        p.stroke(0, 0, 255);
        p.strokeWeight(2);
        p.line(0, 0, xVal, 0);

        // Y-projection (red)
        p.stroke(255, 0, 0);
        p.line(xVal, 0, xVal, yVal);

        // ---------------- LABELS ----------------
        p.noStroke();

        // Angle label `t`
        p.fill(128, 0, 128);
        p.textSize(14);
        p.text('t', 35, -15);

        // Radius label `R`
        p.fill(0, 150, 0);
        p.text('R', xVal * 0.7, yVal * 0.5);

        // x label in blue
        p.fill(0, 0, 255);
        p.text('x', xVal * 0.5, 10);

        // y label in red
        p.fill(255, 0, 0);
        p.text('y', xVal + 12, yVal * 0.5);

        // ---------------- ORIENTATION ARROWS ----------------
        drawOrientationArrows(R, 8);  // 8 evenly spaced arrows
    };

    // Draw N equally spaced arrows around the circle in a counterclockwise direction
    function drawOrientationArrows(R, N) {
        for (let i = 0; i < N; i++) {
            // param from 0..2π
            const t = p.TWO_PI * (i / N);

            // Coordinates on the circle
            const x = R * Math.cos(t);
            const y = -R * Math.sin(t);

            // The tangent direction to the circle at angle t is perpendicular to the radius
            // Circle param: x=R cos(t), y=R sin(t) => derivative wrt t: dx/dt=-R sin(t), dy/dt=R cos(t)
            // But in p5 we invert Y => dy/dt => -R cos(t)
            const dx = -R * Math.sin(t);
            const dy = -R * Math.cos(t);

            const arrowAngle = p.atan2(dy, dx);

            p.push();
            p.stroke(255, 0, 255);
            p.fill(255, 0, 255);
            p.strokeWeight(2);
            p.translate(x, y);
            p.rotate(arrowAngle);
            // Draw the arrow
            const arrowSize = 10;
            p.line(0, 0, -arrowSize, -arrowSize / 2);
            p.line(0, 0, -arrowSize, arrowSize / 2);
            p.pop();
        }
    }
};

const sketch2 = (p) => {
    p.setup = function() {
        let canvas = p.createCanvas(450, 450);
        canvas.parent('ellipseCanvas');
        p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = function() {
        p.clear();
        p.translate(225, 225);  // Center shift to place ellipse in a comfortable area

        // ---------------- AXES ----------------
        p.stroke(255, 165, 0); // orange
        p.strokeWeight(2);
        p.line(-220, 0, 220, 0); // x-axis
        p.line(0, -220, 0, 220); // y-axis

        // Axis labels
        p.noStroke();
        p.fill(255, 120, 0);
        p.textSize(16);
        p.text('x', 210, 12);
        p.text('y', 8, -210);

        // ---------------- ELLIPSE ----------------
        const a = 190;
        const b = 135;
        p.stroke(0);
        p.noFill();
        p.strokeWeight(2);
        // Draw ellipse boundary
        p.ellipse(0, 0, a * 2, b * 2);

        // ---------------- ANGLE & RADIUS ----------------
        const angle = p.PI / 3; // 60 degrees

        // Arc to show angle
        p.stroke(128, 0, 128); // purple
        p.strokeWeight(2);
        p.arc(0, 0, 60, 60, -angle+0.15, 0);

        // Draw radius line
        p.stroke(0, 150, 0); // Green
        p.strokeWeight(3);
        const xVal = a * Math.cos(angle);
        const yVal = b * Math.sin(angle);
        p.line(0, 0, xVal, -yVal); // negative yVal => top is +y in p5

        // X-projection (blue)
        p.stroke(0, 0, 255);
        p.strokeWeight(2);
        p.line(0, 0, xVal, 0);

        // Y-projection (red)
        p.stroke(255, 0, 0);
        p.line(xVal, 0, xVal, -yVal);

        // LABELS
        p.noStroke();
        p.fill(128, 0, 128);
        p.textSize(14);
        p.text('t', 35, -15);

        p.fill(0, 150, 0);
        p.text('R(t)', xVal * 0.7, -yVal * 0.5);

        p.fill(0, 0, 255);
        p.text('a', xVal * 0.5, 10);

        p.fill(255, 0, 0);
        p.text('b', xVal + 12, -yVal * 0.5);

        // ---------------- ORIENTATION ARROWS ----------------
        drawOrientationArrows(a, b, 8);
    };

    // Draw N equally-spaced arrows around the ellipse in magenta
    function drawOrientationArrows(a, b, N) {
        for (let i = 0; i < N; i++) {
            // param from 0..2π
            const t = p.TWO_PI * (i / N);
            // ellipse param x(t) = a cos(t), y(t) = b sin(t)
            const x = a * Math.cos(t);
            const y = b * Math.sin(t);

            // We'll place the arrow at (x, -y) because top is negative y in p5
            const dx = -a * Math.sin(t);  // derivative wrt t
            const dy = b * Math.cos(t);   // derivative wrt t (but note sign for p5 coords)
            const angle = p.atan2(-dy, dx);

            p.push();
            p.translate(x, -y);
            p.rotate(angle);
            p.stroke(255, 0, 255);
            p.fill(255, 0, 255);
            p.strokeWeight(2);
            const arrowSize = 10;
            p.line(0, 0, -arrowSize, -arrowSize / 2);
            p.line(0, 0, -arrowSize, arrowSize / 2);
            p.pop();
        }
    }
};

const sketch3 = (p) => {
    p.setup = function() {
        let canvas = p.createCanvas(400, 400);
        canvas.parent('lineSegmentCanvas');
    };

    p.draw = function() {
        p.clear();
        p.stroke(0);

        // Define points A and B
        const A = { x: 100, y: 300 };
        const B = { x: 300, y: 100 };

        // Draw Line Segment from A to B
        p.line(A.x, A.y, B.x, B.y);

        // Draw 3 Arrows
        drawArrow(A.x, A.y, 0.25);
        drawArrow(A.x, A.y, 0.5);
        drawArrow(A.x, A.y, 0.75);

        // Labels for A and B
        p.fill(0);
        p.text('A', A.x - 10, A.y + 10);
        p.text('B', B.x + 10, B.y - 10);
    };

    function drawArrow(x1, y1, factor) {
        const B = { x: 300, y: 100 };
        const x2 = x1 + factor * (B.x - x1);
        const y2 = y1 + factor * (B.y - y1);

        const arrowSize = 7;
        const angle = p.atan2(B.y - y1, B.x - x1);

        p.push();
        p.stroke(0);
        p.fill(0);
        p.translate(x2, y2);
        p.rotate(angle);
        p.line(0, 0, -arrowSize, -arrowSize / 2);
        p.line(0, 0, -arrowSize, arrowSize / 2);
        p.pop();
    }
};

const sketch4 = (p) => {
    p.setup = function() {
        let canvas = p.createCanvas(400, 400);
        canvas.parent('parabolaCanvas');
    };

    p.draw = function() {
        p.clear();
        p.translate(200, 200);

        // ---------------- AXES ----------------
        p.stroke(255, 140, 0);
        p.strokeWeight(2);
        p.line(-180, 0, 180, 0); // x-axis
        p.line(0, -180, 0, 180); // y-axis

        // ---------------- ASYMPTOTES ----------------
        p.stroke(100, 100, 100, 150); // Gray lines for asymptotes
        p.strokeWeight(1);
        p.line(-100, -180, -100, 180); // x = a
        p.line(100, -180, 100, 180);   // x = b

        // Labels for asymptotes
        p.noStroke();
        p.fill(0);
        p.textSize(14);
        p.text('a', -100, 185);
        p.text('b', 100, 185);

        // ---------------- PARABOLA ----------------
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();

        for (let x = -200; x <= 200; x += 1) {
            const y = 0.01 * x * x;
            p.vertex(x, -y);

            // Draw orientation arrows periodically
            if (x % 60 === 0 && x !== 0) {
                const dydx = 0.02 * x; // Derivative of y = 0.01 * x^2
                const arrowLength = 10 / Math.sqrt(1 + dydx * dydx);

                const xEnd = x + arrowLength;
                const yEnd = -y - dydx * arrowLength;

                drawArrow(x, -y, xEnd, yEnd);
            }
        }
        p.endShape();
    };

    function drawArrow(x1, y1, x2, y2) {
        const arrowSize = 7;
        const angle = p.atan2(y2 - y1, x2 - x1);

        p.push();
        p.stroke(0);
        p.fill(0);
        p.translate(x2, y2);
        p.rotate(angle);
        p.line(0, 0, -arrowSize, -arrowSize / 2);
        p.line(0, 0, -arrowSize, arrowSize / 2);
        p.pop();
    }
};


const sketch5 = (p) => {
    p.setup = function() {
        let canvas = p.createCanvas(450, 450);
        canvas.parent('polygonCanvas');
        p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = function() {
        p.clear();
        p.translate(200, 200);

        // ---------------- AXES ----------------
        p.stroke(255, 165, 0); // orange
        p.strokeWeight(2);
        p.line(-200, 0, 200, 0); // x-axis
        p.line(0, -200, 0, 200); // y-axis

        // Axis labels
        p.noStroke();
        p.fill(255, 120, 0);
        p.textSize(16);
        p.text('x', 190, 12);
        p.text('y', 8, -190);

        // ---------------- POLYGON (Triangle) ----------------
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();

        const points = [
            { x: -100, y: 100 },
            { x: 100, y: 100 },
            { x: -25, y: -150 }
        ];

        p.beginShape();
        for (let point of points) {
            p.vertex(point.x, point.y);
        }
        p.vertex(points[0].x, points[0].y); // Closing the triangle
        p.endShape();

        // Plot points
        p.fill(0);
        p.textSize(14);
        p.text('A', points[0].x - 10, points[0].y + 10);
        p.text('B', points[1].x + 10, points[1].y + 10);
        p.text('C', points[2].x, points[2].y - 10);

        // ---------------- ORIENTATION ARROWS ----------------
        drawArrow(points[0], points[1]);
        drawArrow(points[1], points[2]);
        drawArrow(points[2], points[0]);
    };

    function drawArrow(p1, p2) {
        const arrowSize = 8;
        const angle = p.atan2(p2.y - p1.y, p2.x - p1.x);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        p.push();
        p.stroke(0);
        p.fill(0);
        p.translate(midX, midY);
        p.rotate(angle);
        p.line(-arrowSize, -arrowSize / 2, 0, 0);
        p.line(-arrowSize, arrowSize / 2, 0, 0);
        p.pop();
    }
};

new p5(sketch1);
new p5(sketch2);
new p5(sketch3);
new p5(sketch4);
new p5(sketch5);