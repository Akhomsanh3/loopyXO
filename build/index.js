const PADDING = (window.outerWidth / 100);
var c = new fabric.Canvas('canvas', {
  width: window.innerWidth - 2 *PADDING,
  height: window.innerHeight - 2 *PADDING,
  selectable: false
});
let boardProps = {
  stroke: 'white',
  fill: '',
  strokeWidth: 5
};

let progress = new fabric.Line([
  0, 0, canvas.width, 0
], Object.assign({}, boardProps, {stroke: 'pink'}));

c.add(progress);

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
      id: "rect" + (count++).toString()
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

// fabric.Rect.prototype.animateLine = animateLine; boardV.animateLine('width');
// boardH.animateLine('height'); function animateLine(prop) {
// this.animate(prop, 0, {     onChange: c       .renderAll       .bind(c),
// duration: 1000, onComplete: () => {       if (prop === 'height') {
// this.setHeight(height);  } else {         this.setWidth(width);       }
// c.renderAll()     }  }); }