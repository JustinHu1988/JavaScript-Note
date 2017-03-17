>Note for ECMAScript 6

# Strings and Regular Expressions

String are arguably one of the most important data types in programming.
By extension, regular expressions are important because of the extra power they give developers to wield on strings.
The creators of ECMAScript 6 improved strings and regular expressions by adding new capabilities and long-missing functionality.

## Better Unicode Support
Before ECMAScript 6, JavaScript strings revolved around 16-bit character encoding(UTF-16). Each 16-bit sequence is a code unit representing a character. All string properties and methods, like the `length` property and the `charAt()` method, were based on these 16-bit code units. Of course, 16 bits used to be enough to contain any character. That's no longer true thanks to the expanded character set introduced by Unicode.

### UTF-16 Code Points
Limiting character length to 16 bits wasn't possible for Unicode's stated goal og providing a globally unique identifier to every character in the world. These globally unique identifiers, Called *code points*, are simply numbers starting at 0. Code points are what you may think of as character codes, where a number represents a character. 

The first 2<sup>16</sup> code points in UTF-16 are represented as single 16-bit code units. This range is called the *Basic Multilingual Plane(BMP)*. Everything beyond that is considered to be in one of the *supplementary planes*, where the code points can no longer be represented in just 16-bits. UTF-16 solves this problem by introducing surrogate pairs in which a single code point is represented by two 16-bit code units. That means any single character in a string can be either on code unit for BMP characters, giving a total of 16 bits, or two units for supplementary plane characters, giving a total of 32 bits.

In ECMAScript 5, all string operations work on 16-bit code units, meaning that you can get unexpected results from UTF-16 encoded strings containing surrogate pairs, as in this example:

```javascript
    var text = "𠮷";
    
    console.log(text.length);           // 2
    console.log(/^.$/.test(text));      // false
    console.log(text.charAt(0));        // ""
    console.log(text.charAt(1));        // ""
    console.log(text.charCodeAt(0));    // 55362
    console.log(text.charCodeAt(1));    // 57271
```

The single Unicode character `"𠮷"` is represented using surrogate pairs, and as such, the JavaScript string operations above treat the string as having two 16-bit characters. That means:

- The `length` of `text` is 2, when it should be 1.
- A regular expression trying to match a single character fails because it thinks there are two characters.
- The `charAt()` method is unable to return a valid character string, because neither set of 16 bits corresponds to a printable character.

The `charCodeAt()` method also just can't identify the character properly. It returns the appropriate 16-bit number for each code unit, but that is the closest you could get to the real value of `text` in ECMAScript 5.

ECMAScript 6, on the other hand, enforces UTF-16 string encoding to address problems like these. Standardizing string operations based on this character encoding means that JavaScript can support functionality designed to work specifically with surrogate pairs. The rest of this section discusses a few key examples of that functionality.

### The codePointAt() Method
One method ECMAScript 6 added to fully support UTF-16 is the `codePointAt()` method, which retrieves the Unicode code point that maps to a given position in a string. This method accepts the code unit position rather than the character position and returns an interger value, as these `console.log()` examples show:

```javascript
    var text = "𠮷a";

    console.log(text.charCodeAt(0));    // 55362
    console.log(text.charCodeAt(1));    // 57271
    console.log(text.charCodeAt(2));    // 97

    console.log(text.codePointAt(0));   // 134071
    console.log(text.codePointAt(1));   // 57271
    console.log(text.codePointAt(2));   // 97
```

The `codePointAt()` method returns the same value as the `charCodeAt()` method unless it operates on non-BMP characters.
The first character in `text` is non-BMP and is therefore comprised of two code units, meaning the `length` property is 3 rather than 2. The `charCodeAt()` method returns only the first code unit for position 0, but `codePointAt()` returns the full code point even though the code point spans multiple code units. Both methods return the same value for positions 1(the second code unit of the first character) and 2(the `"a"` character).

Calling the `codePointAt()` method on a character is the easiest way to determine if that character is represented by one or two code units. Here's a function you could write to check:

```javascript
    function is32Bit(c){
        return c.codePointAt(0) > 0xFFFF;
    }
    console.log(is32Bit("𠮷"));   //true
    console.log(is32Bit("a"));   //false
```

The upper bound of 16-bit characters is represented in hexadecimal as `FFFF`, so any code point above that number must be represented by two code units, for a total of 32 bits.


### The String.fromCodePoint() Method
When ECMAScript provides a way to do something, it also tends to provide a way to do the reverse. You can use `codePointAt()` to retrieve the code point for a character in a string, while `String.fromCodePoint()` produces a single-character string from a given code point. For example:

```javascript
    console.log(String.fromCodePoint(134071)); // "𠮷"
```

Think of `String.fromCodePoint()` as a more complete version of the `String.fromCharCode()` method. Both give the same result for all characters in the BMP. There's only a difference when you pass code points for characters outside of the BMP.


### The normalize() Method  //???
Another interesting aspect of Unicode is that different characters may be considered equivalent for the purpose of sorting or other comparison-based operations.

There are two ways to define these relationships:

- First, **canonical equivalence** means that two sequences of code points are considered interchangeable in all respects. For example, a combination of two characters can be canonically equivalent to one character.
- The second relationship is **compatibility**. Two compatible sequences of code points look different but can be used interchangeably in certain situations.

Due to these relationships, two strings representing fundamentally the same text can contain different code point sequences. For example, the character "æ" and the two-character string "ae" may be used interchangeably but are strictly not equivalent unless normalized in some way.

ECMAScript 6 supports Unicode normalization forms by giving strings a `normalize()` method. This method optionally accepts a single string parameter indicating one of the following Unicode normalization forms to apply:

- Normalization Form Canonical Composition (`"NFC"`), which is the default
- Normalization Form Canonical Decomposition (`"NFD"`)
- Normalization Form Compatibility Composition (`"NFKC"`)
- Normalization Form Compatibility Decomposition (`"NFKD"`)

```javascript
    var normalized = values.map(function(text) {
        return text.normalize();
    });

    normalized.sort(function(first, second) {
        if (first < second) {
            return -1;
        } else if (first === second) {
            return 0;
        } else {
            return 1;
        }
    });
```

This code converts the strings in the `values` array into a normalized form so that the array can be sorted appropriately. You can also sort the original array by calling `normalize()` as part of the comparator, as follows:

```javascript
    values.sort(function(first, second) {
        var firstNormalized = first.normalize(),
            secondNormalized = second.normalize();

        if (firstNormalized < secondNormalized) {
            return -1;
        } else if (firstNormalized === secondNormalized) {
            return 0;
        } else {
            return 1;
        }
    });
```


Once again, the most important thing to note about this code is that both `first` and `second` are normalized in the same way. These examples have used the default, NFC, but you can just as easily one of the others, like this:

```javascript
    values.sort(function(first, second) {
        var firstNormalized = first.normalize("NFD"),
            secondNormalized = second.normalize("NFD");

        if (firstNormalized < secondNormalized) {
            return -1;
        } else if (firstNormalized === secondNormalized) {
            return 0;
        } else {
            return 1;
        }
    });
```

If you work on internationalized application, you'll find the `normalize()` method helpful.



### The Regular Expression u Flag

You can accomplish any common string operations through regular expressions. But remember, regular expressions assume 16-bit code units, where each represents a single character. To address this problem, ECMAScript 6 defines a `u` flag for regular expressions, which stands for Unicode.

#### The u Flag in Action \\***
When a regular expression has the `u` flag set, it switches modes to work on characters, not code units. That means the regular expression should no longer get confused about surrogate pairs in strings and should behave as expected.
For example, consider this code:

```javascript
    var text = "𠮷";

    console.log(text.length);           // 2
    console.log(/^.$/.test(text));      // false
    console.log(/^.$/u.test(text));     // true
```

The regular expression `/^.$/` matches any input string with a single character. When used without the `u` flag, this regular expression matches on code units, and so the Japanese character(which is represented by two code units) doesn't match this regular expression. When used with the `u` flag, the regular expression compares characters instead of code units and so the Japanese character matches.


#### Counting Code Points
Unfortunately, ECMAScript 6 doesn't add a method to determine how many code points a string has, but with the `u` flag, you can use regular expressions to figure it out as follows:

```javascript
    function codePointLength(text) {
        var result = text.match(/[\s\S]/gu);
        return result ? result.length : 0;
    }

    console.log(codePointLength("abc"));    // 3
    console.log(codePointLength("𠮷bc"));   // 3
```

This example calls `match()` to check `text` for both whitespace and non-whitespace characters( using [\s\S] to ensure the pattern matches newlines), using a regular expression that is applied globally with Unicode enabled. The `result` contains an array of matches when there's at least one match, so the array length is the number of code points in the string. In Unicode, the strings `"abc"` and `"𠮷bc"` both have three characters, so the array length is three.

> Although this approach works, it's not very fast, especially when applied to long strings. You can use a string iterator (in Chapter 8) as well. In general, try to minimize coounting code points whenever possible.


#### Determining Support for the u Flag //???
Since the `u` flag is a syntax change, attempting to use it in JavaScript engines that aren't compatiable with ECMAScript 6 throws a syntax error. The safest way to determine if the `u` flag is supported is with a function, like this one:

```javascript
    function hasRegExpU() {
        try {
            var pattern = new RegExp(".", "u");
            return true;
        } catch (ex) {
            return false;
        }
    }
```

This function uses the `RegExp` constructor to pass in the `u` flag as an argument. This syntax is valid even in older JavaScript engines, but the constructor will throw an error if `u` isn't supported.


>If your code still needs to work in older JavaScript engines, always use the `RegExp` constructor when using the `u` flag. This will prevent syntax errors and allow you to optionally detect and use the `u` flag with out aborting execution.


## Other String Changes
JavaScript strings have always lagged behind similar features of other languages.

### Methods for Identifying Substrings

Developers have used the `indexof()` method to identify strings inside other strings since JavaScript was first introduced. ECMAScript 6 includes the following three methods, which are designed to do just that:

- The `includes()` method returns true if the given text is found anywhere within the string. It returns false if not.
- The `startsWith()` method returns true if the given text is found at the beginning of the string. It returns false if not.
- The `endsWith()` method returns true if the given text is found at the end of the string. It returns false if not.

Each methods accept two argument: the text to search for and an optional index from which to start the search. When teh second argument is provided, `includes()` and `startsWith()` start the match from that index while `endsWith()` starts the match from the length of the string minus the second argument; when the second argument is omitted, `includes()` and `startsWith()` search from the beginning of the string, while `endWith()` starts from the end. In effect, the second argument minimizes the amount of the string being searched. Here are some examples showing these three methods in action:

```javascript
    var msg = "Hello world!";

    console.log(msg.startsWith("Hello")); //true
    console.log(msg.endsWith("!"));  //true
    console.log(msg.includes("o"));  //true

    console.log(msg.startsWith("o")); //false
    console.log(msg.endsWith("world!")); //true
    console.log(msg.includes("x")); //false

    console.log(msg.startsWith("o", 4)); //true
    console.log(msg.endsWith("o", 8)); //true
    console.log(msg.includes("o", 8)); //false
```

While these three methods make identifying the existence of substrings easier, each only returns a boolean value. If you need to find the actual position of one string within another, use the `indexOf()` or `lastIndexOf()` methods.

> The `startsWith()`, `endWith()`, and `includes` methods will throw an error if you pass a regular expression instead of a string. This stands in contrast to `indexOf()` and `lastIndexOf()`, which both convert a regular expression argument into a string and then search for that string.


### The repeat() Method
ECMAScript 6 also adds a `repeat()` method to strings, which accepts the number of times to repeat the string as an argument. It returns a new string containing the original string repeated teh specified number of times. For example:

```javascript
    console.log("x".repeat(3));  //"xxx"
    console.log("hello".repeat(2)); //"hellohello"
    console.log("abc".repeat(4));  //"abcabcabcabc"
```

This method is a convenience function above all else, and it can be especially useful when manipulating text. It's particularly useful in code formatting utilities that need to create indentation levels, like this:

```javascript
    // indent using a specified number of spaces
    var indent = " ".repeat(4),
        indentLevel = 0;

    // whenever you increase the indent
    var newIndent = indent.repeat(++indentLevel);
```

ECMAScript 6 also makes some useful changes to refular expression functionality that don't fit into a particular category. The next section highlights a few.

## Other Regular Expression Changes
### The Regular Expression y Flag

ECMAScript 6 standardized the `y` flag after it was implemented in Firefox as a proprietary extension to regular expressions. The `y` flag affects a regular expression search's `sticky` property, and it tells the search to start matching characters in a string at the position specified by the regular expression's `lastIndex` property. If there is no match at that location, then the regular expression stops matching. To see how this works, consider the following code:

```javascript
    var text = "hello1 hello2 hello3",
        pattern = /hello\d\s?/,
        result = pattern.exec(text),
        globalPattern = /hello\d\s?/g,
        globalResult = globalPattern.exec(text),
        stickyPattern = /hello\d\s?/y,
        stickyResult = stickyPattern.exec(text);

    console.log(result[0]);  //"hello1 "
    console.log(globalResult[0]);  //"hello1 "
    console.log(stickResult[0]);  //"hello1 "

    pattern.lastIndex = 1;
    globalPattern.lastIndex = 1;
    stickyPattern.lastIndex = 1;

    result = pattern.exec(text);
    globalResult = globalPattern.exec(text);
    stickyResult = stickyPattern.exec(text);

    console.log(result[0]);  //"hello1 "
    console.log(globalResult[0]);  //"hello2 "
    console.log(stickyResult[0]);  //Error! stickyResult is null
```

This example has three regular expressions. The expression in `pattern` has no flags. the one in `globalPattern` uses the `g` flag, and the one in `stickyPattern` uses the `y` flag. In the first trio of `console.log()` calls, all three regular expressions should return `"hello1"` with a space at the end.

After that, the `lastIndex` property is changed to 1 on all three patterns, meaning that the regular expression should start matching from the second character on all of them. The regular expression with no flags completely ignores the change to `lastIndex` and still matches `hello1 ` without incident. The regular expression with the `g` flag goes on to match `"hello2 "` because it is searching forward from the second character of the string (`"e"`). The sticky regular expression doesn't match anything beginning at the second character so `stickyResult` is `null`.

The sticky flag saves the index of the next character after the last match in `lastIndex` whenever an operation is performed. If an operation results in no match, then `lastIndex` is set back to 0. The global flag behaves the same way, as demonstrated here:


There are two more subtle details about the sticky flag to keep in mind:

1. The `lastIndex` property is only honored when calling methods that exist on the regular expression object, like the `exec()` and `test()` methods. Passing the regular expression to a string method, such as `match()`, will not result in the sticky behavior.
2. When using the `^` character to match the start of a string, sticky regular expressions only match from the start of the string(or the start of the line in multiline mode). While `lastIndex` is 0, the `^` makes a sticky regular expression no different from a non-sticky one. If `lastIndex` doesn't correspond to the beginning of the string in single-line mode or the beginning of a line in multiline mode, the sticky regular expression will never match.

As with other regular expression flags, you can detect the presence of `y` by using a property. In this case, you'd check the `sticky` property, as follows:

```javascript
    var pattern = /hello\d/y;
    console.log(pattern.sticky);  //true
```

The `sticky` property is set to true if the sticky flag is present, and the property is false if not. The `sticky` property is read-only based on the presence of the flag and cannot be changed in code.

Similar to the `u` flag, the `y` flag is a syntax change, so it will cause a syntax error in older JavaScript engines. You can use the following approach to detect support:

```javascript
function hasRegExpY(){
    try{
        var pattern = new RegExp(".", "y");
        return true;
    } catch (ex){
        return false;
    }
}
```

Just like the `u` check, this returns false if it's unable to create a regular expression with the `y` flag. In one final similarity to `u`, if you need to use `y` in code that runs in older JavaScript engines, be sure to use the `RegExp` constructor when defining those regular expressions to avoid a syntax error.

### Duplicating Regular Expressions
In ECMAScript 5, you can duplicate regular expressions by passing them into the `RegExp` constructor like this:
```javascript
    var re1 = /ab/i,
        re2 = new RegExp(re1);
```

The `re2` variable is just a copy of the `re1` variable. But if you provide the second argument to the `RegExp` constructor, which specifies the flags for the regular expression, your code won't work, as in this example:

```javascript
    var re1 = /ab/i,

        // throws an error in ES5, okay in ES6
        re2 = new RegExp(re1, "g");
```

If you execute this code in an ECMAScript 5 environment, you'll get an error stating that the second argument cannot be used when the first argument is a regular expression. ECMAScript 6 changed this behavior such that the second argument is allowed and overrides any flags present on the first argument. For example:

```javascript
    var re1 = /ab/i,
    // throws an error in ES5, okay in ES6
    re2 = new REGeXP(re1, "g");

    console.log(re1.toString());  //"/ab/i"
    console.log(re2.toString());  //"/ab/g"

    console.log(re1.test("ab"));  //true
    console.log(re2.test("ab"));  //true

    console.log(re1.test("AB"));  //true
    console.log(re2.test("AB"));  //false
```

In this code, `re1` has the case-insensitive `i` flag while `re2` has only the global `g` flag. The `RegExp` constructor duplicated the pattern from `re1` and substituted the `g` flag for the `i` flag. Without the second argument, `re2` would have the same flags as `re1`.

### The flags Property
Along with adding a new flag and changing how you can work with flags, ECMAScript 6 added a property associated with them. In ECMAScript 5, you could get the text of a regular expression by using the `source` property, but to get the flag string, you'd have to parse the output of the `toString()` method as shown below:

```javascript
    function getFlags(re){
        var text = re.toString();
        return text.substring(text.lastIndexOf("/"));
    }

    //toString() is "/ab/g"
    var re = /ab/g;

    console.log(getFlags(re));  //"g"
```

This converts a regular expression into a string and then returns the characters found after the last `/`. Those characters are the flags.

ECMAScript 6 makes fetching flags easier by adding `flags` property to go along with the `source` property. Both properties are prototype accessor properties with only a getter assigned, making them read-only. The `flags` property makes inspecting regular expressions easier for both debugging and inheritance purposes.

A late addition to ECMAScript 6, the `flags` property returns the string representation of any flags applied to regular expression. For example:

```javascript
    var re=/ab/g;

    console.log(re.source);  //"ab"
    console.log(re.flags);  //"g"
```

This fetches all flags on `re` and prints them to the console with far fewer lines of code than the `toString()` technique can.


>The changes to strings and regular expressions that this chapter has covered so far are definitely powerful, but ECMAScript 6 improves your power over strings in a much bigger way. It brings a type of literal to the table that makes strings more flexible.

## Template Literals
Until ECMAScript 6, JavaScript's strings lacked the methods covered so far in this chapter, and string concatenation is as simple as possible.

To allow developers to solve more complex problems, ECMAScript 6's *template literals* provide syntax for creating domain-specific languages (DSLs) for working with content in a safer way than the solutions available in ECMAScript 5 and earlier.
>A DSL is a programming language designed for specific, narrow purpose, as opposed to general-purpose languages like JavaScript.


Template literals are ECMAScript 6's answer to the following features that JavaScript lacked all the way through ECMAScript 5:

- **Multiline strings** A formal concept of multiline strings.
- **Basic string formatting** The ability to substitute parts of the string for values contained in variable.
- **HTML escaping** The ability to transfrom a string such that it is safe to insert into HTML.

Rather than trying to add more functionality to JavaScript's already-existing strings, template literals represent an entirely new approach to solving these problems.


### Basic Syntax
At their simplest, template literals act like regular strings delimited by backticks (`) instead of double or single quotes. For example:

```javascript
    let message = `Hello world!`
    
    console.log(message);  //"Hello world!"
    console.log(typeof message);  //"string"
    console.log(message.length);  //12
```

This code demonstrates that the variable `message` contains a normal JavaScript string. The template literal syntax is used to create the string value, which is then assigned to the `message` variable.

If you want to use a backtick in your string, then just escape it with a backslash(`\`), as in this version of the `message` variable:

```javascript
    let message = `\`Hello\` world!`;
    
    console.log(message);  //"`Hello` world!"
    console.log(typeof message);  //"string"
    console.log(message.length);  //14
```

There is no need to escape either double or single quotes inside of template literals.

### Multiline Strings
JavaScript developers have wanted a way to create multiline strings. But when using double or single quotes, strings must be completely contained on a single line.

#### Pre-ECMAScript 6 Workarounds
Thanks to a long-standing syntax bug, you can create multiline strings if there is a backslash (`\`) before a newline.
```javascript
    var message = "Multiline \
    string";
    
    console.log(message);  //"Multiline string"
```

The `message` string has no newlines present when printed to the console because the backslash is treated as a continuation rather than a newline. In order to show a newline in output, you'd need to manually include it:

```javascript
    var message = "Multiline \n\
    string";
    
    console.log(message);  //"Multiline
                            // srting"
```

This should print `Multiline string` on two separate lines in all major JavaScript engines, but the behavior is defined as a bug and many developers recommend avoiding it.

Other pre-ECMAScript 6 attempts to create multiline strings usually relied on arrays or string concatenation, such as:

```javascript
    var message = ["Multiline ", "string"].join("\n");
    
    let message = "Multiline \n" + "string";
```

>Q: I have tried to use `let message = "Multiline \nstring";`on chrome, it created a multiline string, why? (maybe it doesn't work on all browsers??)

#### Multiline Strings the Easy Way
ECMAScript 6's template literals make multiline strings easy because there's no special syntax. Just include a newline where you want, and it shows up in the result. For example:

```javascript
    let message = `Multiline
    string`;
    
    console.log(message);  //"Multiline
                            //string"
    console.log(message.length);  //16
```

All whitespace inside the backticks is part of the string, so be careful with indentation. For example:
```javascript
    let message = `Multiline
                   string`;
    
    console.log(message);           // "Multiline
                                    //                 string"
    console.log(message.length);    // 31
```

If making the text line up with proper indentation is important to you, then consider leaving nothing on the first line of a multiline template literal and then indenting after that, as follows:

```javascript
    let html = `
    <div>
        <h1>Title</h1>
    </div>`.trim(); 
```

This code begins the template literal on the first line but doesn't have any text until the second, then the `trim()` method is calles to remove the initial empty line.

> If you prefer, you can also use `\n` in a template literal to indicate where a newline should be inserted.

### Making Substitutions
At this point, template literals may look like fancier versions of normal JavaScript strings. The real difference between the two lies in template literal *substitutions*. Substitutions allow you to embed any valid JavaScript expression inside a template literal and output the result as part of the string.

Substitutions are delimited by an opening `${` and a closing `}` that can have any JavaScript expression inside. The simplest substitutions let you embed local variables directly into a resulting string, like this:

```javascript
    let name = "Nicholas",
        message = `Hello, ${name}.`;
    
    console.log(message);   // "Hello, Nicholas."
```

The substitution `${name}` accesses the local variable `name` to insert `name` into the `message` string.

>A template literal can access any variable accessible in the scope in which it is defined. Attempting to use an undeclared variable in a template literal throws an error in both strict and non-strict modes.

Since all substitutions are JavaScript expressions, you can substitute more than just simple variable names. You can easily embed calculations, function calls, and more.
 
 For example:
```javascript
    let count = 10,
        price = 0.25,
        message = `${count} items cost $${(count*price).toFixed(2)}.`;
    
    console.log(message);  //"10 items cost $2.50."
```

This code preforms a calculation as part of the template literal.

Template literals are also JavaScript expressions, which means you can place a template literal inside of another template literal, as in this example:

```javascript
    let name = "Nicholas",
        message = `Hello, ${
            `my name is ${name}`
        }.`;
        
    console.log(message);  // "Hello, my name is Nicholas."
```

### Tagged Templates
The real power of template literals comes from tagged templates. A *template tag* performs a transformation on the template literal and returns the final string value.
This tag is specified at the start of the template, just before the first ` character, as shown here:

```javascript
    let message = tag`Hello world`;
```
In this example, `tag` is the template tag to apply to the `Hello world` template literal.

#### Defining Tags
A *tag* is simply a function that is called with the processed template literal data. The tag receives data about the template literal as individual pieces and must combine the pieces to create the result. The first argument is an array containing the literal string as interpreted by JavaScript. Each subsequent argument is the interpreted value of each substitution.

Tag functions are typically defined using rest arguments as follows, to make dealing with the data easier:

```javascript
    function tag(literals, ...substitutions){
        //return a string
    }
```

To better understand what gets passed to tags, consider the following:

```javascript
    let count = 10,
        price = 0.25,
        message = passthru`${count} items cost $${(count * price).toFixed(2)}.`;
```

If you had a function called `passthru()`, that function would receive three argument. First, it would get a `literals` array, containing the following elements:

- The empty string before the first substitution(`""`)
- The string after the first substitution and before the second(`" items cost $"`)
- The string after the second substitution(`"."`)

The next argument would be `10`, which is the interpreted value for the `count` variable. This becomes the first element in a `substitutions` array. The final argument would be `"2.50"`, which is the interpreted value for `(count * price).to Fixed(2)` and the second element in the `substitutions` array.

>toFixed() method returns a string, so the final argument `"2.50"` is a string.

Note that the first item in `literals` is an empty string. This ensures that `literals[0]` is always the start of the string, just like `literals[literals.length -1]` is always the end of the string. There is always one fewer substitution than literal, which means the expression `substitutions.length === literals.length - 1` is always true.

Using this pattern, the `literals` and `substitutions` arrays can be interwoven to create a resulting string.
```javascript
    function passthru(literals, ...substitutions){
        let result = "";
        
        for (let i = 0; i<substitutions.length; i++){
            result += literals[i];
            result += substitutions[i];
        }
        
        result += literals[literals.length - 1];
        return result;
    }
    
    let count = 10,
        price = 0.25,
        message = passthru`${count} items cost $${(count*price).toFixed(2)}`;
    
    console.log(message);
```

> The values contained in `substitutions` are not necessarily strings. If an expression evaluates to a number, as in the previous example, then the numeric value is passed in. Determining how such values should output in the result is part of the tag's job.

#### Using Raw Values in Template Literals
The simplest way to work with raw string values is to use the built-in `String.raw()` tag. For example:
```javascript
    let message1 = `Multiline\nstring`,
        message2 = String.raw`Multiline\nstring`;
    
    console.log(message1);          // "Multiline
                                    //  string"
    console.log(message2);          // "Multiline\nstring"
```
Retrieving the raw string information like this allows for more complex processing when necessary.

The raw string information is also passed into template tags. The first argument in a tag function is an array with an extra property called `raw`. The `raw` property is an array containing the raw equivalent of each literal value. For example, teh value in `literals[0]` always has an equivalent `literals.raw[0]` that contains the raw string information. 

You can mimic `String.raw()` using the following code:
```javascript
    function raw(literals, ...substitutions){
        let result = "";
        for(let i=0; i<substitutions.length; i++){
            result += literals.raw[i];  //use raw values instead
            result += substitutions[i];
        }
        result += literals.raw[literals.length - 1];
        
        return result;
    }
    let message = raw`Multiline\nsrting`;
    
    console.log(message);           // "Multiline\\nstring"
    console.log(message.length);    // 17
```

This uses `literals.raw` instead of `literals` to output the string result. That means any character escapes, including Unicode code point escapes, should be returned in their raw form.

Raw strings are helpful when you want to output a string containing code in which you'll need to include the character escaping (for instance, if you want to generate documentation about some code, you may want to output the actual code as it appears).


## Summary
Full Unicode support allows JavaScript to deal with UTF-16 characters in logical ways. The ability to transfer between code point and character via `codePointAt()` and `String.fromCodePoint()` is an important step for string manipulation. The addition of the regular expression `u` flag makes it possible to operate on code points instead of 16-bit characters, and the `normalize()` method allows for more appropriate string comparisons.

ECMAScript 6 also added new methods for working with strings, allowing you to more easily identify a substring regardless of its position in the parent string. More functionality was assed to regular expressions, too.

Template literals are an important addition to ECMAScript 6 that allows you to create domain-specific languages(DSLs) to make creating strings easier. The ability to embed variables directly into template literals means that developers have a safer tool than string concatenation for composing long strings with variables.

Built-in support for multiline strings also makes template literals s useful upgrade over normal JavaScript strings, which have never had this ability. Despite allowing newlines directly inside the template literal, you can still use `\n` and other character escape sequences.

Template tags are the most important part of this feature for creating DSLs. Tags are functions that receive the pieces of the template literal as arguments. You can then use that data to return an appropriate string value. The data provided includes literals, their raw equivalents, and any substitution values. These pieces of information can then be used to determine the correct output for the tag.


























