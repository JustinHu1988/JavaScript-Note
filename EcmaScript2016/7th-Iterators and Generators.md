# Iterators and Generators
Many programming languages have shifted from iterating over data with `for` loops, which require initializing variables to track position in a collection, to using iterator objects that programmatically return the next item in a collection. Iterators make working with collections of data easier, and ECMAScript 6 adds iterators to JavaScript. When coupled with new array methods and new types of collections (such as sets and maps), iterators are key for efficient data processing, and you will find them in many parts of the language. There’s a new `for-of` loop that works with iterators, the spread (`...`) operator uses iterators, and iterators even make asynchronous programming easier.

This chapter covers the many uses of iterators, but first, it’s important to understand the history behind why iterators were added to JavaScript.


## The Loop Problem
If you've ever programmed in JavaScript, you've probably written code that looks like this:
```javascript
var colors = ["red", "green", "blue"];
for(var i = 0, len = colors.length; i < len; i++){
    console.log(colors[i]);
}
```
This standard `for` loop tracks the index into the `colors` array with the `i` increments each time the loop executes if `i` isn't larger than the length of the array(stored in `len`).

While this loop is fairly straightforward, loops grow in complexity when you nest them and need to keep track of multiple variables. Additional complexity can lead to errors, and the boilerplate nature of the `for` loop lends itself to more errors as similar code is written in multiple places. Iterators are meant to solve that problem.

## What are Iterators?
Iterators are just objects with a specific interface designed for iteration. All iterator objects have a `next()` method that returns a result object.
The result object has two properties: `value`, which is the next value, and `done`, which is a boolean that’s true when there are no more values to return. The iterator keeps an internal pointer to a location within a collection of values and with each call to the `next()` method, it returns the next appropriate value.

If you call `next()` after the last value has been returned, the method returns `done` as `true` and `value` contains the return value for the iterator. That return value is not part of the data set, but rather a final piece of related data, or `undefined` if no such data exists. An iterator's return value is similar to a function's return value in that it's a final way to pass information to the caller.

With that in mind, creating an iterator using ECMAScript 5 is fairly straightforward:
```javascript
function createInterator(items){
    var i = 0;
    return {
        next: function(){
            var done = (i >= items.length);
            var value = !done ? items[i++] : undefined;
            return {
                done: done,
                value: value
            };
        }
    };
}
var iterator = createIterator([1,2,3]);
console.log(iterator.next());   // "{ value: 1, done: false }"
console.log(iterator.next());   // "{ value: 2, done: false }"
console.log(iterator.next());   // "{ value: 3, done: false }"
console.log(iterator.next());   // "{ value: undefined, done: true }"

// for all further calls
console.log(iterator.next());   // "{ value: undefined, done: true }"
```

The `createIterator()` function returns an object with a `next()` method. Each time the method is called, the next value in the `items` array is returned as `value`. When `i` is 3, `done` becomes `true` and the ternary conditional operator that sets `value` evaluates to `undefined`. These two results fulfill the special last case for iterators in ECMAScript 6, where `next()` is called on an iterator after the last piece of data has been used.

As this example shows, writing iterators that behave according to the rules laid out in ECMAScript 6 is a bit complex.

Fortunately, ECMAScript 6 also provides generators, which make creating iterator objects much simpler.


## What Are Generators?
A *generator* is a function that returns an iterator. Generator functions are indicated by a star character(*) after the `function` keyword and use the new `yield` keyword.
It doesn't matter if the star is directly next to `function` or if there's some whitespace between it and the `\*` character, as in this example:
```javascript
// generator
function *createIterator(){
    yield 1;
    yield 2;
    yield 3;
}
// generators are called like regular functions but return an iterator
let iterator = createIterator();
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2
console.log(iterator.next().value); // 3
```

The `*` before `createIterator()` makes this function a generator. The `yield` keyword, also new to ECMAScript 6, specifies values the resulting iterator should return when `next()` is called, in the order they should be returned. The iterator generated in this example has three different values to return on successive calls to the `next()` method: first `1`, then `2`, and finally `3`. A generator gets called like any other functions, as shown when `iterator` is created.

Perhaps the most interesting aspect of generator functions is that they stop execution after each `yield` statement. For instance, after `yield 1` executes in this code, the function doesn’t execute anything else until the iterator’s `next()` method is called. At that point, `yield 2` executes. This ability to stop execution in the middle of a function is extremely powerful and leads to some interesting uses of generator functions (discussed in the “Advanced Iterator Functionality” section).

The `yield` keyword can be used with any value or expression, so you can write generator functions that add items to iterators without just listing the items one by one. For example, here's one way you could use `yield` inside a `for` loop:
```javascript
function *createInterator(items){
    for (let i = 0; i < items.length; i++){
        yield items[i];
    }
}
let iterator = createIterator([1,2,3]);
console.log(iterator.next());           // "{ value: 1, done: false }"
console.log(iterator.next());           // "{ value: 2, done: false }"
console.log(iterator.next());           // "{ value: 3, done: false }"
console.log(iterator.next());           // "{ value: undefined, done: true }"
// for all further calls
console.log(iterator.next());           // "{ value: undefined, done: true }"
```

This example passes an array called `items` to the `createIterator()` generator function. Inside the function, a `for` loop yields the elements from the array into the iterator as the loop progresses. Each time `yield` is encountered, the loop stops, and each time `next()` is called on `iterator`, the loop picks up with the next `yield` statement.

Generator functions are an important feature of ECMAScript 6, and since they are just functions, they can be used in all the same places. TH e rest of this section focuses on other useful ways to write generators.

> The `yield` keyword can only by used inside of generators. Use of `yield` anywhere else is a syntax error, including functions that are inside of generators, such as:
```javascript
function *createIterator(items){
    items.forEach(function(item){
        //syntax error
        yield item + 1;
    });
}
```
Even though `yield` is technically inside of `createIterator()`, this code is a syntax error because `yield` cannot cross function boundaries. In this way, `yield` is similar to `return`, in that a nested function cannot return a value for its containing function.

### Generator Function Expressions
You can use function expressions to create generators by just including a star(*) character between the `function` keyword and the opening parenthesis. For example:
```javascript
let createIterator = function *(items){
    for (let i = 0; i < items.length; i++){
        yield items[i];
    }
}
let iterator = createIterator([1, 2, 3]);

console.log(iterator.next());           // "{ value: 1, done: false }"
console.log(iterator.next());           // "{ value: 2, done: false }"
console.log(iterator.next());           // "{ value: 3, done: false }"
console.log(iterator.next());           // "{ value: undefined, done: true }"

// for all further calls
console.log(iterator.next());           // "{ value: undefined, done: true }"

```
In this code, `createIterator()` is a generator function expression instead of a function declaration. The asterisk goes between the `function` keyword and the opening parentheses because the function expression is anonymous. Otherwise, this example is the same as the previous version of the `createIterator()` function, which also used a for loop.

> Creating an arrow function that is also a generator is not possible.

### Generator Object Methods
Because generators are just functions, they can be added to objects, too. For example, you can make a generator in an ECMAScript 5-style object literal with a function expression:
```javascript
var o = {

    createIterator: function *(items) {
        for (let i = 0; i < items.length; i++) {
            yield items[i];
        }
    }
};

let iterator = o.createIterator([1, 2, 3]);
```

You can also use the ECMAScript 6 method shorthand by prepending the method name with a star (*):
```javascript
var o = {

    *createIterator(items) {
        for (let i = 0; i < items.length; i++) {
            yield items[i];
        }
    }
};

let iterator = o.createIterator([1, 2, 3]);
```

These examples are functionally equivalent to the example in the “Generator Function Expressions” section; they just use different syntax. In the shorthand version, because the `createIterator()` method is defined with no `function` keyword, the star is placed immediately before the method name, though you can leave whitespace between the star and the method name.

## Iterables and for-of
Closely related to iterators, an *iterable* is an object with a `Symbol.iterator` property. The well-known `Symbol.iterator` symbol specifies a function that returns an iterator for the given object. 

All collection objects (arrays, sets, and maps) and strings are iterables in ECMAScript 6 and so they have a default iterator specified. Iterables are designed to be used with a new addition to ECMAScript: the for-of loop.

>All iterators created by generators are also iterables, as generators assign the `Symbol.iterator` property by default.

At the beginning of this chapter, I mentioned the problem of tracking an index inside a `for` loop. Iterators are the first part of the solution to that problem. The `for-of` loop is the second part: it removes the need to track an index into a collection entirely, leaving you free to focus on working with the contents of the collection.

A `for-of` loop calls `next()` on an iterable each time the loop executes and stores the `value` from the result object in a variable. The loop continues this process until the returned object's `done` property is `true`. Here is an example:
```javascript
let values = [1,2,3];
for(let num of values){
    console.log(num);
}
```
This code outputs the following:
```javascript
1
2
3
```

This `for-of` loop first calls the `Symbol.iterator` method on the `values` array to retrieve an iterator. (The call to `Symbol.iterator` happens behind the scenes in the JavaScript engine itself.) Then `iterator.next()` is called, and the `value` property on the iterator’s result object is read into `num`. The `num` variable is first 1, then 2, and finally 3. When `done` on the result object is `true`, the loop exits, so `num` is never assigned the value of `undefined`.

**If you are simply iterating over values in an array or collection, then it’s a good idea to use a for-of loop instead of a for loop. The for-of loop is generally less error-prone because there are fewer conditions to keep track of. Save the traditional for loop for more complex control conditions.**

> The `for-of` statement will throw an error when used on, a non-iterable object, `null` or `undefined`.

### Accessing the Default Iterator
You can use `Symbol.iterator` to access the default iterator for an object, like this:
```javascript
 let values = [1, 2, 3];
 let iterator = values[Symbol.iterator]();

 console.log(iterator.next());           // "{ value: 1, done: false }"
 console.log(iterator.next());           // "{ value: 2, done: false }"
 console.log(iterator.next());           // "{ value: 3, done: false }"
 console.log(iterator.next());           // "{ value: undefined, done: true }"
```

This code gets the default iterator for `values` and uses that to iterate over the items in the array. This is the same process that happens behind-the-scenes when using a `for-of` loop.

Since `Symbol.iterator` specifies the default iterator, you can use it to detext whether an object is iterable as follows:
```javascript
function isIterable(object){
    return typeof object[Symbol.iterator] === "function";
}
console.log(isIterable("Hello"));       // true
console.log(isIterable(new Map()));     // true
console.log(isIterable(new Set()));     // true
console.log(isIterable(new WeakMap())); // false
console.log(isIterable(new WeakSet())); // false
```

The `isIterable()` function simply checks to see if a default iterator exists on the object and is a function. The `for-of` loop does a similar check before executing.

So far, the examples in this section have shown ways to use `Symbol.iterator` with built-in iterable types, but you can also use the `Symbol.iterator` property to create your own iterables.


### Creating Iterables


























