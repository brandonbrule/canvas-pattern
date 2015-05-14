var config;
var sample_index=0;
var background_index = 0;
var focus_index = 1;



// Show the pattern repeating
var canvas_repeat = document.getElementById('canvas-repeat');
var ctx_repeat = canvas_repeat.getContext('2d');

// Pattern Canvas
var canvas_pattern = document.getElementById('canvas-pattern');
var ctx_pattern = canvas_pattern.getContext('2d');



// Control Inputs
var sliders = document.getElementsByTagName('input');
var width_input = document.getElementById('width');
var height_input = document.getElementById('height');
var x_len_input = document.getElementById('x-length');
var y_len_input = document.getElementById('y-length');
var random_input = document.getElementById('random');
var pattern_data = document.getElementById('pattern-data');
var svg_data = document.getElementById('svg-data-input');


var background_colours = [
    {background_colour: '#FFF056'},
    {background_colour: '#fe524c'},
    {background_colour: '#61D2D6'},
    {background_colour: '#A0FF57'},
    {background_colour: '#fff'}
  ];

var sample_examples = [
    {"w":"28","h":"45","x_len":"9","y_len":"4","points":"3","position_data":[{"w":15,"h":11},{"w":7,"h":14},{"w":27,"h":34}],"background_index":1},
    {"w":"9","h":"49","x_len":6,"y_len":48,"points":"1","position_data":[{"w":2,"h":5}],"background_index":3,"x1":4,"x2":7,"y1":49,"y2":47},
    {"w":"28","h":"45","x_len":"9","y_len":"4","points":"3","position_data":[{"w":7,"h":28},{"w":8,"h":32},{"w":24,"h":9}],"background_index":2,"x1":6,"x2":22,"y1":25,"y2":31},
    {"w":"76","h":"74","x_len":"7","y_len":"3","points":"1","background_index":4},
    {"w":"76","h":"69","x_len":"6","y_len":"48","points":"6","x1":6,"x2":29,"y1":47,"y2":56,"position_data":[{"w":5,"h":34},{"w":72,"h":6},{"w":56,"h":21},{"w":26,"h":47},{"w":48,"h":18},{"w":50,"h":20}],"background_index":0},
    {"w":"56","h":"39","x_len":"9","y_len":"0","points":"4","position_data":[{"w":12,"h":35},{"w":49,"h":36},{"w":18,"h":39},{"w":15,"h":38}],"background_index":1},
    {"w":"2","h":"33","x_len":"2","y_len":"1","points":"1","background_index":3},
    {"w":"90","h":"45","x_len":"9","y_len":"4","points":"8","x1":41,"x2":20,"y1":20,"y2":42,"position_data":[{"w":33,"h":7},{"w":6,"h":4},{"w":41,"h":32},{"w":26,"h":44},{"w":28,"h":17},{"w":50,"h":12},{"w":63,"h":23},{"w":20,"h":25}],"background_index":2},
    {"w":"54","h":"38","x_len":"12","y_len":"28","points":"4","position_data":[{"w":12,"h":8},{"w":32,"h":21},{"w":17,"h":15},{"w":44,"h":31}],"background_index":0,"x1":17,"x2":51,"y1":7,"y2":36},
    {"w":"90","h":"45","x_len":"9","y_len":"4","points":"8","x1":48,"x2":28,"y1":21,"y2":37,"position_data":[{"w":36,"h":28},{"w":11,"h":36},{"w":34,"h":14},{"w":1,"h":31},{"w":30,"h":24},{"w":65,"h":5},{"w":52,"h":17},{"w":12,"h":31}],"background_index":2},
    {"w":"90","h":"45","x_len":"9","y_len":"4","points":"8","x1":15,"x2":62,"y1":44,"y2":5,"position_data":[{"w":51,"h":25},{"w":86,"h":34},{"w":73,"h":27},{"w":66,"h":25},{"w":73,"h":42},{"w":62,"h":44},{"w":43,"h":21},{"w":57,"h":1}],"background_index":3},
  ];




// Helper Functions
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// General Debounce
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}








function configFromControlValues(){
  var config = {
    w: width_input.value,
    h: height_input.value,
    x_len: x_len_input.value,
    y_len: y_len_input.value,
    points: random_input.value
  };

  return config;
}


// Set Range Slider Values from Data
function controlValuesFromData(data){
  width_input.value = data.w;
  height_input.value = data.h;
  x_len_input.value = data.x_len;
  y_len_input.value = data.y_len;
  random_input.value = data.points;
}

function patternData(config){
  pattern_data.value = JSON.stringify(config);
  window.location.hash = encodeURIComponent(JSON.stringify(config));

  if ( background_colours[config.background_index] ){
    document.getElementsByTagName('body')[0].style.background = background_colours[config.background_index].background_colour;
  }
}

// Background Colour
function setBackgroundColour(){
  // Interate Index for background colours by 1
  (function(){
    background_index = (background_index + 1) % background_colours.length;
    config.background_index = background_index;
    patternData(config);
  })();
}


function drawSVG(){
  var svg_ctx = new SVGCanvas( "canvas-pattern" );
  var svg_container = document.getElementById('svg');
  var svg_element = svg_container.getElementsByTagName('svg')[0];

  config = JSON.parse(pattern_data.value);

  svg_ctx.beginPath();
  svg_ctx.moveTo(config.x1,config.y1);
  svg_ctx.lineTo(config.x2, config.y1);
  for (var i = 0, len = config.points; i < len; i++){
    svg_ctx.lineTo(config.position_data[i].w, config.position_data[i].h);
  }

  svg_ctx.fill();

  svg_container.innerHTML = svg_ctx.toDataURL("image/svg+xml");


  if (svg_element){
    document.getElementById('svg').getElementsByTagName('svg')[0].setAttribute('height', config.h);
    document.getElementById('svg').getElementsByTagName('svg')[0].setAttribute('width', config.w);
    svg_container.parentNode.setAttribute('style', 'background: ' + background_colours[config.background_index].background_colour);
    document.getElementById('svg').getElementsByTagName('svg')[0].setAttribute('style', 'background: ' + background_colours[config.background_index].background_colour);
    svg_data.innerHTML = svg_container.innerHTML;
  }
  
};



// Refill Canvas with repeating Pattern
function repeatPattern(config){
   // Now we draw that pattern to a custom shape:
  var pattern = ctx_repeat.createPattern(canvas_pattern, "repeat");

  // Clear everytime before redrawing.
  ctx_repeat.clearRect(0, 0, canvas_repeat.width, canvas_repeat.height);

  // Fill the Repeat Canvas with the Pattern Canvas
  ctx_repeat.beginPath();
  ctx_repeat.fillStyle = pattern;
  ctx_repeat.fillRect(0,0,canvas_repeat.width,canvas_repeat.height);

  canvas_pattern.parentNode.setAttribute('style', 'background: ' + background_colours[config.background_index].background_colour);


  patternData(config);
}





// Initial Canvas Pattern.
// Makes interesting starting point for random.
function drawPattern(config){

  x_len_input.value = config.x_len;
  y_len_input.value = config.y_len;

  var w = config.w;
  var h = config.h;
  var x_len = config.x_len;
  var y_len = config.y_len;

  // Increase range of x-lengh, y-length
  // according to height and width sizes
  x_len_input.setAttribute('max', w);
  x_len = x_len_input.value;

  y_len_input.setAttribute('max', h);  
  y_len = y_len_input.value;

  // Update Pattern Preview Window Size
  canvas_pattern.width = w;
  canvas_pattern.height = h;


  // The Pattern that's repeated.
  ctx_pattern.fillRect(0, 0, x_len, y_len);
  ctx_pattern.clearRect(0, 0, x_len - (x_len / 2), y_len - (y_len / 2));

  ctx_pattern.beginPath();
  ctx_pattern.moveTo(x_len,y_len);
  ctx_pattern.lineTo(y_len + 1,x_len + 1);
  ctx_pattern.lineTo(x_len - 1,y_len - 1);
  ctx_pattern.fill();

  ctx_pattern.beginPath();
  ctx_pattern.moveTo(y_len,x_len);
  ctx_pattern.lineTo(y_len + 1,x_len + 1);
  ctx_pattern.lineTo(x_len - 1,y_len - 1);
  ctx_pattern.fill();

  repeatPattern(config);

}




// Run Button, Draw Pattern From Data Input
function drawFromData(config){

  var w = config.w;
  var h = config.h;
  var x_len = config.x_len;
  var y_len = config.y_len;
  var points = config.points;

  x_len_input.value = config.x_len;
  y_len_input.value = config.y_len;

  width_input.value = w;
  height_input.value = h;


  // Increase range of x-lengh, y-length
  // according to height and width sizes
  x_len_input.setAttribute('max', w);
  x_len = x_len_input.value;

  y_len_input.setAttribute('max', h);  
  y_len = y_len_input.value;

  // Update Pattern Preview Window Size
  canvas_pattern.width = w;
  canvas_pattern.height = h;

  // The Pattern that's repeated.
  ctx_pattern.beginPath();
  ctx_pattern.moveTo(config.x1,config.y1);
  ctx_pattern.lineTo(config.x2, config.y1);
  for (var i = 0, len = points; i < len; i++){
    ctx_pattern.lineTo(config.position_data[i].w, config.position_data[i].h);
  }
  ctx_pattern.fill();

  // Repeat the Pattern.
  repeatPattern(config);
 
}



// Randomize the Pattern
function randomizePattern(config){

  x_len_input.value = config.x_len;
  y_len_input.value = config.y_len;

  var w = config.w;
  var h = config.h;
  var x_len = config.x_len;
  var y_len = config.y_len;
  var points = config.points;
  var position_data = [];

  // Increase range of x-lengh, y-length
  // according to height and width sizes
  x_len_input.setAttribute('max', w);
  x_len = x_len_input.value;

  y_len_input.setAttribute('max', h);  
  y_len = y_len_input.value;

  // Update Pattern Preview Window Size
  canvas_pattern.width = w;
  canvas_pattern.height = h;

  config.x1 = Math.floor(Math.random() * w) + 1;
  config.x2 = Math.floor(Math.random() * w) + 1;
  config.y1 = Math.floor(Math.random() * h) + 1;
  config.y2 = Math.floor(Math.random() * h) + 1;


  // The Pattern that's repeated.
  ctx_pattern.beginPath();
  ctx_pattern.moveTo(config.x1,config.y1);
  ctx_pattern.lineTo(config.x2, config.y1);
  for (var i = 0, len = points; i < len; i++){
    var rand_width = Math.floor(Math.random() * w) + 1;
    var rand_height = Math.floor(Math.random() * h) + 1;
    position_data.push( { w: rand_width, h: rand_height } );
    ctx_pattern.lineTo(rand_width, rand_height);
  }

  ctx_pattern.fill();


  config.position_data = position_data;

  // Repeat the Pattern.
  repeatPattern(config);

}


// Samples Button
function cycleSamples(){
  // drawSamples uses the modulus operator
  // to continuously go through an array 
  (function(){

    // Draw Random Pattern From Data
    if (sample_examples[sample_index].position_data){
      drawFromData(sample_examples[sample_index]);

    // Draw Original Algorythm Pattern
    } else {
      controlValuesFromData( sample_examples[sample_index]);
      drawPattern(sample_examples[sample_index]);
    }

    sample_index = (sample_index + 1) % sample_examples.length;
  })();
}













// --- Events and Buttons


// Draw Pattern Type
// For Now, There are two algorythms
// Draw starting point, which is drawPattern
// And Randomized Data
function drawPatternType(){
  
  // It'll basically always be from window hash
  if ( window.location.hash ){
    config = decodeURIComponent(window.location.href.split('#')[1]);
    config = JSON.parse(config);

  // Else is if we paste date
  } else {
    config = JSON.parse(pattern_data.value);
  }


  // Draw Random Pattern From Data
  if (config.position_data){
    drawFromData(config);

  // Draw Original Algorythm Pattern
  } else {
    drawPattern(config);
  }
}



// Slider Events
function controlEvents(){
  var sliders = document.getElementsByTagName('input');
  var i = 0;
  var len = sliders.length;
  for (i = 0; i < len; i++){
    sliders[i].onchange =  debounce(function() {
      config = configFromControlValues();
      randomizePattern(config);
    }, 150);
  }
}


// Set Up All Button Events
function buttonEvents(){
  var buttons = document.getElementsByTagName('button');

  for(var i = 0, len = buttons.length; i < len; i++){
    buttons[i].addEventListener('click', function(e){
        var data_action = e.target.getAttribute('data-action');
        switch (data_action) {
          
          case 'toggle-menu':
            document.getElementById('menu').classList.toggle('active');
            break;
          
          case 'randomize-pattern':
            setBackgroundColour();
            config = JSON.parse(pattern_data.value);
            randomizePattern(config);

            break;
            
          case 'toggle-background': 
            setBackgroundColour();
            break;

          case 'toggle-samples':
            cycleSamples();
            break;
          
          default:
            console.log('button data-action not found');
        }
    });
  }
}





// Resize Event
// resize the canvas to fill browser window dynamically
var resizeCanvas = debounce(function() {
  canvas_repeat.width = window.innerWidth;
  canvas_repeat.height = window.innerHeight;

  config = JSON.parse(pattern_data.value);

  drawPatternType();

}, 250);

// On Resize
window.addEventListener('resize', resizeCanvas, false);

// OnLoad Set Up Slider Events and Default Sample
window.onload = function(){
  controlEvents();
  buttonEvents();
  resizeCanvas();
};

// Back, Forward Button
window.onpopstate=function(){
  drawPatternType();
}






// Keyboard Controls
document.onkeydown = function(e) {
  
  e = e || window.event;
  key = e.keyCode;

  switch (key) {
          
          // R - For Random
          case 82:
            config = JSON.parse(pattern_data.value);
            randomizePattern(config);
            setBackgroundColour();
            break;
          
          // S - For Sample
          case 83:
            cycleSamples();
            break;
          
          // B - For Background
          case 66: 
            setBackgroundColour();
            break;

          // M - For Menu
          case 77:
            document.getElementById('menu').classList.toggle('active');
            break;

          // P - Export SVG
          case 80:
            drawSVG();
            drawSVG();
            break;
          default:

        }

}





// NEAT PATTERNS
/*
  ctx_pattern.fillRect(0, 0, x_len, y_len);
  ctx_pattern.clearRect(0, 0, x_len - (x_len / 2), y_len - (y_len / 2));

  ctx_pattern.beginPath();
  ctx_pattern.moveTo(x_len,y_len);
  ctx_pattern.lineTo(y_len + 1,x_len + 1);
  ctx_pattern.lineTo(x_len - 1,y_len - 1);
  ctx_pattern.fill();

  ctx_pattern.beginPath();
  ctx_pattern.moveTo(y_len,x_len);
  ctx_pattern.lineTo(y_len + 1,x_len + 1);
  ctx_pattern.lineTo(x_len - 1,y_len - 1);
  ctx_pattern.fill();
*/


/*
ctx_pattern.beginPath();
  ctx_pattern.moveTo(x_len,y_len);
  ctx_pattern.lineTo(y_len + 1,x_len + 1);
  ctx_pattern.lineTo( (y_len + x_len) ,(y_len + x_len) / 2);
  ctx_pattern.fill();

  ctx_pattern.beginPath();
  ctx_pattern.moveTo(y_len,x_len);
  ctx_pattern.lineTo(y_len - 1,x_len + 1);
  ctx_pattern.lineTo((y_len + x_len) / 2 ,(y_len + x_len));
  ctx_pattern.fill();
*/

/*

  ctx_pattern.beginPath();
  ctx_pattern.moveTo(x_len,y_len);
  ctx_pattern.lineTo(0, 0);
  ctx_pattern.lineTo(0, x_len);
  ctx_pattern.lineTo(y_len, x_len);
  ctx_pattern.lineTo(y_len, 0);
  ctx_pattern.fill();

 */


/*
  ctx_pattern.beginPath();
  ctx_pattern.moveTo(x_len,y_len);
  ctx_pattern.lineTo(y_len, x_len);
  ctx_pattern.lineTo(x_len + 10, y_len - 10);
  ctx_pattern.lineTo(0, 0);
  ctx_pattern.lineTo(x_len - 10, y_len + 10);
  ctx_pattern.lineTo(x_len, y_len);
  ctx_pattern.fill();
*/