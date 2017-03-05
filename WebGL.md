
# 1. Getting started with WebGL
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

### The basic element for a scene
canvas, objects, lights, and camera.



### Resizing the WebGL context
A new WebGL context will set its viewport resolution to the height and width of its canvas element, without CSS, at the instant the context was obtained.
Editing the style of a canvas element will change its displayed size but will not change its rendering resolution. Editing the width and height attributes of a canvas element after the context has been created will also not change the number of pixels to be drawn. 

To change the resolution which WebGL renders at, such as when the user resizes the window of a full-document canvas or you wish to provide in-app adjustable graphics settings, you will need to call the WebGL context's `viewport()` function to acknowledge the change.

Example:
```javascript
gl.viewport(0,0,canvas.width, canvas.height);
```

A canvas will experience scaling when it is rendered at a different resolution than its CSS style makes it occupy on the display. Resizing with CSS is mostly useful to save resources by rendering at a low resolution and allowing the browser to upscale; downscaling is possible which would produce a super sample antialiasing (SSAA) effect (albeit with naive results and a severe performance cost). It is often best to rely upon the MSAA and texture filtering implementations of the user's browser, if available and appropriate, rather than doing it via brute force and hoping that the browser's image reduction algorithm produces a cleaner result. ???



# 2. Rendering Geometry
In this chapter:

- Understand how WebGL defines and processes geometric information
- The relevant API methods that relate to geometry manipulation
- Examine why and how to use JavaScript Object Notation(JSON) to define, store, and load complex geometries
- Continue our analysis of WebGL as a state machine and describe the attributes relevant to geometry manipulation that can be set and retrieved from the state machine.
- creating and loading different geometry models


## Vertices and Indices
WebGL handles geometry in a standard way, independently of the complexity and number of points that surfaces can have.

There are two data that are fundamental to represent the geometry of any 3D object: vertices and indices.

- **Vertices**: the points that define the corners of 3D objects. Each vertex is represented by three floating-point numbers that correspond to the x,y and z corrdinates of the vertex. Unlike OpenGL, in WebGL, we need to write all of our vertices in a JavaScript array and then construct a WebGL vertex buffer with it.
- **Indices**: numeric labels for the vertices in a given 3D scene. Tell WebGL how to connect vertices in order to produce a surface. Indice aro also stored in a JavaScript array and then they are passed along to WebGL's rendering pipeline using a WebGL index buffer.

>There are two kind of WebGL buffers used to describe and process geometry: 
    - Buffers that contain vertex data are known as **Vertex Buffer Objects(VBOs)**.
    - Buffers that contain index data are known as **Index Buffer Objects(IBOs)**.

- **Vertex Buffer Objects[VBOs]**: VBOs contain the data that WebGL requires to describe the geometry that is going to be rendered. Vertex coordinates are usually stored and processed in WebGL as VBOs. Additionally, there are several data elements such as vertex normals, colors and texture coordinates, among others, that can be modeled as VBOs.

- **Vertex shader**: The vertex shader is called on each vertex. This shader manipulates *per-vertex data* such as vertex coordinates, normals, colors, and texture coordinates. This data is represented by attributes inside the vertex shader. Each attribute points to a *VBO* from where it reads vertex data.

- **Fragment shader**: Every set of three vertices defines a triangle and each element on the surface of that triangle needs to be assigned a color. Otherwise our surfaces would be transparent.
    + Each surface element is called a **fragment.** Since we are dealing with surfaces that are going to be displayed on your screen, these elements are more commonly known as pixels.
    + The main goal of the fragment shader is to calculate the color of individual pixels.

- **Framebuffer**: It is a two-dimensional buffer that contains the fragments that have been processed by the fragment shader. Once all fragments have been processed, a 2D image is formed and displayed on screen. The framebuffer is the final destination of the rendering pipeline.

- **Attributes**: are input variables uses in the vertex shader. For example, vertex coordinates, vertex colors and so on. Due to the fact that the vertex shader is called on each vertex, the attributes will be different every time the vertex shader is invoked.
- **Uniforms**: are input variables for both the vertex shader and fragment shader. Unlike attributes, uniforms are constant during a rendering cycle. For example, lights position.
- **Varyings**: are used for passing data from the vertex shader to the fragment shader.

Now let's create a simple geometric object.






















