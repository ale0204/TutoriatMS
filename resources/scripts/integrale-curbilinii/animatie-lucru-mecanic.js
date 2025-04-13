/*
p5.js sketch that:
- Draws a 2D vector field F(x,y).
- Draws a parametric curve r(t).
- Lets you drag a "slider" or the point on the curve to pick t.
- Shows the unit tangent (green) and field vector F (red) at that point.
*/

const sketch = (p) => {
    // Canvas dimensions
    let W = 800, H = 500;

    // Number of discrete samples for the curve
    let paramCount = 200;

    // We'll store curve points for easy reference
    let curvePoints = [];

    // Current param t in [0,1]
    let tValue = 0;

    // p5 slider object
    let tSlider;

    // For dragging the point on the curve
    let isDragging = false;

    // radius of the draggable point
    let pointRadius = 8;

    // Parametric curve r(t). Returns p5.Vector
    function parametricCurve(t) {
        // Example: r(t) = (200 cos(2πt), 100 sin(2 * 2πt))
        // => wave-like shape
        let angle = p.map(t, 0, 1, 0, p.TWO_PI);
        let x = 200 * p.cos(angle);
        let y = 100 * p.sin(2 * angle);
        return p.createVector(x, y);
    }

    // Derivative r'(t) (unscaled). We'll normalize it in draw().
    function parametricCurveDerivative(t) {
        let angle = p.map(t, 0, 1, 0, p.TWO_PI);
        // dx/d(angle) = -200 sin(angle), but also d(angle)/dt = 2π
        let dx = -200 * p.sin(angle) * (p.TWO_PI);
        // y(t) = 100 sin(2 * angle) => derivative wrt angle = 100*2*cos(2 angle)
        // multiplied by d(angle)/dt = 2π
        let dy = 100 * 2 * p.cos(2 * angle) * (p.TWO_PI);
        return p.createVector(dx, dy);
    }

    // Vector field F(x,y) = ( -y, x ), swirl-like
    function vectorField(x, y) {
        return p.createVector(-y, x);
    }

    p.setup = () => {
        // Create canvas and attach it to the page
        let cnv = p.createCanvas(W, H);
        cnv.parent("vectorFieldCanvas");

        // Precompute curve points
        for (let i = 0; i <= paramCount; i++) {
        let tt = i / paramCount;
        curvePoints.push(parametricCurve(tt));
        }

        // Create the slider
        tSlider = p.createSlider(0, 1, 0, 0.001);
        // Put it in #sliderHolder (within .slider-container)
        tSlider.parent("sliderHolder");
        // Style or position as needed
        tSlider.style("width", (W - 100) + "px");
    };

    p.draw = () => {
        p.background(255);

        // Draw coordinate axes
        p.push();
        p.stroke(0);
        p.strokeWeight(1);
        // x-axis
        p.line(0, H/2, W, H/2);
        // y-axis
        p.line(W/2, 0, W/2, H);
        p.pop();

        // Draw a grid of arrows for the vector field
        drawVectorField();

        // If not dragging directly, sync tValue with slider
        if (!isDragging) {
        tValue = tSlider.value();
        }

        // Transform so (W/2,H/2) is origin
        p.push();
        p.translate(W/2, H/2);

        // Draw the parametric curve
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let pt of curvePoints) {
        p.vertex(pt.x, pt.y);
        }
        p.endShape();

        // Current point
        let pos = parametricCurve(tValue);
        // Draggable circle
        p.noStroke();
        p.fill(255, 150, 0);
        p.circle(pos.x, pos.y, pointRadius*2);

        // Tangent vector (normalize it)
        let deriv = parametricCurveDerivative(tValue);
        deriv.normalize();  // now it's unit length
        // Scale for visibility
        let tangentLength = 50;
        p.stroke(0, 180, 0);
        p.strokeWeight(3);
        p.line(pos.x, pos.y, pos.x + deriv.x * tangentLength, pos.y + deriv.y * tangentLength);

        // Vector field at that point
        let F = vectorField(pos.x, pos.y);
        // For display, let's scale it down
        let fieldScale = 0.2;
        p.stroke(255, 0, 0);
        p.line(pos.x, pos.y, pos.x + F.x * fieldScale, pos.y + F.y * fieldScale);

        p.pop();
    };

    // Draw a grid of small arrows for the vector field
    function drawVectorField() {
        p.push();
        p.translate(W/2, H/2);
        p.stroke(150);
        p.strokeWeight(1);
        let step = 40;
        for (let x = -W/2; x <= W/2; x += step) {
        for (let y = -H/2; y <= H/2; y += step) {
            let vec = vectorField(x, y);
            let scale = 0.2;
            p.line(x, y, x + vec.x*scale, y + vec.y*scale);
        }
        }
        p.pop();
    }

    // DRAGGING THE POINT ON THE CURVE
    p.mousePressed = () => {
        // Convert mouse to local coords
        let localX = p.mouseX - W/2;
        let localY = p.mouseY - H/2;

        // Check distance to the current curve point
        let pos = parametricCurve(tValue);
        let d = p.dist(localX, localY, pos.x, pos.y);
        if (d < pointRadius + 2) {
        isDragging = true;
        }
    };

    p.mouseReleased = () => {
        isDragging = false;
    };

    p.mouseDragged = () => {
        if (isDragging) {
        // find nearest curve point to mouse
        let bestIndex = 0;
        let bestDist = 999999;
        let localX = p.mouseX - W/2;
        let localY = p.mouseY - H/2;
        for (let i = 0; i < curvePoints.length; i++) {
            let dd = p.dist(localX, localY, curvePoints[i].x, curvePoints[i].y);
            if (dd < bestDist) {
            bestDist = dd;
            bestIndex = i;
            }
        }
        tValue = bestIndex / paramCount;
        tSlider.value(tValue);
        }
    };
};

new p5(sketch);