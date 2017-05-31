// Register the service worker

/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */
'use strict';

if ('serviceWorker' in navigator) {
  // Delay registration until after the page has loaded, to ensure that our
  // precaching requests don't degrade the first visit experience.
  // See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
  window.addEventListener('load', function() {
    // Your service-worker.js *must* be located at the top-level directory relative to your site.
    // It won't be able to control pages unless it's located at the same level or higher than them.
    // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
    // See https://github.com/slightlyoff/ServiceWorker/issues/468
    navigator.serviceWorker.register('service-worker.js').then(function(reg) {
      // updatefound is fired if service-worker.js changes.
      reg.onupdatefound = function() {
        // The updatefound event implies that reg.installing is set; see
        // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
        var installingWorker = reg.installing;

        installingWorker.onstatechange = function() {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and the fresh content will
                // have been added to the cache.
                // It's the perfect time to display a "New content is available; please refresh."
                // message in the page's interface.
                console.log('New or updated content is available.');
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is now available offline!');
              }
              break;

            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;
          }
        };
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  });
}

window.onresize = function(){ location.reload();}

var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
const PADDING = ismobile ? (window.outerWidth * 5 / 100) : (window.outerWidth / 100);
canvas.style.padding = ismobile ? '6%' : '1%';
var gameStatus = false;
var xScorePlaceholder = document.querySelector('.xScore');
var oScorePlaceholder = document.querySelector('.oScore');
let boardFull = false;
var xScore = 0;
var oScore = 0;
var labels = [];

const WIN = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5,
8], [0, 4, 8], [2, 4, 6] ];

var xPosition = [];
var oPosition = [];

var TURN = 'X';

var c = new fabric.Canvas('canvas', {
  width: window.innerWidth - 2 * PADDING,
  height: window.innerHeight - scorecard.offsetHeight - 2.5 * PADDING,
  selectable: false
});

let boardProps = {
  stroke: '#00bcd4',
  fill: '',
  strokeWidth: 1,
  selectable: false
};

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

progress.style.animation = 'reduced 100000000s ease-in';

progress.addEventListener('animationend', (evt) => {
  switchTurn();
  cloneProgress();
  repaint();
});

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
      fill: 'pink',
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
    let position = TURN === 'X' ?
      xPosition :
      oPosition;

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
      fill: 'hotpink',
      fontSize: 100,
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

      let tempX = new fabric.Text('X WON!', {
        left: c
          .getCenter()
          .left,
        top: c
          .getCenter()
          .top,
        fill: 'hotpink',
        fontSize: 100,
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
      let tempO = new fabric.Text('O WON!', {
        left: c
          .getCenter()
          .left,
        top: c
          .getCenter()
          .top,
        fill: 'hotpink',
        fontSize: 100,
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

  let keys = [...Array(collection.length).keys()];

  keys.forEach((key) => {
    let copy = [...collection];

    let temp = _.pull(copy, copy[key]);

    chunks.push(temp);
  });
  return _.uniq(chunks);
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

startGame();

// fabric.Rect.prototype.animateLine = animateLine; boardV.animateLine('width');
// boardH.animateLine('height'); function animateLine(prop) { this.animate(prop,
// 0, {     onChange: c       .renderAll       .bind(c), duration: 1000,
// onComplete: () => {       if (prop === 'height') { this.setHeight(height);  }
// else {         this.setWidth(width);       } c.renderAll()     }  }); }