let totalPointsSlider;

const perdeaAnimation = (p) => {
    let curvePoints = [];
    let amplitude = 70;      // Reasonably small amplitude
    let curveLength = 300;   // Shorter wave for clarity
    let totalPoints = 20;
    let drag = false;
    let angleX = -p.PI / 6,
        angleY = p.PI / 6;
    let lastMouseX, lastMouseY;

    p.setup = function() {
        let canvas = p.createCanvas(800, 600, p.WEBGL);
        canvas.parent("cortinaAnimationCanvas");

        // Slider for total points
        totalPointsSlider = p.createSlider(20, 300, totalPoints, 1);
        totalPointsSlider.parent("perdeaPointsSliderContainer");
        totalPointsSlider.style("width", "200px");

        generateCurve();
    };

    p.draw = function() {
        p.background(255);

        if (!drag) {
            totalPoints = totalPointsSlider.value();
            generateCurve();
        }

        p.push();
        p.scale(3);  // Zoom to see the curve
        p.rotateX(angleX);
        p.rotateY(angleY);

        drawAxesAndLabels();

        // 1) Draw top curve (3D surface curve)
        p.noFill();
        p.stroke(255, 165, 0);
        p.strokeWeight(3);
        p.beginShape();
        for (let pt of curvePoints) {
            p.vertex(pt.x, pt.y, pt.z);
        }
        p.endShape();

        // 2) Draw base curve (xy-plane)
        p.stroke(0, 0, 150);
        p.strokeWeight(2);
        p.beginShape();
        for (let pt of curvePoints) {
            p.vertex(pt.x, pt.y, 0);
        }
        p.endShape();

        // 3) Fill & lines between top and base for each pair of consecutive points
        for (let i = 0; i < curvePoints.length - 1; i++) {
            const pt1 = curvePoints[i];
            const pt2 = curvePoints[i + 1];

            // Fill the rectangular strip: top1 -> top2 -> base2 -> base1
            p.noStroke();
            p.fill(150, 150, 255, 150);
            p.beginShape();
            p.vertex(pt1.x, pt1.y, pt1.z);
            p.vertex(pt2.x, pt2.y, pt2.z);
            p.vertex(pt2.x, pt2.y, 0);
            p.vertex(pt1.x, pt1.y, 0);
            p.endShape(p.CLOSE);

            // Draw vertical lines on top of fill:
            // (top->base) for each point in this segment
            p.stroke(100);
            p.strokeWeight(2);
            // For each segment's endpoints
            p.line(pt1.x, pt1.y, 0, pt1.x, pt1.y, pt1.z);
            p.line(pt2.x, pt2.y, 0, pt2.x, pt2.y, pt2.z);
        }

        p.pop();

        // Display slider value
        document.getElementById("perdeaPointsValue").textContent = totalPoints;
    };

    // Create a gentle wave in 3D
    function generateCurve() {
        curvePoints = [];
        for (let i = 0; i <= totalPoints; i++) {
            const t = i / totalPoints;
            const x = -curveLength / 2 + t * curveLength;
            const y = amplitude * p.sin(t * p.TWO_PI);
            const z = amplitude * p.noise(t);
            curvePoints.push({ x, y, z });
        }
    }

    function drawAxesAndLabels() {
        // Axes
        p.stroke(0);
        p.strokeWeight(1);
        p.line(-200, 0, 0, 200, 0, 0); // x-axis
        p.line(0, -200, 0, 0, 200, 0); // y-axis
        p.line(0, 0, -200, 0, 0, 200); // z-axis

        // Axes labels
        p.noStroke();
        p.fill(0);
        p.textSize(16);

        // X label
        p.push();
        p.translate(210, 0, 0);
        p.rotateY(-p.HALF_PI);
        p.text("x", 0, 0);
        p.pop();

        // Y label
        p.push();
        p.translate(0, -210, 0);
        p.rotateX(p.HALF_PI);
        p.text("y", 0, 0);
        p.pop();

        // Z label
        p.push();
        p.translate(0, 0, 210);
        p.text("z", 0, 0);
        p.pop();
    }

    // Mouse drag => camera rotation
    p.mousePressed = function() {
        if (
            p.mouseX >= 0 && p.mouseX <= p.width &&
            p.mouseY >= 0 && p.mouseY <= p.height
        ) {
            drag = true;
            lastMouseX = p.mouseX;
            lastMouseY = p.mouseY;
        }
    };

    p.mouseReleased = function() {
        drag = false;
    };

    p.mouseDragged = function() {
        if (drag) {
            let dx = p.mouseX - lastMouseX;
            let dy = p.mouseY - lastMouseY;
            angleY += dx * 0.01;
            angleX += dy * 0.01;
            lastMouseX = p.mouseX;
            lastMouseY = p.mouseY;
        }
    };
};

new p5(perdeaAnimation);