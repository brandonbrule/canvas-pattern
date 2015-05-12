var config;
var sample_index=0;
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
var run_button = document.getElementById('run-button');
var toggle_samples_input = document.getElementById('toggle-samples');


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

  pattern_data.value = JSON.stringify(config);
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

  x_len_input.value = x_len;
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

  // its.a('data x_len_input: ' + x_len_input.value);
  // its.a('data y_len_input: ' + y_len_input.value);
  // its.a(config);

 
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

  // its.a('rand x_len_input: ' + x_len_input.value);
  // its.a('rand y_len_input: ' + y_len_input.value);
  // its.a(config);

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




// --- Events and Buttons


// Draw Pattern Type
// For Now, There are two algorythms
// Draw starting point, which is drawPattern
// And Randomized Data
function drawPatternType(){
  config = JSON.parse(pattern_data.value);

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




// Resize Event
// resize the canvas to fill browser window dynamically
var resizeCanvas = debounce(function() {
  canvas_repeat.width = window.innerWidth;
  canvas_repeat.height = window.innerHeight;

  config = JSON.parse(pattern_data.value);

  drawPatternType();

}, 250);
resizeCanvas();

window.addEventListener('resize', resizeCanvas, false);



// OnLoad Set Up Slider Events and Default Sample
window.onload = function(){
  controlEvents();
  cycleSamples();
};


// Run Button
run_button.addEventListener('click', function(){
  config = JSON.parse(pattern_data.value);
  drawPatternType();
});


// Random Button
document.getElementById('randomize-button').onclick = function(){
  config = JSON.parse(pattern_data.value);
  randomizePattern(config);
};


// Samples Button
function cycleSamples(){
  var samples = [
    {"w":"12","h":"72","x_len":9,"y_len":23,"points":"3","position_data":[{"w":5,"h":8},{"w":2,"h":72},{"w":9,"h":23}]},
    {"w":"76","h":"74","x_len":"7","y_len":"3","points":"1"},
    {"w":"20","h":"4","x_len":"15","y_len":"1","points":"1"},
    {"w":"12","h":"72","x_len":9,"y_len":4,"points":"3","position_data":[{"w":9,"h":13},{"w":1,"h":15},{"w":9,"h":4}]},
    {"w":"9","h":"49","x_len":6,"y_len":48,"points":"1","position_data":[{"w":6,"h":48}]},
    {"w":"7","h":"4","x_len":"3","y_len":"4","points":"1"},
    {"w":"15","h":"28","x_len":9,"y_len":4,"points":"5","position_data":[{"w":8,"h":19},{"w":12,"h":13},{"w":10,"h":23},{"w":7,"h":6},{"w":9,"h":4}]},
    {"w":"2","h":"33","x_len":"2","y_len":"1","points":"1"},
    {"w":"26","h":"26","x_len":"14","y_len":"8","points":"1"},

    {"w":"9","h":"49","x_len":"9","y_len":"45","points":"1"},
    {"w":"90","h":"5","x_len":"82","y_len":"6","points":"1"}
  ];

  // drawSamples uses the modulus operator
  // to continuously go through an array 
  function drawSamples() {

    // Draw Random Pattern From Data
    if (samples[sample_index].position_data){
      drawFromData(samples[sample_index]);

    // Draw Original Algorythm Pattern
    } else {
      controlValuesFromData( samples[sample_index]);
      drawPattern(samples[sample_index]);
    }

    sample_index = (sample_index + 1) % samples.length;
  }

  drawSamples();
}

// Samples Button
toggle_samples_input.onclick = function(){
  cycleSamples();
};





// Keyboard Controls
document.onkeydown = checkKey;
function checkKey(e) {
  
  e = e || window.event;

  if (e.keyCode == '87') {
    // W    
    if (focus_index >= sliders.length){
      focus_index = focus_index - 1;
    } else {
      focus_index = focus_index - 1;
    }
    
    sliders[focus_index].focus();

  } else if (e.keyCode == '69') {
    // E
    if (focus_index < sliders.length){
      focus_index = focus_index + 1;
    } else {
      focus_index = sliders.length + 1;
    }
    sliders[focus_index].focus();
  
  } else if (e.keyCode == '81') {
    // R
    config = JSON.parse(pattern_data.value);
    randomizePattern(config);
    
  } else if (e.keyCode == '82') {
    // Q
    config = JSON.parse(pattern_data.value);
    randomizePattern(config);
    
  } else if (e.keyCode == '83') {
    // S
    cycleSamples();
    
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