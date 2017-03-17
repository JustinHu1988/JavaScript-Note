# JavaScript: quick overview

## Basic

### Bitwise operators
Bitwise operators treat their operands as a sequence of 32 bits(zeros and ones), rather than as decimal, hexadecimal, or octal numbers.

- `a & b`(And) : Returns a one in each bit position for which the corresponding bits of both operands are ones.
- `a | b`(Or) : Returns a one in each bit position for which the corresponding bits of either or both operands are ones.
- `~ a`(Not) : Inverts the bits of its operand.
- `a ^ b`(Xor) : Returns a one in each bit position for which the corresponding bits of either but not both operands are ones.
- `a << b`(Left shift) : Shifts `a`(numbers) in binary representation `b`(<32) bits to the left, shifting in zeroes from the right.
- `a >> b`(Right shift) : Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off.

### `typeof`
return value:

- Undefined - `"undefined"`
- Null - `"object"`
- Boolean - `"boolean"`
- Number - `"number"`
- String - `"string"`
- Symbol(new in ECMAScript 2015) - `"symbol"`
- Host object(provided by the JS environment) - Implementation-dependent
- Function object(implements [[Call]] in ECMA-262 terms) - `"function"`
- Any other object - `"object"`


### Truthy and falsy
How true and false work in JavaScript:

- undefined : `false`
- null : `false`
- Boolean : true is `true` and false is `false`
- Number :  The result is `false` for `+0`, `-0` or `NaN`; otherwise the result is `true`
- String : The result is `false` if the string is empty(length is 0); otherwise, the result is `true`(length>=1)
- Object : `true`

### Functions of the equals operators (== and ===)

#### How `==` works:

- mnull == undefined; // true
- undefined == null; // true
- Number == String; // x == toNumber(y)
- String == Number; // toNumber(x) == y
- Boolean == AnyType; // toNumber(x) == y
- AnyType == Boolean; // x == toNumber(y)
- String or Number == Object; // x == toPrimitive(y)
- Object == String or Number; // toPrimitive(x) == y

#### `toNumber` method:

- toNumber(undefined) //NaN
- toNumber(null) // +0
- toNumber(Boolean) // If the value is `true`, the result is `1`; if the value is `false`, the result is `+0`.
- toNumber(Number) // This is the value of the number
- toNumber(String) // This parses the string into a number.

