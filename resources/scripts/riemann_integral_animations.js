
const minNumRectangles = 4;
const maxNumRectangles = 50;
const defaultNumRectangles = minNumRectangles;
const canvasX = 800;
const canvasY = 500;

/***************************************************************
 * HELPER FUNCTION: PARABOLA
 ***************************************************************/
function parabola(p, x) {
    // Simple parabola, opening upwards, shifted so vertex is near center
    return p.height / 2 + (x - p.width / 2) * (x - p.width / 2) / 500;
}

/***************************************************************
 * 1) LOWER DARBOUX SUM
 ***************************************************************/
let lowerDarbouxSketch = function(p) 
{
    let slider;

    p.setup = function() 
    {
        // Create canvas in #lowerDarbouxCanvas
        let canvas = p.createCanvas(canvasX, canvasY);
        canvas.parent("lowerDarbouxCanvas");

        // Create slider in #lowerDarbouxSliderContainer
        slider = p.createSlider(minNumRectangles, maxNumRectangles, defaultNumRectangles);
        slider.parent("lowerDarbouxSliderContainer");
    };

    p.draw = function() 
    {
        p.background(240);
        let n = slider.value();

        // Display the current subinterval count
        document.getElementById("lowerDarbouxValue").textContent = n;

        p.stroke(255, 0, 0);
        p.noFill();

        // Draw the base curve (a parabola for example)
        p.beginShape();
        for (let x = 0; x <= p.width; x += 5) {
            let yVal = parabola(p, x);
            p.vertex(x, p.height - yVal);
        }
        p.endShape();

        // Draw lower sum rectangles
        for (let i = 0; i < n; i++) {
            let x1 = (i / n) * p.width;
            let x2 = ((i + 1) / n) * p.width;
            let y1 = parabola(p, x1);
            let y2 = parabola(p, x2);
            let minY = Math.min(y1, y2);

            p.fill(255, 0, 0, 100);
            p.rect(x1, p.height - minY, x2 - x1, minY);
        }
    };
};
new p5(lowerDarbouxSketch);

/***************************************************************
 * 2) UPPER DARBOUX SUM
 ***************************************************************/
function upperDarbouxSketch(p)
{
    let slider;

    p.setup = function() 
    {
        let canvas = p.createCanvas(canvasX, canvasY);
        canvas.parent("upperDarbouxCanvas");
        slider = p.createSlider(minNumRectangles, maxNumRectangles, defaultNumRectangles);
        slider.parent("upperDarbouxSliderContainer");
    };

    p.draw = function() 
    {
        p.background(240);
        let n = slider.value();

        // Display the current subinterval count
        document.getElementById("upperDarbouxValue").textContent = n;

        p.stroke(0, 0, 255);
        p.noFill();

        // Draw the base curve
        p.beginShape();
        for (let x = 0; x <= p.width; x += 5) {
            let yVal = parabola(p, x);
            p.vertex(x, p.height - yVal);
        }
        p.endShape();

        // Draw upper sum rectangles
        for (let i = 0; i < n; i++) {
            let x1 = (i / n) * p.width;
            let x2 = ((i + 1) / n) * p.width;
            let y1 = parabola(p, x1);
            let y2 = parabola(p, x2);
            let maxY = Math.max(y1, y2);

            p.fill(0, 0, 255, 100);
            p.rect(x1, p.height - maxY, x2 - x1, maxY);
        }
    };
};
new p5(upperDarbouxSketch);

/***************************************************************
 * 3) RIEMANN SUM with RANDOM POINTS
 ***************************************************************/
let riemannSketch = function(p) 
{
    let slider;
    let oldN = 0;
    let randomXs = []; // store random sample points (ξ_i)

    p.setup = function() 
    {
        let canvas = p.createCanvas(canvasX, canvasY);
        canvas.parent("riemannCanvas");
        slider = p.createSlider(minNumRectangles, maxNumRectangles, defaultNumRectangles);
        slider.parent("riemannSliderContainer");
    };

    p.draw = function() 
    {
        p.background(240);
        let n = slider.value();

        // Show current subinterval count
        document.getElementById("riemannValue").textContent = n;

        // If the user changed n, generate new random points (once)
        if (n !== oldN) {
            oldN = n;
            randomXs = [];
            for (let i = 0; i < n; i++) {
            let x1 = (i / n) * p.width;
            let x2 = ((i + 1) / n) * p.width;
            // choose a random point in (x1, x2)
            let randX = p.random(x1, x2);
            randomXs.push(randX);
            }
        }

        // Draw the base curve
        p.stroke(0);
        p.noFill();
        p.beginShape();
        for (let x = 0; x <= p.width; x += 5) {
            let yVal = parabola(p, x);
            p.vertex(x, p.height - yVal);
        }
        p.endShape();

        // Draw rectangles based on random sample points
        for (let i = 0; i < n; i++) {
            let x1 = (i / n) * p.width;
            let x2 = ((i + 1) / n) * p.width;
            let mid = randomXs[i];
            let yVal = parabola(p, mid);

            p.fill(100, 200, 100, 100);
            p.rect(x1, p.height - yVal, x2 - x1, yVal);

            // Mark the chosen random point
            p.fill(0);
            p.ellipse(mid, p.height - yVal, 8, 8);
        }
    };
};
new p5(riemannSketch);
