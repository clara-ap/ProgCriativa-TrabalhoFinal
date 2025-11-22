// Variáveis para os botões
let button, buttonPlaySong;
let showParticles = false;
let buttonsHeight = 50;

// Variáveis para a música
let song;
let amplitude;
let fft;
let level, bass, treble, centroid;
//let peakDetect;

// Variáveis para a onda 
let boxWidth = 3;
let boxHeight = 3;
let boxDepth = 3;
let waveAngle = 0;
let activeBoxes = [];
let gridMinX, gridMaxX;

// Variáveis para a esfera 
let sphereAngle = 0;
let sphereRadius = 1600;
//let currentRadius = 1600;

// Variáveis para o cubo
let cubeAngle = 0;

// Variáveis para as partículas 
let circles = [];
let baseRadius;
let numPoints = 180;


function preload() {
  soundFormats('mp3');
  song = loadSound('Dont You Worry Child (Radio Edit).mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight - buttonsHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 255);
  noFill();
  stroke(50); 
  
  buttonPlaySong = createButton("Clique para tocar/pausar a música.");
  buttonPlaySong.mousePressed(controlSong);
  buttonPlaySong.style("width", "300px");
  buttonPlaySong.style("height", buttonsHeight + "px");
  buttonPlaySong.style("font-size", "18px");
  
  button = createButton("Clique para liberar as partículas.");
  button.mousePressed(() => showParticles = !showParticles);
  button.style("width", "300px");
  button.style("height", buttonsHeight + "px");
  button.style("font-size", "18px");

  amplitude = new p5.Amplitude();
  amplitude.setInput(song);

  fft = new p5.FFT(0.8, 512); 
  fft.setInput(song);
  
  peakDetect = new p5.PeakDetect(20, 140, 0.35, 20);

  gridMinX = -floor(width / 40);
  gridMaxX = floor(width / 40);
  
  for (let i = gridMinX; i < gridMaxX; i++) {
    for (let j = -floor(height / 45); j < floor(height / 45); j++) {
      if (random() < 0.6) {
        activeBoxes.push(createVector(i, j));
      }
    }
  }
}

function draw() {
  background(0);

  let spectrum = fft.analyze(); 
  peakDetect.update(fft); 
  level = amplitude.getLevel();
  
  // Pega os 3 componentes de frequência para as cores
  bass = fft.getEnergy("bass");
  treble = fft.getEnergy("treble");
  centroid = fft.getCentroid(); 
  
  if (showParticles) {
    drawParticles();
  }
  else {
    drawWave(); 
  }
  drawSphere();
  drawCube(800);
  drawCube(5);
}

// function mousePressed() {
//   userStartAudio(); 
//   if (song.isPlaying()) {
//     song.pause();
//   } else {
//     song.loop();
//   }
// }

function controlSong() {
  userStartAudio(); 
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}

function drawWave() {
  push();
  rotateX(waveAngle * 0.8); 
  rotateZ(90); 
  
  let waveHue = map(centroid, 100, 4000, 0, 360, true);
  let waveHeight = map(level, 0, 0.4, 10, 100);
  let t = frameCount * 3;
  
  for (let b of activeBoxes) {
    push();

    let wave = sin(t + b.x * 20) * waveHeight;

    translate(
      b.x * (boxWidth + 10),
      wave, 
      b.y * (boxDepth + 15)
    );
    
    let brightness = map(wave, -waveHeight, waveHeight, 90, 100);
    stroke(waveHue, 100, brightness); 
    box(boxWidth, boxHeight, boxDepth);

    pop();
  } 

  pop(); 

  waveAngle += 0.5;
}

function drawSphere() {
  push();
  noFill(); 
  
  let sphereHue = map(treble, 0, 150, 300, 360, true);
  stroke(sphereHue, 90, 90);
  strokeWeight(1);

  let sphereSpeed = map(level, 0, 0.4, 0.1, 0.8, true);
  sphereAngle += 1.5*sphereSpeed; 
  
  rotateZ(-90)
  rotateY(sphereAngle * 0.8);
  
  sphere(sphereRadius, 24, 24); 
  pop(); 
}

function drawCube(cubeSize) {
  push();
  noFill();
  
  let cubeHue = map(bass, 0, 255, 100, 180, true);
  stroke(cubeHue, 80, 80, 100); 
  strokeWeight(2);
  
  let baseCubeSpeed = 0.3;
  let additionalCubeSpeed = map(treble, 0, 150, 0, 0.8, true);
  cubeAngle += (baseCubeSpeed + additionalCubeSpeed); 
  
  rotateY(cubeAngle * 0.7); 
  rotateZ(cubeAngle * 0.5);
  
  box(cubeSize); 
  pop();
}

function drawParticles() {
  
  // cria os círculos só quando o level ultrapassa o threshold 
  // o raio do círculo criado depende de level
  let threshold = 0.2;
  baseRadius = map(level, 0, 1, 5, 20);
  if (level > threshold) {
    circles.push({
      radius: baseRadius,
      alpha: 255
    });
  }
  
  let hue = map(bass, 0, 255, 0, 300);
  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    push();
    scale(baseRadius/10)
    stroke(hue, 100, 80, c.alpha);
    noFill();
    strokeWeight(1);
    //translate(-width/2, -height/2);
    // desenha o círculo de pontos
    for (let j = 0; j < numPoints; j++) {
      let angle = map(j, 0, numPoints, 0, 360);
      let x = cos(angle) * c.radius;
      let y = sin(angle) * c.radius;
      point(x, y);
    }
    pop();

    // aumenta o raio e diminui a opacidade
    c.radius += 2.5;
    c.alpha -= 3;

    // remove quando ficar invisível
    if (c.alpha <= 0) {
      circles.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}