let timeOffset = 0;
let pulseOffset = 0;
let drawnLines = []; // To store the drawn lines

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
  let dangerFactor = map(distanceToCenter, 0, maxDistance, 255, 20);
  background(255 - dangerFactor, 20, 20, 25); // Danger when close, safe when far

  let numRings = 50;
  let maxRadiusX = width / 3;
  let maxRadiusY = height / 2; // Adjust for '0' shape

  push();
  translate(width / 2, height / 2);
  timeOffset += 0.01; // Increment to evolve the visual over time
  pulseOffset += 0.05; // Increment for pulsing effect

  for (let i = 0; i < numRings; i++) {
    let noiseFactor = map(i, 0, numRings, 0, 1); // Progressive noise level
    let radiusX = map(i, 0, numRings, maxRadiusX / 50, maxRadiusX);
    let radiusY = map(i, 0, numRings, maxRadiusY / 50, maxRadiusY);
    let pulse = sin(pulseOffset + i * 0.1) * 5; // Pulsing effect
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.05) {
      let offset = map(noise(i * 0.1, angle * noiseFactor, timeOffset), 0, 1, -radiusX / 10, radiusX / 10);
      let x = (radiusX + offset + pulse) * cos(angle);
      let y = (radiusY + offset + pulse) * sin(angle);
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
    let radius1X = random(maxRadiusX / 2, maxRadiusX);
    let radius1Y = random(maxRadiusY / 2, maxRadiusY);
    let radius2X = random(maxRadiusX / 2, maxRadiusX);
    let radius2Y = random(maxRadiusY / 2, maxRadiusY);
    let x1 = radius1X * cos(angle1);
    let y1 = radius1Y * sin(angle1);
    let x2 = radius2X * cos(angle2);
    let y2 = radius2Y * sin(angle2);
    line(x1 + width / 2, y1 + height / 2, x2 + width / 2, y2 + height / 2);
  }

  // Draw the user-drawn lines with a glitch effect
  for (let line of drawnLines) {
    drawGlitchLine(line.x1, line.y1, line.x2, line.y2);
  }
}

function mousePressed() {
  timeOffset += 1; // Jump in evolution when the mouse is pressed
}

function mouseDragged() {
  // Store the line being drawn
  drawnLines.push({ x1: mouseX, y1: mouseY, x2: pmouseX, y2: pmouseY });
}

function drawGlitchLine(x1, y1, x2, y2) {
  for (let i = 0; i < 10; i++) { // Reduce the number of iterations for a less dramatic effect
    let glitchOffsetX = random(-10, 10); // Reduce the range of offset for a less pronounced glitch
    let glitchOffsetY = random(-10, 10);
    stroke(255, 0, 0, random(150, 255));
    line(x1 + glitchOffsetX, y1 + glitchOffsetY, x2 + glitchOffsetX, y2 + glitchOffsetY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

