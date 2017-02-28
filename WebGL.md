# WebGL

WebGL programs consist of control code written in JavaScript and special effects code (shader code) that is executed on a computer's Graphics Processing Unit(GPU). 






### Resizing the WebGL context
A new WebGL context will set its viewport resolution to the height and width of its canvas element, without CSS, at the instant the context was obtained.
Editing the style of a canvas element will change its displayed size but will not change its rendering resolution. Editing the width and height attributes of a canvas element after the context has been created will also not change the number of pixels to be drawn. 

To change the resolution which WebGL renders at, such as when the user resizes the window of a full-document canvas or you wish to provide in-app adjustable graphics settings, you will need to call the WebGL context's `viewport()` function to acknowledge the change.

Example:
```javascript
gl.viewport(0,0,canvas.width, canvas.height);
```

A canvas will experience scaling when it is rendered at a different resolution than its CSS style makes it occupy on the display. Resizing with CSS is mostly useful to save resources by rendering at a low resolution and allowing the browser to upscale; downscaling is possible which would produce a super sample antialiasing (SSAA) effect (albeit with naive results and a severe performance cost). It is often best to rely upon the MSAA and texture filtering implementations of the user's browser, if available and appropriate, rather than doing it via brute force and hoping that the browser's image reduction algorithm produces a cleaner result. ???

