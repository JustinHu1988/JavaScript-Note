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























