# Note for ECMAScript 6
## Block Bindings

### Hoisting
Variable declarations using `var` are hoisted to the top of the function (or global scope, if declared outside of a function).

### Block-level Declarations
Block-level declarations are those that declare variables that inaccessible outside of a given block scope.
Block scopes are created:

1. Inside of a function
2. Inside of a block (indicated by the `{` and `}` characters)

### Let Declarations
You can basically replace `var` with `let` to declare a variable, but limit the variable's scope to only the current code block.
Since `let` declarations are not hoisted to the top of the enclosing block, you may want to always place `let` declarations first in the block, so that they are available to the entire block.

### No Redeclaration

If an identifier has already been defined in a scope, then using identifer in a `let` declaration inside that scope causes an error to be thrown.
For example:
```javascript
    var count = 30;
    
    //Syntax error
    let count = 40;
```

On the other hand, no error is thrown if a `let` declaration creates a new variable with the same name as a variable in its containing scope:

```javascript
    var count = 30;
    //Does not throw an error
    if (condition){
        let count = 40;
    }
```

### Constant Declarations
Variables declared using `const` are considered constants.
Every `const` variable nust be initialized on declaration.

```javascript
    //Valid constant
    const maxItems = 30;
    
    //Syntax error: missing initialization
    const name;
```

In similarity to let, a `const` declaration throws an error when made with an identifier for an already-defined variable in the same scope. It doesn't matter if that variable was declared using `var`, `let` or `const`.

There is one big **defference** between `let` and `const` to remember: Attempting to assign a `const` to a previously defined constant will throw an error, in both strict and non-strict modes:

```Javascript
    const maxItems = 5;
    maxItems = 6; // throws error
```

Constants variable can't be assigned a new value later on.

However, unlike constants in other languages, the value a constant holds may be modified if it is an object.

#### Declaring Objects with Const
A `const` declaration prevents modification of the binding and not of the value itself. That means `const` declarations for objects do not prevent modification of those objects. For example:

```Javascript
    const person = {
        name:"Nicholas"
    };
    
    //works
    person.name = "Greg";
    
    //throws an error
    person = {
        name:"Greg"
    };
```

### The Temporal Dead Zone(TDZ)
A variable declared with either `let` or `const` cannot be accessed until after the declaration. Attempting to do so results in a reference error, even when using normally safe operations such as the `typeof` operation in this example:

```javascript
    if(condition){
        console.log(typeof value);  //ReferenceError!
        let value = "blue";
    }
```

Here, this statement is never executed because the previous line throws an error.
>if you never declare the `value` variable, `typeof` won't throw an error, but will return `undefined`. (So, you can use `typeof` on a variable outside of the block where that variable is declared, though it may not give the results you're after.)

```javascript
    console.log(typeof value); //"undefined"
    if (condition){
        let value = "blue";
    }
```

When a javascript engine looks through an upcoming block and finds a variable declaration, it either hoists the declaration to the top of the function or global scope(for `var`) or places the declaration in the TDZ(for `let` and `const`). Any attempt to access a variable in the TDZ results in a runtime error.
In the last example, the variable `value` isn't in the TDZ when the `typeof` operation executes because it occurs outside of the block in which `value` is declared.

The TDZ is just one unique aspect of block bindings. Another unique aspect has to do with their use inside of loops.

### Block Binding in Loops

```javascript
    for(let i=0; i<10; i++){
        process(items[i]);
    }
    //i is not accessible here - throws an error
    console.log(i);
```

### Functions in Loops
The characteristics of `var` have long made creating functions inside of loops problematic, because the loop variables are accessible from outside the scope of the loop.
```javascript
    var funcs = [];
    
    for(var i=0; i<10; i++){
        funcs.push(function(){console.log(i);});
    }
    funcs.forEach(function(func){
        func();  //outputs the number "10" ten times
    });
    
```
`i` is shared across each iteration of the loop, meaning the functions created inside the loop all hold a reference to the same variable. The variable `i` has a value of `10` once the loop completes, and so when `console.log(i)` is called, that value print each time.

To fix this problem, developers use **immediately-invoked function expressions(IIFEs)** inside of loops to force a new copy of the variable they want to iterate over to be created:

```javascript
    var funcs = [];
    for (var i=0; i<10; i++){
        funcs.push((function(value){
           return function(){console.log(value);} 
        })(i));
    }
```

Block-level binding with `let` and `const` in ECMAScript 6 can simplify this loop for you.

### Let Declarations in Loops
A `let` declaration simplifies loops by effectively mimicking what the IIFE does in the previous example. On each iteration, the loop creates a new variable and initializes it to the value of the variable with the same name from the previous iteration. That means you can omit the IIFE altogether and get the results you expect:

```javascript
    var funcs = [];
    for(let i=0; i<10; i++){
        funcs.push(function(){
            console.log(i);
        });
    }
    
    funcs.forEach(function(func){
        func();  //outputs 0, then 1, then 2, up to 9
    });
```

The same is true for `for-in` and `for-of` loops, as shown here:

```javascript
    var funcs = [],
        object = {
            a:true,
            b:true,
            c:true
        };
    
    for(let key in object){
        funcs.push(function(){
            console.log(key);
        });
    }
    
    funcs.forEach(function(func){
        func();  //outputs "a", then "b", then "c"
    });
```

In this example, the `for-in` loop shows the same behavior as the `for` loop. Each time through the loop, a new `key` binding is created, and so each function has its own copy of the `key` variable. The result is that each function outputs a different value. If `var` were used to declare `key`, all functions would output `"c"`.

>It's important to understand that the behavior of `let` declarations in loops is a specially-defined behavior in the specification and is not necessarily related to the non-hoisting characteristics of `let`. In fact, early implementations of `let` did not have this behavior, as it was added later on in the process.

### Constant Declarations in Loops
The ECMAScript 6 specification doesn't explicitly disallow `const` declarations in loops; however, there are different behaviors based on the type of loop you're using. 

For a normal `for` loop, you can use `const` in the initializer, but the loop will throw a warning if you attempt to change the value. For example:

```javascript
    var funcs = [];
    //throws an error after on iteration
    for(const i=0; i<10; i++){
        funcs.push(function(){
            console.log(i);
        });
    }
```
In this code, the `i` variable is declared as a constant. The first iteration of the loop, where `i` is 0, executes successfully. An error is thrown when `i++` executes because it's attempting to modify a constant. As such, you can only use `const` to declare a variable in the loop initializer if you are not modifying that variable.

When used in a `for-in` or `for-of` loop, on the other hand, a `const` variable behaves the same as a `let` variable. So the following should not cause an error:

```javascript
    var funcs = [],
        object = {
            a: true,
            b: true,
            c: true
        };
    
    //doesn't cause an error
    for(const key in object){
        funcs.push(function(){
            console.log(key);
        });
    }
    
    funcs.forEach(function(func){
        func();  //outputs "a", then "b", then "c"
    });
```
This code functions almost exactly the same as the second example in the "Let Declarations in Loops" section. The only difference is that the value of `key` cannot be changed inside the loop.

The `for-in` and `for-of` loops work with `const` because the loop initializer creates a new binding on each iteration through the loop rather than attempting to modify the value of an existing binding.


### Global Block Bindings
Another way in which `let` and `const` are different from `var` is in their global scope behavior.

When `var` is used in the global scope, it creates a new global variable, which is a property on the global object(`window` in browsers). That means you can accidentally overwrite an existing global using var, such as:

```javascript
    //in a browser
    var RagExp = "Hello!";
    console.log(window.RegExp); //"Hello!"
    var ncz = "Hi!";
    console.log(window.ncz); //"Hi!"
```

Even though the `RegExp` global is defined on `window`, it is not safe from being overwritten by a `var` declaration.

If you instead use `let` or `const` in the global scope, a new binding is created in the global scope but no property is added to the global object. That also means you cannot overwrite a global variable using `let` or `const`, you can only shadow it.

```javascript
   //in a browser
   let RegExp = "Hello!"; //"Hello!"
   console.log(window.RegExp === RegExp); //false
   
   const ncz = "Hi!"; 
   console.log(ncz); //"Hi!"
   console.log("ncz" in window) //false
```

In this example, `window.RegExp` and `RegExp` are not the same.
This capability makes `let` and `const` a lot safer to use in the global scope when you don't want to create properties on the global object.


> You may still want to use `var` in the global scope if you have a code that should be available from the global object. (This is most common in a browser when you want to access code across frames or windows).


### Emerging Best Practices for Block Bindings
While ECMAScript 6 was in development, there was widespread belief you should use `let` by default instead of `var` for variable declarations. In this case, you would use `const` for variables that needed modification protection.

However, now an alternate approach gained popularity: use `const` by default and only use `let` when you know a variable's value needs to change. The rationale is that most variables should not change their value after initialization because unexpected value changes are a source of bugs.


### Summary
The `let` and `const` block bindings introduce lexical scoping to JavaScript. These declarations are not hoisted and only exist within the block in which they are declared. This offers behavior that is more like other languages and less likely to cause unintentional errors, as variables can now be declared exactly where they are needed. As a side effect, you cannot access variables before they are declared, even with safe operators such as `typeof`. Attempting to access a block binding before its declaration results in an error due to the binding's presence in the temporal dead zone.

In many cases, `let` and `const` behave in a manner similar to `var`; however, this is not true for loops. For both `let` and `const`, `for-in` and `for-of` loops create a new binding with each iteration through the loop. That means functions created inside the loop body can access the loop bindings values as they are during the current iteration, rather than as they were after the loop's final iteration(the behavior with `var`). The same is true for `let` declarations in `for` loops, while attempting to use `const` declarations in a `for` loop may result in an error.
 
 The current best practice for block bindings is to use `const` by default and only use `let` when you know a variable's value needs to change. This ensures a basic level of immutability in code that can help prevent certain types of errors.














