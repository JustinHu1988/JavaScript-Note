# this

In most cases, the value of `this` is determined by how a function is called. It can't be set by assignment during execution, and it may be different each time the function is called.

ES5 introduced the `bind` method to set the value of a function's `this` regardless of how it's called, and ES6 introduced arrow functions whose `this` is  lexically scoped (it is set to the `this` value of the enclosing execution context).

## Global context
If `this` is used outside of any function, `this` refers to the global object, whether in strict mode or not.
```javascript
console.log(this === window);   // true
console.log(this.document === document);    //true
```

## Function context
Inside a function, the value of `this` depends on how the function is called.

### Simple call
```javascript
// not in strict mode, this === window
function f1(){
    return this;
}
console.log(f1() === window);  // true

// In strict mode, however, the value of this 
// remains at whatever it was set to 
// when entering the execution context
function f2(){
    'use strict';
    return this;
}
console.log(f2() === undefined); //true
```

### `call` and `apply`
A function's `this` value can be bound to a particular object in the call using the `call` or `apply` methods which all functions inherit from `Function.prototype`.

```javascript
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {a: 1, b: 3};

// The first parameter is the object to use as
// 'this', subsequent parameters are passed as 
// arguments in the function call
add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

// The first parameter is the object to use as
// 'this', the second is an array whose
// members are used as the arguments in the function call
add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34

```

Note that with call and apply, if the value passed as this is not an object, an attempt will be made to convert it to an object using the internal ToObject operation. So if the value passed is a primitive like 7 or 'foo', it will be converted to an Object using the related constructor, so the primitive number 7 is converted to an object as if by new Number(7) and the string 'foo' to an object as if by new String('foo'), e.g.
```javascript
function bar(){
    console.log(Object.prototype.toString.call(this));
}
bar.call(7);
```