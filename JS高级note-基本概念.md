<script>的基本特点：
	1）所有<script>元素都会按照它们在页面中出现的先后顺序被解析。在不使用defer和async属性的情况下，只有在解析完前面<script>元素中的代码后，才会开始解析后面<script>元素中的代码。
	2）区分大小写
	3）标识符（变量、函数、属性、函数参数的名字）规则：
		首字符必须是字母、下划线或美元符号（$）；
		其他字符可以是字母、下划线、美元符号或数字；
		使用驼峰式大小写；
		不能把关键字、保留字、true、false和null用作标识符。
	4）注释
		单行注释 //
		多行注释 /**/
	5）严格模式（strict mode）
		ECMAScript5引入严格模式概念。在严格模式下，ECMAScript3中的一些不确定的行为将得到处理，而且对某些不安全的操作也会抛出错误。
		整个脚本启用严格模式：在顶部添加：
			"use strict";
		特定函数启用严格模式，在函数内部顶端添加"use strict";
			function someFunction(){
				"use strict";
				//code
			}
	6）关键字
			//break do instanceof typeof case else new var catch finally return void continue for switch while debugger function this with default if throw delete in try 

	7）保留字
		ECMAScript3的保留字
			//abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public
		ECMAScript5非严格模式下的保留字
			//class enum extends super const export import
		ECMAScript5严格模式下增加的保留字
			//implements package public interface private static let protected yield

		ECMAScript5对eval和arguments也施加了限制。


3.3变量
	松散类型，可以用来保存任何类型的数据。
	一条语句定义多个变量，逗号分隔：
		var message = "hi", found = false, age = 29;
	如果省略var操作符，可以在局部作用域中定义全局变量：
		function test(){
			message = "hi"; //全局变量
		}
		alert(message); //error!
		test();
		alert(message); //"hi"
		注意：函数声明内的变量并不会直接进入执行环境（即使是这种全局变量声明法），在函数第一次执行前，访问message将会抛出错误（尚未声明）。只有在函数执行时，变量message才会进入执行环境，然后由于message是全局变量，函数执行完毕后没有被销毁，因此会继续生效，可以随时被访问。



3.4数据类型
	5种简单数据类型：
		Undefined Null Boolean Number String
	1种复杂数据类型：
		Object（本质上由一组无序的名值对组成）

	typeof操作符：检测变量的数据类型
		可能的返回值：
			"undefined"
			"boolean"
			"string"
			"number"
			"object"——如果这个值是对象或null（特殊值null被认为是一个空的对象引用）
			"function"
		（从技术角度讲，函数在ECMAScript中是对象，不是一种数据类型。不过函数也确实有一些特殊的属性，因此通过typeof把函数和其他对象区分开来。）

	Undefined类型：
		只有一个值：undefined
		在使用var声明变量但未对其加以初始化时，该变量值为undefined。

		未声明的变量和声明但未赋值的变量是不一样的：
			var message;	//声明但未赋值
			alert(message);	//"undefined"
			alert(aruVar);	//产生错误（尚未声明）
		但两者执行typeof操作符都会返回undefined值：
			var message;
			alert(typeof message); //"undefined"
			alert(typeof aruVar); //"undefined"

	Null类型：
		只有一个值：null
		null值表示一个空对象指针。因此使用typeof操作符检测null会返回"object"

		如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为null。这样一来，只要直接检查null值就可以知道相应的变量是否已经保存了一个对象的引用。
			例：
				if(car != null){
					// 对car对象执行某些操作
				}
		实际上，undefined值是派生自null值的，因此ECMA-262规定对它们的相等性测试要返回true：
			alert(null == undefined); //true
		但两者用途不同。只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存null值。
		
	Boolean类型：
		两个字面值：true 和 false
		ECMAScript中所有类型的值都有和这两个Boolean值等价的值。	要将一个值转换为其对应的Boolean值，可以调用转型函数 Boolean() 
			例：
				var message = "Hello world!";
				var messageAsBoolean = Boolean(message); //true
		转换对应规则：
			对应true的：非空字符串、非零数字（包括无穷大）、任何对象。
			对应false的：空字符串""、0和NaN、null、undefined


	Number类型：
		进制：
			十进制
			八进制：第一位是0，后面是0-7，数字超出7则导致整个数值按十进制计算，首位0被忽略。严格模式下无效，抛出错误。
			十六进制：前两位是0x，后面是0-F。
			进行算数计算时，所有八进制和十六进制表示的数值最终都会被转换成十进制数值。
		
		1.浮点数值：
			浮点数值需要的内存空间是保存整数值的两倍，因此ECMAScript会不失时机地将浮点数值转换为整数值。（如果小数点后没有任何数字，这个数值可以作为整数保存。如果浮点数值本身表示的就是一个整数（如 1.0），那么该值也会被转换为整数）。
				var floatNum1 = 1.; //小数点后没数字，转换为1
				var floatNum2 = 10.0; //解析为10
			对于极大或极小的数值，可以用e表示法（科学计数法）表示的浮点数值表示。例：
				var floatNum = 3.125e7; //31250000
				floatNum = 3e-17; //0.00000000000000003

			*浮点数值的最高精度是17位小数，但在算数计算时其精度远远不如整数。例如：0.1+0.2的结果不是 0.3，而是 0.30000000000000004。这个小小的舍入误差会导致无法测试特定的浮点数值。
				因此，下方的测试条件不应使用：
				if(a+b == 0.3){  // 此条件判定不合适
					alert("You got 0.3.");
				}
				这个例子中，测试不一定能够通过，所以永远不要测试某个特定的浮点数值。
			注：关于浮点数值计算会产生舍入误差的问题，这是使用基于IEEE754数值的浮点计算通病。

		2.数值范围：
			Number.MIN_VALUE:5e-324
			Number.MAX_VALUE:1.7976931348623157e+308
			超出这个范围的会转换成Infinity值（或-Infinity）。
			
			如果某次计算返回了正或负的Infinity值，那么该值将无法继续参与下一次的计算。
			用isFinite()函数确定一个数值是否有穷：
				var result = Number.MAX_VALUE + Number.MAX_VALUE;
				alert(isFinite(result)); //false
			访问Number.NEGATIVE_INFINITY和Number.POSITIVE_INFINITY分别保存着-Infinity和Infinity。

		3. NaN：
			NaN：非数值（Not a Number）。用于表示一个本来要返回数值的操作数未返回数值的情况（这样不会抛出错误）。
			（在其他编程语言中，任何数值除以非数值都会导致错误，从而停止代码执行。但在ECMAScript中，任何数值除以非数值会返回NaN，因此不会影响其他代码执行）

			NaN本身有两个特点：
				1）任何涉及NaN的操作都会返回NaN。
				2）NaN与任何值都不相等，包括NaN本身。

			isNaN()函数：
				任何不能被转换为数值的参数都会导致这个函数返回true。
					例：
					alert(isNaN(NaN)); //true
					alert(isNaN(10)); //false
					alert(isNaN("10")); //false 可以被转换为数值10
					alert(isNaN("blue")); //true（不能转换为数值）
					alert(isNaN(true)); //false（可以被转换成数值1）

		4. 数值转换：
			Number()、parseInt()、parseFloat()

			Number():用于任何数据类型。转换规则：
				1）Boolean值：true和false分别被转换为1和0；
				2）数字：传入并原值返回；
				3）null值：返回0；
				4）undefined：返回NaN；
				5）字符串：
					（1）如果只包含数字（前端可以带+或-），将其转换为十进制数值。
					（2）如果是有效的浮点格式，转换为对应的浮点数值。
					（3）如果是有效的16进制格式，则转换成等值的十进制整数值。
					（4）如果是空字符串，转换为0。
					（5）如果包含初上述格式之外的字符，则将其转换为NaN。
				6）对象：
					调用对象的valueOf()方法，然后按照上述规则转换；如果转换结果是NaN，则调用对象的toString()方法，再次按照上述规则转换返回的字符串值。

			parseInt()函数
				1）在转换字符串时，会忽略字符串前面的空格，直至找到第一个非空格字符。如果第一个字符不是数字字符或负号，parseInt()就会返回NaN（也就是说，parseInt()转换空字符串会返回NaN（而Number()对空字符返回0））。
				2）如果第一个字符是数字字符，parseInt()会继续解析第二个字符，直到解析完后续所有字符或遇到了非数字字符。
					例：
					var num1 = parseInt("1234blue"); //1234
					var num2 = parseInt(""); //NaN
					var num3 = parseInt("0xA"); //10（十六进制转换）
					var num4 = parseInt(22.6); //22
				注；在ECMAScript5中，parseInt()已经不具备八进制的能力。
				3）为了解决进制困惑，可以为这个函数提供第二个参数：转换时使用的基数。
					例：
					var num = parseInt("0xAF", 16); //175  （制定进制可以不用带0x）
					var num = parseInt("AF", 16); //175
					var num = parseInt("AF"); //NaN
				为了避免歧义，建议转换时指定基数。

			parseFloat()函数
				与parseInt()类似，区别是（1）第一个小数点是有效的；（2）只能识别十进制（因此16进制会转换为0）
					例：
					var num = parseFloat("22.34.6"); //22.34

	
	String类型
		String类型表示由零或多个16位Unicode字符组成的字符序列，即字符串。可以由双引号或单引号表示。
		1. 字符字面量
			转义序列，用于表示非打印字符，或者其他用途的字符。如下：
				\n 换行
				\t 制表
				\b 退格
				\r 回车
				\f 进纸
				\\ 斜杠
				\' 单引号，在单引号表示的字符串内使用'
				\" 双引号，在双引号表示的字符串中使用"
				\xnn 以十六进制代码nn表示一个字符
				\unnnn 以十六进制代码nnnn表示一个Unicode字符

		2. 字符串特点
			ECMAScript中的字符串是不可变的。也就是说，字符串一旦创建，它们的值就不能改变。要改变某个变量保存的字符串，首先要销毁原来的字符串，然后再用另一个包含新值的字符串填充该变量：
				例：
				var lang = "Java";
				lang = lang + "Script";
				此例的实现过程如下：
					首先创建一个能容纳10个字符的新字符串，然后在这个字符串中填充"Java"和"Script"，最后一步是销毁原来的字符串"Java"和字符串"Script"，因为这两个字符串已经没用了。

		3. 转换为字符串：
			1） toString()方法：直接返回相应值的字符串表现。（null和undefined值没有这个方法）
				一般而言，调用toString方法不必传递参数，但也可传递一个参数：输出数值的基数。
					例：
						var age = 10;
						alert(age.toString(2)); //"1010"
						alert(age.toString(8)); //"12"
					通过指定基数，toString()方法会改变输出的值。
			2） String()方法：如果转换的值有可能是null或undefined的情况下，可以使用String()。转换规则如下：
				（1）如果值有toString()方法，则调用该方法（无参数）并返回相应结果；
				（2）如果值是null，返回"null"；
				（3）如果值是undefined，返回"undefined".
			注：要把某个值转换为字符串，可以用加号操作符，把它与一个空字符串（""）加在一起。


	Object类型
		Object的每个实例都具有下列属性和方法：
			1）constructor:
				保存着用于创建当前对象的构造函数。
			2）hasOwnProperty(propertyName):
				检查给定属性在当前对象实例中是否存在。属性名需要以字符串形式传入。
			3）isPrototypeOf(object):
				检查传入的对象是否是当前对象的实例。
			4）propertyIsEnumerable(propertyName): 
				检查给定的属性是否能用for-in语句来枚举。属性名需要以字符串形式传入。
			5）toLocalString():
				返回对象的字符串表示，该字符串与执行环境的地区对应。
			6）toString():
				返回对象的字符串表示。
			7）valueOf():
				返回对象的字符串、数值或布尔值表示。通常与toString()返回值相同。
		ECMAScript中，Object是所有对象的基础，因此所有对象都具有这些基本属性和方法。

		从技术角度讲，ECMA-262中对象的行为不一定适用于JavaScript中的其他对象。浏览器环境中的对象，比如BOM和DOM中的对象，都属于宿主对象，是由宿主实现提供和定义的。ECMA-262不负责定义宿主对象，因此宿主对象不一定继承Object。



3.5操作符
	算数操作符、位操作符、关系操作符、相等操作符等。
	ECMAScript操作符的特点在于：它们能够适应于很多值：字符串、数字、布尔值以及对象。不过在应用于对象时，操作符通常都会调用对象的valueOf()和toString()方法，以便取得可以操作的值。

	3.51 一元操作符
		只能操作一个值的操作符。

		1. 递增和递减操作符
			各有两个版本：前置型和后置型
				var age = 29;
				var anotherAge = --age + 2;
				alert(age); //28
				alert(anotherAge); //30
			前置和后置的重要区别：前置递增和递减是在语句求值前被执行，而后置是在语句求值执行后再执行：
				var num1 = 2;
				var num2 = 20;
				var num3 = num1-- + num2; //等于22
				alert(num1); //1
				var num4 = num1 + num2; //等于21
			在应用于不同值时，递增和递减操作符遵循下列规则：参见数值转换的规则、再执行操作。


		2. 一元加和减操作符
			一元加操作符：对数值没有影响，对非数值会将其转换为数值
			一元减操作符：将数字转变为负数，对非数值先转换为数值再转换为负值
				var s1 = "01";
				s1 = -s1; //值变成了-1

	3.52 位操作符
		ECMAScript中的所有数值都以IEEE-754 64位格式存储。不过位操作符并不直接操作64位的值。而是先将64位的值转换成32位的整数，然后执行操作，最后再将结果转换回64位。

		对于有符号的整数，32位中前31位表示整数的值，第32位用于表示数值的符号（符号位）：0表示正数、1表示负数。
		符号位的值决定了其他位数值的格式。正数以纯二进制格式存储，31位中的每一位都表示2的幂。负数以二进制补码形式存储。

			二进制补码的计算：
			（1）求这个数值绝对值的二进制码；
			（2）求出反码；
			（3）反码+1。

		ECMAScript会隐藏这些信息，即使以二进制字符串形式输出一个负数，也只显示位一个二进制字符串，前面加上符号。
			var num = -18;
			alert(num.toString(2)); //"-10010"

		对数值应用位操作符时，因为会发生64位-32位-64位的转换，导致一个问题：NaN和Infinity会被转换成0来处理。
		对非数值应用操作符时，会先使用Number()函数将该值转换为数值，再应用位操作。

		1. 按位非（NOT）：~
			前置，返回反码
		2. 按位与（AND）：&
			两个操作符数，逐位对应执行“与”操作。
		3. 按位或（OR）：|
			两个操作符数，逐位对应执行“或”操作。
		4. 按位异或（XOR）：^
			两个操作符数，逐位对应执行“异或”操作。
		5. 左移：<<
			左移指定位数，不影响符号位。
		6. 有符号右移：>>
			右移指定位数，不影响符号位。
		7. 无符号右移：>>>
			右移指定位数，符号位。

	3.53 布尔操作符
		非（NOT）、与（AND）、或（OR）
		1. 逻辑非：!
			可以应用于任何类型值，都会返回一个布尔值。转换规则如下（转换成布尔类型再反转，可对比boolean类型一节）：
				1）操作数是对象，返回false；
				2）操作数是空字符串，返回true；
				3）操作数是非空字符串，返回false；
				4）操作数数值0，返回true；
				5）非0数字（包括Infinity），返回false；
				6）null，返回true；
				7）NaN，返回true；
				8）undefined，返回true；
			如果同时使用两个逻辑非操作符，实际等于模拟Boolean()转型函数。
		2. 逻辑与：&&
			逻辑与操作属于短路操作，如果操作数1能够决定结果，就不会再对操作数2求值。
			如果有一个操作数不是布尔值，逻辑与操作符不一定返回布尔值，特殊规则如下：
				1）如果操作数1是对象，则返回操作数2；
				2）如果操作数2是对象，则只有在操作数1求值结果为true时返回该对象。
				3）如果有一个操作数是null，则返回null；
				4）如果有一个操作数是NaN，则返回NaN；
				5）如果有一个操作数是undefined，则返回undefined。
		3. 逻辑或：||
			也属于短路操作，如果操作数1的求值结果是true，就不会对操作数2求值。
			如果有一个操作数不是布尔值，逻辑或操作符也不一定返回布尔值，特殊规则如下：
				1）如果操作数1是对象，则返回操作数1；
				2）如果操作数1的求值结果是false，则返回操作数2；
				3）如果两个都是对象，则返回操作数1；
				4）两个都是null，则返回null；
				5）两个都是NaN，返回NaN；
				6）两个都是undefined，则返回undefined；

			利用逻辑或可以避免为变量赋null或undefined值：
				例：
					var myObject = preferredObject || backupObject;
					//优先为myObject赋值preferredObject，而backupObject则是在preferredObject没有有效值时提供后备值。

	3.54 乘性操作符
		乘法、除法、求模
			在操作数为非数值的情况下，会自动转换类型后执行计算。
		1. 乘法：*
			处理特殊值的特殊规则：
				1）如果乘积超出ECMAScript的表示范围，则返回Infinity或-Infinity；
				2）如果有一个操作数是NaN，则结果为NaN；
				3）如果Infinity与0相乘，则返回NaN；
				4）如果Infinity和非0数值相乘，返回Infinity或-Infinity，符号取决于操作数的符号。
				5）Infinity乘以Infinity，结果为Infinity;
				6）如果有一个操作数不是数值，则在后台调用Number()将其转换为数值，再应用上面的规则。
		2. 除法：/
			特殊规则：
				1）如果商超出ECMAScript的表示范围，则返回Infinity或-Infinity；
				2）如果有一个操作数是NaN，则结果为NaN；
				3）如果Infinity被Infinity除，则返回NaN；
				4）如果0被0除，则返回NaN；
				4）如果非零有限数被0除，返回Infinity或-Infinity，符号取决于操作数的符号。
				5）Infinity被非零有限数值除，结果为Infinity或-Infinity;
				6）如果有一个操作数不是数值，则在后台调用Number()将其转换为数值，再应用上面的规则。
		3. 求模（求余数）：%
			例：
				var result = 26 % 5; //等于1
			特殊规则：
				1）如果被除数是无穷大而除数有限大，结果为NaN；
				2）被除数是有限大，除数是0，结果为NaN；
				3）如果是Infinity被Infinity除，结果为NaN；
				4）被除数有限大，而除数无穷大时，结果是被除数；
				5）被除数是0，则结果是0；
				6）如果有一个操作数不是数值，则在后台调用Number()将其转换为数值，再应用上面的规则。

	3.55 加性操作符

	3.56 关系操作符

	3.57 相等操作符

	3.58 条件操作符

	3.59 赋值操作符

	3.510 逗号操作符


3.6 语句
	1. if语句
	2. do-while语句：后测试循环语句，在循环体代码执行一次之后再测试条件。
	3. while语句
	4. for语句
	5. for-in语句：用来枚举对象的属性。
		例：for(var propName in window){
				document.write(porpName);
			}//用for-in循环来显示BOM中window对象的所有属性。
			对象属性没有顺序，因此返回顺序不可预测。
			如果要迭代的变量值为null或underfined，在ECMAScript5里不再抛出错误，只是不执行循环体（以前的版本会抛出错误）。
	*6. label语句：
		语法：
			label: statement
			例：
				start: for(var i=0; i<count; i++){
					alert(i);
				}
			此例中定义的start标签，可以在将来由break或continue语句引用。
			加标签的语句一般都要与for语句等循环语句配合使用。
	7. break和continue语句：
		break和continue语句用于在循环中精确地控制代码的执行。
			其中，break语句会立即跳出循环，执行循环后面的语句。continue语句也跳出本次循环，不过会从循环顶部继续执行。

			例1： 
				var num = 0;

				outermost:
				for(var i=0; i<10; i++){
					for(var j=0; j<10; j++){
						if(i==5 && j==5){
							break outermost;
						}
						num++;
					}
				}
				alert(num); //55

			例2：
				var num = 0;

				outermost:
				for(var i=0; i<10; i++){
					for(var j=0; j<10; i++){
						if(i==5 && j==5){
							continue outermost;
						}
						num++;
					}
				}
				alert(num); //95
		分析：添加了outermost这个标签后，break和continue语句在跳出循环时都会跳至outermost标签处，因此都和不加标签的最终循环次数有所不同。

	注：虽然联用break、continue和label语句能够执行复杂的操作，但过度使用也会给调试带来麻烦。在此，建议如果使用label语句，一定要使用描述性的标签，同时不要嵌套过多的循环。

	8. with语句
		with语句的作用是将代码的作用域设置到一个特定的对象中。
		语法：
			with(expression) statement;
		定义with语句的目的主要是为了简化多次编写同一个对象的工作。
		在with语句的代码块内部，每个变量首先被认为是一个局部变量，而如果局部环境中找不到该变量的定义，就会查询location对象中是否有同名的属性。如果发现了同名属性，则以location对象属性的值作为变量的值。

		严格模式下不允许使用with语句。
		注：大量使用with语句将导致性能下降，调试困难，一般不建议使用。

	9. switch语句
		switch语句与if语句关系很密切。switch语句中的每一种情形（case）的含义是：如果表达式等于这个值 （value），则执行后面的语句（statement）。而break关键字会导致代码执行流跳出switch语句，如果省略break关键字，就会导致执行完当前case后，继续执行下一个case。最后的default关键字则用于在表达式不匹配前面任何一种情形的时候，执行机动代码（相当于else语句）。
		语法：
			switch(expression){
				case value: statement;
					break;
				case value: statement;
					break;
				case value: statement;
					break;
				case value: statement;
					break;
				default:statement
			}

		从根本上讲，switch语句就是为了让开发人员免于编写像下面这样的语句：
			if(i == 25){
				alert("25");
			} else if(i==35){
				alert("35");
			} else if(i==45){
				alert("45");
			} else{
				alert("Other");
			}
			与此等价的switch语句如下：
			switch(i){
				case 25: alert("25");
					break;
				case 35: alert("35");
					break;
				case 45: alert("45");
					break;
				default: alert("Other");
			}
			如果想同时执行多个case，去掉break时记得添加注释：
			例：
				switch(i){
					case 25: //合并两种情形
					case 35:
						alert("25 or 35");
					case 45:
						alert("45");
					default: alert("Other");
				}
		
		特色：可以在switch语句中使用任何数据类型，而且case的值不一定是常量，可以是变量甚至表达式：
			例1：
				switch("hello world"){
					case "hello" + " world": alert("Greeting was found."); //此语句被执行
						break;
					case "goodbye": alert("Closing was found.");
						break;
					default: alert("Unexpected message was found.");
				}
			例2：
				var num = 25;
				switch(true){
					case num < 0: alert("Less than 0.");
						break;
					case num >=0 && num <= 10: alert("Between 0 and 10.");
						break;
					default: alert("More than 20.");  //此语句被执行
				}

		*注意：switch语句比较值得时候使用的是全等操作符，不会发生类型转换。

		

3.7 函数
	
	return语句：可以从函数中返回值，然后停止并退出函数。
			推荐做法：要么让函数始终返回一个值，要么永远不要返回值，这样方便调试代码。
	严格模式对函数有一些限制：
		1）不能把函数命名为eval或arguments；
		2）不能把参数命名为eval或arguments；
		3）不能出现两个命名参数同名的情况。

	3.71 理解参数
		ECMAScript函数的参数与大多数其他语言中函数的参数有所不同。

		ECMAScript中的参数在内部使用一个数组来表示的。函数接收到的始终都是这个数组，而不关心数组中包含哪些参数。
			函数体内可以通过arguments对象来访问这个参数数组，从而获得传递给函数的每一个参数。
			不过，arguments对象只是与数组类似（它并不是Array的实例），因为可以使用方括号语法访问它的每一个元素。（arguments[0]、arguments[1]、arguments[2]...）
			因此，实际上声明函数上不显式地传入参数也可以，例：
				function sayHi(){
					alert("Hello " + arguments[0] + arguments[1]);
				}
				sayHi("my ","world."); //"Hello my world."
			这个函数声明时并没有设定参数名，但依然可以依靠在函数体内写入arguments[x]，后续可以在执行函数时按顺序添加参数。

			ECMAScript函数的重要特点：命名的参数只是提供便利，但不是必需的。

		通过访问arguments对象的length属性，可以获知有多少个参数传递给了函数。
			例:
				function howManyArgs(){
					alert(arguments.length);
				}
				howManyArgs("string",45); //2
				howManyArgs(); //0
				howManyArgs(12); //1
			开发人员可以利用这一点，让函数能够接收任意个参数并分别实现适当的功能：
			例：
				function doAdd(){
					if(arguments.length == 1){
						alert(arguments[0]+10);
					} else if(arguments.length == 2){
						alert(arguments[0]+arguments[1]);
					}
				}
				doAdd(10); //20
				doAdd(30,20) //50
			这在一定程度上弥补了ECMAScript没有函数重载的缺憾。

		注1：arguments有一个特点，它的值永远与对应命名参数的值保持同步。每次修改arguments中的值，相应的命名参数也会被同步改动。
			例：
				function doAdd(num1, num2){
					arguments[1] = 10;
					alert(arguments[0] + num2); //num2此时等于10
				}
			arguments中的值和对应的命名参值并不是访问相同的内存空间。它们内存空间是独立的，但它们的值可以同步。
			*不过，如果只传入了一个参数，那么为arguments[1]设置的值不会反映到命名参数中。因为arguments对象的长度是由传入的参数个数决定的，不是由定义函数时的命名参数的个数决定的。
				function doAdd(num1, num2){
					arguments[1] = 10;
					alert(arguments[0] + num2); 
					console.log(num2);
				}
				doAdd(1); //NaN
				//因为只传入了一个argument，因此num2的值是undefined，没有与argument[1]同步，argument.length的值也只是1。

		注2：没有传递值的命名参数将自动被赋予undefined值。

		注3：严格模式下无法使用arguments对象和命名参数的同步。

		注4：ECMAScript中的所有参数传递的都是值，不能通过引用传递参数。


	3.72 没有重载
		ECMAScript函数没有传统意义的重载，可以通过利用参数的arguments对象length属性的长度判定，可以模仿方法的重载。













