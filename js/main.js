'use strict';

var params = {
  frameRate : 10,
  color: '#20108f',
  step: 10,
  size: 5,
  shape: 1,
  random: 0
}

var canv = null;
var code = '';
var editor = null;

function setup() {
  // canv = createCanvas(windowWidth, windowHeight / 2);
  canv = createCanvas(windowWidth, windowHeight);
  canv.style('position', 'absolute');
  // canv.style('top', '56px');
  canv.style('top', '0px');
  canv.style('left', '0px');

  const pane = new Tweakpane({
    title: 'parameter',
  });

  pane.addInput(params, 'frameRate', {
    step: 10,
    min : 10,
    max : 255
  });

  pane.addInput(params, 'color');

  pane.addInput(params, 'step', {
    min : 10,
    max : 255
  });

  pane.addInput(params, 'size', {
    min : 1,
    max : 255
  });

  pane.addInput(params, 'shape', {
    options: {
      ellipse : 1,
      square : 2,
      triangle :3
    }
  });

  pane.addInput(params, 'random', {
    min : 0,
    max : 255
  });

  // Editor
  var editor_div = createElement('div');
  editor_div.id('editor');
  editor_div.style('position', 'absolute');
  editor_div.style('left', '0px');
  editor_div.style('top', windowHeight / 2 + 'px');
  editor_div.style('width', windowWidth + 'px');
  editor_div.style('height', windowHeight / 2 + 'px');
  editor_div.style('display', 'none');

  editor = ace.edit("editor");
  // editor.setTheme("ace/theme/theme-solarized_light");
  editor.session.setMode("ace/mode/html");
  editor.setReadOnly(true);
  editor.renderer.$cursorLayer.element.style.display = "none";

  // Initial Canvas Setting
  noStroke();
  fill(255);
  colorMode(RGB);
}

function draw() {
  background(255);

  var step = params.step;
  var size = params.size;
  colorChange(params.color);

  for (let x = 0; x <= windowWidth; x += step) {
    for (let y = 0; y <= windowHeight; y += step) {
      const d = random(params.random);
      switch(params.shape) {
        case 1:
          ellipse(x + d, y + d, size, size);
          break;
        case 2:
          square(x + d, y + d, size);
          break;
        case 3:
          triangle(x + d, y + d + size / 2, x + d + size / 2, y + d, x + size, y + d + size / 2);
          break;
        default:
          ellipse(x + d, y + d, size, size);
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
  var code = `<!DOCTYPE html>
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

      var step = ${params.step};
      var size = ${params.size};
      colorChange('${params.color}');

      for (let x = 0; x <= windowWidth; x += step) {
        for (let y = 0; y <= windowHeight; y += step) {
          const d = random(${params.random});
          switch(${params.shape}) {
            case 1:
              ellipse(x + d, y + d, size, size);
              break;
            case 2:
              square(x + d, y + d, size);
              break;
            case 3:
              triangle(x + d, y + d + size / 2, x + d + size / 2, y + d, x + size, y + d + size / 2);
              break;
            default:
              ellipse(x + d, y + d, size, size);
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
