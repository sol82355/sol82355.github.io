Variables Initialization

let timeOffset = 0;
let pulseOffset = 0;
let drawnLines = []; // To store the drawn lines


timeOffset: This variable controls the evolution of the visual effect over time, allowing for smooth animation. It gets incremented in each frame to create continuous motion.
pulseOffset: This variable is responsible for controlling the pulsing effect of the rings. It also changes over time to make the visual appearance dynamic.
drawnLines: This is an array to store all the lines drawn by the user while dragging the mouse, enabling a custom glitch effect to be applied later.
setup() Function

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  background(20);
  strokeWeight(2);
}


setup(): This function is called once when the program starts. It initializes the drawing canvas and sets basic properties.
createCanvas(windowWidth, windowHeight): Creates a canvas that fills the entire browser window. It allows for a responsive design that resizes to match the window dimensions.
noFill(): Disables the fill color for shapes so that only their outlines are visible.
background(20): Sets the initial background color to a dark shade. This value (20) is close to black.
strokeWeight(2): Sets the thickness of the lines used in the sketches. This ensures the shapes are clearly visible.
draw() Function

function draw() {
  // Change background color based on mouse proximity to the center
  let distanceToCenter = dist(mouseX, mouseY, width / 2, height / 2);
  let maxDistance = dist(0, 0, width / 2, height / 2);
  let dangerFactor = map(distanceToCenter, 0, maxDistance, 255, 20);
  background(255 - dangerFactor, 20, 20, 25); // Danger when close, safe when far


draw(): This function is called continuously and is responsible for animating the canvas.
let distanceToCenter = dist(mouseX, mouseY, width / 2, height / 2): Calculates the distance between the mouse cursor and the center of the canvas. This helps determine the background color dynamically.
let maxDistance = dist(0, 0, width / 2, height / 2): Finds the maximum possible distance from the center to a corner.
let dangerFactor = map(distanceToCenter, 0, maxDistance, 255, 20): Maps the mouse distance to a range between 255 (red) and 20 (dark red). This creates a visual effect where the background becomes more "dangerous" (red) as the mouse approaches the center.
background(255 - dangerFactor, 20, 20, 25): Sets the background color based on the mouse proximity, where it turns redder as the mouse moves closer to the center.
Drawing Rings

  let numRings = 50;
  let maxRadiusX = width / 2;
  let maxRadiusY = height / 3; // Adjust for ellipse shape

  push();
  translate(width / 2, height / 2);
  timeOffset += 0.01; // Increment to evolve the visual over time
  pulseOffset += 0.05; // Increment for pulsing effect


let numRings = 50: Specifies the number of rings to be drawn on the canvas, creating a layered effect.
let maxRadiusX = width / 2 and let maxRadiusY = height / 3: Define the maximum horizontal and vertical radii for the rings. This ensures that the rings form an elliptical shape.
push(): Saves the current state of transformation, allowing the code to make modifications like translations without affecting future drawing operations.
translate(width / 2, height / 2): Moves the origin of the canvas to its center, making it easier to draw concentric elliptical shapes from the middle.
timeOffset += 0.01 and pulseOffset += 0.05: Increment the timeOffset and pulseOffset to animate the rings and introduce continuous changes over time.
Drawing Each Ring

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


The for loop iterates over numRings to draw multiple concentric rings.
let noiseFactor = map(i, 0, numRings, 0, 1): Maps the current ring index to a noise factor between 0 and 1, adding gradual variation to each ring.
let radiusX and let radiusY: These define the horizontal and vertical radius for each ring, ensuring each successive ring becomes larger.
let pulse = sin(pulseOffset + i * 0.1) * 5: Creates a pulsing effect for each ring, making the shapes expand and contract in a wave-like pattern.
beginShape(): Starts defining a shape composed of a series of connected vertices.
The inner for loop iterates over angles from 0 to TWO_PI to draw an entire ring.
let offset: Uses Perlin noise to add variation to the radius, introducing a slight randomness that makes the ring appear more organic.
let x and let y: Calculate the coordinates for each vertex, adjusting for radius, offset, and pulse.
stroke(lerpColor(color(150, 150, 255), color(255, 50, 50), noiseFactor)): Sets the color of the current ring, interpolating between blue and red based on the noise factor to create a gradient effect.
vertex(x, y): Adds a vertex at the calculated coordinates.
endShape(CLOSE): Completes the ring by connecting the last vertex back to the first.
pop(): Restores the previous transformation state.
Drawing Connecting Lines

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


stroke(255, 50): Sets the stroke color for the connecting lines with low opacity (50) to create a subtle effect.
The loop iterates 10 times to draw random lines connecting different points within the rings.
Random angles and radii are used to determine the start and end points of each line.
The line() function draws each line, adjusted to the center of the canvas.
Drawing User-Drawn Lines with Glitch Effect

  for (let line of drawnLines) {
    drawGlitchLine(line.x1, line.y1, line.x2, line.y2);
  }


Iterates through all lines stored in the drawnLines array and applies a glitch effect to each.
Handling Mouse Events

function mousePressed() {
  timeOffset += 1; // Jump in evolution when the mouse is pressed
}

function mouseDragged() {
  // Store the line being drawn
  drawnLines.push({ x1: mouseX, y1: mouseY, x2: pmouseX, y2: pmouseY });
}


mousePressed(): Increments timeOffset to cause a noticeable jump in the animation when the user clicks the mouse.
mouseDragged(): Stores the coordinates of lines being drawn by the user as they drag the mouse, allowing these lines to be rendered later.
Drawing Glitch Lines

function drawGlitchLine(x1, y1, x2, y2) {
  for (let i = 0; i < 10; i++) {
    let glitchOffsetX = random(-10, 10);
    let glitchOffsetY = random(-10, 10);
    stroke(255, 0, 0, random(150, 255));
    line(x1 + glitchOffsetX, y1 + glitchOffsetY, x2 + glitchOffsetX, y2 + glitchOffsetY);
  }
}


drawGlitchLine(): Draws the user-drawn lines with a glitch effect by adding random offsets to the line’s coordinates.
The loop runs 10 times to draw multiple copies of the line with slight random displacements, giving the impression of a glitch.
Window Resize Handling

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


windowResized(): This function is triggered whenever the window is resized, ensuring the canvas is resized accordingly to maintain full coverage.



