BOM
BOM提供了很多对象，用于访问浏览器的功能。

8.1 window 对象
	BOM的核心对象是window。
	window既是通过JavaScript访问浏览器窗口的一个接口，又是ECMAScript规定的Global对象。

	8.11 全局作用域
		所有在全局作用域中声明的变量、函数都会变成window对象的属性和方法。

		全局变量和window对象上定义属性的区别：
			1. 全局变量不能通过delete操作符删除，而直接在window对象上定义的属性可以。
			2. 尝试访问未声明的变量会抛出错误，但通过查询window对象，可以知道某个未声明的变量是否存在。
				例1：
				var newValue = oldValue; //抛出错误
				例2：
				var newValue = window.oldValue; //不会抛出错误，undefined

	8.12 窗口关系及框架
		如果页面中包含框架，则每个框架都拥有自己的window对象，并且保存在frames集合中。在frames集合中，可以通过数值索引（从0开始，从左至右、从上到下）或者框架名称来访问相应的window对象。（访问方法详见P195）

		top对象：
			top对象始终指向最外层的框架、也就是浏览器窗口。使用它可以确保在一个框架中正确地访问另一个框架。

		parent对象：
			parent对象始终指向当前框架的直接上层框架。（在没有框架的情况下，parent等于top，因为它们都是window）

		self对象：
			始终指向window。实际上self对象可以和window对象可以互换使用。所有这些对象都是window对象的属性，可以写作：window.parent、window.top。

	8.13 窗口对象
		1. 跨浏览器取得窗口左边和上边的位置(各浏览器判定不一致)：
			var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;
			var topPos = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;
		
		2. 使用moveTo()和moveBy()可以将窗口移到新位置（这两个方法可能被禁用）：
			moveTo()：接收新位置的x、y坐标值；
			moveBy()：接收的是在水平和垂直方向上移动的像素数。
				例：
				window.moveTo(0,0); //将窗口移动到屏幕左上角
				window.moveBy(100,200);  //将窗口向下移动100px，向右移动200px

	8.14 窗口大小：（跨浏览器确定窗口大小）

		以下四个属性在各浏览器判定不一致：
				innerWidth、innerHeight
				outerWidth、outerHeight

		页面视口：
			document.documentElement.clientWidth //页面视口宽度
			document.documentElement.clientHeight //页面视口高度
			document.body.clientWidth //
			document.body.clientHeight

		取得页面视口的通用代码：
			例：
			var pageWidth = window.innerWidth,
				pageHeight = window.innerHeight;

			if (typeof pageWidth != "number") {
				if(document.conpatMode == "CSS1Compat"){ //检查是否处于标准模式
					pageWidth = document.documentElement.clientWidth;
					pageHeight = document.documentElement.clientHeight;
				} else {
					pageWidth = document.body.clientWidth;
					pageHeight = document.body.clientHeight;
				}
			}

		调整窗口位置：
			resizeTo()
			resizeBy()
			这两个方法有可能在浏览器中禁用。

	8.15 导航和打开窗口
			window.open()
			window.close()

		*window.opener：新创建的window对象有一个opener属性，其中保存着打开它的原始窗口对象。

		如果是浏览器内置的屏蔽程序阻止弹出窗口，那么window.open()很可能返回null。此时只要检测这个返回的值就可以确定弹出窗口是否被屏蔽了。
			例：
			var wroxWin = window.open("http://www.xrox.com","_blank");
			if (wroxWin == null) {
				alert("The popup was blocked!");
			}

		如果是浏览器扩展或其他程序阻止的弹出窗口，那么window.open()常会抛出一个错误。因此要想准确检测弹出窗口是否被屏蔽，要将window.open()调用封装在一个try-catch块中：
			var blocked = false;
			try {
				var worxWin = window.open("http://www.wrox.com","_blank");
				if (wroxWin == null) {
					alert("The popup was blocked!");
				}
			} catch (ex){
				blocked = true;
			}

			if (blocked) {
				alert("The popup was blocked!");
			}


	8.16 超时调用和间歇调用
		JavaScript是单线程语言，但允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行。

		1. setTimeout()方法
			两个参数：要执行的代码、以毫秒表示的时间
				1）要执行的代码建议以函数形式传入，不建议直接传入字符串（会有性能损失）
				2）第二个参数表示等待时间，但经过该时间代码不一定会执行。是告诉JavaScript再过多长时间把当前任务添加到队列中。

			调用setTimeout()之后，该方法会返回一个数值ID，表示超时调用。这个超时调用ID是计划执行代码的唯一标识符，可以通过它来取消超时调用。要取消尚未执行的超时调用计划，可以调用clearTimeout()方法并将相应的超时调用ID作为参数传递给它。
				例：
				var timeoutId = setTimeout(function(){
					alert("Hello world!");
				},1000);
				clearTimeout(timeoutId);

			注：超时调用的代码都在全局作用域中执行，因此函数中的this值在非严格模式下指向window对象，严格模式是undefined。

		2. setInterval()方法
			两个参数：要执行的代码、以毫秒表示的时间

			取消间歇调用：clearInterval()

			1）取消间歇调用的重要性要远远高于取消超时调用。
				例：
				var num = 0;
				var max = 10;
				var intervalId = null;
				function incrementNumber(){
					num++;
					//如果执行次数达到了max设定的值，则取消后续尚未执行的调用
					if(num==max){
						clearInterval(intervalId);
						alert("Done");
					}
				}
				intervalId = setInterval(incrementNumber, 500);

			2）一般认为，使用超时调用来模拟间歇调用是一种最佳模式。
				例：
				var num = 0;
				var max = 10;
				function incrementNumber(){
					num++;
					//如果执行次数未达到max设定的值，则设置另一次超时调用
					if(num<max){
						setTimeout(incrementNumber, 500);
					} else{
						alert("Done");
					}
				}
				setTimeout(incrementNumber,500);


	8.17 系统对话框
		1. alert()
		2. confirm()
			为了确定用户是单击了OK还是Cancel，可以检查confirm()方法返回的布尔值：
				例：
					if(confirm("Are you sure?")){
						alert("I'm so glad you're sure!");
					} else {
						alert("I'm sorry to hear you're not sure.");
					}

		3. prompt()
			prompt()方法接受两个参数：
				1）要显示给用户的文本提示
				2）文本输入域的默认值（可以是空字符串）
				如果用户单击了OK按钮，则prompt()返回文本输入域的值；如果用户单击了Cancel或没有单击OK而通过别的方式关闭了对话框，则该方法返回null。
					例：
					var result = prompt("What is your name?", "");
					if (result !== null) {
						alert("Welcome, " + result);
					}

		4. print()
			window.print()

		5. find()
			window.find()




8.2 location对象

8.3 navigator对象

8.4 screen对象

8.5 history对象


