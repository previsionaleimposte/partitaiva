//frase da scrivere
//tasse imposte //previsionale imposte //calcolo imposte
let srcText = ["Q","U","A","N","T","O"," ","P","A","G","H","E","R","Ò","?", " "];
//array con le posizioni delle lettere iniziali delle parole di srcText
let srcStartNum = [0, 7];
//elenco caratteri random
let rndText =  ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","!","?","£","$","€","<",">", "Ò"," "];

//array that stores tiles
let tiles;

//array dei numeri delle celle dell'enigmistica
let cellNumber;

//numero di iterazioni per cella
const minIter = 2;
const maxIter = 15;
//array che contiene i singoli valori
let iterNum;

//shift delle righe di testo
let rndIncrem;
let maxTileOffset = 20;

let arrow;
let img;
let img2;

//variabili per la rotazione che segue la pos del mouse
let targetAngle;
//let currentAngle = 0.0;
//let smoothSpeed = 0.05;
let x = 0.0;
let y = 0.0;

//dimensione delle tile
const tileW = 18;
const tileH = 18;
//numero di tiles che si ottengono da width/tileW e height/tileH
let numTilesW;
let numTIlesH;

const fpsArrow = 18;
const fpsMosaic = 3;
let refreshMosaic = 0;

let canvasDiv;
let myWidth;
let myHeight;

function preload() {
  arrow = loadImage("assets/freccia1.png");
}

function setup() {

  canvasDiv = document.getElementById('canvas-container');
  myWidth = canvasDiv.offsetWidth;
  myHeight = canvasDiv.offsetHeight;

  //settings
  let cnv = createCanvas(myWidth, myHeight);
  cnv.parent("canvas-container");

  resetSketch();
}

function resetSketch() {
  tiles = [];
  cellNumber = [];
  iterNum = [];
  rndIncrem = [];

  frameRate(fpsArrow);


  imageMode(CENTER);
  angleMode(DEGREES);

  textSize(tileW - tileW/4);
  strokeWeight(0.75);

  //centratura rotazione seguendo mouse
  x = width * 0.5;
  y = height * 0.5;

  //calcolo numero tiles
  numTilesW= ceil(width / tileW);
  numTilesH = ceil(height / tileH);

    //crea un valore random di iterazioni per ciascuna tile
  let cellTot = numTilesW * numTilesH;
  for (let i = 0; i < cellTot; i++) {
    let rndIter = round(random(minIter, maxIter));
    iterNum.push(rndIter);
  }

  //create a unique value for each cell
  //vengono generati w*h numeri / lunghezza della frase * numero di parole nella frase + 20 (numero a caso per assicurarsi che siano abbastanza)
  let cellIniz = ceil(numTilesW * numTilesH / srcText.length * 2) + 20;

  //viene creato un array che contiene i valori univoci, poi shuffolato
  for (let i = 0; i < cellIniz; i++){
    cellNumber.push(1+i);
  }
  //shuffle(cellNumber, true);



  for (let i = 0; i < numTilesH; i++) {
    let rndI = round(random(0, maxTileOffset));

    rndIncrem.push(rndI);
  }

  for (let i = 0; i < numTilesW; i++) {
    //array temporaneo che contiene le tiles della riga i
    let arr = [];

    for (let j = 0; j < numTilesH; j++) {
      //creazione della tile e push nell'array
      arr[j] = new Tile(i, j);
    }
    //push dell'array nell'array
    tiles[i] = arr;
  }
}

function draw() {
  background(100);

  //calcolo rotazione seguendo il mouse
  if (myWidth > 600) {
    targetAngle = atan2(mouseY - y, mouseX - x);
  } else {
    targetAngle = 90;
  }
  //currentAngle = lerpAngle(currentAngle, targetAngle, smoothSpeed);

  //immagine png della freccia che ruota
  push();
  translate(width/2, height/2);
  rotate(targetAngle + 90);
  image(arrow, 0, 0, 400, 400);
  pop();


  img2 = get(); //get del canvas, per ottenere un'img (solo in memoria, non mostrata) modificata dalla rotazione su cui fare un get dei pixel


  //aggiorna quando il counter (refreshMosaic)
  if (fpsArrow / refreshMosaic == fpsMosaic){

    //mosaico di lettere
    for (let i = 0; i < numTilesW; i++){
      for (let j = 0; j < numTilesH; j++) {
        tiles[i][j].changeLetter();
        tiles[i][j].display();
      }
    }
    refreshMosaic = 0;
  }
  else {
    //mosaico di lettere
    for (let i = 0; i < numTilesW; i++){
      for (let j = 0; j < numTilesH; j++) {
        //tiles[i][j].changeLetter();
        tiles[i][j].display();
      }
    }
  }


  //maschera freccia
  for (let i = 0; i < numTilesW; i++){
    for (let j = 0; j < numTilesH; j++) {
      let col = img2.get(i*tileW+5, j*tileH+5);
              //console.log(col[1]);
      if (col[1] != 0) {
        fill(255,255,255);
      } else {
        fill(255,255,255,0);
      }
      push();
      //fill(col);
      //noStroke();
      rect(i * tileW, j * tileH, tileW, tileH);
      pop();
    }
  }

  //console.log(refreshMosaic);
  refreshMosaic++;

}

// Linear interpolation of an angle.
function lerpAngle(a, b, step) {
	// Prefer shortest distance,
	const delta = b - a;
	if (delta == 0.0) {
		return a;
	} else if (delta < -PI) {
		b += TWO_PI;
	} else if (delta > PI) {
		a += TWO_PI;
	}
	return (1.0 - step) * a + step * b;
}

class Tile {

  constructor(numX, numY) {
    //posizione
    this.cycleX = numX;
    this.cycleY = numY;

    this.x = numX * tileW;
    this.y = numY * tileH;

        //incremento in base al valore conetnuto nell'array rndIncrem (generato random)
    this.lineIncrement = rndIncrem[numY];

    this.iter = 0;
    this.iterTot = iterNum[0];
    iterNum.shift();

    //se la casella contiene una lettera d'inizio della parola deve avere un pallino nella cella
    this.pallino = false;
    //numero che deve essere mostrato come pallino
    this.pallinoNum = 0;
    //srcStartNum contiene le posizioni nell'array della frase da scrivere delle lettere di inizio delle singole parole
    if (srcStartNum.includes((this.lineIncrement + numX)%srcText.length)) {
      this.pallino = true;
      this.pallinoNum = cellNumber[0];
      cellNumber.shift(); //item 0 viene rimosso dall'array
    }


    //lettera che dovrà raggiungere la tile
    //[ resto della divisione tra: (incremento random + posizione nell'array di lettere) / lunghezza dell'array di lettere  ]
    this.finLet = srcText[(this.lineIncrement + numX)%srcText.length];
    //estrai un numero per trovare una lettera a caso tra le possibili
    this.rndStartNum = floor(random(0, rndText.length -1));
    //lettera random
    this.rndLet = rndText[this.rndStartNum];
    this.currLet = this.rndLet;

    //console.log(this.finLet, this.rndLet);

    //let c = color(255, 204, 0);
    //this.fill = (c);
    //noStroke();
  }

  changeLetter() {
    //this.fill = (random(0,255));
    if (this.finLet !== " ") {
      if (this.rndLet == this.finLet) {
        this.currLet = this.finLet;
      }
      else {
        if (this.iter < this.iterTot) {
          this.rndStartNum = floor(random(0, rndText.length -1));
          //lettera random
          this.rndLet = rndText[this.rndStartNum];
          this.currLet = this.rndLet;

          this.iter +=1;
        }
        else {
          this.currLet = this.finLet;
        }
      }
    }
  }

  display() {

    if (this.finLet !== " ") {
      push();
      fill(255);
      //noStroke();
      rect(this.x, this.y, tileW, tileH);
      pop();

      if (this.pallino === true) {
        push();
        fill(0);
        //circle(this.x, this.y, 5);
        textSize(5);
        text(this.pallinoNum, this.x + 2, this.y+5)
        pop();
      }
      fill(0);
      text(this.currLet,this.x + tileW/4, this.y + tileH/1.25);

    }
    else {
      push();
      fill(255);
      //noStroke();
      rect(this.x, this.y, tileW, tileH);
      fill(30);
      rect(this.x+tileW/10, this.y+tileH/10, tileW-tileW/5, tileH-tileH/5);

      pop();
    }

  }
}

function windowResized() {
  myWidth = canvasDiv.offsetWidth;
  myHeight = canvasDiv.offsetHeight;
  resizeCanvas(myWidth, myHeight);
  resetSketch();
}
