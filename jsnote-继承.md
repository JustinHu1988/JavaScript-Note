继承

ECMAScript只支持实现继承，而且其实现继承主要是依靠原型链来实现的。

6.31 原型链

基本思想：利用原型让一个引用类型继承另一个引用类型的属性和方法。
	
	简单回顾一下构造函数、原型和实例的关系：
		每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。
		如果我们让原型对象变成另一个类型的实例，那么原型对象也将包含一个指向另一个原型的指针。可以由此层层递进。

	实现原型链的基本模式：
		//定义一个构造函数
		function SuperType(){
			this.property = true;
		}
		//为其原型添加方法
		SuperType.prototype.getSuperValue = function(){
			return this.property;
		};

		//定义另一个构造函数
		function SubType(){
			this.subproperty = false;
		}
		//将SubType的原型设置为SuperType的实例。
		SubType.prototype = new SuperType();
		//为SubType的原型添加方法
		SubType.prototype.getSubValue = function(){
			return this.subproperty;
		};

		var instance = new SubType();
		alert(instance.getSuperValue()); //true

	实现的本质是重写原型对象，替换为一个新类型的实例。
		注意：SubType.prototype中的constructor指向SuperType。因为SubType.prototype被重写为SuperType的一个实例，失去了自身的constructor属性，而此时SubType.prototype的原型SuperType里的constructor属性指向的是SuperType。

	通过实现原型链，本质上扩展了本章前面介绍的原型搜索机制。


	1. 别忘记默认的原型
		所有函数的默认原型都是Object的实例，因此默认原型都会包含一个内部指针[[prototype]]，指向Object.prototype。 这也正是所有自定义类型都会继承toString()、valueOf()等默认方法的根本原因。

	2. 确定原型和实例的关系
		可以通过两种方式来确定：
			1）使用instanceof操作符；
				测试实例与原型链中出现过的构造函数，结果会返回true。
					例：alert(instance instanceof Object); //true
			2）isPrototypeOf()方法；
				只要是原型链中出现过的原型，都可以说是该原型链所派生实例的原型，返回true。
					例：alert(Object.prototype.isPrototypeOf(instance)); //true

	3. 谨慎地定义方法：
		子类型有时候需要覆盖超类型的某个方法，或者添加超类型中不存在的某个方法。不过，给原型添加方法的代码，一定要放在重写原型的语句之后。

		注意: 通过原型链实现继承，当将原型对象为超类型的实例后，不能用字面量形式为其添加方法，原因也和上面类似，因为字面量形式会再度重写原型，导致原型对象不再是超类型的实例，也就无法继承超类型原型里的属性和方法。

	4. 原型链的问题： 
		1）最主要的问题来自包含引用类型值的原型。(重要)
			包含引用类型值的原型属性会被所有实例共享，因此引用类型属性要在构造函数中定义，而不再原型中定义。因为构造函数中的属性，会在每次创建新实例时各自重新创建，不会共享同一个引用。
			然而，即使把引用类型属性都放在构造函数里，通过原型实现继承时（原型链）中还会出现这个问题。
			通过原型实现继承时，原型实际上会变成另一个类型的实例。因此超类型赋予子类型原型的实例属性，会在子类型的实例里成为原型属性。这会导致子类型的实例共享引用类型的原型属性，无法各自独立。
				例：
					function SuperType(){
						this.colors = ["red", "blue", "green"];
					}
					function SubType(){}

					SubType.prototype = new SuperType();

					var instance1 = new SubType();
					instance1.colors.push("black");
					alert(instance1.colors); //"red,blue,green,black"

					var instance2 = new SubType();
					alert(instance2.colors); //"red,blue,green,black"
					//colors属性被子类型实例共享，修改一个实例会影响其他实例。

		2）创建子类型实例时，无法向超类型的构造函数中传递参数。
			应该说，是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。

		由于以上两个问题，实践中很少会单独使用原型链。



6.32 借用构造函数（constructor stealing）
	基本思想：在子类型的构造函数内部调用超类型构造函数。

		函数只是在特定环境下执行代码的对象，因此通过使用apply()和call()方法也可以在新创建的对象上执行构造函数。
			例：
			function SuperType(){
				this.colors = ["red","blue","green"];
			}
			function SubType(){
				//继承了SuperType
				SuperType.call(this);
			}
			var instance1 = new SubType();
			instance1.colors.push("black");
			alert(instance1.colors); //"red,blue,green,black"

			var instance2 = new SubType();
			alert(instance2.colors); //"red,blue,green"

	1. 传递参数

		相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。
			function SuperType(name){
				this.name = name;
			}
			function SubType(name,age){
				SuperType.call(this,name);
				this.age = age;
			}

			var instance = new SubType("Nicholas",29);
			alert(instance.name); //"Nicholas"
			alert(instance.age); //29

		为了确保SuperType构造函数不会重写子类型的属性，可以在调用超类型构造函数后，再添加应该在子类型中定义的属性。

	2. 借用构造函数的问题

		单用借用构造函数，无法避免构造函数模式存在的问题——方法都在构造函数中定义，函数无法复用。
		而且，超类型原型中定义的方法对于子类型不可见（即无法形成原型链）。



6.33 组合继承（combination inheritance）

	也称伪经典继承。将原型链和借用构造函数的技术组合到一块，从而发挥二者长处的继承模式。

	思路：使用原型链实现对原型属性和方法的继承，通过借用构造函数实现对实例的继承。如此一来，既通过原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

		function SuperType(name){
			this.name = name;
			this.colors = ["red","blue","green"];
		}

		SuperType.prototype.sayName = function(){
			alert(this.name);
		};

		function SubType(name, age){
			SuperType.call(this,name);
			this.age = age;
		}

		//继承方法
		SubType.prototype = new SuperType();
		SubType.prototype.constructor = SubType;
		SubType.prototype.sayAge = function(){
			alert(this.age);
		};

		var instance1 = new SubType("Nicholas", 29);
		instance1.colors.push("black");
		alert(instance1.colors); //"red,blue,green,black"
		instance1.sayName(); //"Nicholas"
		instance1.sayAge(); // 29

		var instance2 = new SubType("Greg", 27);
		alert(instance2.colors); //"red,blus,green"
		instance2.sayName(); //"Greg"
		instance2.sayAge(); // 27

	组合继承避免了原型链和借用构造函数的缺陷，融合两者的优点，成为JS中最常用的继承模式。



6.34 原型式继承（Prototypal Inheritance in JavaScript）
	
	借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。
	用途：在没必要兴师动众地创建构造函数、只想让一个对象和另一个对象保持类似的情况下，原型式继承就可以胜任。不过，包含引用类型值的属性始终都会共享相应的值。

		function object(o){
			function F(){}
			F.prototype = o;
			return new F();
		}
		在object()函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。本质上讲，object()对传入其中的对象执行了一次浅复制。

		例：
			var person = {
				name:"Nicholas",
				friends:["Shelby","Court","Van"]
			};

			var anotherPerson = object(person);
			anotherPerson.name = "Greg";
			anotherPerson.friends.push("Rob");

			var yetAnotherPerson = object(person);
			yetAnotherPerson.name = "Linda";
			yetAnotherPerson.friends.push("Barbie");

			alert(person.friends); //"Shelby, Court, Van, Rob, Barbie"

	ECMAScript5通过新增Object.create()方法规范化了原型式继承。这个方法接受两个参数：一个用作新对象原型的对象，和（可选）一个为新对象定义额外属性的对象。在传入一个参数的情况下，Object.create()与object()方法的行为相同。

			var person = {
				name: "Nicholas",
				friends:["Shelby","Court","Van"]
			};

			var anotherPerson = Object.create(person);
			anotherPerson.name = "Greg";
			anotherPerson.friends.push("Rob");

			var yetAnotherPerson = Object.create(person);
			yetAnotherPerson.name = "Linda";
			yetAnotherPerson.friends.push("Barbie");

			alert(person.friends); //"Shelby,Court,Van,Rob,Barbie"

	Object.create()方法的第二个参数与Object.defineProperties()方法的第二个参数格式相同。每个属性都是通过自己的描述符定义的。以这种方式指定的任何属性都会覆盖原型对象上的同名属性。
			例：
				var person = {
					name: "Nicholas",
					friends: ["Shelby", "Court", "Van"]
				};
				var anotherPerson = Object.create(person, {
					name:{
						value:"Greg"
					}
				});
				alert(anotherPerson.name); //"Greg"



6.35 寄生式继承（parasitic）
	寄生式继承与原型式继承紧密相关。
	创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真的是它做了所有工作一样返回对象。
		例：
			function createAnother(original){
				var clone = object(original); //通过调用函数创建一个新对象
				clone.sayHi = function(){ //以某种方式来增强这个对象
					alert("hi");
				};
				return clone;	//返回这个对象
			}
		createAnother()函数接收了一个参数，也就是将要作为新对象基础的对象。然后，把这个对象传递给object()函数，将返回的结果赋值给clone。再为clone对象添加了一个新方法sayHi()，最后返回clone对象。可以像下面这样应用：

			var person = {
				name: "Nicholas",
				friends: ["Shelby","Court","Van"]
			};
			var anotherPerson = createAnother(person);
			anotherPerson.sayHi(); //"hi"

	这个例子中的代码基于person返回了一个新对象——anotherPerson，新对象不仅具有person的所有属性和方法，还有自己的sayHi()方法的行为相同。
	在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。

	注：使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率；这一点与构造函数模式类似。 

6.36 寄生组合式继承
	组合继承是JavaScript最常用的继承模式。但是，组合继承会调用两次超类型构造函数。一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。等于在调用子类型构造函数是又重写了一遍从原型中获得的属性。
	
	我们重新分析一下组合继承：
		function SuperType(name){
			this.name = name,
			this.colors = ["red", "blue", "green"]
		}

		SuperType.prototype.sayName = function(){
			alert(this.name);
		};

		function SubType(name,age){
			SuperType.call(this, name); //第二次调用SuperType()
			this.age = age;
		}

		SubType.prototype = new SuperType(); //第一次调用SuperType()
		SubType.prorotype.constructor = SubType;
		SubType.prototype.sayAge = function(){
			alert(this.age);
		};

		第一次调用SuperType构造函数时，SubType.prototype会得到两个属性：name和colors；它们都是SuperType的实例属性，只不过现在位于SubType的原型中。
		当调用SubType构造函数时，又会调用一次SuperType构造函数，这一次又在新对象上创建了实例属性name和colors。于是，这两个属性就屏蔽了原型中的两个同名属性。

	寄生组合式继承：
		通过借用构造函数来继承属性，通过原型链的混成模式来继承方法。
		基本思路：不必为了指定子类型的原型而调用超类型的构造函数。我们需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。

		基本模式：
			function inheritPrototype(subType, superType){
				var prototype = Object(superType.prototype);	//创建对象 创建的是superType.prototype的副本？
				prototype.constructor = subType;				//增强对象
				subType.prototype = prototype;					//指定对象
			}

			在函数内部，第一步创建超类型原型的一个副本，第二步为创建的副本添加constructor属性，从而弥补因重写原型而失去的默认constructor属性。 最后一步，将新创建的对象（即副本）赋值给子类型的原型。

		例：
			function SuperType(name){
				this.name = name,
				this.colors = ["red", "blue", "green"]
			}

			SuperType.prototype.sayName = function(){
				alert(this.name);
			};

			function SubType(name, age){
				SuperType.call(this, name);
				this.age = age;
			}

			inheritPrototype(SubType, SuperType);

			SubType.prototype.sayAge = function(){
				alert(this.age);
			};

		此例的高效率体现在它只调用了一次SuperType构造函数，并且因此避免了在SubType.prototype上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此能够正常使用instanceof和isPrototypeOf()。
		寄生组合式继承，是引用类型最理想的继承范式。





	



