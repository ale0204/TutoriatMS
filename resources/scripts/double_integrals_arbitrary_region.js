// =========================
// Arbitrary Region Animation for Double Integrals
// =========================

// 1) Define the polygon representing the region boundary.
// Replace these points with any shape you want.
const regionPoints = [
    { x: 50,  y: 100 },
    { x: 100, y: 50 },
    { x: 200, y: 30 },
    { x: 300, y: 50 },
    { x: 400, y: 100 },
    { x: 450, y: 180 },
    { x: 430, y: 260 },
    { x: 350, y: 320 },
    { x: 250, y: 340 },
    { x: 150, y: 320 },
    { x: 70,  y: 260 },
    { x: 50,  y: 180 }
];
  
// 2) Ray-casting function to check if a point is inside the polygon.
function pointInPolygon(px, py, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersect = ((yi > py) !== (yj > py)) &&
                          (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
  
// 3) Example integrand: f(x,y) = 1 for area. Feel free to change.
function f(x, y) {
    return 1;
}
  
// 4) p5 Sketch
let arbitraryRegionSketch = function(p) {
    let slider;
    let divisions = 10; // default # of subdivisions
  
    p.setup = function() {
        // Create canvas in #arbitraryRegionCanvas
        let canvas = p.createCanvas(500, 350);
        canvas.parent("arbitraryRegionCanvas");
  
        // Create slider in #arbitraryRegionSliderContainer
        slider = p.createSlider(15, 70, 15, 1);
        let sliderContainer = document.getElementById("arbitraryRegionSliderContainer");
        slider.parent(sliderContainer);
    };
  
    p.draw = function() {
        p.background(240);
        divisions = slider.value();
  
        // Update text with the current subdivisions value
        document.getElementById("arbitraryRegionSubdivValue").textContent = divisions;
  
        // 1) Draw the region boundary
        p.stroke(0);
        p.strokeWeight(2);
        p.fill(200, 220, 255);
        p.beginShape();
        for (let pt of regionPoints) {
            p.vertex(pt.x, pt.y);
        }
        p.endShape(p.CLOSE);
  
        // 2) Partition the bounding rectangle into small rectangles
        let dx = p.width / divisions;
        let dy = p.height / divisions;
  
        // We'll draw only the small rectangles whose centers lie inside the region.
        for (let i = 0; i < divisions; i++) {
            for (let j = 0; j < divisions; j++) {
                // (x1, y1) is the top-left corner of the small rectangle
                let x1 = i * dx;
                let y1 = j * dy;
                // Determine the center of the rectangle
                let cx = x1 + dx / 2;
                let cy = y1 + dy / 2;
  
                // Check if the center is inside the polygon
                if (pointInPolygon(cx, cy, regionPoints)) {
                    p.fill(255, 0, 0, 100);  // Semi-transparent red fill
                    p.stroke(0);             // Black outline
                    p.rect(x1, y1, dx, dy);
                }
                // If outside, don't draw the rectangle at all.
            }
        }
    };
};
  
new p5(arbitraryRegionSketch);