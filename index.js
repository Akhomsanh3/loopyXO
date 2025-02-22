let computer = false;

const onePlayer = document.querySelector('.onePlayer');
const twoPlayer = document.querySelector('.twoPlayer');
const fragment = document.querySelector('.fragment');

const ismobile = navigator
  .userAgent
  .match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
const PADDING = ismobile ?
  (window.outerWidth * 5 / 100) :
  (window.outerWidth / 100);
canvas.style.padding = ismobile ?
  '5%' :
  '1%';
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

const totalMoves = [...Array(9).keys()];

const WIN = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6] ,[1, 4, 7], [2, 5,
8], [0, 4, 8], [2, 4, 6]];

let xPosition = [];
let oPosition = [];

let TURN = 'X';

const c = new fabric.Canvas('canvas', {
  width: window.innerWidth - 2 * PADDING,
  height: window.innerHeight - scorecard.offsetHeight - 2.5 * PADDING,
  selectable: false
});

const boardProps = {
  stroke: '#2F4F4F',
  fill: '',
  strokeWidth: 1,
  selectable: false
};

onePlayer.onclick = (e) => {
  e.preventDefault();
  computer = true;
  let playerText = new fabric.Text("It's your turn!", {
    left: c.getWidth() / 2,
    top: c.getHeight() / 2,
    fill: xAndOColor,
    fontSize: window.document.fonts.size * 5,
    fontFamily: 'Raleway',
    fontWeight: 400,
    selectable: false,
    originX: 'center',
    originY: 'center'
  });
  fragment.style.visibility = 'hidden';
  c.add(playerText);
  setTimeout(() => {
    c.remove(playerText);
  }, 400);
  startGame();
}

twoPlayer.onclick = () => {
  computer = false;

  let playerText = new fabric.Text('Two Players', {
    left: c.getWidth() / 2,
    top: c.getHeight() / 2,
    fill: xAndOColor,
    fontSize: window.document.fonts.size * 5,
    fontFamily: 'Raleway',
    fontWeight: 400,
    selectable: false,
    originX: 'center',
    originY: 'center'
  });
  fragment.style.visibility = 'hidden';
  c.add(playerText);
  setTimeout(() => {
    c.remove(playerText);
  }, 400);
  startGame();
}

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

}

function startGame() {

  progress.style.animation = `reduced ${playerTime}s ease-in`;

  progress.addEventListener('animationend', (evt) => {
    switchTurn();
    cloneProgress();
    repaint();
  });

  c.on('mouse:down', (evt) => {

    let clickedRect = rectangles.filter((rectangle) => {
      if (rectangle.id === evt.target.id && !evt.target.occupied) {
        return true
      }
    });

    clickedRect = clickedRect[0];
    // Check if the game is over
    let position = TURN === 'X' ?
      xPosition :
      oPosition;

    position.push(parseInt(clickedRect.id));

    var text = new fabric.Text(TURN, {
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

    switchTurn();

    if (labels.length === 9) {
      boardFull = true;
      repaint();
      return;
    }
    // // console.log(TURN);

    if (areWeDoneHere(position, clickedRect)) {
      switchTurn();
      repaint();
      return;
    }

    if (computer) {
      playComputer();
    }

  });

}

function getHypothesis(position, availableMoves, count) {

  let invertM = invertMoves(availableMoves);

  let _WIN = WIN.slice();
  let hypothesis;

  switch (count) {
    case 2:
      hypothesis = divideThemInChunks(position);
      break;

    case 3:
      hypothesis = divideThemInChunks(position);
      break;

    case 4:
      hypothesis = divideThemInChunks(position)
      break;
  }

  let move = [];
  let leastDifference = [];
  let winf = [];

  _WIN = WIN.map((winH) => {
    let _winH = winH.slice();
    return _.pullAll([..._winH], invertM);
  });


  _WIN.forEach((winH) => {
    let _winH = winH.slice();
    hypothesis.forEach((hy) => {

      if (_.difference(_winH, hy).length <= 2) {
        winf.push(_.pullAll([..._winH], hy));
      };

    });
  });

  leastDifference = _.flatten(_.uniq(winf));

  let leastLength;

  move = _.uniq(leastDifference);

  let maximizingMoves = move.filter((eachMove) => {
    gameStatus = false;
    return areWeDoneHere(position, eachMove);
  });

  gameStatus = false;

  if (maximizingMoves.length === 0) {
    return _.sample(move);
  }

  return _.sample(maximizingMoves);
}

function randomRectangle() {

  const playedMoves = [
    ...xPosition,
    ...oPosition
  ].sort();

  const availableMoves = totalMoves.filter((move) => {
    return !_.includes(playedMoves, move);
  });

  const stage = TURN === 'X' ?
    oPosition.length :
    xPosition.length;

  const position = TURN === 'X' ? oPosition : xPosition;
  const nextPosition = TURN !== 'X' ? oPosition : xPosition;

  switch (stage) {
    case 1:
      {
        console.log(availableMoves);
        if (_.includes(availableMoves, 4)) {
          return 4;
        } else {
          return _.sample(availableMoves);
        }
        break;
      }
    case 2:
      {
        return getHypothesis(position, availableMoves, 2);
        break;
      }
    case 3:
      {
        // In case the player is not at their best

        let temp = getHypothesis(nextPosition, availableMoves, 3);

        if (temp) {
          return temp;
        }

        return getHypothesis(position, availableMoves, 3);
        break;
      }
    case 4:
      {
        // In case the player is not at their best

        let temp = getHypothesis(nextPosition, availableMoves, 3);

        if (temp) {
          return temp;
        }

        return getHypothesis(position, availableMoves, 4);
        break;
      }
  }
}

function playComputer() {

  let clickedRectID = randomRectangle(xPosition, oPosition);
  clickedRectID = Array.isArray(clickedRectID) ? clickedRectID[0] : clickedRectID;

  let clickedRect = rectangles.filter((rectangle) => {
    if (parseInt(rectangle.id) === clickedRectID) {
      return true
    }
  });
  clickedRect = clickedRect[0];

  let position = TURN === 'X' ?
    xPosition :
    oPosition;

  position.push(parseInt(clickedRect.id));

  let text = new fabric.Text(TURN, {
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

  if (areWeDoneHere(position, clickedRect)) {
    repaint();
    return;
  }

  switchTurn();

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
      fontSize: gameOverTextSize,
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

  let _position = position.slice();

  if (Number.isInteger(clickedRect)) {
    _position.push(clickedRect);
  }

  _position = _position.sort();


  const _WIN = WIN.slice();

  _WIN.some((winH) => {
    let _winH = winH.slice();
    let hypothesis;

    if (_position.length > 3) {
      hypothesis = divideThemInChunks(_position);
    } else if (_position.length === 3) {
      hypothesis = _.chunk(_position, 3);
    } else {
      return false;
    }

    hypothesis.map((hy) => {
      return hy.sort();
    });

    hypothesis.some((hy) => {
      gameStatus = _
        .difference(hy, _winH)
        .length == 0 ?
        true :
        false;
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

function invertMoves(moves) {
  return _.difference(totalMoves, moves);
}

function switchTurn() {
  TURN = TURN === 'X' ?
    'O' :
    'X';
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
