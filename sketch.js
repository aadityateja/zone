
/*
  ASYMMETRY — THE SCHOOL
  THE LIVING FIELD
  p5.js | Responsive animated website background

  Features:
  - Asymmetric liquid infinity
  - Cyan / violet / electric blue gradients
  - Flowing wavefronts and particles
  - ASYMMETRY typography with travelling disturbances
  - Responsive canvas
*/

let particles = [];
let stars = [];
let t = 0;

const N = 700;
const TAU = Math.PI * 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont("sans-serif");

  for (let i = 0; i < N; i++) {
    particles.push({
      u: random(TAU),
      speed: random(0.002, 0.007),
      phase: random(TAU),
      offset: random(-13, 13),
      size: random(0.5, 2.0)
    });
  }

  for (let i = 0; i < 180; i++) {
    stars.push({
      x: random(-900, 900),
      y: random(-600, 600),
      size: random(0.4, 1.4),
      alpha: random(15, 90),
      phase: random(TAU)
    });
  }
}

function draw() {
  background(3, 3, 8, 48);
  t += 0.009;

  const unit = min(width / 1000, height / 650);

  push();
  translate(width / 2, height / 2);
  scale(unit);

  drawStars();
  drawAmbientField();

  // Slow breathing of the complete field
  const breath = 1 + 0.012 * sin(t * 0.65);

  push();
  scale(breath);

  drawInfinityAura();
  drawInfinityRibbon();
  drawFlowParticles();
  drawWavefronts();

  pop();

  // Typography is independent of the ribbon scale.
  drawTitle();
  drawSubtitle();
  drawSignal();

  pop();
}

// ----------------------------------------------------
// BACKGROUND
// ----------------------------------------------------

function drawStars() {
  noStroke();

  for (const s of stars) {
    const a = s.alpha * (0.65 + 0.35 * sin(t + s.phase));

    fill(130, 190, 255, a);
    circle(
      s.x * min(width / 1000, height / 650),
      s.y * min(width / 1000, height / 650),
      s.size
    );
  }
}

function drawAmbientField() {
  noStroke();

  // Large, soft, barely visible field disturbances.
  for (let i = 5; i >= 1; i--) {
    fill(15, 65, 115, 2.0);
    ellipse(
      -35 + sin(t * 0.5) * 18,
      0,
      360 + i * 115,
      150 + i * 62
    );
  }

  for (let i = 4; i >= 1; i--) {
    fill(100, 20, 180, 1.6);
    ellipse(
      120 + cos(t * 0.35) * 20,
      10,
      180 + i * 75,
      100 + i * 40
    );
  }
}

// ----------------------------------------------------
// ASYMMETRIC INFINITY MATHEMATICS
// ----------------------------------------------------

function fieldPoint(u) {
  const c = cos(u);
  const s = sin(u);

  // Different dimensions for the two lobes.
  const left = 205;
  const right = 292;

  let x = c < 0
    ? left * c - 15
    : right * c + 12;

  let y = 126 * s * c * (1 + 0.20 * c);

  // Break perfect symmetry at the crossing.
  y += 12 * s * s - 7 * c;

  // Travelling deformations make the line feel fluid.
  const wave =
    5.5 * sin(3 * u - t * 1.4) +
    2.5 * sin(7 * u + t * 1.2) +
    1.3 * sin(11 * u - t * 0.8);

  x += wave * s;
  y += wave * c;

  // Approximate curve normal.
  const dx = -240 * s;
  const dy = 126 * cos(2 * u);

  const mag = max(0.001, sqrt(dx * dx + dy * dy));

  return {
    x: x,
    y: y,
    nx: -dy / mag,
    ny: dx / mag
  };
}

// ----------------------------------------------------
// LIQUID INFINITY GLOW
// ----------------------------------------------------

function drawInfinityAura() {
  noFill();

  // Wide, restrained coloured aura.
  blendMode(ADD);

  for (let k = 8; k >= 1; k--) {
    stroke(15, 115, 255, 1.6 + k * 0.7);
    strokeWeight(k * 3.2);
    drawFieldCurve();
  }

  for (let k = 5; k >= 1; k--) {
    stroke(145, 35, 255, 1.5 + k * 0.6);
    strokeWeight(k * 2.0);
    drawFieldCurve(0.12);
  }

  blendMode(BLEND);
}

function drawInfinityRibbon() {
  // Multiple strands create the appearance of liquid filaments.
  blendMode(ADD);
  noFill();

  for (let strand = -2; strand <= 2; strand++) {
    const offset = strand * 2.2;

    for (let i = 0; i < 620; i++) {
      const u1 = i / 620 * TAU;
      const u2 = (i + 1) / 620 * TAU;

      const a = fieldPoint(u1);
      const b = fieldPoint(u2);

      const pulse = 0.5 + 0.5 * sin(u1 * 3 - t * 2.0);
      const hue = 0.5 + 0.5 * sin(u1 * 1.4 + t * 0.8);

      const rr = lerp(45, 155, hue);
      const gg = lerp(145, 220, pulse);
      const bb = 255;

      stroke(rr, gg, bb, 38 + pulse * 55);
      strokeWeight(strand === 0 ? 1.0 : 0.45);

      line(
        a.x + a.nx * offset,
        a.y + a.ny * offset,
        b.x + b.nx * offset,
        b.y + b.ny * offset
      );
    }
  }

  // A fine, cold-white central filament.
  stroke(205, 245, 255, 85);
  strokeWeight(0.65);
  drawFieldCurve();

  blendMode(BLEND);
}

function drawFieldCurve(phaseOffset = 0) {
  beginShape();

  for (let i = 0; i <= 600; i++) {
    const u = i / 600 * TAU;
    const p = fieldPoint(u + phaseOffset);
    vertex(p.x, p.y);
  }

  endShape();
}

// ----------------------------------------------------
// PARTICLES FLOW THROUGH THE FIELD
// ----------------------------------------------------

function drawFlowParticles() {
  blendMode(ADD);
  noStroke();

  for (const p of particles) {
    p.u += p.speed;

    if (p.u >= TAU) p.u -= TAU;

    const point = fieldPoint(p.u);

    const ripple =
      sin(p.u * 8 - t * 3 + p.phase) * 3.5;

    const x = point.x + point.nx * (p.offset + ripple);
    const y = point.y + point.ny * (p.offset + ripple);

    const pulse =
      0.5 + 0.5 * sin(p.u * 4 - t * 2 + p.phase);

    const a = 30 + 120 * pulse;

    // Colour transitions from electric blue to violet.
    if (sin(p.u * 1.6 + t) > 0.3) {
      fill(100, 195, 255, a);
    } else {
      fill(190, 95, 255, a * 0.8);
    }

    circle(x, y, p.size * (0.7 + pulse));
  }

  blendMode(BLEND);
}

// ----------------------------------------------------
// TRAVELLING WAVEFRONTS
// ----------------------------------------------------

function drawWavefronts() {
  blendMode(ADD);
  noStroke();

  for (let k = 0; k < 4; k++) {
    const head = (t * 0.45 + k * TAU / 4) % TAU;

    for (let j = 0; j < 65; j++) {
      const d = j * 0.0035;
      const u = (head - d + TAU) % TAU;
      const p = fieldPoint(u);

      const a = 110 * pow(1 - j / 65, 2);

      fill(100, 225, 255, a);
      circle(p.x, p.y, 0.8 + 1.8 * (1 - j / 65));
    }

    const tip = fieldPoint(head);
    fill(210, 250, 255, 180);
    circle(tip.x, tip.y, 3);
  }

  blendMode(BLEND);
}

// ----------------------------------------------------
// TYPOGRAPHY: ASYMMETRY AS A LIVING DISTURBANCE
// ----------------------------------------------------

function drawTitle() {
  const title = "ASYMMETRY";

  // Responsive type size within the scaled composition.
  const size = constrain(width / min(width / 1000, height / 650) * 0.00001, 1, 1);
  const fontSize = min(74, max(35, width / min(width / 1000, height / 650) * 0.065));

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(fontSize);

  const letterWidths = [];
  let total = 0;

  for (let i = 0; i < title.length; i++) {
    const w = textWidth(title[i]) + 2.5;
    letterWidths.push(w);
    total += w;
  }

  let x = -total / 2;

  // Soft glow behind the letters.
  for (let pass = 0; pass < 3; pass++) {
    let gx = -total / 2;

    for (let i = 0; i < title.length; i++) {
      const w = letterWidths[i];
      const phase = t * 1.7 - i * 0.65;

      const disturbance =
        sin(phase) * 2.8 +
        sin(t * 0.8 + i * 1.2) * 1.4;

      const y = disturbance;

      noStroke();
      fill(30, 150, 255, 8 + pass * 4);
      text(title[i], gx + w / 2, y);

      gx += w;
    }
  }

  // Each letter receives its own flowing colour.
  for (let i = 0; i < title.length; i++) {
    const w = letterWidths[i];

    const phase = t * 1.7 - i * 0.65;
    const disturbance =
      sin(phase) * 2.8 +
      sin(t * 0.8 + i * 1.2) * 1.4;

    // Colour sweeps across the word.
    const colourWave = sin(i * 0.7 - t * 1.3);

    const r = map(colourWave, -1, 1, 105, 225);
    const g = map(colourWave, -1, 1, 185, 225);
    const b = 255;

    // A tiny horizontal vibration makes the type feel alive.
    const dx = sin(t * 1.2 + i * 0.8) * 0.8;

    noStroke();
    fill(r, g, b, 245);
    text(title[i], x + w / 2 + dx, disturbance);

    // Occasional luminous disturbance on the lettering.
    const spark = sin(t * 2.0 - i * 1.7);

    if (spark > 0.94) {
      fill(210, 175, 255, 210);
      circle(x + w / 2, disturbance - fontSize * 0.45, 2.2);
    }

    x += w;
  }
}

function drawSubtitle() {
  push();

  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(10);

  // Slowly breathing tracking effect.
  const tracking = 5.0 + 0.8 * sin(t * 0.6);
  const label = "THE SCHOOL";

  let total = 0;

  for (let i = 0; i < label.length; i++) {
    total += textWidth(label[i]) + tracking;
  }

  let x = -total / 2;

  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    const w = textWidth(ch) + tracking;

    fill(160, 190, 220, 165 + 40 * sin(t + i * 0.3));
    text(ch, x + w / 2, 54);

    x += w;
  }

  // Tiny horizontal signal lines.
  stroke(95, 170, 220, 80);
  strokeWeight(0.6);

  line(-112, 54, -65, 54);
  line(65, 54, 112, 54);

  pop();
}

// ----------------------------------------------------
// SMALL SIGNAL / EXPERIMENTAL DETAIL
// ----------------------------------------------------

function drawSignal() {
  push();

  const y = 120;
  const widthLine = 180;

  stroke(80, 150, 210, 28);
  strokeWeight(0.6);
  line(-widthLine / 2, y, widthLine / 2, y);

  noStroke();

  const x = map((t * 25) % widthLine, 0, widthLine, -widthLine / 2, widthLine / 2);

  fill(110, 215, 255, 150);
  circle(x, y, 2);

  pop();
}

// ----------------------------------------------------
// RESIZE
// ----------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(3, 3, 8);
}
