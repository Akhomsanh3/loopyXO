const ismobile = navigator
  .userAgent
  .match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
const PADDING = ismobile
  ? (window.outerWidth * 5 / 100)
  : (window.outerWidth / 100);
canvas.style.padding = ismobile
  ? '5%'
  : '1%';
const playerTime = 7;
let gameStatus = false;
const gameOverTextSize = window.document.fonts.size * 8;
const xScorePlaceholder = document.querySelector('.xScore');
const oScorePlaceholder = document.querySelector('.oScore');
let boardFull = false;
let xScore = 0;
let oScore = 0;
let labels = [];
const xAndOColor = '#FFC107';

const WIN = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5,
8], [0, 4, 8], [2, 4, 6] ];

let xPosition = [];
let oPosition = [];

let TURN = 'X';

const c = new fabric.Canvas('canvas', {
  width: window.innerWidth - 2 * PADDING,
  height: window.innerHeight - scorecard.offsetHeight - 2.5 * PADDING,
  selectable: false
});

const boardProps = {
  stroke: '#00bcd4',
  fill: '',
  strokeWidth: 1,
  selectable: false
};

const height = canvas.clientHeight - PADDING;
const width = canvas.clientWidth - PADDING;
const oneThirdWidth = Math.floor(width / 3);
const oneThirdHeight = Math.floor(height / 3);

let rectangles = [];
let count = 0;

function initialize() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let temp = new fabric.Rect({
        top: i * oneThirdHeight,
        left: j * oneThirdWidth,
        height: oneThirdHeight - 2,
        width: oneThirdWidth - 2,
        fill: '',
        stroke: 'white',
        selectable: false,
        id: (count++).toString(),
        occupied: false
      });
      rectangles.push(temp);
    }
  }

  rectangles.forEach((rectangle) => {
    c.add(rectangle);
  });

  const lineV1 = new fabric.Line([
    oneThirdWidth - 2,
    0,
    oneThirdWidth - 2,
    height
  ], boardProps);

  const lineV2 = new fabric.Line([
    2 * oneThirdWidth - 2,
    0,
    2 * oneThirdWidth - 2,
    height
  ], boardProps);

  const lineH1 = new fabric.Line([
    0, oneThirdHeight - 2,
    width,
    oneThirdHeight - 2
  ], boardProps);

  const lineH2 = new fabric.Line([
    0, 2 * oneThirdHeight - 2,
    width,
    2 * oneThirdHeight - 2
  ], boardProps);

  c.add(lineV1, lineV2, lineH1, lineH2);

  progress.style.animation = `reduced ${playerTime}s ease-in`;

  progress.addEventListener('animationend', (evt) => {
    switchTurn();
    cloneProgress();
    repaint();
  });

  startGame();
}

function startGame() {

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
      fill: xAndOColor,
      fontSize: clickedRect.width / 2,
      fontFamily: 'Raleway',
      fontWeight: 100,
      selectable: false,
      originX: 'center',
      originY: 'center'
    });

    labels.push(text);

    rectangles.map((rectangle) => {
      if (rectangle.id === clickedRect.id) {
        rectangle.occupied = !rectangle.occupied;
      }
      return rectangle;
    });

    cloneProgress();

    text.animate('fontSize', clickedRect.width / 1.87, {
      onChange: c
        .renderAll
        .bind(c),
      duration: 100,
      oncomplete: c.renderAll()
    });

    c.add(text);

    if (labels.length === 9) {
      boardFull = true;
      repaint();
      return;
    }
    // Check if the game is over
    let position = TURN === 'X'
      ? xPosition
      : oPosition;

    if (areWeDoneHere(position, clickedRect)) {
      repaint();
      return;
    }

    switchTurn();

  });

}

function repaint() {

  if (boardFull) {
    labels.forEach((label) => {
      setTimeout(() => {
        c.remove(label);
      }, 100);
    });

    rectangles.forEach(rectangle => {
      rectangle.occupied = false;
    });

    let tempDraw = new fabric.Text('DRAW', {
      left: c
        .getCenter()
        .left,
      top: c
        .getCenter()
        .top,
      fill: xAndOColor,
      fontSize:gameOverTextSize,
      fontFamily: 'Raleway',
      fontWeight: 100,
      selectable: false,
      originX: 'center',
      originY: 'center'
    });

    c.add(tempDraw);

    setTimeout(() => {
      c.remove(tempDraw);
    }, 500)

    xPosition = [];
    oPosition = [];
    gameStatus = false;
    labels = [];
    boardFull = false;
    TURN = 'X';
    cloneProgress();

    return;
  } else {
    // Repaint
    labels.forEach((label) => {
      setTimeout(() => {
        c.remove(label);
      }, 100);
    });

    rectangles.forEach(rectangle => {
      rectangle.occupied = false;
    });

    if (TURN === 'X') {
      xScore++;
      xScorePlaceholder.innerText = xScore;
      xScoreContainer
        .classList
        .add('animated');

      xScoreContainer
        .classList
        .add('shake');

      const tempX = new fabric.Text('X WON!', {
        left: c
          .getCenter()
          .left,
        top: c
          .getCenter()
          .top,
        fill: xAndOColor,
        fontSize: gameOverTextSize,
        fontFamily: 'Raleway',
        fontWeight: 100,
        selectable: false,
        originX: 'center',
        originY: 'center'
      });

      c.add(tempX);

      setTimeout(() => {
        xScoreContainer.className = "";
        c.remove(tempX);
      }, 500)

    } else {
      oScore++;
      oScorePlaceholder.innerText = oScore;
      oScoreContainer
        .classList
        .add('animated');

      oScoreContainer
        .classList
        .add('shake');
      const tempO = new fabric.Text('O WON!', {
        left: c
          .getCenter()
          .left,
        top: c
          .getCenter()
          .top,
        fill: xAndOColor,
        fontSize: gameOverTextSize,
        fontFamily: 'Raleway',
        fontWeight: 100,
        selectable: false,
        originX: 'center',
        originY: 'center'
      });
      c.add(tempO)
      setTimeout(() => {
        oScoreContainer.className = "";
        c.remove(tempO);
      }, 500)

    }

    xPosition = [];
    oPosition = [];
    gameStatus = false;
    labels = [];
    TURN = 'X';
    cloneProgress();
    return; // So that X plays first every time
  }

}

function areWeDoneHere(position, clickedRect) {
  position.push(parseInt(clickedRect.id));
  WIN.some((winH) => {
    let hypothesis;
    if (position.length > 3) {
      hypothesis = divideThemInChunks(position);
    } else if (position.length === 3) {
      hypothesis = _.chunk(position, 3);
    } else {
      return false;
    }

    hypothesis.map((hy) => {
      return hy.sort();
    });

    hypothesis.some((hy) => {
      gameStatus = _
        .difference(winH, hy)
        .length == 0
        ? true
        : false;
      return gameStatus;
    });

    return gameStatus;
  });

  return gameStatus;
}

function divideThemInChunks(collection) {
  let chunks = [];

  const keys = [...Array(collection.length).keys()];

  keys.forEach((key) => {
    let copy = [...collection];

    let temp = _.pull(copy, copy[key]);

    chunks.push(temp);
  });
  return _.uniq(chunks);
}

function switchTurn() {
  TURN = TURN === 'X'
    ? 'O'
    : 'X';
}

function cloneProgress() {

  let progressElement = progress;
  let newProgressElement = progressElement.cloneNode(true);
  progressElement
    .parentNode
    .replaceChild(newProgressElement, progressElement);
  newProgressElement.addEventListener('animationend', (evt) => {
    evt.preventDefault();
    switchTurn();
    cloneProgress();
    repaint();
  });
}

initialize();