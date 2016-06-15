DOM2和DOM3

	DOM1级主要定义的是HTML和XML文档的底层结构。DOM2和DOM3级则在这个结构的基础上引入了更多的交互能力，也支持了更高级的XML特性。
	DOM2和DOM3级分为许多模块（模块之间有某种关联），分别描述了DOM的某个非常具体的子集。

	模块如下
		1. DOM2级核心 - DOM Level 2 Core
		2. DOM2级视图 - DOM Level 2 Views
		3. DOM2级事件 - DOM Level 2 Events
		4. DOM2级样式 - DOM Level 2 Style
		5. DOM2级遍历和范围 - DOM Level 2 Traversal and Range
		6. DOM2级HTML - DOM Level 2 HTML


12.1 DOM变化

	检测浏览器是否支持相应模块：
		var supportsDOM2Core = document.implementation.hasFeature("Core", "2.0");
		var supportsDOM3Core = document.implementation.hasFeature("Core", "3.0");
		var supportsDOM2HTML = document.implementation.hasFeature("HTML", "2.0");
		var supportsDOM2Views = document.implementation.hasFeature("Views", "2.0");
		var supportsDOMXML = document.implementation.hasFeature("XML", "2.0");

	12.11 针对XML命名空间的变化
	......

	12.12 其他方面的变化
	......



12.2 样式

	在HTML中定义样式的方式有3种：
		1. 通过<link/>元素包含外部样式表文件
		2. 使用<style/>元素定义嵌入式样式
		3. 使用style特性定义针对特定元素的样式。

	要确定浏览器是否支持DOM2级定义的CSS能力：
		var supportsDOM2CSS = document.implementation.hasFeature("CSS","2.0");
		var supportsDOM2CSS2 = document.implementation.hasFeature("CSS2","2.0"); 
		*//为什么要用两行判定？

	12.21 访问元素的样式（Style对象）
		任何支持style特性的HTML元素在JS中都有一个对应的style属性（是个对象）。
			*这个style对象是CSSStyleDeclaration的实例，包含着通过HTML的style特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表经层叠而来的样式。

			在style特性中指定的任何CSS属性都将表现为这个style对象的相应属性。
			使用短划线的CSS属性名，必须将其转换成驼峰大小写形式，才能通过JavaScript来访问。其中一个不能直接转换的CSS属性就是float（保留字），对应的是cssFloat，IE对应的是styleFloat。
			所有度量值都必须指定度量单位。

				例：
					var myDiv = document.getElementById("myDiv");
					myDiv.style.backgroundColor = "red";
					myDiv.style.width = "100px";
					myDiv.style.height = "200px";
					myDiv.style.border = "1px solid black";

		1. DOM样式——Style对象的属性和方法
			1）cssText
			2）length
			3）parentRule：表示css信息的CSSRule对象。
			4）getPropertyCSSValue(propertyName)：返回包含给定属性值的CSSValue
			5）getPropertyPriority(propertyName)：
			6）getPropertyValue(propetrtyName)：
			7）item(index)
			8）removeProperty(propertyName)
			9）setProperty(propertyName,value,priority)

			设置cssText是为元素应用多项变化最快捷的方式。

			length属性的目的，是与item()方法配套使用，以便迭代在元素中定义的CSS属性。
				例：
					for(var i=0, len=myDiv.style.length; i<len; i++){
						alert(myDiv.style[i]); //或者myDiv.style.item(i);
					}


		2. 计算的样式（document.defaultView.getComputedStyle()）
			DOM2级样式增强了document.defaultView，提供了getComputedStyle()方法：
				两个参数：目标元素、伪元素字符串（如果不需要为元素，第二个参数可以是null）

				getComputedStyle()返回一个CSSStyleDeclaration对象（与style属性的类型相同），其中包含当前元素所有的计算样式。*（但综合属性不一定返回）

			IE不支持getComputedStyle()方法，可以用currentStyle属性替代。	


			*注： 最重要的一条，是要记住所有计算的样式都是只读的，不能修改计算后样式对象中的CSS属性。


	12.22 操作样式表
		document.styleSheets集合

		......
		1. cssRules：其属性...

		2. insertRule()：向现有样式表添加新规则

		3. deleteRule()：从样式表中删除规则


	12.23 元素大小
		
		1. 取得偏移量的4个属性：
			offsetHeight:元素在垂直方向占用的空间大小
			offsetWidth:水平方向...
			offsetLeft:元素左外边框至包含元素左内边框的距离
			offsetTop:元素上外边框至包含元素上内边框的距离。

			offsetLeft和offsetTop属性与包含元素有关，而包含元素的引用保存在offsetParent属性中。而offsetParent属性不一定等于parentNode的值。（offsetParent属性需要找到祖先元素最近的具有大小的元素）。

			获取元素在页面上偏移量的自定义函数：（P321）
			getElementTop()和getElementLeft()......


			这些偏移量属性都是只读的，每次访问需要重新计算，为提高性能，若需要频繁访问可以保存在局部变量中。

		2. 客户区大小
			clientWidth:内容区宽度+内边距宽度
			clientHeight:...

			确定浏览器视口大小：使用document.documentElement或document.body的clientWidth和clientHeight属性。

				例：
				function getViewport(){
					if(document.compatMode == "BackCompat"){ //检查是否是混杂模式
						return { //混杂模式
							width: document.body.clientWidth,
							height: document.body.clientHeight
						};
					} else {
						return{ //标准模式
							width: document.documentElement.clientWidth,
							height: document.documentElement.clientHeight
						};
					}
				}

		3. 滚动大小
			scrollHeight: 元素内容的总高度
			scrollWidth: 元素内容的总宽度
			scrollLeft: 被隐藏在内容区左侧的像素数，设置这个属性可以改变元素的滚动位置。
			scrollTop: 被隐藏在内容区域上方的像素数，设置这个属性可以改变元素的滚动位置。

			例：页面内容的总高度：document.documentElement.scrollHeight

			对于不包含滚动条的页面，scrollWidth和scrollHeight与clientWidth和clientHeight之间的关系并不清晰（浏览器标准不一，详见P323）

			在确定文档的总高度时（包括基于视口的最小高度时），必须取得scrollWidth/clientWidth和scrollHeight/clientHeight中的最大值，保证跨浏览器下的结果精确：
				var docHeight = Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight);
				var docWidth = Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth);

			注：对于运行在混杂模式下的IE，需要用document.body替代document.documentElement。

		4. 确定元素大小

			getBoundingClientRect(): 返回一个矩形对象，包含四个属性：left、top、right、bottom，给出了元素在页面中相对于视口的位置。

				注：IE8以前返回的位置与当代浏览器(0,0)不同，左上角坐标默认为(2,2)。

				跨浏览器取得元素大小的函数：P325......



12.3 遍历
	“DOM2级遍历和范围”模块定义了两个用于辅助完成顺序遍历DOM结构的类型：NodeIterator和TreeWalker。这两个类型能够基于给定的起点对DOM结构执行深度优先的遍历操作。

	检测浏览器对DOM2级遍历能力的支持情况：
		var supportsTraversals = document.implementation.hasFeature("Traversal","2.0");
		var supportsNodeIterator = (typeof document.createNodeIterator == "function");
		var supportsTreeWalker = (typeof document.createTreeWalker == "function");

	DOM遍历是深度优先（depth-first）的DOM结构遍历。遍历顺序详见P327图示

	*1. NodeIterator
		使用document.createNodeIterator()方法创建NodeIterator类型的实例。

		4个参数：
			root
			whatToShow
			filter
			entityReferenceExpansion

			其中，whatToShow参数是一个位掩码，通过应用一或多个过滤器（filter）来确定要访问那些节点。这个参数的值以常量形式在NodeFilter类型中定义。详见P328。 

			例：遍历某<div>元素中的所有元素：
				var div = document.getElementById("div1");
				var iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, null, false);
				var node = iterator.nextNode();
				while (node!==null){
					alert(node.tagName);
					node = iterator.nextNode();
				}

				如果指向返回遍历中遇到的<li>元素，只要使用一个过滤器即可：

				var div = document.getElementById("div1");
				var filter = function(node){
					return node.tagName.toLowerCase() == "li" ?
						NodeFilter.FILTER_ACCEPT :
						NodeFilter.FILTER_SKIP;
				};
				var iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, filter, false);

				var node = iterator.nextNode();
				while(node!==null){
					alert(node.tagName);
					node = iterator.nextNode();
				}

		由于nextNode()和previousNode()方法都基于NodeIterator在DOM结构中的内部指针工作，所以DOM结构的变化会反映在遍历的结果中。

	*2. TreeWalker

		TreeWalker是NodeIterator的一个更高级版本。除了包括nextNode()和previousNode()在内的相同功能之外，这个类型还提供了在不同方向遍历DOM结构的方法：

			parentNode()
			firstChild()
			lastChild()
			nextSibling()
			previousSibling()

		创建TreeWalker对象要使用document.createTreeWalker()方法。
			4个参数：与document.createNodeIterator()方法相同。

		详见P331

		TreeWalker真正强大的地方在于能够在DOM结构沿着任何方向移动。

		TreeWalker类型还有一个属性，叫currentNode，表示任何遍历方法在上一次便利中返回的节点。通过给这个属性赋值（节点）也可以修改遍历继续进行的起点。


12.4 范围
	












	
