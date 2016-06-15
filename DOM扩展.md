 DOM扩展

11.1 选择符API
	level 1 核心两个方法：querySelector()和querySelectorAll()

	11.11 querySelector()方法
		接收一个CSS选择符，返回与该模式匹配的第一个元素，如果没找到就返回null。

	11.12 querySelectorAll()方法
		同样接收CSS选择符，但返回的匹配元素的NodeList实例。
		只要传给querySelectorAll()方法的CSS选择符有效，该方法都会返回一个NodeList对象，如果没找到匹配元素，NodeList对象就是空的。
			例：
			var ems = document.getElementById("myDiv").querySelectorAll("em"); //取得某<div>中的所有<em>元素。
	如果传入的选择符不被支持或者有语法错误，就会抛出错误。

	11.13 matchesSelector()方法（接收一个CSS选择符，如果调用元素与该选择符匹配，返回true）
		在取得某个元素引用的情况下，使用这个方法能够检测它是否会被querySelector()或querySelectorAll()方法返回。
		详情：P288

11.2 元素遍历
	Element Traversal API为DOM元素添加了以下5个属性：(解决返回节点的不一致性)
		1. childElementCount:返回子元素（不包括文本节点和注释）的个数
		2. firstElementChild:
		3. lastElementChild:
		4. previousElementSibling:
		5. nextElementSibling:

		利用这些元素，可以不必担心空白文本节点。

		代码实例：详见P289

11.3 HTML5

	11.31 与类相关的补充
		HTML5新增了很多API，简化CSS类的用法。
		1.getElementsByClassName()方法：
			接收一个包含一或多个类名的字符串，返回带有指定类的所有元素的NodeList。
			传入多个类名时，类名的先后顺序不重要。
			调用这个方法时，只有位于调用元素子树中的元素才会返回。

		2. classList属性
			用于添加或删除类名：
				1）add()
				2）contain()
				3）remove()
				4）toggle():如果列表中已有，则删除，如果列表中没有，则添加。

				例：
				div.classList.remove("user");

			以前，用className删除某个特定的属性，相对比较繁琐，详见下：
				例：//删除"user"类：
					var classNames = div.className.split(/\s+/); //首先，取得类名字符串，并拆分成数组
					var pos = -1,
						i,
						len;
					for(i=0;  len=classNames.length; i++){
						if(classNames[i] == "user"){
							pos = i;
							break;
						}
					}
					//删除类名
					classNames.splice(i,1);

					//把剩下的类名拼成字符串并重新设置
					div.className = classNames.join(" ");

	11.32 焦点管理
		document.activeElement属性：
			始终会引用DOM中当前获得了焦点的元素。

		元素获得焦点的方式:
			页面加载、用户输入（通常用TAB）、在代码中调用focus()方法。

			例：
				var button = document.getElementById("myButton");
				button.focus();
				alert(document.activeElement === button); //true

		document.hasFocus()方法
		详见P291

	11.33 HTMLDocument的变化
		HTML5为HTMLDocument增加新的功能。

			1. readyState属性:检测是否加载完成
				值：loading或complete

				例：
					if(document.readyState == "complete"){
						//执行操作
					}

			2. 检测兼容模式：document.compatMode
				表示浏览器采用了那种渲染模式：
					标准模式值："CSS1Compat"
					混杂模式值："BackCompat"

			3. 新增document.head属性
				兼容方式获取head元素：
					var head = document.head || document.getElementsByTagName("head")[0];

	11.34 字符集属性：document.charset

	11.35 自定义数据属性：
			HTML5规定可以为元素添加非标准的属性吗，但要添加前缀data-，目的是为元素提供与渲染无关的信息。
				例：
				//<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
			可以通过元素的dataset属性来访问自定义属性的值：
				例：
				var div = document.getElementById("myDiv");
				//取得属性值
				var appId = div.dataset.appId; //这时的访问不需要加data-前缀
				//设置属性值
				div.dataset.myname = "Mike";
				//检测是否有某属性的值：
				if(div.dataset.myname){
					//代码
				}

	11.36 插入标记（用于给文档插入大量新HTML标记的情况，直接插入HTML字符串）
		
		1. innerHTML属性：
		
		2. outerHTML属性：
			读模式：返回调用它的元素和所有子节点。
			写模式：创建新的DOM子树，然后用这个DOM子树完全替换调用元素。

		3. insertAdjacentHTML()方法：
			接收两个参数：
				1） 插入位置：
					"beforebegin"：插入为前一个同辈元素
					"afterbegin"：插入为第一个子元素
					"beforeend"：插入为最后一个子元素
					"afterend"：插入为下一个同辈元素
				2） 要插入的HTML文本

		4. 内存与性能问题
			在使用innerHTML、outerHTML属性和insertAdjacentHTML()方法时，最好先手工删除要被替换的元素的所有事件处理程序和JavaScript对象属性。

			在插入大量新HTML标记时，使用innerHTML属性与通过多次DOM操作先创建节点再指定关系相比，效率要高得多。
			这是因为，在设置innerHTML或outerHTML时，会创建一个HTML解析器。这个解析器是在浏览器级别的代码（通常是C++编写）基础上运行的，因此比执行JavaScript快得多。
			不过，创建和销毁HTML解析器也会带来性能损失。所以最好控制设置innerHTML或outerHTML的次数：

				例：
					//避免下述频繁设置的操作
					for(var i=0, len=values.length; i<len; i++){
						ul.innerHTML += "<li>" + values[i] + "</li>";
					}//每循环一次就要读取两次innerHTML，效率很低。

					//优化做法：单独构建字符串，最终一次性将结果字符串赋值给innerHTML：
					var itemsHtml = "";
					for(var i=0, len=values.length; i<len; i++){
						itemsHtml += "<li>" + values[i] + "</li>";
					}
					ul.innerHTML = itemsHtml;
					//这个例子高效很多，只对innerHTML执行一次赋值操作。

	11.37 scrollIntoView()方法
		scrollIntoView()方法可以在所有HTML元素上调用，将调用的元素出现在视口中。

		参数：
			true：调用元素的顶部与视口顶部平齐
			false：调用元素会尽可能出现在视口（可能的话，调用元素的底部与视口底部平齐）

			例：
			document.forms[0].scrollIntoView();



11.4 专有扩展
	11.41 文档模式（document mode）
		通过document.documentMode属性可以知道给定页面使用的是什么文档模式。

	11.42 children属性

	11.43 contains()方法
		接收一个参数（节点），检测该节点是不是调用属性节点的后代节点
			例：
			alert(document.documentElement.contains(document.body)); //true 检测html元素中是否包含body节点（document.documentElement指向html元素）。

		使用DOM Level3的 compareDocumentPosition()也可以确定节点间关系。返回一个位掩码。

		*各浏览器通用的contains函数写法：（结合能力检测）
			P300

	11.44 插入文本
		1. *innerText属性
			可以操作元素中包含的所有文本内容，包括子文档树中的文本。
				例：
				//<div id="content">
				//	<p>This is a <strong>paragraph</strong> with a list following it.</p>
				//	<ul>
				//		<li>Item 1</li>
				//		<li>Item 2</li>
				//		<li>Item 3</li>
				//	</ul>
				//</div>

				alert(document.getElementById("content").innerText);
				//会返回下列字符串
				//This is a paragraph with a list following it.
				//Item 1
				//Item 2
				//Item 3

			由于不同浏览器处理空白符的方式不同，因此输出的文本可能也可能不会包含原始HTML代码的缩进。
				//用innerText属性设置文本
				document.getElementById("content").innerText = "Hello world!";
				//如此一来，页面的HTML代码就会变成：
				//<div id="content">Hello world!</div>
			设置innerText永远只会生成当前节点的一个子文本节点。为了确保只生成一个子文本节点，就必须要对文本进行HTML编码（会将html标记转义）
 				
 				//去掉div内的所有html标记
				div.innerText = div.innerText;

			详见P303


		2. outerText属性
			outerText属性在写模式下，会替换整个元素：
				例：
				div.outerText = "Hello world!";
				//相当于如下两行代码
				var text = document.createTextNode("Hello world!");
				div.parentNode.replaceChild(text,div);
			本质上，新的文本节点会完全取代调用outerText的元素，此后该元素就从文档中被删除，无法访问。


	11.45 滚动
		除了scrollIntoView()之外，还有几个关于滚动的方法可以使用。

		下面列出的几个方法都是对HTMLElement类型的拓展，可以在所有元素中调用。
			1. scrollIntoViewIfNeeded(alignCenter);
			2. scrollByLines(lineCount);
			3. scrollByPages(pageCount);

			P303

