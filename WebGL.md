
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

## Rendering geometry in WebGL
The following are the steps that we will follow in this section to render an object in WebGL:
1. Define a geometry using JavaScript arrays. 
2. Create the respective WebGL buffers.
3. Point a vertex shader attribute to the VBO that we created in the previous step to store vertex coordinates.
4. Use the IBO to perform the rendering.

### Defining a geometry using JavaScript arrays
We need two JavaScript arrays: one for the vertices and one for the indices.

### Creating WebGL buffers
For every buffer, we need to :
1. Create a new buffer
2. Bind is to make it the current buffer
3. Pass the buffer data using one of the typed arrays
4. Unbind the buffer

```javascript
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
//create a buffer
var myBuffer = gl.createBuffer(); 
// binds a given WebGLBuffer to a target
gl.bindBuffer(gl.ARRAY_BUFFER, myBuffer);
// Initializes and creates the buffer object's data store
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// unbind a buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);
```

### Associating attributes to VBOs
Once the VBOs have been created, we associate these buffers to vertex shader attributes. Each vertex shader attribute will refer to one and only one buffer, depending on the correspondence that is established. 
We can achieve this by following these steps:
####1. First, we bind a VBO that we want to map.
```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, myBuffer);
```
####2. Next, we point an attribute to the currently bound VBO.
```javascript
// next chapter we will learn to define vertex shader attributes.
//For now, Let's assume that we have the aVertexPosition attribute 
//and it will represent vertex coordinates inside the vertex shader.

// The WebGL function that allows pointing attributes to the currently
// bound VBOs is vertexAttribPointer.
gl.vertexAttribPointer(Index, Size, Type, Norm, Stride, Offset);
// Index: An attribute's index that we are going to map the currently bound buffer to.
// Size: Indicates the number of values per vertex that are stored in the currently bound buffer.
// Type: Specifies the data type of the values stored in the current buffer. It is one of the following constants: FIXED, BYTE, UNSIGNED_BYTE, FLOAT, SHORT, or UNSIGNED_SHORT.
// Norm: This parameter can be set to true or false. It handles numeric conversions that lie out of the scope of this introductory guide. For all practical effects, we will set this parameter to false.
// Stride: If stride is zero, then we are indicating that elements are stored sequentially in the buffer.
// Offset: The position in the buffer from which we will start reading values for the corresponding attribute. It is usually set to zero to indicate that we will start reading values from the first element of the buffer.
```
`vertexAttribPointer` defines a pointer for reading information from the currently bound buffer. Remember that an error will be generated if there is no VBO currently bound.
####3. Finally, we enable the attribute.
Finally, we just need to activate the vertex shader attribute.
```javascript
gl.enableVertexAttribArray(aVertexPosition);
```



### Rendering
Once we have defined our VBOs and we have mapped then to the corresponding vertex shader attributes, we are ready to render!
The functions `drawArrays` and `drawElements` are used for writing on the framebuffer.

- **`drawArrays`**: uses vertex data in the order in which it is defined in the buffer to create the geometry.
- **`drawElements`**: uses indices to access the vertex data buffers and create the geometry. `drawElements` uses indices, therefore vertices are processed just once, and can be used as many times as they are defined in the IBO. This feature reduces both the memory and processing required on the GPU.

Both `drawArrays` and `drawElements` will only use **enabled arrays**. These are the *vertex buffer objects that are mapped to active vertex shader attributes*.

#### Using drawElements
When we use `drawElements`, we need at least two buffers: a VBO and an IBO.
> When using `drawElements`, you need to make sure that the corresponding IBO is currently bound.
```javascript
gl.drawElements(Mode, Count, Type, Offset);
```


### WebGL as a state machine: buffer manipulation
There is some information about the state of the rendering pipeline that we can retrieve when we are dealing with buffers with the functions: `getParameter`, `getBufferParameter` and `isBuffer`.

We can use `getParameter(parameter)` where parameter can have the following values:
- `ARRAY_BUFFER_BINDING`: It retrieves a reference to the currently-bound VBO
- `ELEMENT_ARRAY_BUFFER_BINDING`: It retrieves a reference to the currently-bound IBO

Also, we can enquire about the size and the usage of the currently-bound VBO and IBO using `getBufferParameter(type, parameter)` where `type` can have the following values:
- ARRAY_BUFFER: To refer to the currently bound VBO
- ELEMENT_ARRAY_BUFFER: To refer to the currently bound IBO

And `parameter` can be:
- BUFFER_SIZE: Returns the size of the requested buffer
- BUFFER_USAGE: Returns the usage of the requested buffer

> Your VBO and/or IBO needs to be bound when you enquire about the state of the currently bound VBO and/or IBO with `getParameter` and `getBufferParameter`.

Finally, `isBuffer(object)` will return `true` if the `object` is a WebGL buffer, `false` when the buffer is invalid, and an error if the `object` being evaluated is not a WebGL buffer. `isBuffer` does not require any VBO or IBO to be bound.
 
 
 ## Advanced geometry loading techniques: JavaScript Object Notation(JOSN) and AJAX
 

JSON stands for JavaScript Object Notation. It is a lightweight, text-based, open format used for data interchange.

The JSON format is language-agnostic. This means that there are parsers in many languages to read and interpret JSON objects. Also, JSON is a subset of the object of the object literal notation of JavaScript. Therefore, we can define JavaScript objects using JSON.

#### Defining JSON-based 3D models
Most modern web browsers support native JSON encoding and decoding through the built-in JavaScript object JSON. Let's examine the methods available inside this object:

- `JSON.stringify()`: convert JavaScript objects to JSON-formatted text.
- `JSON.parse()`: convert text into JavaScript objects.

For example:
```javascript
var model = {"vertices":[0,0,0,1,1,1], "indices": [0,1]};
typeof model; // "object"
console.log(model.vertices); // [0, 0, 0, 1, 1, 1]
console.log(model.indices); // [0, 1]
var text = JSON.stringify(model);
console.log(text.vertices); // undefined
typeof text; // "string"
// because text is not a JavaScript object but a string with
// the peculiarity of being written according to JSON notation
// to describe an object. Everything in it is text and therefore
// it does not have any fields.

// Now let's convert the JSON text back to an object:
var model2 = JSON.parse(text);
typeof model2; // "object"
console.log(model2.vertices); // [0, 0, 0, 1, 1, 1]
```

#### Asynchronous loading with AJAX

1. **Request file:** First of all, we should indicate the filename that we want to load. Remember that this file contains the geometry that we will be loading from the web server instead of coding the JavaScript arrays directly into the web page.
2. **AJAX request:** We need to write a function that will perform the AJAX request. Let's call this function `loadFile`. The code can look like this:
```javascript
function loadFile(name){
    var request = new XMLHttpRequest();
    var resource = 'http://' + document.domain + name;
    request.open('GET', resource);  // initializes a request
    request.onreadystatechange = function(){ // An EventHandler that is called whenever the readyState attribute changes.
        if (request.readyState == 4){ //  XMLHttpRequest.readyState property returns the state an XMLHttpRequest client is in
            if(request.status == 200 || (request.status==0 && document.domain.length==0)){ // XMLHttpRequest.status property returns the numerical status code of the response of the XMLHttpRequest
                handleLoadedGeometry(name,JSON.parse(request.responseText)); // XMLHttpRequest.responseText returns a DOMString that contains the response to the request as text, or null if the request was unsuccessful or has not yet been sent.
            } else {
                alert("There was a problem loading the file:" + name);
                alert("HTML error code: " + request.status);
            }
        }
    };
    request.send(); // Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent.
}
```
If the readyState is 4, it means that the file has finished downloading.

3. **Retrieve file**: The web server will receive and treat our request as a regular HTTP request. As a matter of fact, the server does not know that this request is asynchronous (it is asynchronous for the web browser as it does not wait for the answer). The server will look for our file and whether it finds it or not, it will generate a response. This will take us to step 4.

4. **Asynchronous response**: Once a response is sent to the web browser, the callback specified in the `loadFile` function is invoked. This callback corresponds to the request method `onreadystatechange`. This method examines the answer.
Now if we get a 200 status, we can invoke the `handleLoadedGeometry` function.

5. **Handling the loaded model**:In order to keep our code looking pretty, we can create a new function to process the file retrieved from the server. Let's call this handleLoadedGeometry function. In the previous segment of code, we used the JSON parser in order to create a JavaScript object from the file before passing it along to the `handleLoadedGeometry` function.This object corresponds to the second argument(`model`) as we can see here:
```javascript
function handleLoadedGeometry(name, model){
    alert(name + " has been retrieved from the server");
    modelVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    modelIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Unit16Array(model.indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
```
Just like `initBuffers`, we bind our VBO and IBO and pass then the information contained in the JavaScript arrays of our `model` object.

#### Setting up a web server
Use nginx.

##### Working around the web server requirement
If you are using Chrome and do not want to install a web server, make sure you run it from the command line with the following modifier:
```
--allow-file-access-from-files
```


# Lights!
In this chapter, we will:

- learn about light sources, normals, and materials
- learn the difference between shading and lighting
- Use the Goraud and Phong shading methods, and the Lambertian and Phong lighting models.
- Define and use uniforms, attributes, and varyings
- Work with ESSL, the shading language for WebGL
- Discuss relevant WebGL API methods that relate to shaders
- Continue our analysis of WebGL as state machine and describe the attributes relevant to shaders that can be set and retrieved from the state machine


## Lights, normals, and materials
- **lights**:
    1. positional light: modeled by a point in space (a lamp)
    2. directional light: modeled with a vector that indicates its direction (sun)
- **Normals**: 
    - the methods of calculating normals
- **Materials**: The material of an object in WebGL can be modeled by several parameters, including its color and its texture(**Texture mapping**).

## Using lights, normals, and materials in the pipeline

Normals are defined on a vertex-per-vertex basis; therefore normals are modeled in WebGL as a VBO and they are mapped using an attribute (aNormalAttribute). (Attributes are never passed to the fragment shader)

Lights and materials are passed as uniforms. Uniforms are available to both the vertex shader and the fragment shader. This gives us a lot of flexibility to calculate our lighting model because we can calculate how the light is reflected on a vertex-by-vertex basis (vertex shader) or on a fragment-per-fragment basis(fragment shader).

> Remember that the vertex shader and fragment shader together are referred to as the **program**.

### Parallelism and the difference between attributes and uniforms

When a draw call is invoked (using `drawArrays` or `drawElements`), the GPU will launch in parallel several copies of the vertex shader. Each copy will receive a different set of attributes. These attributes are drawn from the VBOs that are mapped to the respective attributes.

On the other hand, all the copies of the vertex shaders will receive the same uniforms, therefore teh name, uniform. In other words, uniforms can be seen as constants per draw call.

Once lights, normals, and materials are passed to the program, the next step is to determine which shading and lighting models we will implement.

## Shading methods and light reflection models
The terms shading and lighting refer to different concepts: 

- shading refers to type of *interpolation* that is performed to obtain the final color for every fragment in the scene.
- once the shading model is established, the lighting model determines *how* the normals, materials and lights are combined to produce the final color. (Lighting models are also referred to in literature as *reflection models*)

### Shading/interpolation methods
Two basic types of interpolation method: Goraud and Phong shading.
#### Goraud interpolation
- The Goraud interpolation method computes the final color for the vertex shader, using the vertex normals.
- Then the calculated color for the vertex is carried to the fragment shader using a varying variable. (varying color)
- Assigns the color for the fragment using the interpolated varying color.

> The interpolation of varyings is automatic in the pipeline. No programming is required.

#### Phong interpolation
The Phong method calculates the final color in the fragment shader. 

- To do this, each vertex normal is passed along from the vertex shader to the fragment shader using a varying. 
- Because of the interpolation mechanism of varyings included in the pipeline, each fragment will have its own normal. 
- Fragment normals are then used to perform the calculation of the final color in the fragment shader.

Again, please note here that the shading method does not specify how the final color for every fragment is calculated. It only specifies where (vertex or fragment shader) and also the type of interpolation(vertex colors or vertex normals).???

### Light reflection models
The lighting model is independent from the shading/interpolation model. The shading model only determines where the final color is calculated. Now it is time to talk about how to perform such calculations.

#### Lambertian reflection model (理想散射)
Lambertian reflections are commonly used in computer graphics as a model for diffuse reflections, which are the kind of reflections where an incident light ray is reflected in many angles instead of only in one angle as it is the case for specular reflections.

This lighting model is based on the **cosine emission law**(lambert's emission law).
(发光强度的空间分布符合余弦定律的发光体（不论是自发光或是反射光），其在不同角度的辐射强度会依余弦公式变化，角度越大强度越弱。)
>(计算方法有待学习)

#### Phong reflection model (Phong反射)
Tht sum of three types of reflection: ambient（环境）, diffuse（散射）, specular(镜面).

- ambient: amount of light present everywhere in the scene. Independent from any light source;
- diffuse: The incident light is reflected in many directions. It can be modeled by a Lambertian surface.
- specular: Mirror-like reflection. The direction of the incoming light and the direction of the reflected outgoing light make the same angle with respect to the surface normal.

>**How to calculate specular**
This is modeled by the *dot product(数量积)* of two vectors, namely, the *eye vector* and the *reflected light-direction vector*.  
eye vector: has its origin in the fragment and its end in the view position(camera).
The reflected light-direction vector is obtained by reflecting
the light-direction vector upon the surface normal vector. When this dot product equals 1 (by working with normalized vectors) then our camera will capture the maximum specular reflection.???  
The dot product is then exponentiated by a number that represents the shininess of the surface. After that, the result is multiplied by the light and material specular components.???



The ambient, diffuse, and specular terms are added to find the final color of the fragment.

Now it is time for us to learn the language that will allow us to implement the shading and lighting strategies inside the vertex and fragment shaders. This language is called **ESSL**.


## ESSL--OpenGL ES Shading Language
OpenGL ES Shading Language (ESSL) is the language in which we write our shaders. Its syntax and semantics are very similar to C/C++. However, it has types and built-in functions that make it easier and more intuitive to manipulate vectors and matrices.

> This section is a summary of the official GLSL ES specification. It is a subset of GLSL (OpenGL Shading Language).

### Storage qualifier(存储限定符)
Variable declarations may have a storage qualifier specified in front of the type:

- **attribute**: Linkage between a vertex shader and a WebGL application for per-vertex data. This storage qualifier is only legal inside the vertex shader.
- **uniform**: Value does not change across the object being processed, and uniforms form the linkage between a shader and a WebGL application. Uniforms are legal in both the vertex and fragment shaders. If a uniform is shared by the vertex and fragment shader, the respective declarations need to match.
- **varying**: Linkage between a vertex shader and a fragment shader for interpolated data. By definition, varyings are necessarily shared by the vertex shader and the fragment shader. The declaration of varyings needs to match between the vertex and fragment shaders.
- **const**: a compile-time constant, or a function parameter that is read-only. They can be used anywhere in the code of an ESSL program.

### Types
ESSL provide the following basic types:

- `void`: For functions that do not return a value or for an empty parameter list
- `bool`: A conditional type, taking on values of true or false
- `int`: A signed integer
- `float`: A single floating-point scalar
- `vec2`: A two component floating-point vector
- `vec3`: A three component floating-point vector
- `vec4`: A four component floating-point vector
- `bvec2`: A two component boolean vector
- `bvec3`: A three component boolean vector
- `bvec4`: A four component boolean vector
- `ivec2`: A two component integer vector
- `ivec3`: A three component integer vector
- `ivec4`: A four component integer vector
- `mat2`: A 2*2 floating-point matrix
- `mat3`: A 3*3 floating-point matrix
- `mat4`: A 4*4 floating-point matrix
- `sampler2D`: A handle for accessing a 2D texture
- `samplerCube`: A handle for accessing a cube mapped texture

So an input variable will have one of the four qualifiers followed by one type. For example, we will declare our vFinalColor varying as follows:
```
varying vec4 vFinalColor;
```
This means that the `vFinalColor` variable is a varying vector with four components.

### Vector components
 

### Operators and functions

 According to the specification: the arithmetic binary operators add (+), subtract (-), multiply (*), and divide (/) operate on integer and floating-point typed expressions (including vectors and matrices). The two operands must be the same type, or one can be a scalar float and the other a float vector or matrix, or one can be a scalar integer and the other an integer vector. Additionally, for multiply (*), one can be a vector and the other a matrix with the same dimensional size of the vector. These result in the same fundamental type (integer or float) as the expressions they operate on. 

  If one operand is a scalar and the other is a vector or a matrix, the scalar is applied component-wise to the vector or the matrix, with the final result being of the same type as the vector or the matrix. Dividing by zero does not cause an exception but does result in an unspecified value.
 
 -  -x: The negative of the x vector. It produces the same vector in the exact  opposite direction. 
 -  x+y : Sum of the vectors x and y. They need to have the same number  of components. 
 -  x-y: Subtraction of the vectors x and y. They need to have the same number  of components. 
 -  x*y: If x and y are both vectors, then this operator yields a component-wise multiplication.  Multiply applied to two matrices return a linear algebraic matrix multiplication, not a component-wise multiplication (for it, you must use the `matrixCompMult` function). 
 - x/y: The division operator behaves similarly to the multiply operator. 
 - dot(x,y): Returns the dot product (scalar) of two vectors. They need to have the same dimensions.
 - cross(vec3 x, vec3 y): Returns the cross product (vector) of two vectors. They have to be vec3.
 - `matrixCompMult (mat x, mat y)`: Component-wise multiplication of matrices. They need to have the same dimensions (mat2, mat3, or mat4). 
 - `normalize(x)`: Returns a vector in the same direction but with a length of 1. 
 - `reflect(t, n)`: Reflects the vector t along the vector n. 


There are many more functions including trigonometry and exponential functions. We will refer to those as we need them in the development of the different lighting models.

Let's see now a quick example of the shaders ESSL code for a scene with the following properties:

- **Lambertian reflection model**: We account for the diffuse interaction between one light source and our scene. This means that we will use uniforms to define the light properties, the material properties, and we will follow the *Lambert's Emission Law*  to calculate the final color for every vertex.
- **Goraud shading**: We will interpolate vertex colors to obtain fragment colors and there fore we need one `varying` to pass the vertex color information between shaders.

Let's dissect first what the attributes, uniforms, and varyings will be. 

### Vertex attributes

We start by defining two attributes in the vertex shader. Every vertex will have:
```
attribute vec3 aVertexPosition; 
attribute vec3 aVertexNormal;
```
Right after the attribute keyword, we find the type of the variable. In this case, this is vec3, as each vertex position is determined by three elements (x,y,z). Similarly, the normals are also determined by three elements (x,y,z). Please notice that a position is a point in tridimensional space that tells us where the vertex is, while a normal is a vector that gives us information about the orientation of the surface that passes along that vertex.

Remember that attributes are only available for use inside the vertex shader.

### Uniforms
Uniforms are available to both the vertex shader and the fragment shader. While attributes are different every time the vertex shader is invoked (remember, we process the vertices in parallel, therefore each copy/thread of the vertex shader processes a different vertex). Uniforms are constant throughout a rendering cycle. That is, during a `drawArrays` or `drawElements` WebGL call.

We can use uniforms to pass along information about lights (such as diffuse color and direction), and materials (diffuse color).

For example:
```
    uniform vec3 uLightDirection; // incoming light source direction
    uniform vec4 uLightDiffuse;   //light diffuse component uniform vec4 uMaterialDiffuse; //material diffuse color
```

Again, here teh keyword `uniform` tells us that these variables are uniforms and the ESSL types `vec3` and `vec4` tell us that these variables have three or four components.

### Varyings
We need to carry the vertex color from the vertex shader to the fragment shader:

```
varying vec4 vFinalColor;
```

As previously mentioned in the section *Storage Qualifier*, the declaration of varyings need to match between the vertex and fragment shaders.

Now let's plug the attributes, uniforms, and varyings into the code and see how the vertex shader and fragment shader look like.

### Vertex shader
This is what a vertex shader looks like. On a first look, we identify the attributes, uniforms, and varyings that we will use along with some matrices that we will discuss in a minute. Also we see that the vertex shader has a main function that does not accept parameters and returns void. Inside, we can see some ESSL functions such as normalize and dot and some arithmetical operators.

```
attribute vec3 aVertexPosition; 
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix; 
uniform mat4 uPMatrix; 
uniform mat4 uNMatrix;

uniform vec3 uLightDirection; 
uniform vec4 uLightDiffuse; 
uniform vec4 uMaterialDiffuse;

varying vec4 vFinalColor;

void main(void) {      
    vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));    
    vec3 L = normalize(uLightDirection);        

    float lambertTerm = dot(N,-L);      

    vFinalColor = uMaterialDiffuse * uLightDiffuse * lambertTerm;   
    vFinalColor.a = 1.0;   

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); 
}
```

We can see that there are three 4*4 matrices. **These matrices are required in the vertex shader to calculate the location for vertices and normals whenever we move the camera**. 

There are a couple of operations here that involve using these matrices:

```
vec3 N = vec3(uNmatrix * vec4(aVertexNormal, 1.0));
```

The previous line of code calculates the *transformed normal*.

And:

```
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
```

This line calculates the *transformed vertex position*. `gl_Position` is a special output variable that stores the transformed vertex position.

We will come back to these operations in Chapter 4, Camera.



Going back to the code of the main function, we can clearly see that the Lambertian reflection model is being implemented. The dot product of the normalized normal and light direction vector is obtained and then it is multiplied by the light and material diffuse components. Finally, this result is passed into the `vFinalColor` varying to be used in the fragment shader. Also, as we are calculating the color in the vertex shader and then interpolating the vertex colors for the fragments of every triangle, we are using a Goraud interpolation method.


### Fragment shader

The fragment shader is very simple. The first three lines define the precision of the shader. This is mandatory according to the ESSL specification. Similarly, to the vertex shader, we define our inputs; in this case, just one varying variable and then we have the main function.

```
#ifdef GL_SL
precision highp float;
#endif
varying vec4 vFinalColor;

void main(void){
    gl_FragColor = vFinalColor;
}
```

We just need to assign the `vFinalColor` varying to the output variable gl_FragColor.

Remember that the value of the vFinalColor varying will be different from the one calculated in the vertex shader as WebGL will interpolate it by taking the corresponding calculated colors for the vertices surrounding the correspondent fragment (pixel). ???



## Writing ESSL programs


