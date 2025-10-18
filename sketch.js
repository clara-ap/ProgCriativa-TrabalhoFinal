/*
 * PROJETO 1: SINFONIA NATURAL (Ecossistema Musical)
 * * Versão "Final"
 * * INSTRUÇÕES:
 * 1. Adicione um arquivo MP3 a este sketch.
 * 2. Mude o nome 'sua-musica.mp3' no código abaixo.
 * 3. Clique na tela para tocar/pausar a música.
 */

let som, fft, amplitude;

// Aluno A (FFT)
let particulas = [];
let corFundo;

// Aluno C (Amplitude)
let aguaViva;

function preload() {
  soundFormats('mp3', 'wav');
  som = loadSound('Tame Impala - The Less I Know The Better.mp3', musicaCarregada);
}

function musicaCarregada() {
  console.log("Música carregada!");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  fft = new p5.FFT(0.8, 512);
  amplitude = new p5.Amplitude(0.9);

  // Aluno C: Instancia a criatura
  aguaViva = new Jellyfish(width / 2, height / 2);

  // Aluno A: Cor inicial do fundo
  corFundo = color(220, 80, 10);
}

function draw() {
  // --- ANÁLISE DE SOM ---
  let espectro = fft.analyze();
  let waveform = fft.waveform();
  let amp = amplitude.getLevel();
  
  // =============================================
  // ALUNO A: Atmosfera e Partículas (FFT)
  // =============================================
  let graves = fft.getEnergy("bass");
  let agudos = fft.getEnergy("treble");

  // Mapeia graves para o brilho do fundo, com transição suave
  let brilhoFundoAlvo = map(graves, 0, 255, 5, 25);
  corFundo = lerpColor(corFundo, color(220, 80, brilhoFundoAlvo), 0.1);
  background(corFundo);

  // Gera partículas com base nos agudos
  if (random(255) < agudos * 0.5) {
    particulas.push(new Particle(random(width), height * 0.9));
  }
  // Atualiza partículas
  for (let i = particulas.length - 1; i >= 0; i--) {
    particulas[i].update();
    particulas[i].display();
    if (particulas[i].isDead()) {
      particulas.splice(i, 1);
    }
  }

  // =============================================
  // ALUNO B: Flora Generativa (Waveform)
  // =============================================
  
  // Desenha um "chão"
  fill(120, 40, 15); // Verde escuro
  rect(0, height * 0.9, width, height * 0.1);
  
  // Desenha duas plantas/árvores recursivas
  // A forma de onda é passada para a função para "balançar" os galhos
  desenharGalho(width * 0.3, height * 0.9, 120, -PI / 2, 8, waveform);
  desenharGalho(width * 0.7, height * 0.9, 100, -PI / 2, 7, waveform);

  // =============================================
  // ALUNO C: Fauna e Energia (Amplitude)
  // =============================================
  
  // Atualiza e exibe a criatura, passando a amplitude
  aguaViva.update(amp);
  aguaViva.display(amp);
}

// --- Funções e Classes Auxiliares ---

// ALUNO A: Classe Particle
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(-1, -2));
    this.lifespan = 100; // 100% de vida
    this.cor = color(50 + random(20), 100, 100); // Amarelo/Laranja
  }
  update() {
    this.pos.add(this.vel);
    this.vel.y *= 0.98; // Desacelera
    this.lifespan -= 1.5;
  }
  display() {
    noStroke();
    fill(this.cor, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
  isDead() {
    return this.lifespan < 0;
  }
}

// ALUNO B: Função recursiva da Planta
function desenharGalho(x, y, len, angle, depth, onda) {
  if (depth === 0) return;

  // Pega um valor da waveform para "balançar"
  let waveIndex = floor(map(x, 0, width, 0, onda.length));
  let waveVal = onda[waveIndex] || 0;
  let shake = map(waveVal, -1, 1, -5, 5) * (depth / 2); // Balanço mais forte nos galhos finos

  let x2 = x + (cos(angle) * len) + shake;
  let y2 = y + (sin(angle) * len);

  strokeWeight(depth * 0.8);
  stroke(120, 60, 100 - depth * 8, 80); // Verde
  line(x, y, x2, y2);

  // Chama a si mesma para os próximos galhos
  desenharGalho(x2, y2, len * 0.8, angle - 0.3, depth - 1, onda);
  desenharGalho(x2, y2, len * 0.7, angle + 0.3, depth - 1, onda);
}

// ALUNO C: Classe Jellyfish
class Jellyfish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.baseSize = 100;
  }

  update(amp) {
    // Movimento orgânico usando Perlin Noise
    let targetX = map(noise(this.noiseOffsetX), 0, 1, 0, width);
    let targetY = map(noise(this.noiseOffsetY), 0, 1, height * 0.2, height * 0.8);
    let target = createVector(targetX, targetY);
    
    // Acelera em direção ao alvo
    this.acc = p5.Vector.sub(target, this.pos);
    this.acc.setMag(0.1 + amp * 0.5); // Aceleração base + boost da amplitude
    
    this.vel.add(this.acc);
    this.vel.limit(1 + amp * 3); // Limite de velocidade (afeta o "arrasto")
    this.pos.add(this.vel);
    
    this.noiseOffsetX += 0.005;
    this.noiseOffsetY += 0.005;
  }

  display(amp) {
    // Pulso baseado na amplitude
    let pulse = map(amp, 0, 1, 0, 80);
    let currentSize = this.baseSize + pulse;

    // Desenha o corpo (forma orgânica com curveVertex)
    noStroke();
    fill(0, 100, 100, 30); // Vermelho/Rosa translúcido
    
    beginShape();
    let steps = 10;
    for (let i = 0; i < steps; i++) {
      let ang = map(i, 0, steps, 0, TWO_PI);
      // 'tremulação' na forma
      let noiseFactor = noise(this.noiseOffsetX + i, this.noiseOffsetY);
      let r = currentSize * 0.5 + map(noiseFactor, 0, 1, -10, 10);
      curveVertex(this.pos.x + cos(ang) * r, this.pos.y + sin(ang) * r);
    }
    // Repete os 3 primeiros vértices para fechar a curva
    curveVertex(this.pos.x + cos(0) * (currentSize * 0.5), this.pos.y + sin(0) * (currentSize * 0.5));
    curveVertex(this.pos.x + cos(map(1, 0, steps, 0, TWO_PI)) * (currentSize * 0.5), this.pos.y + sin(map(1, 0, steps, 0, TWO_PI)) * (currentSize * 0.5));
    curveVertex(this.pos.x + cos(map(2, 0, steps, 0, TWO_PI)) * (currentSize * 0.5), this.pos.y + sin(map(2, 0, steps, 0, TWO_PI)) * (currentSize * 0.5));
    endShape();
  }
}

// --- Interação ---
function mousePressed() {
  if (som.isPlaying()) {
    som.pause();
  } else {
    userStartAudio();
    som.loop();
  }
}