# Visualização Artística de Música aplicada em Sistemas Físicos

> Trabalho Final da disciplina de Programação Criativa (2025.2) - UFRJ

Este projeto propõe uma obra de arte digital generativa e audioreativa, onde a música atua como um motor de forças físicas que moldam o ambiente 3D. Diferente de visualizadores tradicionais, aqui a amplitude, o espectro de frequência e as batidas modulam rigidez, rotação e gravidade da cena.

## Demo Online

Você pode visualizar a versão final do sketch rodando diretamente no navegador através do link abaixo:

**[Acessar Sketch no p5.js Editor](https://editor.p5js.org/clara_20221/sketches/KFrIAU3t6)**

---

## Sobre o Projeto

A motivação central reside na exploração da visualização de música através de simulação física. O sistema captura o sinal de áudio em tempo real e o trata como um conjunto de perturbadores físicos:

* **Amplitude Global:** Atua como "energia cinética" geral da cena.
* **Frequências (FFT):** Graves e agudos controlam elementos distintos (cubos vs. esferas).
* **Centróide Espectral:** Define a "cor" da música, alterando a paleta visual baseada na predominância de tons graves ou agudos.

## Tecnologias Utilizadas

* [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
* [p5.js](https://p5js.org/) (Core)
* **WEBGL** (Renderização 3D)
* **p5.sound** (Análise de áudio: Amplitude, FFT, PeakDetect)

## Como Funciona (Implementação)

O ambiente 3D é composto por três entidades principais que reagem de formas distintas:

### 1. Grade de Ondas (Wave Grid)
Uma matriz de caixas 3D cuja altura é calculada por uma função senoidal multiplicada pelo volume da música.
* **Cor:** Controlada dinamicamente pelo *Spectral Centroid*. Sons graves tendem ao vermelho, sons agudos ao violeta.

### 2. Geometria Central
* **Esfera:** A rotação é acelerada pelo volume geral. A cor reage à intensidade dos agudos (*Treble*).
* **Cubos:** Rotacionam em eixos opostos. A velocidade aumenta com os agudos, enquanto a cor pulsa com a energia dos graves (*Bass*).

### 3. Sistema de Partículas
Um sistema que gera anéis de partículas apenas quando a música atinge picos de intensidade (Amplitude > 0.2). As partículas expandem e desaparecem (fade-out), simulando ondas de choque sonoras.

## Controles

* **Botão Play/Pause:** Inicia ou pausa a música e a análise de áudio.
* **Botão Partículas:** Alterna a visibilidade do sistema de partículas, permitindo alterar a cena.

---

## Autores

Trabalho desenvolvido por alunos da Escola Politécnica da UFRJ:

* **Clara Albino Pacheco**
* **Gabriel Henrique Braga Lisboa**
* **Luiz Felipe Pereira Costa**

**Professores:** Cláudio Esperança e Doris Kosminsky.
