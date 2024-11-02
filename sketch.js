let timeOffset = 0;
let pulseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  background(20);
  strokeWeight(2);
}

function draw() {
  // Change background color based on mouse proximity to the center
  let distanceToCenter = dist(mouseX, mouseY, width / 2, height / 2);
  let maxDistance = dist(0, 0, width / 2, height / 2);
  let dangerFactor = map(distanceToCenter, 0, maxDistance, 0, 1);
  
  // Background color transition from green (safe) to red (danger)
  let safeColor = color(20, 255, 20, 25);
  let dangerColor = color(255, 20, 20, 25);
  let bgColor = lerpColor(safeColor, dangerColor, dangerFactor);
  background(bgColor);

  let numRings = 50;
  let maxRadius = min(width, height) / 2;

  translate(width / 2, height / 2);
  timeOffset += 0.01; // Increment to evolve the visual over time
  pulseOffset += 0.05; // Increment for pulsing effect
  push();
  for (let i = 0; i < numRings; i++) {
    let noiseFactor = map(i, 0, numRings, 0, 1); // Progressive noise level
    let radius = map(i, 0, numRings, maxRadius / 50, maxRadius);
    let pulse = sin(pulseOffset + i * 0.1) * 5; // Pulsing effect
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.05) {
      let offset = map(noise(i * 0.1, angle * noiseFactor, timeOffset), 0, 1, -radius / 10, radius / 10);
      let x = (radius + offset + pulse) * cos(angle);
      let y = (radius + offset + pulse) * sin(angle);
      stroke(lerpColor(color(150, 150, 255), color(255, 50, 50), noiseFactor));
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop();

  // Draw lines to represent connections
  stroke(255, 50);
  for (let i = 0; i < 10; i++) {
    let angle1 = random(TWO_PI);
    let angle2 = random(TWO_PI);
    let radius1 = random(maxRadius / 2, maxRadius);
    let radius2 = random(maxRadius / 2, maxRadius);
    let x1 = radius1 * cos(angle1);
    let y1 = radius1 * sin(angle1);
    let x2 = radius2 * cos(angle2);
    let y2 = radius2 * sin(angle2);
    line(x1, y1, x2, y2);
  }

  push();
  // Draw glitching effect if mouse is pressed
  if (mouseIsPressed) {
    for (let i = 0; i < 10; i++) {
      // Draw larger glitch effect using rectangles and lines
      let glitchX = mouseX + random(-50, 50);
      let glitchY = mouseY + random(-50, 50);
      let glitchWidth = random(10, 50);
      let glitchHeight = random(10, 50);
      stroke(random(255), random(255), random(255));
      fill(random(255), random(255), random(255), 150);
      
      // Draw a random rectangle to create a glitchy effect
      rect(glitchX - width / 2, glitchY - height / 2, glitchWidth, glitchHeight);

      // Draw additional lines for more glitch variation
      let lineX1 = mouseX + random(-50, 50) - width / 2;
      let lineY1 = mouseY + random(-50, 50) - height / 2;
      let lineX2 = lineX1 + random(-20, 20);
      let lineY2 = lineY1 + random(-20, 20);
      stroke(random(255), random(255), random(255));
      line(lineX1, lineY1, lineX2, lineY2);
    }
  }
  pop();
}

function mousePressed() {
  timeOffset += 1; // Jump in evolution when the mouse is pressed
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

