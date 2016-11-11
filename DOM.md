#DOM

##10.1 节点层次
DOM可以将任何HTML或XML文档描绘成一个由多节点构成的结构。节点分为几种不同的类型，每种类型分别表示文档中不同的信息或标记。每个节点都拥有各自的特点。

文档节点（Document）是每个文档的根节点。
html中，文档节点的子节点是<html>元素，即文档元素，也是整个文档的最外层元素。
Xml中，没有预定义的元素，因此任何元素都可能成为文档元素。

HTML元素通过元素节点表示，特性（attribute）通过特性节点表示，文档类型通过文档类型节点表示，而注释则通过注释节点表示。
总共有12种节点类型。都承自一个基类型。

###10.11 Node类型
JavaScript中的所有节点类型都继承自Node类型，因此所有节点类型共享相同的基本属性和方法。
每个节点都有一个nodeType属性，用于表明节点的类型。

节点类型：在Node类型中定义的下列12个数值常量来表示：

1. Node.ELEMENT_NODE  (1);
2. Node.ATTRIBUTE_NODE  (2);
3. Node.TEXT_NODE  (3);
4. Node.CDATA_SECTION_NODE  (4);
5. Node.ENTITY_REFERENCE_NODE  (5);
6. Node.ENTITY_NODE  (6);
7. Node.PROCESSING_INSTRUCTION_NODE  (7);
8. Node.COMMENT_NODE  (8);
9. Node.DOCUMENT_NODE  (9);
10. Node.DOCUMENT_TYPE_NODE  (10);
11. Node.DOCUMENT_FRAGMENT_NODE  (11);
12. Node.NOTATION_NODE  (12);

**检测节点类型：nodeType属性**  
有两种判定方式：
```javascript
	//1
	if(someNode.nodeType == Node.ELEMENT_NODE){ //IE中无效，建议将nodeType属性和数字值比较
		alert("Node is an element.");
	}
	//2
	if(someNode.nodeType == 1){ //适用于所有浏览器
		alert("Node is an element.")
	}
```

####1. nodeName和nodeValue属性
这两个属性的值取决于节点的类型。
对于元素节点，nodeName中保存的始终是元素标签名，而nodeValue的值则为null。

####2. 节点关系
childNodes属性：里面保存着Nodelist对象。
	1）NodeList：一种类数组对象，用于保存一组有序的节点。可以通过方括号语法来访问NodeList的值，也有length属性，不过它并不是Array的实例。NodeList实际上是基于DOM结构动态执行查询的结果，因此DOM结构的变化能够自动反应在NodeList对象中。
	2）访问保存在NodeList中的节点：(1)方括号、(2)item()方法。
```javascript
		var firstChild = someNode.childNodes[0];
		var secondChild = someNode.childNodes.item(1);
		var count = someNode.childNodes.length; //表示的是访问NodeList的那一刻，其中包含的节点数量
```

将NodeList对象转换为数组：
	*对arguments对象使用 Array.prototype.slice()方法可以将其转换为数组。//？？这个怎么写
	采用同样的方法，可以将NodeList对象转换为数组。
	例：
```javascript
	var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes,0);
	//IE8之前，将NodeList实现为一个COM对象，因此NodeList转换为数组，必须手动枚举。
	function convertToArray(nodes){
		var array = null;
		try{
			array = Array.prototype.slice.call(nodes,0); //针对非IE浏览器
		} catch(ex){
			array = new Array();
			for(var i=0, len=nodes.length; i<len; i++){
				array.push(nodes[i]);
			}
		}
		return array;
	}
	convertToArray(someNode.childNodes);
```

			parentNode属性：该属性指向父节点。

			previousSibling属性：指向前一个同胞节点。（首节点的previousSibling属性值为null）

			nextSibling属性：指向后一个同胞节点。（末节点的nextSibling属性值为null）

			firstChild属性：someNode.firstChild的值始终等于someNode.childNodes[0]。

			lastChild属性：someNode.lastChild的值始终等于someNode.childNodes[someNode.childNodes.length-1]。

			hasChildNodes()方法：在节点包含一或多个子节点的情况下返回true。

			ownerDocument属性：指向表示整个文档的文档节点（所有节点都有这个属性）。

			//注：并不是每种类型都有子节点。

####3. 操作节点
			appendChild(); 向childNodes列表的末尾添加一个节点。添加节点后，childNodes的新增节点、父节点以及最后一个子节点的关系指针都会相应更新。最后，appendChild()返回新增的节点。
				例：
					var returnedNode = someNode.appendChild(newNode);
					alert(returnedNode == newNode); // true
					alert(someNode.lastChild == newNode); //true
				如果传入appendChild()的节点已经是文档的一部分，结果就将该节点从原来的位置转移到新位置。

			insertBefore(); 参数：要插入的节点、作为参照的节点。
							插入节点后，被插入的节点会变成参照节点的前一个同胞节点，同时被方法返回。
							如果参照节点是null，则insertBefore()与appendChild()执行相同的操作。

			replaceChild(); 参数：要插入的节点、要替换的节点。
							返回被替换掉的节点。
			
			removeChild(); 参数：将要移除的节点。
							返回被移除的节点。

####4. 其他方法
			有两个方法是所有节点都有的：cloneNode()和normalize()

			cloneNode();  参数：一个布尔值，表示是否执行深复制。参数为true时执行深复制（复制整个节点树），false时执行浅复制（只复制节点本身）。
							复制后返回的节点副本属于文档所有，但因为尚未指定父节点，因此还需要通过appendChild()、insertBefore()或replaceChild()将它添加到文档中。
			normalize(); 用于处理文档树中的文本节点。如果找到空文本节点，则删除；如果找到相邻的文本节点，则合并。


		注：deepList.childNodes.length在IE8以前版本和后续版本之间对空白字符的判定不一致（P253）



	10.12 Document类型
		在浏览器中，document对象是HTMLDocument（继承自Document类型）的一个实例，表示整个HTML页面。
		而且，document对象是window对象的一个属性，因此可以将其作为全局对象访问。
		特征：
			1. nodeType：9
			2. nodeName："#document"
			3. nodeValue：null
			4. parentNode：null
			5. ownerDocument：null
			6. 子节点：可能是一个DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction、Comment

		1. 属性：用于访问子节点
			访问子节点<html>：
			1）documentElement属性：始终指向<html>元素。
			2）通过childNodes列表访问
				例：
				var html = document.documentElement; //取得对<html>的引用
				alert(html === document.childNodes[0]); //true
				alert(html === document.firstChild); //true

			访问子节点<body>：
			body属性：直接指向<body>元素。
				例：
				var body = document.body; //取得对<body>的引用

			访问子节点DocumentType：
			doctype属性：
				var doctype = document.doctype; //取得对<!DOCTYPE>的引用

			浏览器都支持document.documentElement属性和document.body属性。但对document.doctype属性的支持有差别。

		2.属性：用于显示文档信息
			作为HTMLDocument的一个实例，document对象还有一些标准的Document对象所没有的属性，这些属性提供了document对象所表现的网页的一些信息。

			1）title属性
				包含着<title>元素中的文本内容。
					例：
						var originalTitle = document.title; //取得文档标题
						document.title = "New page title"; //设置稳当标题

			2）URL属性
				包含着页面完整的URL（即地址栏中显示的URL）。
					var url = document.URL;	//取得完整的URL
			3）domain属性
				只包含着域名。
					var domain = document.domain; //取得域名
			4）referrer属性
				保存着连接到当前页面的那个页面的URL，在没有来源页面时，此属性可能包含空字符串。
					var referrer = document.referrer; //取得来源页面的URL

			进一步学习：P256，关于域名设置。

		3. 方法：用于查找元素
			取得特定的某个或某组元素的引用，然后再执行一些操作。

			1）getElementById()
				如果找到相应元素即返回，若找不到则返回null。如果页面中有多个元素的ID相同，则只返回第一次出现在元素。
			
			2）getElementsByTagName()
				返回包含零或多个元素的NodeList。
				在HTML文档中，这个方法会返回一个HTMLCollection对象，作为一个“动态”集合，该对象与NodeList非常类似：
					var images = document.getElementsByTagName("img");
				这行代码会将一个HTMLCollection对象保存在images变量中，可以使用方括号语法或item()方法来访问HTMLCollection对象中的项。这个对象中的元素的数量则可以通过其length属性取得。
					alert(images.length); //输出图像的数量
					alert(images[0].src); //输出第一个图像元素的src特性
					alert(images.item(0).src); //输出第一个图像元素的src特性

				HTMLCollection对象还有一个方法：namedItem()。
					可以通过元素的name特性取得集合中的项（若有多项，只取得符合条件的第一项）。
					var myImage = images.namedItem("myImage"); //从img的动态集合中选出name属性值为myImage的元素。

				在提供按索引访问项的基础上，HTMLCollection还支持按名称访问项：对有name命名的项也可以使用方括号语法来访问：
					var myImage = images["myImage"];

				*对HTMLCollection而言，我们可以向方括号中传入数值或字符串形式的索引值。在后台，对数值索引会调用item()，而对字符串索引就会调用namedItem()。

				如果想取得文档中的所有元素，可以向getElementsByTagName()中传入"*"。

			3）getElementsByName()
				返回带有给定name特性的所有元素。
				最常用这个方法取得单选按钮，为了确保发送给浏览器的值正确无误，所有单选按钮必须具有相同的name特性。
				这里返回的也是一个HTMLCollection。（而namedItem()方法只会取得第一项。）

		4. 特殊集合
			除了属性和方法，document对象还有一些特殊的集合。这些集合都是HTMLCollection对象，为访问文档常用的部分提供了快捷方式。

			1）document.anchors
			2）document.applets (已不推荐使用)
			3）document.forms
			4）document.images
			5）document.links

		5. DOM一致性检测
			由于DOM分为多个级别，也包含多个部分，因此检测浏览器实现了DOM的哪些部分就十分必要了。
			document.implementation属性就是为此提供相应信息和功能的对象。其有一个hasFeature()方法：
				例：
				var hasXmlDom = document.implementation.hasFeature("XML","1.0");
				详细检测值见P259

		6. 文档写入 
			document.write()
			document.writeIn()
			document.open()
			document.close()

			其中，write()和writeIn()方法都接受一个字符串参数，write()会原样写入，writeIn()会在字符串末尾添加一个换行符（\n）。在页面加载过程中，可以使用这两个方法向页面中动态地添加内容。不过，若在文档加载结束后在调用document.write()，输出的内容将会重写整个页面。



	10.13 Element类型
		Element类型用于表现XML或HTML元素，提供了对元素标签名、子节点及特性的访问。
		特征：
			1. nodeType：1
			2. nodeName：元素的标签名
			3. nodeValue：null
			4. parentNode：可能是Document或Element
			5. 子节点：可能是Element、Text、Comment、ProcessingInstruction、CDATASection或EntityReference
		
			要访问元素的标签名，可以使用nodeName属性，也可以使用tagName属性，这两个属性返回相同的值。
				//<div id="myDiv"></div>
				var div = document.getElementById("myDiv");
				alert(div.tagName); //"DIV" 
				alert(div.tagName == div.nodeName); //true
			这里实际输出的是"DIV"而非"div"，最好在比较之前将标签名转换为相同的大小写形式：
				if(element.tagName == "div"){ //不能这样比较，容易出错！
					//在此执行某些操作
				}
				if(element.tagName.toLowerCase() == "div"){ //这样最好（适用于任何文档）
					//在此执行某些操作
				}

		1. HTML元素
			所有HTML元素都由HTMLElement类型表示，不是就直接通过这个类型，也是通过它的子类型来表示。HTMLElement类型直接继承自Element并添加了一些属性。
			标准特性：
				1）id，元素在文档中的唯一标识符
				2）title
				3）lang
				4）dir，语言的方向，值为"ltr"或"rtl"。
				5）className，与元素的class特性对应，为元素指定的CSS类
				例：
					//<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
					var div = document.getElementById("myDiv");
					alert(div.id); //"myDiv"
					alert(div.className); //"bd"
					alert(div.title); //"Body text"
					alert(div.lang); //"en"
					alert(div.dir); //"ltr"

			HTML元素与其类型汇总P263

		2. 取得特性
			getAttribute()
				var div = document.getElementById("myDiv");
				alert(div.getAttribute("id")); //"myDiv"
				alert(div.getAttribute("class")); //"bd"
				alert(div.getAttribute("title")); //"Body text"
				注意：传递给getAttribute()的特姓名与实际的特姓名相同。因此想要得到class特性值，应该传入"class"而不是"className"，后者只有在通过对象属性访问特性时才用。如果给定名称的特性不存在，getAttribute()返回null。

				通过getAttribute()方法也可以取得自定义特性的值。
					例：
					//<div id="myDiv" my_special_attribute="hello!"></div>
					这个元素包含一个名为my_special_attribute的自定义特性，值是"hello!"。可以用getAttribute()取得。
					var value = div.getAttribute("my_special_attribute");
				*不过，特性的名称是不区分大小写的。根据HTML5规范，自定义特性应该加上data-前缀以便验证。

				有两类特殊的特性，它们虽然有对应的属性名，但属性的值与通过getAttribute()返回的值并不相同。
					1. style
						通过getAttribute()返回的style特性值中包含的是css文本，而通过属性访问它则会返回一个对象。
					2. onclick
						当在元素上使用时，onclick特性中包含的是JavaScript代码；如果通过getAttribute()访问，则会返回相应代码的字符串。而在访问onclick属性时，则会返回一个JavaScript函数（如果未指定相应特性，则返回null）。因为onclick及其他事件处理程序属性本身就应该被赋予函数值。
				*由于上述两类特殊情况，在通过JavaScript以变成方式操作DOM时，开发人员经常不适用getAttribute()，而只使用对象的属性。只有在取得自定义特性值的情况下，才会使用getAttribute()方法。

			

		3. 设置特性
			1）setAttribute()
				两个参数：要设置的特性名和值。如果特性不存在，setAttribute()则创建该属性并设置相应的值。
					例：
					div.setAttribute("id","someOtherId");
					div.setAttribute("class","ft");
				通过setAttribute()方法既可以操作HTML特性，也可以操作自定义特性。通过这个方法设置的特性名会被统一转换为小写形式，"ID"最终会变成"id"。

			2）因为所有特性都是属性，所以直接给属性赋值可以设置特性的值：
				例：
					div.id = "someOtherId";
					div.align = "left";
				不过，像下面这样为DOM元素添加一个自定义的属性，给属性不会自动成为元素的特性。
					div.myColor = "red";
					alert(div.getAttribute("myColor")); //null,IE除外

			3）removeAttribute()
				用于彻底删除元素的特性，调用这个方法不仅会清除特性的值，还会从元素中完全删除特性。

		4. attributes属性
			Element类型是使用attributes属性的唯一一个DOM节点类型。

			attributes属性中包含一个NamedNodeMap对象，与NodeList类似，也是一个动态集合。元素的每一个特性都由一个Attr节点表示，每个节点都保存在NamedNodeMap对象中。

			*NamedNodeMap对象拥有下列方法：
				1） getNamedItem(name)
						返回nodeName属性等于name的节点。
				2） removeNamedItem(name)
						从列表中移除nodeName属性等于name的节点。
				3） setNamedItem(node)
						向列表中添加节点，以节点的nodeName属性为索引。
				4） item(pos)
						返回位于数字pos位置处的节点。

			attributes属性中包含一系列节点，每个节点的nodeName就是特性的名称，而节点的nodeValue就是特性的值。
				要取得元素的id特性，可以使用以下代码：
				var id = element.attributes.getNamedItem("id").nodeValue;

				以下是使用方括号语法通过特性名称访问节点的简写方式：
				var id = element.attributes["id"].nodeValue;

			调用removeNamedItem()方法与在元素上调用removeAttribute()方法的效果相同。唯一的区别是，removeNamedItem()返回表示被删除特性的Attr节点。
				var oldAttr = element.attributes.removeNamedItem("id");

			setNamedItem()是个不常用的方法，可以为元素添加一个新特性，为此需要为它传入一个特性节点：
				var element.attributes.setNamedItem(newAttr);

			*一般来说，attributes属性的上述几个方法不够方便，因此开发人员更多会直接使用getAttribute()、removeAttribute()和setAttribute()这几个直接方法。
			不过，如果想要遍历元素的特性，attributes属性可以派上用场。在需要将DOM结构序列化为XML或HTML字符串时，多数会涉及遍历元素特性。
				例：
					function outputAttribute(element){
						var pairs = new Array(),
							attrName,
							attrValue,
							i,
							len;

						for(i=0, len=element.attributes.length; i<len; i++){
							attrName = element.attributes[i].nodeName;
							attrValue = element.attributes[i].nodeValue;
							pairs.push(attrName + "=\"" + attrValue +"\"");
						}
						return pairs.join(" ");
					}
				//注： 针对attributes对象中的特性，不同浏览器的返回顺序不同。（IE7之前的效果另说P267）

		5. 创建元素
			document.createElement()方法：可以创建新元素。
				参数：要创建元素的标签名。
					例：
					var div = document.createElement("div");
					div.id = "myNewDiv";
					div.className = "box";
					document.body.appendChild(div);
			注：IE中可以用另一种方式使用createElement()——为这个方法传入完整的元素标签，可以包含属性。
				这种方式有助于避开IE7及更早版本中动态创建元素的某些问题P268

		6. 查找元素的子节点、及数目
			元素可以有任意数目的子节点和后代节点。元素的childNodes属性中包含了它所有的子节点，这些子节点有可能是元素、文本节点、注释或处理指令。

			*不过不同浏览器在看待这些节点方面存在显著的不同：P269。不同浏览器中，对空白符是否属于子节点的判定不同。

			因此，如果需要通过childNodes属性遍历子节点，就要注意浏览器之间的差别。执行某项操作以前，要先检查nodeType属性：
				例：
					for(var i=0, len=element.childNodes.length; i<len; i++){
						if(element.childNodes[i].nodeType == 1){
							//只有在子节点是元素节点时，执行某些操作
						}
					}

			如果向通过某个特定的标签名取得子节点：元素也支持getElementsByTagName()方法。通过元素调用这个方法时，只会返回当前元素的后代。
				var ul = document.getElementById("myList");
				var items = ul.getElementsByTagName("li");



	10.14 Text类型
		文本节点由Text类型表示。
		特征：
			1. nodeType：3
			2. nodeName："#text"
			3. nodeValue：节点包含的文本
			4. parentNode：是一个Element
			5. 没有子节点

		*可以通过nodeValue属性或data属性访问Text节点中包含的文本。

		操作文本节点中的文本：
			1. appendData(text)：将text添加到节点的末尾
			2. deleteData(offset,count)：从offset指定的位置开始删除count个字符
			3. insertData(offset,text)：在offset指定的位置插入text
			4. replaceData(offset,count,text)：用text替换从offset指定的位置开始到offset+count为止处的文本
			5. splitText(offset)：从offset指定的位置将当前文本节点分成两个文本节点。
			6. substringData(offset,count)：提取从offset指定的位置开始，到offset+count为止处的字符串。

		文本节点还有一个length属性：保存着节点中字符的数目。nodeValue.length和data.length中也保存着同样的值。
			//没有内容，也就没有文本节点
				//<div></div>
			//有空格，因此有一个文本节点
				//<div> </div>
			//有内容，因此有一个文本节点
				//<div>Hello World!</div>
			访问文本节点：
			例：
				var textNode = div.firstChild; //或div.childNodes[0]
			修改文本节点：
				div.firstChild.nodeValue = "Some other message";

			注意：在修改文本节点时，注意字符串会经过HTML编码，需要转义：
				例：
				div.firstChild.nodeValue = "Some <strong>other</strong> message"; //输出结果："Some &lt;strong&gt;other&lt;strong&gt; message"

		1. 创建文本节点
			document.createTextNode(); //详见P271

		2. 规范化文本节点
			element.normalize(); //将元素节点中相邻的子文本节点合并，详见P272

		3. 分割文本节点
			element.splitText(); //按照指定位置（参数为数字）分割nodeValue的值。这个方法会返回一个新文本节点，即被分割出来的新节点（原节点只剩下除去被分割的部分）。

			分割文本节点是从文本节点中提取数据的一种常用DOM解析技术。




	10.15 Comment类型
		注释在DOM中通过Comment类型表示。
			特征：
			1. nodeType：8
			2. nodeName："#comment"
			3. nodeValue：注释的内容
			4. parentNode：Document或Element
			5. 没有子节点

		Comment类型与Text类型继承自相同的基类，因此它拥有除splitText()之外的所有字符串操作方法。与Text类型相似，也可以通过nodeValue或data属性来取得注释的内容。
		使用document.createComment()并为其传递注释文本也可以创建注释节点。


	10.16 CDATASection类型
	......
	10.17 DocumentType类型
	......
	10.18 DocumentFragment类型
	......
	10.19 Attr类型
		元素的特性在DOM中以Attr类型来表示。各浏览器都可以访问Attr类型的构造函数和原型。从技术角度讲，特性就是存在于元素的attributes属性中的节点。
			特征：
			1. nodeType：2
			2. nodeName：特性的名称
			3. nodeValue：特性的值
			4. parentNode：null
			5. 没有子节点（HTML中）

		尽管它们也是节点，但特性却不被认为是DOM文档树的一部分。
		3个属性：
			name
			value
			specified（是否是默认特性）

		document.createAttribute()中传入特性名称，可以创建新的特性节点。
			*例：
			var attr = document.createAttribute("align");
			attr.value = "left";
			element.setAttributeNode(attr);	//为了将新创建的特性添加到元素中，必须使用元素的setAttributeNode()方法
			alert(element.attributes["align"].value);
			alert(element.getAttributeNode("align").value);  
			alert(element.getAttribute("align"));

		*不建议直接访问特性节点，实际上，使用getAttribute()、setAttribute()、removeAttribute()方法远比操作特性节点方便。


	
10.2 DOM操作技术
	10.21 动态脚本
		指页面加载时不存在，但将来的某一时刻通过修改DOM动态添加的脚本。

		创建动态脚本的两种方式：
		1.插入外部文件
			例：
				//常规写法
				<script type="text/javascript" src="client.js"></script>
				///动态创建写法
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "client.js";
				document.body.appendChild(script);
			在执行最后一行代码之前，不会下载外部文件。也可以把这个元素添加到<head>元素中。
			封装到函数中：
				function loadScript(url){
					var script = document.createElement("script");
					script.type = "text/javascript";
					script.src = url;
					document.body.appendChild(script);
				}
				loadScript("client.js");

		2.行内方式创建：
			例：
				//常规写法
				<script type="text/javascript">
					function sayHi(){
						alert("hi");
					}
				</script>
				///动态创建：
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.appendChild(document.createTextNode("function sayHi(){alert('hi');}"));
				document.body.appendChild(script);

				这种创建方式，在IE中会导致错误，IE将<script>视为一个特殊的元素，不允许DOM访问其子节点。不过，可以使用<script>元素的text属性来制定JavaScript代码。

				兼容、并封装到函数里的写法：
				function loadScriptString(code){
					var script = document.createElement("script");
					script.type = "text/javascript";
					try{
						script.appendChild(document.createTextNode(code));
					} catch(ex){
						script.text = code;
					}
					document.body.appendChild(script);
				}
				loadScriptString("function sayHi(){alert('hi');}");

				以这种方式加载的代码会在全局作用域中执行，而且当脚本执行后立即可用。实际上，这与在全局作用域中把相同的字符串传递给eval()是一样的。

疑问：参见text类型一节，那一节的文本值是要转义的，而这里的TextNode里的值却未经过转义，这是为什么？验证一下分别是什么规律。

	
	10.22 动态样式
		动态样式是指在页面刚加载时不存在的样式，在页面加载完成后动态添加到页面中。
			1. 动态添加<link>元素:
				//<link rel="stylesheet" type="text/css" href="styles.css">
				var link = document.createElement("link");
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = "styles.css";
				var head = document.getElementsByTagName("head")[0];
				head.appendChild(link);
				//注意，必须将<link>元素添加到<head>元素中，才能保证所有浏览器中的行为一致。

				用函数封装上述过程：
				function loadStyle(url){
					var link = document.createElement("link");
					link.rel = "stylesheet";
					link.type = "text/css";
					link.href = url;
					var head = document.getElementsByTagName("head")[0];
					head.appendChild(link);
				}
				loadStyle("styles.css");

			注：加载外部样式文件的过程是异步的，也就是加载样式与执行JavaScript代码的过程没有固定的次序。

			2. 用<style>元素包含嵌入式CSS：
				/* <style type="text/css">
					body{
						background-color:red;
					}
					</style>
				*/
				var style = document.createElement("style");
				style.type = "text/css";
				style.appendChild(document.createTextNode("body{background-color:red;}"));
				var head = document.getElementsByTagName("head")[0];
				head.appendChild(style);

				IE中上述代码会报错，因为IE将<style>视为一个特殊的元素，不允许DOM访问其子节点。（与<script>类似）

				兼容、并封装到函数里的写法：
				function loadStyleString(css){
					var style = document.createElement("style");
					style.type = "text/css";
					try{
						style.appendChild(document.createTextNode(css))
					} catch(ex){
						style.styleSheet.cssText = css;
					}
					var head = document.getElementsByTagName("head")[0];
					head.appendChild(style);
				}
				loadStyleString("body{background-color:red}");
				//这种写法对css做出的改变不是内联样式，应该不影响hover等效果？有待验证。
				如果针对IE编写代码时，务必小心使用styleSheet.cssText属性，有可能会导致浏览器崩溃。


	10.23 操作表格
		用核心DOM方法创建和修改表格太过复杂，为了方便构建表格，HTML DOM还为<table><tbody><tr>元素添加了一些属性和方法。

		1. <table>元素的属性和方法：
			.caption
			.tBodies
			.tFoot
			.tHead
			.rows
			.createTHead()
			.createTFoot()
			.createCaption()
			.deleteTHead()
			.deleteTFoot()
			.deleteCaption()
			.deleteRow(pos)
			.insertRow(pos)
		2. <tbody>元素的属性和方法：
			.rows
			.deleteRow(pos)
			.insertRow(pos)
		3. <tr>元素的属性和方法：
			.cells
			.deleteCell(pos)
			.insertCell(pos)

			例:
			//创建table
			var table = document.createElement("table");
			table.border = 1;
			table.width = "100%";

			//创建tbody
			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			//创建第一行
			tbody.insertRow(0);
			tbody.rows[0].insertCell(0);
			tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 1,1"));
			tbody.rows[0].insertCell(1);
			tbody.rows[0].cells[1].appendChild(document.createTextNode("Cell 2,1"));

			//创建第二行
			tbody.insertRow(1);
			tbody.rows[1].insertCell(0);
			tbody.rows[1].cells[0].appendChild(document.createTextNode("Cell 1,2"));
			tbody.rows[1].insertCell(1);
			tbody.rows[1].cells[1].appendChild(document.createTextNode("Cell 2,2"));

			document.body.appendChild(table);

	10.24 使用NodeList
		理解NodeList及其“近亲”NamedNodeMap和HTMLCollection，是从整体上透彻理解DOM的关键所在。

		这三个集合都是动态的。
			例：下述代码会导致无限循环。
				var divs = document.getElementsByTagName("div"),
					i,
					div;
				for(i=0; i<divs.length;i++){
					div = document.createElement("div");
					document.body.appendChild(div);
				}

				如果想使用最初的序列长度作为固定循环次数，可以先将length属性存到另一个变量里：
				var divs = document.getElementsByTagName("div"),
					i,
					len,
					div;
				for(i=0,len=divs.length; i<len; i++){
					div = document.createElement("div");
					document.body.appendChild(div);
				}
				
		一般来说，应该尽量减少访问NodeList的次数。每次访问NodeList，都会运行一次基于文档的查询。，可以考虑将从NodeList中取得的值缓存起来。





