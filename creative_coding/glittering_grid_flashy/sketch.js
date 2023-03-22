let photo1;
let photo2;
let photo3;
let sq_size;
let initr;
let initg;
let initb;
let d;
let tiles = [];
let rows;
let cols;
let numtiles;
let flashing_speed;
let speed_slider;

function setup() {
  createCanvas(1500,900);
  photo1 = loadImage("../data/PXL_20211020_150643595.MP_small.jpg");
  photo2 = loadImage("../data/IMG_20201129_131202_small.jpg");
  photo3 = loadImage("../data/PXL_20220419_150449064.MP_small.jpg");
  
  sq_size = 40;
  tile1 = new Tile(200,200, sq_size, sq_size);

  initr = random(0,255);
  initg = random(0,255);
  initb = random(0,255);

  rows = int(height/sq_size) - 2;
  cols = int(width/sq_size) - 2;
  numtiles = rows*cols;
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
        tiles.push(new Tile(j*sq_size, i*sq_size, sq_size, sq_size));
    }
  }
  speed_slider = createSlider(1,10,1);
}

function draw() {

  background(102,0,102);

  for (let i = 0; i < numtiles; i++){
    tiles[i].display();
    tiles[i].update();
  }
  photo1.resize(800,0);
  image(photo1, (width/2 - 2*sq_size)-photo1.width/2, (height/2- 2*sq_size)-photo1.height/2);

  speed_slider.position(width - 180, height - 40);
  flashing_speed = speed_slider.value();
}

class Tile{
  constructor(tx, ty, tw, th){
    this.x = tx;
    this.y = ty;
    this.w = sq_size;
    this.h = sq_size;
    this.r = initr + random(-d,d);
    this.g = initg + random(-d,d);
    this.b = initb + random(-d,d);
  }
  
  update(){
    let threshold = (10000 + (10-flashing_speed) * 105);
    let dummy = int(random(0,11000));
    if(dummy > threshold){
        this.r = int(random(0,255));
        this.g = int(random(0,255));
        this.b = int(random(0,255));
    }  
  }
  
  display(){
    fill(this.r,this.g,this.b);
    rect(this.x,this.y,this.w,this.h);
  }
}
