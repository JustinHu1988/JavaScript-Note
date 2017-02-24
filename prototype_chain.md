# Inheritance and the prototype chain
JavaScript are prototype-based.

When it comes to inheritance, JavaScript only has one construct: **objects**. 

Each object has an internal link to another object called its prototype. That prototype object has a prototype of its own, and so on until an object is reached with `null` as its prototype. By definition, `null` has no prototype, and acts as the final link in this prototype chain.




