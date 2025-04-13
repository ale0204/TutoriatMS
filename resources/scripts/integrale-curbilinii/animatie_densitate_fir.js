let totalPoints = 60;
let amplitude = 80;
let curveLength = 500;
let thicknessMin = 3;
let thicknessMax = 15;

let curvePoints = [];

function setup() {
  // Create the canvas and attach it to the element with id "densityVisualizationCanvas"
  let canvas = createCanvas(800, 600, WEBGL);
  canvas.parent("densityVisualizationCanvas");
  
  generateCurve();
}

function draw() {
  background(240);
  orbitControl();
  
  drawAxes();

  // Draw the curve with cylinders
  for (let i = 0; i < curvePoints.length - 1; i++) {
    const pt1 = curvePoints[i];
    const pt2 = curvePoints[i + 1];
    
    // Compute a radius that smoothly transitions
    // between pt1 and pt2 based on our continuous function
    const r1 = getThicknessAt(pt1.t);
    const r2 = getThicknessAt(pt2.t);
    const radius = (r1 + r2) * 0.5;

    drawCylinderBetweenPoints(pt1, pt2, radius);
  }
}

// Continuous thickness: a Gaussian-like peak at t=0.5
function getThicknessAt(t) {
  let offset = t - 0.5;
  let val = Math.exp(-8 * offset * offset);
  return thicknessMin + (thicknessMax - thicknessMin) * val;
}

function generateCurve() {
  curvePoints = [];
  for (let i = 0; i <= totalPoints; i++) {
    const t = i / totalPoints;
    const x = -curveLength / 2 + t * curveLength;
    const y = amplitude * sin(t * TWO_PI);
    const z = (amplitude * cos(t * TWO_PI)) / 2;
    curvePoints.push({ x, y, z, t });
  }
}

function drawCylinderBetweenPoints(pt1, pt2, radius) {
  push();

  // Midpoint
  const midX = (pt1.x + pt2.x) / 2;
  const midY = (pt1.y + pt2.y) / 2;
  const midZ = (pt1.z + pt2.z) / 2;

  // Direction
  let dir = createVector(pt2.x - pt1.x, pt2.y - pt1.y, pt2.z - pt1.z);
  let segLength = dir.mag();
  dir.normalize();

  // Move to midpoint
  translate(midX, midY, midZ);

  // Rotate from (0,1,0) to 'dir'
  const angle = createVector(0, 1, 0).angleBetween(dir);
  let axis = createVector(0, 1, 0).cross(dir).normalize();

  if (segLength > 0.0001) {
    rotate(angle, axis);

    // EXTRA rotation if the cylinders appear sideways:
    // Try exactly ONE of these at a time until it looks correct:
    rotate(HALF_PI, createVector(0, 0, 1));
    // rotate(-HALF_PI, createVector(0, 0, 1));
    // rotate(HALF_PI, createVector(1, 0, 0));
    // rotate(-HALF_PI, createVector(1, 0, 0));
  }

  noStroke();
  // TEAL color
  fill(0, 128, 128);
  cylinder(radius, segLength);

  pop();
}

// Just a reference axis drawing
function drawAxes() {
  strokeWeight(2);

  // X-axis in red
  stroke(255, 0, 0);
  line(-300, 0, 0, 300, 0, 0);

  // Y-axis in green
  stroke(0, 255, 0);
  line(0, -300, 0, 0, 300, 0);

  // Z-axis in blue
  stroke(0, 0, 255);
  line(0, 0, -300, 0, 0, 300);
}