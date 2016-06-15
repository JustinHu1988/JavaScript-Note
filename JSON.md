JSON（JavaScript Object Notation）

理解JSON语法，解析JSON，序列化JSON

JSON是一种数据格式。

20.1 语法
	JSON语法可以表示以下三种类型的值：
		1. 简单值：字符串、数值、布尔值和null，不支持undefined
		2. 对象：一组无序的键值对。键值对中的值可以是简单值，也可以是复杂数据。
		3. 数组：一组有序的值的列表。可以通过数值索引来访问其中的值。数组的值也可以是任意类型。

	20.11 简单值
		JSON字符串必须使用双引号！（单引号会引起语法错误）

	20.12 对象
		JSON中的对象必须给属性加双引号。
		JSON对象末尾不加分号，没有声明变量（JSON中没有变量的概念）

		同一个对象中不能出现同名属性。

	20.13 数组
		JSON数组也没有变量和分号。
			例：[25, "hi", true]


20.2 解析和序列化
	JSON是Web服务开发中交换数据的事实标准。

	20.21 JSON对象
		早期的JSON解析器基本上就是使用JavaScript的eval()函数。
		ECMAScript 5 对解析JSON的行为进行规范，定义了全局对象JSON。

		针对较早版本的浏览器，可以使用shim:http://github.com/douglascrockford/JSON-js


		JSON对象有两个方法：stringify()和parse()。分别用于把JavaScript对象序列化为JSON字符串，和把JSON字符串解析成原声JavaScript值。
			例： 
				var book = {
					title: "Professional JavaScript",
					authors: ["Nicholas C. Zakas"],
					edition: 3,
					year: 2011
				};
				var jsonText = JSON.stringify(book);

				此时，jsonText里保存的JSON字符串如下：
				{"title":"Professional JavaScript","authors":["Nicholas C. Zakas"],"edition":3,"year":2011}

			默认情况下，JSON.stringify()输出的JSON字符串不包含任何空格字符或缩进。

			在序列化JavaScript对象时，所有函数及原型成员都会被有意忽略，不体现在结果中。此外，值为undefined的任何属性也都会被跳过。结果中最终都是值为有效JSON数据类型的实例属性。

		将JSON字符串直接传给JSON.parse()就可以得到相应的JavaScript值。
			例：
				var bookCopy = JSON.parse(jsonText);

			注意，虽然book和bookCopy具有相同的属性，但它们是两个独立的、没有任何关系的对象。

			如果传给JSON.parse()的字符串不是有效的JSON，该方法会抛出错误。


	20.22 序列化选项
