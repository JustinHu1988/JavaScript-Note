# Introducing JavaScript Classes
Unlike most formal object-oriented programming languages, JavaScript didn’t support classes and classical inheritance as the primary way of defining similar and related objects when it was created. 

While exploring ECMAScript 6 classes, it’s helpful to understand the underlying mechanisms that classes use, so this chapter starts by discussing how ECMAScript 5 developers achieved class-like behavior. As you will see after that, however, ECMAScript 6 classes aren’t exactly the same as classes in other languages. There’s a uniqueness about them that embraces the dynamic nature of JavaScript.

## Class-Like Structures in ECMAScript 5
In ECMAScript 5 and earlier, JavaScript had no classes. The closest equivalent to a class was creating a constructor and then assigning methods to the constructor’s prototype, an approach typically called creating a custom type. For example:
```javascript
function PersonType(name) {
    this.name = name;
}
PersonType.prototype.sayName = function(){
    console.log(this.name);
};
let person = new PersonType("Nicholas");
person.sayName();   // outputs "Nicholas"
console.log(person instanceof PersonType);  // true
console.log(person instanceof Object);  // true
```

This basic pattern underlies a lot of the class-mimicking JavaScript libraries, and that’s where ECMAScript 6 classes start.


## Class Declarations
### A Basic Class Declaration
Class declarations begin with the `class` keyword followed by the name of the class. The rest of the syntax looks similar to concise methods in object literals, without requiring commas between them.
For example:
```javascript
class PersonClass {
    // equivalent of the PersonType constructor
    constructor(name){
        this.name = name;
    }
    // equivalent of PersonType.prototype.sayName
    sayName(){
        console.log(this.name);
    }
}
let person = new PersonClass("Nicholas");
person.sayName(); // "Nicholas"
console.log(person instanceof PersonClass); // true
console.log(person instanceof Object);      // true

console.log(typeof PersonClass);        // "function"
console.log(typeof PersonClass.prototype.sayName)   // "function"
```

Instead of defining a function as the constructor, class declarations allow you to define the constructor directly inside the class with the special `constructor` method name. Since class methods use the concise syntax, there’s no need to use the `function` keyword. 

All other method names have no special meaning, so you can add as many methods as you want.

>Own properties, properties that occur on the instance rather than the prototype, can only be created inside a class constructor or method. In this example, name is an own property. I recommend creating all possible own properties inside the constructor function so a single place in the class is responsible for all of them.

Interestingly, class declarations are just syntactic sugar on top of the existing custom type declarations. The `PersonClass` declaration actually creates a function that has the behavior of the `constructor` method, which is why `typeof PersonClass` gives `"function"` as the result. 

The `sayName()` method also ends up as a method on `PersonClass.prototype` in this example, similar to the relationship between `sayName()` and `PersonType.prototype` in the previous example. These similarities allow you to mix custom types and classes without worrying too much about which you’re using.

### Why to Use the Class Syntax
Despite the similarities between classes and custom types, there are some important differences to keep in mind:

1. Class declarations, unlike function declarations, are not hoisted. Class declarations act like `let` declarations and so doesn't exist in the temporal dead zone until execution reaches the declaration.
2. All code inside of class declarations runs in strict mode automatically. There's no way to opt-out of strict mode inside of classes.
3. All methods are non-enumerable. This is a significant change from custom types, where you need to use `Object.defineProperty()` to make a method non-enumerable.
4. All methods lack an internal `[[Construct]]` method and will throw an error if you try to call then with `new`.
5. Calling the class constructor without `new` throws an error.
6. Attempting to overwrite the class name within a class method throws an error.

**With all of this in mind, the `PersonClass` declaration from the previous example is directly equivalent to the following code, which doesn't use the class syntax**:
```javascript
// direct equivalent of PersonClass
let PersonType2 = (function(){
    "use strict";
    const PersonType2 = function(name){
        // make sure the function was called with new
        if (typeof new.target === "undefined"){
            throw new Error("Constructor must be called with new.");
        }
        this.name = name;
    }
    Object.defineProperty(PersonType2.prototype, "sayName", {
        value: function(){
            // make sure the method wasn't called with new
            if(typeof new.target !== "undefined"){
                throw new Error("Method cannot be called with new.");
            }
        },
        enumerable: false,
        writable: true,
        configurable: true
    });
    return PersonType2;
}());
```
First, notice that there are two `PersonType2` declarations: a `let` declaration in the outer scope and a `const` declaration inside the IIFE. This is how class methods are forbidden from overwriting the class name while code outside the class is allowed to do so. The constructor function checks `new.target` to ensure that it’s being called with `new`; if not, an error is thrown. Next, the `sayName()` method is defined as nonenumerable, and the method checks `new.target` to ensure that it wasn’t called with `new`. The final step returns the constructor function.

This example shows that while it’s possible to do everything classes do without using the new syntax, the class syntax simplifies all of the functionality significantly.

>### Constant Class Names
The name of a class is only specified as if using const inside of the class itself. That means you can overwrite the class name outside of the class but not inside a class method. For example:
```javascript
class Foo {
    constructor(){
        Foo = "bar";    // throws an error when executed
    }
}
// but this is okay after the class declaration
Foo = "baz";
```


## Class Expressions
Classes and functions are similar in that they have two forms: declarations and expressions.

Functions have an expression form that doesn’t require an identifier after function, and similarly, classes have an expression form that doesn’t require an identifier after class. These class expressions are designed to be used in variable declarations or passed into functions as arguments.

### A Basic Class Expression
Here's the class expression equivalent of the previous `PersonClass` examples:
```javascript
let PersonClass = class {
    // equivalent of the PersonType constructor
    constructor(name){
        this.name = name;
    }
    // equivalent of PersonType.prototype.sayName
    sayName(){
        console.log(this.name);
    }
}
let person = new PersonClass("Nicholas");
person.sayName(); // "Nicholas"
console.log(person instanceof PersonClass); // true
console.log(person instanceof Object);      // true

console.log(typeof PersonClass);        // "function"
console.log(typeof PersonClass.prototype.sayName)   // "function"
```
As this example demonstrates, class expressions do not require identifiers after `class`. Aside from the syntax, class expressions are functionally equivalent to class declarations.

**In anonymous class expressions, as in the previous example, `PersonClass.name` is an empty string. When using a class declaration, `PersonClass.name` would be `"PersonClass"`.**

>Whether you use class declarations or class expressions is mostly a matter of style. Unlike function declarations and function expressions, both class declarations and class expressions are not hoisted, and so the choice has little bearing on the runtime behavior of the code.
The only significant difference is that anonymous class expressions have a `name` property that is an empty string while class declarations always have a `name` property equal to the class name (for instance, `PersonClass.name` is `"PersonClass"` when using a class declaration).

### Named Class Expressions
The previous section used an anonymous class expression in the example, but just like function expressions, you can also name class expressions.
To do so, include an identifier after the class keyword like this:
```javascript
let PersonClass = class PersonClass2 {
    // equivalent of the PersonType constructor
    constructor(name) {
            this.name = name;
    }
    
    // equivalent of PersonType.prototype.sayName
    sayName() {
        console.log(this.name);
    }
}
console.log(typeof PersonClass);        // "function"
console.log(typeof PersonClass2);       // "undefined"
```
In this example, the class expression is named PersonClass2. The PersonClass2 identifier exists only within the class definition so that it can be used inside the class methods (such as the sayName() method in this example). Outside the class, typeof PersonClass2 is "undefined" because no PersonClass2 binding exists there. To understand why this is, look at an equivalent declaration that doesn’t use classes:
```javascript
// direct equivalent of PersonClass named class expression
let PersonClass = (function() {

    "use strict";

    const PersonClass2 = function(name) {

        // make sure the function was called with new
        if (typeof new.target === "undefined") {
            throw new Error("Constructor must be called with new.");
        }

        this.name = name;
    }

    Object.defineProperty(PersonClass2.prototype, "sayName", {
        value: function() {

            // make sure the method wasn't called with new
            if (typeof new.target !== "undefined") {
                throw new Error("Method cannot be called with new.");
            }

            console.log(this.name);
        },
        enumerable: false,
        writable: true,
        configurable: true
    });

    return PersonClass2;
}());
```

Creating a named class expression slightly changes what's happening in the JavaScript engine. For class declarations, the outer binding (defined with let) has the same name as the inner binding (defined with const). A named class expression uses its name in the const definition, so PersonClass2 is defined for use only inside the class.

While named class expressions behave differently from named function expressions, there are still a lot of similarities between the two. Both can be used as values, and that opens up a lot of possibilities, which I’ll cover next.


## Classes as First-Class Citizens
In programming, something is said to be a `first-class citizen` when it can be used as a value, meaning it can be passed into a function, returned from a function, and assigned to a variable. JavaScript functions are first-class citizens (sometimes they’re just called first class functions), and that’s part of what makes JavaScript unique.

ECMAScript 6 continues this tradition by making classes first-class citizens as well. That allows classes to be used in a lot of different ways. For example, they can be passed into functions as arguments:
```javascript
function createObject(classDef){
    return new classDef();
}
let obj = createObject(class{
    sayHi(){
        console.log("Hi!");
    }
});
console.log(obj);   // object
obj.sayHi();        // "Hi!"
```
In this example, the createObject() function is called with an anonymous class expression as an argument, creates an instance of that class with new, and returns the instance. The variable obj then stores the returned instance.

Another interesting use of class expressions is creating singletons by immediately invoking the class constructor. To do so, you must use `new` with a class expression and include parentheses at the end. For example:
```javascript
let person = new class {
    constructor(name){
        this.name = name;
    }
    sayName(){
        console.log(this.name);
    }
}("Nicholas");
person.sayName();   // "Nicholas"
```

Here, an anonymous class expression is created and then executed immediately. This pattern allows you to use the class syntax for creating singletons without leaving a class reference available for inspection. (Remember that `PersonClass` only creates a binding inside of the class, not outside.???) The parentheses at the end of the class expression are the indicator that you’re calling a function while also allowing you to pass in an argument.

The examples in this chapter so far have focused on classes with methods. But you can also create accessor properties on classes using a syntax similar to object literals.

## Accessor Properties
While own properties should be created inside class constructors, classes allow you to define accessor properties on the prototype. To create a getter, use the keyword `get` followed by a space, followed by an identifier; to create a setter, do the same using the keyword `set`. For example:
```javascript
class CustomHTMLElement {
    constructor(element){
        this.element = element;
    }
    get html(){
        return this.element.innerHTML;
    }
    set html(value){
        this.element.innerHTML = value;
    }
}
var descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype,"html"); //Both getter and setter functions must be retrieved using Object.getOwnPropertyDescriptor()
console.log("get" in descriptor);   // true
console.log("set" in descriptor);   // true
console.log(descriptor.enumerable); // false
```

In this code, the CustomHTMLElement class is made as a wrapper around an existing DOM element. It has both a getter and setter for html that delegates to the innerHTML method on the element itself. This accessor property is created on the CustomHTMLElement.prototype and, just like any other method would be, is created as non-enumerable. The equivalent non-class representation is:

```javascript
// direct equivalent to previous example
let CustomHTMLElement = (function() {
    "use strict";
    const CustomHTMLElement = function(element){
        //make sure the function was called with new
        if(typeof new.target === "undefined"){
            throw new Error("Constructor must be called with new.");
        }
        this.element = element;
    }
    Object.defineProperty(CustomHTMLElement.prototype, "html", {
        enumerable: false,
        configurable: true,
        get: function(){
            return this.element.innerHTML;
        },
        set: function(value){
            this.element.innerHTML = value;
        }
    });
}());
```
As with previous examples, this one shows just how much code you can save by using a class instead of the non-class equivalent. The html accessor property definition alone is almost the size of the equivalent class declaration.


## Computed Member Names
The similarities between object literals and classes aren’t quite over yet. Class methods and accessor properties can also have computed names. Instead of using an identifier, use square brackets around an expression, which is the same syntax used for object literal computed names. For example:
```javascript
let methodName = "sayName";
class PersonClass {
    constructor(name){
        this.name = name;
    }
    [methodName](){
        console.log(this.name);
    }
}
let me = new PersonClass("Nicholas");
me.sayName();   // "Nicholas"
me[methodName]();   // "Nicholas"
```
This version of PersonClass uses a variable to assign a name to a method inside its definition. The string "sayName" is assigned to the methodName variable, and then methodName is used to declare the method. The sayName() method is later accessed directly.

Accessor properties can use computed names in the same way, like this:
```javascript
let propertyName = "html";

class CustomHTMLElement {

    constructor(element) {
        this.element = element;
    }

    get [propertyName]() {
        return this.element.innerHTML;
    }

    set [propertyName](value) {
        this.element.innerHTML = value;
    }
}
```
Here, the getter and setter for html are set using the `propertyName` variable. Accessing the property by using .html only affects the definition.

You’ve seen that there are a lot of similarities between classes and object literals, with methods, accessor properties, and computed names. There’s just one more similarity to cover: generators.

## Generator Methods
When Chapter 8 introduced generators, you learned how to define a generator on an object literal by prepending a star (`*`) to the method name. The same syntax works for classes as well, allowing any method to be a generator. Here’s an example:
```javascript
class MyClass {
    *createIterator(){
        yield 1;
        yield 2;
        yield 3;
    }
}
let instance = new MyClass();
let iterator = instance.createIterator();
```
This code creates a class called `MyClass` with a `createIterator()` generator method. The method returns an iterator whose values are hardcoded into the generator. Generator methods are useful when you have an object that represents a collection of values and you’d like to iterate over those values easily. Arrays, sets, and maps all have multiple generator methods to account for the different ways developers need to interact with their items.

While generator methods are useful, defining a default iterator for your class is much more helpful if the class represents a collection of values. You can define the default iterator for a class by using `Symbol.iterator` to define a generator method, such as:

```javascript
class Collection {
    constructor(){
        this.items = [];
    }
    *[Symbol.iterator](){
        for (let item of this.items){
            yield item;
        }
    }
}
var collection = new Collection();
collection.items.push(1);
collection.items.push(2);
collection.items.push(3);
for(let x of collection){
    console.log(x);
}
```
This example uses a computed name for a generator method that delegates to the `values()` iterator of the `this.items` array. Any class that manages a collection of values should include a default iterator because some collection-specific operations require collections they operate on to have an iterator. Now, any instance of `Collection` can be used directly in a `for-of` loop or with the spread operator.

Adding methods and accessor properties to a class prototype is useful when you want those to show up on object instances. If, on the other hand, you’d like methods or accessor properties on the class itself, then you’ll need to use static members.

## Static Members
Adding additional methods directly onto constructors to simulate static members is another common pattern in ECMAScript 5 and earlier. For example:
```javascript
function PersonType(name){
    this.name = name;
}
// static method
PersonType.create = function(name){
    return new PersonType(name);
};
// instance method
PersonType.prototype.sayName = function(){
    console.log(this.name);
};
var person = PersonType.create("Nicholas");
```

In other programming languages, the factory method called `PersonType.create()` would be considered a static method, as it doesn’t depend on an instance of PersonType for its data. ECMAScript 6 classes simplify the creation of static members by using the formal `static` annotation before the method or accessor property name. For instance, here’s the class equivalent of the last example:
```javascript
class PersonClass {
    // equivalent of the PersonType constructor
    constructor(name){
        this.name = name;
    }
    // equivalent of PersonType.prototype.sayName
    sayName(){
        console.log(this.name);
    }
    // equivalent of PersonType.create
    static create(name){
        return new PersonClass(name);
    }
}
let person = PersonClass.create("Nicholas");
```
The `PersonClass` definition has a single static method called `create()`. The method syntax is the same used for `sayName()` except for the `static` keyword. You can use the `static` keyword on any method or accessor property definition within a class. The only restriction is that you can't use `static` with the `constructor` method definition.

>Static members are not accessible from instances. You must always access static members from the class directly.


## Inheritance with Derived Classes
**Prior to ECMAScript 6, implementing inheritance with custom types was an extensive process. Proper inheritance required multiple steps. For instance, consider this example**:
```javascript
function Rectangle(length, width){
    this.length = length;
    this.width = width;
}
Rectangle.prototype.getArea = function(){
    return this.length * this.width;
};
function Square(length){
    Rectangle.call(this, length, length);
}
Square.prototype = Object.create(Rectangle.prototype, {
    constructor:{
        value:Square,
        enumerable: true,
        writable: true,
        configurable: true
    }
});
var square = new Square(3);
console.log(square.getArea());      // 9
console.log(square instanceof Square);  // true
console.log(square instanceof Rectangle);   // true
```

`Square` inherits from `Rectangle`, and to do so, it must overwrite `Square.prototype` with a new object created from `Rectangle.prototype` as well as call the `Rectangle.call()` method. These steps often confused JavaScript newcomers and were a source of errors for experienced developers.

**Classes make inheritance easier to implement by using the familiar `extends` keyword to specify the function from which the class should inherit.**

The prototypes are automatically adjusted, and you can access the base class constructor by calling the super() method. Here’s the ECMAScript 6 equivalent of the previous example:
```javascript
class Rectangle{
    constructor(length, width){
        this.length = length;
        this.width = width;
    }
    getArea(){
        return this.length * this.width;
    }
}
class Square extends Rectangle {
    constructor(length){
        // same as Rectangle.call(this, length, length)
        super(length,length);
    }
}
var square = new Square(3);
console.log(square.getArea());              // 9
console.log(square instanceof Square);      // true
console.log(square instanceof Rectangle);   // true
```















