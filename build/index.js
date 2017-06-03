"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function initialize(){for(var e=0;e<3;e++)for(var t=0;t<3;t++){var n=new fabric.Rect({top:e*oneThirdHeight,left:t*oneThirdWidth,height:oneThirdHeight-2,width:oneThirdWidth-2,fill:"",stroke:"white",selectable:!1,id:(count++).toString(),occupied:!1});rectangles.push(n)}rectangles.forEach(function(e){c.add(e)});var o=new fabric.Line([oneThirdWidth-2,0,oneThirdWidth-2,height],boardProps),i=new fabric.Line([2*oneThirdWidth-2,0,2*oneThirdWidth-2,height],boardProps),r=new fabric.Line([0,oneThirdHeight-2,width,oneThirdHeight-2],boardProps),a=new fabric.Line([0,2*oneThirdHeight-2,width,2*oneThirdHeight-2],boardProps);c.add(o,i,r,a)}function startGame(){progress.style.animation="reduced "+playerTime+"s ease-in",progress.addEventListener("animationend",function(e){switchTurn(),cloneProgress(),repaint()}),c.on("mouse:down",function(e){var t=rectangles.filter(function(t){if(t.id===e.target.id&&!e.target.occupied)return!0});t=t[0];var n="X"===TURN?xPosition:oPosition;n.push(parseInt(t.id));var o=new fabric.Text(TURN,{left:t.left+t.width/2,top:t.top+t.height/2,fill:xAndOColor,fontSize:t.width/2,fontFamily:"Raleway",fontWeight:100,selectable:!1,originX:"center",originY:"center"});return labels.push(o),rectangles.map(function(e){return e.id===t.id&&(e.occupied=!e.occupied),e}),cloneProgress(),o.animate("fontSize",t.width/1.87,{onChange:c.renderAll.bind(c),duration:100,oncomplete:c.renderAll()}),c.add(o),switchTurn(),9===labels.length?(boardFull=!0,void repaint()):areWeDoneHere(n,t)?(switchTurn(),void repaint()):void(computer&&playComputer())})}function getHypothesis(e,t,n){var o=invertMoves(t),i=(WIN.slice(),void 0);switch(n){case 2:case 3:case 4:i=divideThemInChunks(e)}var r=[],a=[],c=[];WIN.map(function(e){var t=e.slice();return _.pullAll([].concat(_toConsumableArray(t)),o)}).forEach(function(e){var t=e.slice();i.forEach(function(e){console.log("Difference between",t," and ",e,"is = ",_.difference(t,e)),_.difference(t,e).length<=2&&c.push(_.pullAll([].concat(_toConsumableArray(t)),e))})}),a=_.flatten(_.uniq(c));var l=(r=_.uniq(a)).filter(function(t){return gameStatus=!1,areWeDoneHere(e,t)});return gameStatus=!1,0===l.length?_.sample(r):_.sample(l)}function randomRectangle(){var e=[].concat(_toConsumableArray(xPosition),_toConsumableArray(oPosition)).sort(),t=totalMoves.filter(function(t){return!_.includes(e,t)}),n="X"===TURN?oPosition.length:xPosition.length,o="X"===TURN?oPosition:xPosition,i="X"!==TURN?oPosition:xPosition;switch(n){case 1:return console.log(t),_.includes(t,4)?4:_.sample(t);case 2:return getHypothesis(o,t,2);case 3:var r=getHypothesis(i,t,3);return r||getHypothesis(o,t,3);case 4:var a=getHypothesis(i,t,3);return a||getHypothesis(o,t,4)}}function playComputer(){var e=randomRectangle(xPosition,oPosition);e=Array.isArray(e)?e[0]:e;var t=rectangles.filter(function(t){if(parseInt(t.id)===e)return!0});t=t[0];var n="X"===TURN?xPosition:oPosition;n.push(parseInt(t.id));var o=new fabric.Text(TURN,{left:t.left+t.width/2,top:t.top+t.height/2,fill:xAndOColor,fontSize:t.width/2,fontFamily:"Raleway",fontWeight:100,selectable:!1,originX:"center",originY:"center"});if(labels.push(o),o.animate("fontSize",t.width/1.87,{onChange:c.renderAll.bind(c),duration:100,oncomplete:c.renderAll()}),c.add(o),9===labels.length)return boardFull=!0,void repaint();areWeDoneHere(n,t)?repaint():switchTurn()}function repaint(){if(boardFull){labels.forEach(function(e){setTimeout(function(){c.remove(e)},100)}),rectangles.forEach(function(e){e.occupied=!1});var e=new fabric.Text("DRAW",{left:c.getCenter().left,top:c.getCenter().top,fill:xAndOColor,fontSize:gameOverTextSize,fontFamily:"Raleway",fontWeight:100,selectable:!1,originX:"center",originY:"center"});return c.add(e),setTimeout(function(){c.remove(e)},500),xPosition=[],oPosition=[],gameStatus=!1,labels=[],boardFull=!1,TURN="X",void cloneProgress()}if(labels.forEach(function(e){setTimeout(function(){c.remove(e)},100)}),rectangles.forEach(function(e){e.occupied=!1}),"X"===TURN){xScore++,xScorePlaceholder.innerText=xScore,xScoreContainer.classList.add("animated"),xScoreContainer.classList.add("shake");var t=new fabric.Text("X WON!",{left:c.getCenter().left,top:c.getCenter().top,fill:xAndOColor,fontSize:gameOverTextSize,fontFamily:"Raleway",fontWeight:100,selectable:!1,originX:"center",originY:"center"});c.add(t),setTimeout(function(){xScoreContainer.className="",c.remove(t)},500)}else{oScore++,oScorePlaceholder.innerText=oScore,oScoreContainer.classList.add("animated"),oScoreContainer.classList.add("shake");var n=new fabric.Text("O WON!",{left:c.getCenter().left,top:c.getCenter().top,fill:xAndOColor,fontSize:gameOverTextSize,fontFamily:"Raleway",fontWeight:100,selectable:!1,originX:"center",originY:"center"});c.add(n),setTimeout(function(){oScoreContainer.className="",c.remove(n)},500)}return xPosition=[],oPosition=[],gameStatus=!1,labels=[],TURN="X",void cloneProgress()}function areWeDoneHere(e,t){var n=e.slice();return Number.isInteger(t)&&n.push(t),n=n.sort(),WIN.slice().some(function(e){var t=e.slice(),o=void 0;if(n.length>3)o=divideThemInChunks(n);else{if(3!==n.length)return!1;o=_.chunk(n,3)}return o.map(function(e){return e.sort()}),o.some(function(e){return gameStatus=0==_.difference(e,t).length}),gameStatus}),gameStatus}function divideThemInChunks(e){var t=[];return[].concat(_toConsumableArray(Array(e.length).keys())).forEach(function(n){var o=[].concat(_toConsumableArray(e)),i=_.pull(o,o[n]);t.push(i)}),_.uniq(t)}function invertMoves(e){return _.difference(totalMoves,e)}function switchTurn(){TURN="X"===TURN?"O":"X"}function cloneProgress(){var e=progress,t=e.cloneNode(!0);e.parentNode.replaceChild(t,e),t.addEventListener("animationend",function(e){e.preventDefault(),switchTurn(),cloneProgress(),repaint()})}var computer=!1,onePlayer=document.querySelector(".onePlayer"),twoPlayer=document.querySelector(".twoPlayer"),fragment=document.querySelector(".fragment"),ismobile=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i),PADDING=ismobile?5*window.outerWidth/100:window.outerWidth/100;canvas.style.padding=ismobile?"5%":"1%";var playerTime=7e10,gameStatus=!1,gameOverTextSize=8*window.document.fonts.size,xScorePlaceholder=document.querySelector(".xScore"),oScorePlaceholder=document.querySelector(".oScore"),boardFull=!1,xScore=0,oScore=0,labels=[],xAndOColor="#FFC107",totalMoves=[].concat(_toConsumableArray(Array(9).keys())),WIN=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],xPosition=[],oPosition=[],TURN="X",c=new fabric.Canvas("canvas",{width:window.innerWidth-2*PADDING,height:window.innerHeight-scorecard.offsetHeight-2.5*PADDING,selectable:!1}),boardProps={stroke:"#00bcd4",fill:"",strokeWidth:1,selectable:!1};onePlayer.onclick=function(e){e.preventDefault(),computer=!0;var t=new fabric.Text("It's your turn!",{left:c.getWidth()/2,top:c.getHeight()/2,fill:xAndOColor,fontSize:5*window.document.fonts.size,fontFamily:"Raleway",fontWeight:400,selectable:!1,originX:"center",originY:"center"});fragment.style.visibility="hidden",c.add(t),setTimeout(function(){c.remove(t)},400),startGame()},twoPlayer.onclick=function(){computer=!1;var e=new fabric.Text("Two Players",{left:c.getWidth()/2,top:c.getHeight()/2,fill:xAndOColor,fontSize:5*window.document.fonts.size,fontFamily:"Raleway",fontWeight:400,selectable:!1,originX:"center",originY:"center"});fragment.style.visibility="hidden",c.add(e),setTimeout(function(){c.remove(e)},400),startGame()};var height=canvas.clientHeight-PADDING,width=canvas.clientWidth-PADDING,oneThirdWidth=Math.floor(width/3),oneThirdHeight=Math.floor(height/3),rectangles=[],count=0;initialize();