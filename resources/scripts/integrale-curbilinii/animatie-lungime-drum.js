const arcLengthSketch = (p) => {
    let slider;
  
    // We define a custom function on the instance
    p.drawShape = function(padding, my_func) {
      let n = slider.value();
      let partitionSize = 5;
  
      // Update the displayed slider value
      document.getElementById("arcLengthValue").textContent = n;
  
      // Clear background
      p.background(240);
  
      // Draw continuous curve
      p.stroke(0);
      p.noFill();
      p.beginShape();
      for (let x = padding; x <= p.width - padding; x += partitionSize) {
        p.vertex(x, my_func(x));
      }
      p.endShape();
  
      // Overdraw with polygonal approximations
      p.stroke(255, 0, 0);
      for (let i = 0; i < n; i++) {
        let x1 = padding + (i / n) * (p.width - 2 * padding);
        let x2 = padding + ((i + 1) / n) * (p.width - 2 * padding);
  
        if (i === n - 1) {
          x2 = p.width - padding;
        }
  
        let y1 = my_func(x1);
        let y2 = my_func(x2);
  
        p.line(x1, y1, x2, y2);
        p.fill(0, 0, 255);
        p.ellipse(x1, y1, 5, 5);
  
        if (i === n - 1) {
          p.ellipse(x2, y2, 5, 5);
        }
      }
      p.fill(0);
    };
  
    // The standard p5 setup function, but within instance mode
    p.setup = function() {
      let canvas = p.createCanvas(800, 500);
      canvas.parent('arcLengthCanvas');
  
      // Create slider
      slider = p.createSlider(4, 20, 4);
      slider.parent('arcLengthSliderContainer');
    };
  
    // The standard p5 draw function, but within instance mode
    p.draw = function() {
      const PADDING = 10;
      // We pass a lambda that computes y for each x
      p.drawShape(PADDING, (x) => {
        return p.height / 3 + (x - p.width / 2) * (x - p.width / 2) / 500;
      });
    };
  };
  
  // Finally, create a new p5 instance, passing in our sketch function
  new p5(arcLengthSketch);
  