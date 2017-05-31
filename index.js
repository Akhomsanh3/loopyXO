const PADDING = (window.outerWidth / 100);
const WIN = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var xPosition = [];
var oPosition = [];

var TURN = 'X';
var c = new fabric.Canvas('canvas', {
  width: window.innerWidth - 2 * PADDING,
  height: window.innerHeight - 2 * PADDING,
  selectable: false
});

let boardProps = {
  stroke: 'white',
  fill: '',
  strokeWidth: 5,
  selectable: false
};

let progress = new fabric.Line([
  0, 0, canvas.width, 0
], Object.assign({}, boardProps, {
  stroke: 'pink'
}));

// c.add(progress);

const height = canvas.clientHeight - PADDING;
const width = canvas.clientWidth - PADDING;
const oneThirdWidth = Math.floor(width / 3);
const oneThirdHeight = Math.floor(height / 3);

var rectangles = [];

var count = 0;

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    let temp = new fabric.Rect({
      top: i * oneThirdHeight,
      left: j * oneThirdWidth,
      height: oneThirdHeight - 2,
      width: oneThirdWidth - 2,
      fill: '',
      stroke: 'black',
      selectable: false,
      id: "rect" + (count++).toString(),
      occupied:false
    });
    rectangles.push(temp);
  }
}

rectangles.forEach((rectangle) => {
  c.add(rectangle);
});

let lineV1 = new fabric.Line([
  oneThirdWidth - 2,
  0,
  oneThirdWidth - 2,
  height
], boardProps);

let lineV2 = new fabric.Line([
  2 * oneThirdWidth - 2,
  0,
  2 * oneThirdWidth - 2,
  height
], boardProps);

let lineH1 = new fabric.Line([
  0, oneThirdHeight - 2,
  width,
  oneThirdHeight - 2
], boardProps);

let lineH2 = new fabric.Line([
  0, 2 * oneThirdHeight - 2,
  width,
  2 * oneThirdHeight - 2
], boardProps);

c.add(lineV1, lineV2, lineH1, lineH2);

c.on('mouse:down', (evt) => {

  let clickedRect = rectangles.filter((rectangle) => {
    if (rectangle.id === evt.target.id && !evt.target.occupied) {
      return true
    }
  });

  clickedRect = clickedRect[0];

  let turnText = TURN;

  var text = new fabric.Text(turnText, {
    left: clickedRect.left + clickedRect.width / 2,
    top: clickedRect.top + clickedRect.height / 2,
    fill: 'pink',
    fontSize: clickedRect.width / 2,
    fontFamily: 'Raleway',
    fontWeight: 100,
    selectable: false,
    originX: 'center',
    originY: 'center'
  });

  TURN = TURN === 'X'
    ? 'O'
    : 'X';

  rectangles.map((rectangle) => {
    if (rectangle.id === clickedRect.id) {
      rectangle.occupied = !rectangle.occupied;
    }
    return rectangle;
  })

  text.animate('fontSize', clickedRect.width / 1.87, {
    onChange: c
      .renderAll
      .bind(c),
    duration: 400,
    oncomplete:c.renderAll()
  });

  c.add(text);
})


// fabric.Rect.prototype.animateLine = animateLine; boardV.animateLine('width');
// boardH.animateLine('height'); function animateLine(prop) {
// this.animate(prop, 0, {     onChange: c       .renderAll       .bind(c),
// duration: 1000, onComplete: () => {       if (prop === 'height') {
// this.setHeight(height);  } else {         this.setWidth(width);       }
// c.renderAll()     }  }); }