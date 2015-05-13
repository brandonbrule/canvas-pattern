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


var background_colours = [
    {background_colour: '#FFF056'},
    {background_colour: '#fe524c'},
    {background_colour: '#61D2D6'},
    {background_colour: '#A0FF57'},
    {background_colour: '#fff'}
  ];

var sample_examples = [
    {"w":"28","h":"45","x_len":"9","y_len":"4","points":"3","position_data":[{"w":15,"h":11},{"w":7,"h":14},{"w":27,"h":34}],"background_index":0},
    {"w":"28","h":"45","x_len":"9","y_len":"4","points":"3","position_data":[{"w":10,"h":19},{"w":11,"h":21},{"w":27,"h":24}],"background_index":1},
    {"w":"28","h":"45","x_len":"9","y_len":"4","points":"3","position_data":[{"w":9,"h":4},{"w":2,"h":4},{"w":1,"h":38}],"background_index":2},
    {"w":"76","h":"74","x_len":"7","y_len":"3","points":"1","background_index":3},
    {"w":"20","h":"4","x_len":"15","y_len":"1","points":"1", "background_index": 0},
    {"w":"9","h":"49","x_len":6,"y_len":48,"points":"1","position_data":[{"w":6,"h":48}],"background_index":2},
    {"w":"56","h":"39","x_len":"9","y_len":"0","points":"4","position_data":[{"w":12,"h":35},{"w":49,"h":36},{"w":18,"h":39},{"w":15,"h":38}],"background_index":1},
    {"w":"2","h":"33","x_len":"2","y_len":"1","points":"1","background_index":3},
    {"w":"90","h":"5","x_len":"82","y_len":"6","points":"1", "background_index": 4}
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
  y_len_input.value = y_len;

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
  ctx_pattern.moveTo(0,0);
  ctx_pattern.lineTo(y_len, x_len);
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


  // The Pattern that's repeated.
  ctx_pattern.beginPath();
  ctx_pattern.moveTo(0,0);
  ctx_pattern.lineTo(y_len, x_len);
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
      drawPattern(config);
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