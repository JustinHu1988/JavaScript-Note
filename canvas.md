`canvas` is an HTML element which can be used to draw graphics using scripting (usually JavaScript).

# The `<canvas>` element

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

#### `lineWidth = value`
Sets the width of lines drawn in the future.

#### `lineCap = type`
Sets the appearance of the ends of lines.
```javascript
ctx.lineCap = "butt";
ctx.lineCap = "round";
ctx.lineCap = "square";
```

#### `lineJoin = type`
Sets the appearance of the "corners" where lines meet.
```javascript
ctx.lineJoin = "bevel";
ctx.lineJoin = "round";
ctx.lineJoin = "miter";
```

#### `miterLimit = value` ???
Establishes a limit on the miter when two lines join at a sharp angle, to let you control how thick the junction becomes.

#### `setLineDash(segments)`
Sets the current line dash pattern.
```html
<canvas id="canvas1"></canvas>
```
```javascript
var canvas=document.getElementById("canvas1");
var ctx=canvas.getContext("2d");
ctx.setLineDash([5,15]);
ctx.beginPath();
ctx.moveTo(0,100);
ctx.lineTo(400,100);
ctx.stroke();
```

#### `getLineDash()`
Returns the current line dash pattern array containing an even number of non-negative numbers.

#### `#### lineDashOffset = value`
Specifies where to start a dash array on a line.



## Gradients
Just like any normal drawing program, we can fill and stroke shapes using linear and radial gradients. 

We create a `CanvasGradient` object by using one of the following methods. We can then assign this object to the `fillStyle` or `strokeStyle` properties.

#### `createLinearGradient(x1, y1, x2, y2)`
Creates a linear gradient object with a starting point of (x1, y1) and an end point of (x2, y2).
#### `createRadialGradient(x1, y1, r1, x2, y2, r2)`
Creates a radial gradient. The parameters represent two circles, one with its center at (x1, y1) and a radius of r1, and the other with its center at (x2, y2) with a radius of r2.

Once we've created a CanvasGradient object we can assign colors to it by using the addColorStop() method.

#### `gradient.addColorStop(position, color)`
Creates a new color stop on the gradient object. The position is a number between 0.0 and 1.0 and defines the relative position of the color in the gradient.

Example:
```javascript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  // Create gradients
  var lingrad = ctx.createLinearGradient(0, 0, 0, 150);
  lingrad.addColorStop(0, '#00ABEB');
  lingrad.addColorStop(0.5, '#fff');
  lingrad.addColorStop(0.5, '#26C000');
  lingrad.addColorStop(1, '#fff');

  var lingrad2 = ctx.createLinearGradient(0, 50, 0, 95);
  lingrad2.addColorStop(0.5, '#000');
  lingrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

  // assign gradients to fill and stroke styles
  ctx.fillStyle = lingrad;
  ctx.strokeStyle = lingrad2;
  
  // draw shapes
  ctx.fillRect(10, 10, 130, 130);
  ctx.strokeRect(50, 50, 50, 50);

}
```

Example:
```javascript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  // Create gradients
  var radgrad = ctx.createRadialGradient(45, 45, 10, 52, 50, 30);
  radgrad.addColorStop(0, '#A7D30C');
  radgrad.addColorStop(0.9, '#019F62');
  radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');
  
  var radgrad2 = ctx.createRadialGradient(105, 105, 20, 112, 120, 50);
  radgrad2.addColorStop(0, '#FF5F98');
  radgrad2.addColorStop(0.75, '#FF0188');
  radgrad2.addColorStop(1, 'rgba(255, 1, 136, 0)');

  var radgrad3 = ctx.createRadialGradient(95, 15, 15, 102, 20, 40);
  radgrad3.addColorStop(0, '#00C9FF');
  radgrad3.addColorStop(0.8, '#00B5E2');
  radgrad3.addColorStop(1, 'rgba(0, 201, 255, 0)');

  var radgrad4 = ctx.createRadialGradient(0, 150, 50, 0, 140, 90);
  radgrad4.addColorStop(0, '#F4F201');
  radgrad4.addColorStop(0.8, '#E4C700');
  radgrad4.addColorStop(1, 'rgba(228, 199, 0, 0)');
  
  // draw shapes
  ctx.fillStyle = radgrad4;
  ctx.fillRect(0, 0, 150, 150);
  ctx.fillStyle = radgrad3;
  ctx.fillRect(0, 0, 150, 150);
  ctx.fillStyle = radgrad2;
  ctx.fillRect(0, 0, 150, 150);
  ctx.fillStyle = radgrad;
  ctx.fillRect(0, 0, 150, 150);
}
```


## Patterns
#### `createPattern(image,type)`
Creates and returns a new canvas pattern object. `image` is a CanvasImageSource, `type` is a string indicating how to use the image(`repeat`,`repeat-x`,`repeat-y`,`no-repeat`).

We use this method to create a CanvasPattern object which is very similar to the gradient methods we've seen above. Once we've created a pattern, we can assign it to the `fillStyle` or `strokeStyle` properties.

```javascript
var img = new Image();
img.src = 'someimage.png';
var ptrn = ctx.createPattern(img, 'repeat');
```

>Note: Like with the `drawImage()` method, you must make sure the image you use is loaded before calling this method or the pattern may be drawn incorrectly.


## Shadows

#### `shadowOffsetX = float`

#### `shadowOffsetY = float`

#### `shadowBlur = float`

#### `shadowColor = color`

## Canvas fill rules ???
When using `fill` (or `clip` and `isPointinPath`) you can optionally provide a fill rule algorithm by which to determine if a point is inside or outside a path and thus if it gets filled or not. This is useful when a path intersects itself or is nested.

Two values are possible:

- "nonzero": The non-zero winding rule, which is the default rule.
- "evenodd": The even-odd winding rule.

```javascript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d'); 
  ctx.beginPath(); 
  ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
  ctx.arc(50, 50, 15, 0, Math.PI * 2, true);
  ctx.fill('evenodd');
}
```


# Drawing text

####  `fillText(text, x, y [, maxWidth])`
Fills a given text at the given (x,y) position. Optionally with a maximum width to draw.
Example:
```javascript
function draw(){
    var ctx = document.getElementById("canvas").getContext('2d');
    ctx.font = '48px serif';
    ctx.fillText('Hello world', 10, 50);
}
```

#### `strokeText(text, x, y [, maxWidth])`
Strokes a given text at the given (x,y) position. Optionally with a maximum width to draw.
```javascript
function draw(){
    var ctx = document.getElementById("canvas").getContext('2d');
    ctx.font = '48px serif';
    ctx.strokeText('Hello world', 10, 50);
}
```

### Styling text
#### `font = value`
This string uses the same syntax as the CSS font property.

#### `textAlign = value`
`start`(default), `end`, `left`, `right` or `center`.

#### `textBaseline = value`

#### `direction = value`
`ltr`, `rtl`, `inherit`(default).

### Advanced text measurements
#### `measureText()` ???
Returns a TextMetrics object containing the width, in pixels, that the specified text will be when drawn in the current text style.


# Using images
Importing images into a canvas is basically a two step process:

1. Get a reference to an HTMLImageElement object or to another canvas element as a source. It is also possible to use images by providing a URL.
2. Draw the image on the canvas using the `drawImage()` function.

## Getting images to draw
The canvas API is able to use any of the following data types as an image source:
#### `HTMLImageElement`
These are images created using the `Image()` constructor, as well as any `<img>` element.
#### `HTMLVideoElement`
Using an HTML `<video>` element as your image source grabs the current frame from the video and uses it as an image.
#### `HTMLCanvasElement`
You can use another `<canvas>` element as your image source.

These sources are collectively referred to by the type `CanvasImageSource`.

There are several ways to get images for use on a canvas:
### 1. Using images from the same page
- `document.images`
- `document.getElementsByTagName()`
- `document.getElementById()`

### 2. Using images from other domains ???
Using the crossorigin attribute of an `<img>` element (reflected by the HTMLImageElement.crossOrigin property), you can request permission to load an image from another domain for use in your call to drawImage(). If the hosting domain permits cross-domain access to the image, the image can be used in your canvas without tainting it; otherwise using the image will taint the canvas.

### 3. Using other canvas elements
Just as with normal images, we access other canvas elements using either the `document.getElementsByTagName()` or `document.getElementById()` method. Be sure you've drawn something to the source canvas before using it in your target canvas.

One of the more practical uses of this would be to use a second canvas element as a thumbnail view of the other larger canvas.

### 4. Creating an image from scratch
Another option is to create new `HTMLImageElement` objects in our script.
To do this, you can use the convenient `Image()` constructor:
```javascript
var img = new Image();
img.src = "myImage.png"; // Set source path, When this script gets executed, the image starts loading.
```
When this script gets executed, the image starts loading.

If you try to call `drawImage()` before the image has finished loading, it won't do anything. So you need to be sure to use the load event so you don't try this before the image has loaded:
```javascript
var img = new Image();  // create new img element
img.addEventListener('load', function(){
    // execute drawImage statements here
}, false);
img.src = 'myImage.png';    // set source path
```

**If you're only using one extenal image this can be a good approach, but once you need to track more than one we need to resort to something more clever. It's beyond the scope of this tutorial to look at image pre-loading tactics, but you should keep that in mind.**

### 5. Embedding an image via `data: URL`
Another possible way to include images is via the `data: url`. Data URLs allow you to completely define an image as a Base64 encoded string of characters directly in your code.
```javascript
var img = new Image();
img.src = 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';
```
One advantage of data URLs is that the resulting image is available immediately without another round trip to the server. Another potential advantage is that it is also possible to encapsulate in one file all of your CSS, JavaScript, HTML, and images, making it more portable to other locations.

Some disadvantages of this method are that your image is not cached, and for larger images the encoded url can become quite long.

### 6. Using frames from a video
You can also use frames from a video being presented by a `<video>` element (even if the video is not visible).  For example, if you have a `<video>` element with the ID "myvideo", you can do this:
```javascript
function getMyVideo(){
    var canvas = document.getElementById('canvas');
    if(canvas.getContext){
        var ctx = canvas.getContext('2d');
        return document.getElementById('myvideo');
    }
}
```
This returns the HTMLVideoElement object for the video, which, as covered earlier, is one of the objects that can be used as a CanvasImageSource.


## Drawing images

Once we have a reference to our source image object we can use the `drawImage()` method to render it to the canvas. As we will see later the the `drawImage()` method is overloaded and has several variants. In its most basic form it looks like this:

#### `drawImage(image, x, y)`
Draws the CanvasImageSource specified by the image parameter at the coordinates (x, y).

> SVG images must specify a width and height in the root <svg> element.

Example:
```javascript
function draw(){
    var ctx = document.getElementById('canvas').getContext('2d');
    var img = new Image();
    img.onload = function(){
        ctx.drawImage(img, 0, 0);
        ctx.beginPath();
        ctx.moveTo(30,96);
        ctx.lineTo(70,66);
        ctx.lineTo(103, 76);
        ctx.lineTo(170, 15);
        ctx.stroke();
    };
    img.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png';
}
```

#### Scaling: `drawImage(image, x, y, width, height)`
The second variant of the `drawImage()` method adds two new parameters and lets us place scaled images on the canvas.

This adds the width and height parameters, which indicate the size to which to scale the image when drawing it onto the canvas.
```javascript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  var img = new Image();
  img.onload = function() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        ctx.drawImage(img, j * 50, i * 38, 50, 38);
      }
    }
  };
  img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
}
```

#### Slicing: `drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)`
The third and last variant of the `drawImage()` method has eight parameters in addition to the image source. It lets us cut out a section of the source image, then scale and draw it on our canvas.

Given an `image`, this function takes the area of the source image specified by the rectangle whose top-left corner is (sx, sy) and whose width and height are sWidth and sHeight and draws it into the canvas, placing it on the canvas at (dx, dy) and scaling it to the size specified by dWidth and dHeight.

Slicing can be a useful tool when you want to make compositions. You could have all elements in a single image file and use this method to composite a complete drawing. For instance, if you want to make a chart you could have a PNG image containing all the necessary text in a single file and depending on your data could change the scale of your chart fairly easily. Another advantage is that you don't need to load every image individually, which can improve load performance.

#### Controlling image scaling behavior
As mentioned previously, scaling images can result in fuzzy or blocky artifacts due to the scaling process. You can use the drawing context's `imageSmoothingEnabled` property to control the use of image smoothing algorithms when scaling images within your context. By default, this is true, meaning images will be smoothed when scaled. You can disable this feature like this:
```javascript
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
```


# Transformations
Before we look at the transformation methods, let's look at two other methods which are indispensable once you start generating ever more complex drawings.

#### `save()`
Saves the entire state of the canvas.

#### `restore()`
Restores the most recently saved canvas state.

Canvas states are stored on a stack. Every time the `save()` method is called, the current drawing state is pushed onto the stack.

**A drawing state consists of:**

- The transformations that have been applied.
- The current values of the following attributes:
    `strokeStyle`, `fillStyle`, `globalAlpha`, `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `lineDashOffset`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`, `globalCompositeOperation`, `font`, `textAlign`, `textBaseline`, `direction`, `imageSmoothingEnabled`.
- The current `clipping path`, which we'll see in the next section.

You can call the `save()` method as many times as you like. Each time the `restore()` method is called, the last saved state is popped off the stack and all saved settings are restored.


## Translating

#### `translate(x,y)`
Moves the canvas and its origin on the grid. `x` indicates the horizontal distance to move, and `y` indicates how far to move the grid vertically.

**It's a good idea to save the canvas state before doing any transformations. In most cases, it is just easier to call the restore method than having to do a reverse translation to return to the original state. Also if you're translating inside a loop and don't save and restore the canvas state, you might end up missing part of your drawing, because it was drawn outside the canvas edge.**

## Rotating
#### `rotate(angle)`
Rotates the canvas clockwise around the current origin by the angle number of radians.

The rotation center point is always the canvas origin. To change the center point, we will need to move the canvas by using the `translate()` method.

## Scaling
#### `scale(x,y)`
Scales the canvas units by x horizontally and by y vertically. Both parameters are real numbers. Values that are smaller than 1.0 reduce the unit size and values above 1.0 increase the unit size. Values of 1.0 leave the units the same size.

Using negative numbers you can do axis mirroring (for example using translate(0,canvas.height); scale(1,-1); you will have the well-known Cartesian coordinate system, with the origin in the bottom left corner).

By default, one unit on the canvas is exactly one pixel. If we apply, for instance, a scaling factor of 0.5, the resulting unit would become 0.5 pixels and so shapes would be drawn at half size. In a similar way setting the scaling factor to 2.0 would increase the unit size and one unit now becomes two pixels. This results in shapes being drawn twice as large.


## Transforms
Finally, the following transformation methods allow modifications directly to the transformation matrix.

#### `transform(a,b,c,d,e,f)`
The parameters of this function are:

`a (m11)`
Horizontal scaling.
`b (m12)`
Horizontal skewing.
`c (m21)`
Vertical skewing.
`d (m22)`
Vertical scaling.
`e (dx)`
Horizontal moving.
`f (dy)`
Vertical moving.

#### `setTransform(a, b, c, d, e, f)`

#### `resetTransform()`
Resets the current transform to the identity matrix. This is the same as calling: `ctx.setTransform(1, 0, 0, 1, 0, 0);`


# Compositing and clipping
## Compositing
#### `globalCompositeOperation = type`
This sets the type of compositing operation to apply when drawing new shapes, where type is a string identifying which of the twelve compositing operations to use.

- source-over: (default)
- source-in
- source-out
- source-atop
- destination-over
- destination-in
- destination-out
- destination-atop
- lighter
- copy
- xor
- multiply
- screen
- overlay
- darken
- lighten
- color-dodge
- color-burn
- hard-light
- soft-light
- difference
- exclusion
- hue
- saturation
- color
- luminosity

## Clipping paths
A clipping path is like a normal canvas shape but it acts as a mask to hide unwanted parts of shapes.

If we compare clipping paths to the globalCompositeOperation property we've seen above, we see two compositing modes that achieve more or less the same effect in `source-in` and `source-atop`. The most important differences between the two are that clipping paths are never actually drawn to the canvas and the clipping path is never affected by adding new shapes. This makes clipping paths ideal for drawing multiple shapes in a restricted area.

In the chapter about drawing shapes I only mentioned the `stroke()` and `fill()` methods, but there's a third method we can use with paths, called `clip()`.

#### `clip()`
Turns the path currently being built into the current clipping path.

You use `clip()` instead of `closePath()` to close a path and turn it into a clipping path instead of stroking or filling the path.

By default the `<canvas>` element has a clipping path that's the exact same size as the canvas itself.


# Basic animations
Probably the biggest limitation is, that once a shape gets drawn, it stays that way. If we need to move it we have to redraw it and everything that was drawn before it. It takes a lot of time to redraw complex frames and the performance depends highly on the speed of the computer it's running on.

## Basic animation steps
These are the steps you need to take to draw a frame:

1. Clear the canvas
    Unless the shapes you'll be drawing fill the complete canvas, you need to clear any shapes that have been drawn previously. The easiest way to do this is using the `clearRect()` method.
2. Save the canvas state
    If you're changing any setting (such as styles, transformations, etc.) which affect the canvas state and you want to make sure the original state is used each time a frame is drawn, you need to save that original state.
3. Draw animated shapes
    The step where you do the actual frame rendering.
4. Restore the canvas state
    If you've saved the state, restore it before drawing a new frame.

## Controlling an animation
Shapes are drawn to the canvas by using the canvas methods directly or by calling custom functions. In normal circumstances, we only see these results appear on the canvas when the script finishes executing. For instance, it isn't possible to do an animation from within a `for` loop.

That means we need a way to execute our drawing functions over a period of time. There are two ways to control an animation like this.

### Scheduled updates
There are three functions which can be used to call a specific function over a set period of time:
#### `setInterval(function, delay)`
#### `setTimeout(function, delay)`
#### `requestAnimationFrame(callback)`
Tell the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.

If you don't want any user interaction you can use the `setInterval()` function which repeatedly executes the supplied code. If we wanted to make a game, we could use keyboard or mouse events to control the animation and use `setTimeout()`. By setting `EventListeners`, we catch any user interaction and execute our animation functions.

## A animated solar system



















