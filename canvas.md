`canvas` is an HTML element which can be used to draw graphics using scripting (usually JavaScript).

##The <canvas> element

```html
<canvas id="tutorial" width="150" height="150"></canvas>
```

 `canvas` element has only two specify attributes: `width` and `height`. The initially size is 300 pixels wide and 150 pixels high.

 The `<canvas>` element can be styled just like any normal image (margin, border, background...).  

### fallback content
Like for `<video>`, `<audio>`, or `<picture>` elements, it is easy to define some fallback content.
Providing fallback content: just insert the alternate content inside the `<canvas>` element.

For example, we could provide a text description of the canvas content or provide a static image og the dynamically rendered content. 
```html
<canvas id="stockGraph" width="150" height="150">
    current stock price: $3.15 + 0.15
</canvas>

<canvas id="clock" width="150" height="150">
<img src="images/clock.png" width="150" height="150" alt=""/>
</canvas>
```


## The rendering context
The `<canvas>` element creates a fixed-size drawing surface that exposes one or more rendering contexts, which are used to create and manipulate the content shown.

The canvas is initially blank. To display something, a script first needs to access the rendering context and draw on it.

`getContext(contextType, contextAttributes)` 

```javascript
var canvas1 = document.getElementById("tutorial");
var ctx = canvas1.getContext("2d");
```


## Checking for support
You can check for support by testing for the presence of the `getContext()` method.

```javascript
var canvas1 = document.getElementById("tutorial");
if (canvas.getContext) {
    var ctx = canvas1.getContext("2d");
    // drawing code
} else {
    // unsupported code
}
```



# Drawing shapes
First, we need set up a canvas environment, then let's see hao to draw rectangles, triangles, lines, arcs and curves.

## Drawing rectangles
Unlike SVG, `<canvas>` only supports on primitive shape: rectangles.
All other shapes must be created by combining one or more paths, lists of points connected by lines.
>Luckily, we have an assortment of path drawing functions which make it possible to compose very complex shapes.

First, let's focus on drawing rectangles, we have **three** functions:
```javascript
fillRect(x,y,width,height);     // Draws a filled rectangle
strokeRect(x,y,width,height);   // Draws a rectangular outline
clearRect(x,y,width,height);    // Clears the specified rectangular area, making it fully transparent
```

For example:
```javascript
function draw(){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        
        ctx.fillRect(25,25,100,100);
        ctx.clearRect(45,45,60,60);
        ctx.strokeRect(50,50,50,50,);
    }
}
```
Unlike the path functions we'll see in the next section, all three rectangle functions draw immediately to the canvas.

## Drawing paths
The only other primitive shapes are *paths*. A path is a list of points, connected by segments of lines that can be of different shapes, curved or not, of different width and of different color.
A path, or even a subpath, can be closed. 

To make shapes using paths takes some extra steps:

1. First, you create the path.
2. Then you use drawing commands to draw into the path.
3. Then you close the path.
4. Once the path has been created, you can stroke or fill the path to render it.

Here are the functions used to perform these steps:

- `beginPath()`
- Path methods
- `closePath()` (optional), this method tries to close the shape by drawing a straight line from the current point to the start. If the shape has already been closed or there's only one point in the list, this function does nothing.
- `stroke()`
- `fill()`

The first step to create a path is to call the beginPath(). Internally, paths are stored as a list of sub-paths (lines, arcs, etc) which together form a shape. Every time this method is called, the list is reset and we can start drawing new shapes.

> Note: When the current path is empty, such as immediately after calling beginPath(), or on a newly created canvas, the first path construction command is always treated as a moveTo(), regardless of what it actually is. For that reason, you will almost always want to specifically set your starting position after resetting a path.

> Note: When you call `fill()`, any open shapes are closed automatically, so you don't have to call `closePath()`. This is not the case when you call `stroke()`.

For example, drawing a triangle:
```javascript
function draw(){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(75,50);
        ctx.lineTo(100,75);
        ctx.lineTo(100,25);
        ctx.fill();
    }
}
```

### `moveTo(x,y)`
When the canvas is initialized or beginPath() is called, you typically will want to use the moveTo() function to place the starting point somewhere else. 

We could also use moveTo() to draw unconnected paths.

### `lineTo(x,y)`
Draws a line from the current drawing position to the position specified by x and y.

### `arc(), arcTo()`

#### `arc(x, y, radius, startAngle, endAngle, anticlockwise)`
Draws an arc which is centered at (x,y) position with *radius* starting at *startAngle* and ending at *endAngle* going in the given direction indicated by *anticlockwise*(defaulting to clockwise).

#### `arcTo(x1, y1, x2, y2, radius)`
Draws an arc with the given control points and radius, connected to the previous point by a straight line.

> Note: Angles in the arc function are measured in radians, not degrees. To convert degrees to radians you can use the following JavaScript expression: radians = (Math.PI/180)*degrees.

#### `quadraticCurveTo(cp1x, cp1y, x, y)`
Draws a quadratic Bézier curve from the current pen position to the end point specified by x and y, using the control point specified by cp1x and cp1y.

#### `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`
Draws a cubic Bézier curve from the current pen position to the end point specified by x and y, using the control points specified by (cp1x, cp1y) and (cp2x, cp2y).

#### `rect(x,y,width,height)`
In addition to the three methods we saw in Drawing rectangles, which draw rectangular shapes directly to the canvas, there's also the `rect()` method, which adds a rectangular path to a currently open path.

When this method is executed, the `moveTo()` method is automatically called with the parameters `(0,0)`. In other words, the current pen position is automatically reset to the default coordinates.

#### `Path2D()`
The Path2D() constructor returns a newly instantiated Path2D object, optionally with another path as an argument (creates a copy), or optionally with a string consisting of SVG path data.
```javascript
new Path2D();       // empty path object
new Path2D(path);   // copy from another Path2D object
new Path2D(d);      // path from SVG path data
```
All path methods like `moveTo`, `rect`, `arc` or quadraticCurveTo, etc., are available on Path2D objects.

#### `Path2D.addPath(path [, transform])`
Adds a path to the current path with an optional transformation matrix.
Example for `Path2D()`:
```javascript
function draw(){
    var canvas = document.getElementById('canvas');
    if(canvas.getContext){
        var ctx = canvas.getContext('2d');
        var rectangle = new Path2D();
        rectangle.rect(10,10,50,50);
        var circle = new Path2D();
        circle.moveTo(125,35);
        circle.arc(100, 35, 25, 0, 2*Math.PI);
        
        ctx.stroke(rectangle);
        ctx.fill(circle);
    }   
}
```

#### Using SVG paths
Another powerful feature of the new canvas Path2D API is using SVG path data to initialize paths on your canvas. This might allow you to pass around path data and re-use them in both, SVG and canvas.



# Applying styles and colors

## colors
Two properties of the drawing shape we can use: `fillStyle` and `strokeStyle`.

### `fillStyle = color`
Sets the style used when filling shapes.

### `strokeStyle = color`
Sets the style for shapes' outlines.

By default, the stroke and fill color are set to  black(CSS color value #000000).

>Note: When you set the strokeStyle and/or fillStyle property, the new value becomes the default for all shapes being drawn from then on. For every shape you want in a different color, you will need to reassign the fillStyle or strokeStyle property.

FillStyle example:
```javascript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 6; j++) {
      ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' +
                       Math.floor(255 - 42.5 * j) + ', 0)';
      ctx.fillRect(j * 25, i * 25, 25, 25);
    }
  }
}
```

StrokeStyle example:
```javascript
function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        ctx.strokeStyle = 'rgb(0, ' + Math.floor(255 - 42.5 * i) + ', ' + 
                         Math.floor(255 - 42.5 * j) + ')';
        ctx.beginPath();
        ctx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    }
  }
```


## Line Styles



















