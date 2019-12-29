'use strict';

var params = {
  frameRate : 10,
  color: '#201952',
  distance: 10,
  size: 5,
  shape: 1,
  random: 0
}

var canv = null;
var code = null;
var editor_div = null;
var editor = null;

function setup() {

  // canvas
  canv = createCanvas(windowWidth, windowHeight - 56);
  canv.style('position', 'absolute');
  canv.style('top', '56px');
  canv.style('left', '0px');

  // pane
  const pane = new Tweakpane({
    title: 'parameter',
  });

  pane.addInput(params, 'shape', {
    options: {
      ellipse : 1,
      square : 2,
      triangle :3
    }
  });

  pane.addInput(params, 'color');

  pane.addInput(params, 'size', {
    min : 1,
    max : 255
  });

  pane.addInput(params, 'distance', {
    min : 10,
    max : 255
  });

  const f1 = pane.addFolder({
    title: 'animation',
  });

  f1.addInput(params, 'random', {
    min : 0,
    max : 255
  });

  f1.addInput(params, 'frameRate', {
    step: 10,
    min : 10,
    max : 255
  });

  // Editor
  editor_div = createElement('div');
  editor_div.id('editor');
  editor_div.style('position', 'absolute');
  editor_div.style('left', '0px');
  editor_div.style('top', windowHeight / 2 + 56 + 'px');
  editor_div.style('width', windowWidth + 'px');
  editor_div.style('height', windowHeight / 2 - 56 + 'px');

  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.session.setMode("ace/mode/html");
  editor.setReadOnly(true);
  editor.renderer.$cursorLayer.element.style.display = "none"

  editor_div.style('display', 'none');

  // Initial Canvas Setting
  noStroke();
  fill(255);
  colorMode(RGB);
}

function draw() {
  background(255);

  var distance = params.distance;
  var size = params.size;
  colorChange(params.color);

  for (let x = 0; x <= windowWidth; x += distance) {
    for (let y = 0; y <= windowHeight; y += distance) {
      const r = random(params.random);
      switch(params.shape) {
        case 1:
          ellipse(x + r, y + r, size, size);
          break;
        case 2:
          square(x + r, y + r, size);
          break;
        case 3:
          triangle(x + r, y + r + size / 2, x + r + size / 2, y + r, x + size, y + r + size / 2);
          break;
        default:
          ellipse(x + r, y + r, size, size);
      }
    }
  }

  setCode();

  frameRate(params.frameRate);
}

function colorChange(color) {
  var red = parseInt(color.substring(1,3), 16);
  var green = parseInt(color.substring(3,5), 16);
  var blue = parseInt(color.substring(5,7), 16);
  fill(red, green, blue);
}

function setCode(){
  code = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Genarate Web Animation</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
  </head>
  <body>
    <!-- main -->
    <script>
    function setup() {
      canv = createCanvas(windowWidth, windowHeight);
      canv.style('position', 'absolute');
      canv.style('top', '0px');
      canv.style('left', '0px');

      noStroke();
      fill(255);
      colorMode(RGB);
    }

    function draw() {
      background(255);

      var distance = ${params.distance};
      var size = ${params.size};
      colorChange('${params.color}');

      for (let x = 0; x <= windowWidth; x += distance) {
        for (let y = 0; y <= windowHeight; y += distance) {
          const r = random(${params.random});
          switch(${params.shape}) {
            case 1:
              ellipse(x + r, y + r, size, size);
              break;
            case 2:
              square(x + r, y + r, size);
              break;
            case 3:
              triangle(x + r, y + r + size / 2, x + r + size / 2, y + r, x + size, y + r + size / 2);
              break;
            default:
              ellipse(x + r, y + r, size, size);
          }
        }
      }
      frameRate(${params.frameRate});
    }

    function colorChange(color) {
      var red = parseInt(color.substring(1,3), 16);
      var green = parseInt(color.substring(3,5), 16);
      var blue = parseInt(color.substring(5,7), 16);
      fill(red, green, blue);
    }
    </script>
  </body>
</html>`;
  editor.setValue(code);
  editor.selection.clearSelection();
}

function toggleSource(){
  if (editor_div.style('display') == 'block') {
    editor_div.style('display', 'none');
  } else {
    editor_div.style('display', 'block');
  }
}

function downloadHtml() {
    var downLoadLink = document.createElement("a");
    downLoadLink.download = "web_animation.html";

    var blob = new Blob([ code ], { "type" : "text/plain" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, "web_animation.html");
        window.navigator.msSaveOrOpenBlob(blob, "web_animation.html");
    } else {
        downLoadLink.href = window.URL.createObjectURL(blob);
    }
    downLoadLink.click();
}
