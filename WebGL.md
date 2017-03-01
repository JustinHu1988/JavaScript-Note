
# Getting started with WebGL
WebGL programs consist of control code written in JavaScript and special effects code (shader code) that is executed on a computer's Graphics Processing Unit(GPU). 

WebGL was originally based on OpenGL ES 2.0, the OpenGL specification version for devices such as iPhone and iPad.

In this chapter, you will:

- Understand the structure of a WebGL application
- Set up you drawing area (canvas)
- Test your browser's WebGL capabilities
- Understand that WebGL acts as a state machine
- Modify WebGL variables that affect your scene
- Load and examine a fully-functional scene

### about rendering
1. **software-based rendering** : the calculations required to render 3D scenes are performed using the computer's main processor, its CPU.
2. **hardware-based rendering** : a Graphics Processing Unit(GPU) will perform 3D graphics computations in real time.

Hardware-based rendering is much more efficient.

1. server-based rendering
2. client-based rendering

## Structure of a WebGL application
We need certain components to be present to create a 3D scene. The components we are referring to are as follows:

- **Canvas**: placeholder
- **Objects**: These are the 3D entitlies that make up part of the scene. These entities are composed of triangles. In chapter 2, we will see how WebGL handles geometry. We will use WebGL **buffers** to store polygonal data and we will see how WebGL uses these buffers to render the objects in the scene.
- **Lights**: WebGL uses **shaders** to model lights in the scene.
- **Camera**: The canvas acts as the viewport to the 3D world.


### Creating an HTML5 canvas / Accessing a WebGL context
See `example 001`.
We need to create a JavaScript function that will check whether a WebGL context can be obtained for the canvas or not.


## WebGL is a state machine
A WebGL context can be understood as a state machine: once you modify any of its attributes, that modification is permanent until you modify that attribute again. At any point you can query the state of these attributes and so you can determine the current state of your WebGL context.



### Resizing the WebGL context
A new WebGL context will set its viewport resolution to the height and width of its canvas element, without CSS, at the instant the context was obtained.
Editing the style of a canvas element will change its displayed size but will not change its rendering resolution. Editing the width and height attributes of a canvas element after the context has been created will also not change the number of pixels to be drawn. 

To change the resolution which WebGL renders at, such as when the user resizes the window of a full-document canvas or you wish to provide in-app adjustable graphics settings, you will need to call the WebGL context's `viewport()` function to acknowledge the change.

Example:
```javascript
gl.viewport(0,0,canvas.width, canvas.height);
```

A canvas will experience scaling when it is rendered at a different resolution than its CSS style makes it occupy on the display. Resizing with CSS is mostly useful to save resources by rendering at a low resolution and allowing the browser to upscale; downscaling is possible which would produce a super sample antialiasing (SSAA) effect (albeit with naive results and a severe performance cost). It is often best to rely upon the MSAA and texture filtering implementations of the user's browser, if available and appropriate, rather than doing it via brute force and hoping that the browser's image reduction algorithm produces a cleaner result. ???

