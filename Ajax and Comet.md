# Ajax与Comet


>	Ajax是Asynchronous JavaScript + XML缩写。能够向服务器请求额外的数据而无需卸载页面，会带来更好的用户体验。

>	Ajax技术的核心是XMLHttpRequest对象（XHR对象）。

>	可以使用XHR对象取得新数据，然后再通过DOM将新数据插入到页面中。虽然名字中包含XML的成分，但Ajax通信与数据格式无关，这种技术无需刷新页面即可从服务器取得数据，但不一定是XML数据。


## 21.1 创建XMLHttpRequest对象

	var xhr = new XMLHttpRequest();

### 20.11 XHR的用法
	
####1. 使用XHR对象时，要调用的第一个方法是`open()`。  
>	接受3个参数：
>>	1. 要发送请求的类型（"get""post"等）  
>>	2. 请求的URL
>>	3. 表示是否异步发送请求的布尔值;
	
			xhr.open("get","example.php","false");

			这行代码会启动一个针对example.php的GET请求。
			URL相对于执行代码的当前页面；
			调用open()方法并不会真正发送请求，而只是启动一个请求以备发送；

####2.  要发送特定的请求，必须调用`send()`方法：

			xhr.open("get","example.txt","false");
			xhr.send(null);

			send()方法接收一个参数，作为请求主体发送的数据。
			如果不需要通过请求主体发送数据，则必须传入null（这个参数对于有些浏览器是必需的）。
			调用send()之后，请求会被分配到服务器。

####3.  同步请求：
			如果请求是同步的，JS代码会等到服务器响应之后继续执行。
			在收到响应后，响应数据会自动填充XHR对象的以下属性：
				1. responseText: 作为响应主体被返回的文本。
				2. responseXML: 如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着相应数据的XML DOM文档。
				3. status: 响应的HTTP状态。
				4. statusText: HTTP状态的说明。

			在接到响应后，第一步是检查status属性，以确定响应已经成功返回（状态码200作为成功的标志）。此时，responseText属性的内容已经就绪。状态代码为304表示请求的资源并没有被修改，可以至二级使用浏览器中的缓存版本；当然，也意味着响应是有效的。

			检测上述两种状态码：
				xhr.open("get","example.txt",false);
				xhr.send(null);
				//同步请求时，代码执行到这里会暂停，等待响应后再继续执行。如果是异步请求，则需要设定触发事件。
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
					alert(xhr.responseText);
				} else {
					alert("Request was unsuccessful: " + xhr.status);
				}

			建议通过检测status来决定下一步的操作，不要依赖statusText（跨浏览器不够一致）。

			不论内容类型是什么，响应主体的内容都会保存到responseText属性中。（而对于非XML数据而言，responseXML属性的值将为null）

####4. 异步请求：
			多数情况下，我们需要发送异步请求：
				
				*通过检测XHR对象的readyState属性，该属性表示请求/响应过程的当前活动阶段。
					0：未初始化。尚未调用open()方法。
					1：启动。已经调用open()方法，但尚未调用send()方法。
					2：发送。已经调用send()方法，但尚未接收到响应。
					3：接收。已经接收到部分相应数据。
					4：完成。已经接收到全部相应数据，而且已经可以在客户端使用。

			每当readyState属性的值发生变化时，都会触发一次readyStatechange事件。可以利用这个事件来检测每次状态变化后的readyState值。
				通常，我们只对readyState值为4的阶段感兴趣，因为这时所有数据都已经就绪。
				不过，必须在调用open()之前指定onreadystatechange事件处理程序。（保证跨浏览器兼容）

				例：
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function(){
						if (xhr.readyState == 4){
							if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
								alert(xhr.responseText);
							} else {
								alert("Request was unsuccessful: " + xhr.status);
							}
						}
					};
					xhr.open("get","example.php",true);
					xhr.send(null);

					//这里没有使用this对象，原因是onreadystatechange事件处理程序的作用域问题（浏览器差异），因此使用实际的XHR对象实例变量是较为可靠的方式。

			另外，在接收到响应之前，还可以调用abort()方法来取消异步请求：
				xhr.abort();

				调用这个方法之后，XHR对象会停止触发事件，而且也不再允许访问任何与响应有关的对象属性。在终止请求之后，还应该对XHR对象进行解引用操作。


### 21.12 HTTP头部信息
		每个HTTP请求和响应都会带有相应的头部信息。
		XHR对象也提供了操作这两种头部（请求头部和响应头部）信息的方法。

		默认情况下，在发送XHR请求的同时，还会发送下列头部信息：
			1. Accept：浏览器能够处理的内容类型。
			2. Accept-Charset：浏览器能够显示的字符集。
			3. Accept-Encoding：浏览器能够处理的压缩编码。
			4. Accept-Language：浏览器当前设置的语言。
			5. Connection：浏览器和服务器之间的连接类型。
			6. Cookie：当前页面设置的任何Cookie。
			7. Host：发出请求的页面所在的域。
			8. Referer：发出请求的页面的URI。（注意，这个头部字段拼写有误，对应的单词是referrer）
			9. User-Agent：浏览器的用户代理字符串。

		自定义头部信息：setRequestHeader()方法可以设置自定义的请求头部信息。这个方法接收两个参数：头部字段的名称和头部字段的值。
			要成功发送请求头部信息，必须在调用open()方法之后且调用send()方法之前调用setRequestHeader()。

			var xhr = createXHR();
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4) {
					if((xhr.status >= 200 && xhr.status <300) || xhr.status == 304){
						alert(xhr.responseText);
					} else {
						alert("Requset was unsuccessful: " + xhr.status);
					}
				}
			};
			xhr.open("get","example.php",true);
			xhr.setRequsetHeader("MyHeader","MyValue");
			xhr.send(null);

			服务器在接收到这种自定义的头部信息之后，可以执行相应的后续操作。（建议避免使用默认的头部字段名称，可能有的浏览器不允许覆盖默认头部字段）。

		获取头部字段：
			调用XHR对象的getResponseHeader()方法并传入头部字段名称。
			调用gerAllResponseHeaders()方法则可以获取一个包含所有头部信息的长字符串。在没有自定义信息的情况下，getAllResponseHeaders()方法通常会返回多行文本，如下：
				Date: Sun, 14 Nov 2004 18:04:03 GMT
				Server: Apache/1.3.29 (Unix)
				Vary: Accept
				X-Powered-By: PHP/4.3.8
				Connection: close
				Content-Type: text/html; charset=iso-8859-1

###	21.13 GET请求
		常用于向服务器查询某些信息。必要时，可以将查询字符串参数追加到URL末尾，以便将信息发送给服务器。
		*对于XHR而言，位于传入open()方法的URL末尾的查询字符串必须经过正确的编码。

			使用get请求经常会发生一个错误，就是查询字符串的格式有问题。查询字符串中每个参数的名称和值必须使用 encodeURIComponent()进行编码，然后才能放到URL的末尾；而且，所有名-值对儿都必须由和号（&）分隔：
				例：
				xhr.open("get","example.php?name1=value1&name2=value2",true);

			下面这个函数可以辅助向现有URL的末尾添加查询字符串参数：
				function addURLParam(url,name,value){
					url += (url.indexOf("?") == -1 ? "?" : "&");
					url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
					return url;
				}

			下面是使用这个函数来构建请求URL的示例：
				var url = "example.php";

				url = addURLParam(url, "name" , "Nicholas");
				url = addURLParam(url, "book", "Professional JavaScript");

				xhr.open("get", url, false);
			在这里使用 addURLParam()函数，可以确保查询字符串的格式良好，并可靠地用于XHR对象。

###	21.14 POST请求
		用于向服务器发送应该被保存的数据。  
		POST请求应该把数据作为请求的主体提交。

		发送POST请求的第二步，就是向send()方法中传入某些数据。

			默认情况下，服务器对POST请求和提交Web表单的请求并不会一视同仁。因此，服务器端必须有程序来读取发送过来的原始数据。
			*XHR模仿表单提交：
				1. 将Content-Type头部信息设置为：application/x-www-form-urlencoded，也就是表单提交时的内容类型
				2. 以适当的格式创建字符串。POST数据的格式与查询字符串格式相同，如果需要将页面中表单的数据进行序列化，然后再通过XHR发送到服务器。可以使用14章介绍的serialize()函数来创建这个字符串：
				例：
					function submitData(){
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function(){
							if (xhr.readyState == 4){
								if ((xhr.status >= 200 && xhr.status <300) || xhr.status == 304) {
									alert(xhr.responseText);
								} else {
									alert("Request was unsuccessful: " + xhr.status);
								}
							}
						};

						xhr.open("post","postexample.php",true);
						xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
						var form = document.getElementById("user-info");
						xhr.send(serialize(form));

	POST请求会比GET消耗更多资源，性能上看，GET请求的速度最快可以是POST请求的两倍。


## 21.2 XMLHttpRequest 2级
	
###	21.21 FormData
		快捷地将表单数据序列化。

		新建一个FormData类型的实例对象，并将数据传入其中，然后可以直接将其传给XHR的send()方法。
			例：
				var data = new FormData(document.forms[0]);  //将文档第一个表单的数据传入data对象中。

			或者我们可以用append()方法把键值对传入data对象：
				var data = new FormData();
				data.append("name","Nicholas");

			完整实例：
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4) {
						if ((xhr.status >= 200 && xhr.status<300) || xhr.status == 304) {
							alert(xhr.responseText);
						} else {
							alert("Request was unsuccessful: " + xhr.status);
						}
					}
				};

				xhr.open("post","postexample.php",true);
				var form = document.getElementById("user-info");
				xhr.send(new FormData(form));

		优点：不必明确地在XHR对象上设置请求头部。

###	*21.22 超时设定
		XHR的timeout属性。
		在给timeout设置了一个数值后，如果在规定的时间内浏览器还没有接收到响应，就会触发timeout事件，进而调用ontimeout事件处理程序。

		不过，请求终止时，会调用ontimeout事件处理程序。但此时readyState可能已经改变为4了，这意味着会调用onreadystatechange事件处理程序。如果在超时终止请求后在访问status属性，就会导致错误。为避免浏览器报错，可以将检查status属性的语句封装一个 try-catch 语句当中。
			示例：
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4) {
					try{
						if ((xhr.status>=200 && xhr.status<300) || xhr.status == 304) {
							alert(xhr.responseText);
						}else{
							alert("Request was unsuccessful: " + xhr.status);
						}
					} catch(ex){
						//假设由ontimeout事件处理程序处理
					}
				}
			};

			xhr.open("get","timeout.php",true);
			xhr.timeout = 1000;
			xhr.ontimeout = function(){
				alert("Request did not return in a second.");
			};
			xhr.send(null);

###	21.23 overrideMimeType()方法
		重写XHR响应的MIME类型。

		例：服务器返回的MIME类型是text/plain，但数据中实际包含的是XML。根据MIME类型，即使数据是XML，responseXML属性中仍然是null。通过调用overrideMimeType()方法，可以保证把响应当作XML而非纯文本来处理。
			var xhr = new XMLHttpRequest();
			xhr.open("get","text.php",true);
			xhr.overrideMimeType("text/xml");  //调用overrideMimeType()必须在send()方法之前。
			xhr.send(null);


##21.3 进度事件
	Progress Events规范

	六个进度事件：
		1. loadstart：在接收到响应数据的第一个字节时触发。
		2. progress：在接收响应期间时续不断地触发。
		3. error：在请求发生错误时触发。
		4. abort：在因为调用abort()方法而终止连接时触发。
		5. load：在接收到完整的响应数据时触发。
		6. loadend：在通信完成或者触发error、abort或load事件后触发。

		每个请求都从触发loadstart事件开始，接下来是一个或多个progress事件，然后触发error、abort或load事件中的一个，最后以触发loadend事件结束。

###	21.31 load事件
		响应接收完毕后将触发load事件，因此也就没必要检查readyState属性了。而onload事件处理程序会接收到一个event对象，其target属性就指向XHR对象实例，因而可以访问到XHR对象的所有方法和属性。
		然而，并非所有浏览器都为这个事件实现了适当的事件对象。 结果开发人员还是要像下面这样被迫使用XHR对象变量：
			例：
			var xhr = new XMLHttpRequest();
			xhr.onload = function(){
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status==304){
					alert(xhr.responseText);
				} else {
					alert("Request was unsuccessful: " + xhr.status);
				}
			}; 
			xhr.open("get", "altevents.php", true);
			xhr.send(null);
		只要浏览器接收到服务器的响应，不管其状态如何，都会触发load事件。因此需要检查status属性，才能确定数据是否真的可用。

###	21.32 progress事件
		progress事件会在浏览器接收新数据期间周期性地触发。

		*onprogress事件处理程序会接收到一个event对象，其target属性是XHR对象，但包含着三个额外属性：
			1. lengthComputable：进度信息是否可用（布尔值）。
			2. position：已经接收的字节数。
			3. totalSize：根据Content-Length响应头部确定的预期字节数。

		有了这些信息，我们可以为用户创建一个进度指示器：
			例：
			var xhr = new XMLHttpRequest();
			xhr.onload = function(event){
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
					alert(xhr.responseText);
				} else {
					alert("Request was unsuccessful: " + xhr.status);
				}
			};
			xhr.onprogress = function(event){
				var divStatus = document.getElementById("status");
				if(event.lengthComputable){
					divStatus.innerHTML = "Received " + event.position + " of " +event.totalSize + " bytes";
				}
			};

			xhr.open("get","altevents.php",true);
			xhr.send(null);

		为确保正常执行，必须在调用open()方法之前添加onprogress事件处理程序。


##21.4 跨源资源共享
	通过XHR实现Ajax通信的一个主要限制：跨域安全策略。
	默认情况下，XHR对象只能访问与包含它的页面位于同一个域中的资源。不过，实现合理的跨域请求也有必要。

	CORS（Cross-Origin Resource Sharing，跨源资源共享），定义了在必须访问跨源资源时，浏览器与服务器应该如何沟通。
	CORS基本思想：使用自定义的HTTP头部让浏览器和服务器进行沟通，从而决定请求或响应是应该成功还是失败。

	例：
		在发送请求时，需要附加一个额外的Origin头部，其中包含请求页面的源信息（协议、域名和端口），以便服务器根据这个头部信息来决定是否予以响应。
		如果服务器认为这个请求可以接受，就在Access-Control-Allow-Origin头部中回发相同的源信息（如果是公共资源，可以回发"*"）。
		如果没有这个头部，或者源信息不匹配，浏览器就会驳回请求。注意，请求和响应都不包含cookie信息。


###	21.41 IE对CORS的实现
		IE8中引入了XDR（XDomainRequest）类型。这个对象与XHR类似，但能实现安全可靠的跨域通信。

		XDR与XHR的不同点：
			1. cookie不会随请求发送，也不会随响应返回。
			2. 只能设置请求头部信息中的Content-Type字段。
			3. 不能访问响应头部信息。
			4. 只支持GET和POST请求。
		这些变化使CSRF（Cross-Site Request Forgery，跨站点请求伪造）和XSS（Cross-Site Scripting，跨站点脚本）的问题得到了缓解。被请求的资源可以根据它认为合适的任意数据（用户代理、来源页面等）来决定是否设置Access-Control-Allow-Origin头部。作为请求的一部分，Origin头部的值表示请求的来源域，以便远程资源明确地识别XDR请求。

		XDR对象的使用方法与XHR对象非常相似，也是创建一个XDomainRequest的实例，调用open()方法，再调用send()方法。但XDR对象的open()方法只接收两个参数：请求的类型和URL。

		所有XDR请求都是异步执行的，不能用它来创建同步请求。请求返回之后，会触发load事件，响应的数据也会保存在responseText属性中。
			例：
			var xdr = new XDomainRequest();
			xdr.onload = function(){
				alert(xdr.responseText);
			};
			xdr.onerror = function(){
				alert("An error occurred.");
			};
			xdr.open("get","http://www.somewhere-else.com/page/");
			xdr.send(null);
		在接收到响应后，你只能访问响应的原始文本，没有办法确定响应的状态代码。响应有效就会触发load事件，无效（包括响应中缺少Access-Control-Allow-Origin头部）会触发error事件（只能得知请求未成功）。 
			鉴于导致XDR请求失败的因素很多，因此建议不要忘记通过onerror事件处理程序来捕获该事件，否则，即使请求失败也不会有任何提示。

		在请求返回前调用 abort() 方法可以终止请求：
			xdr.abort();

		与XHR一样，XDR对象也支持timeout属性以及ontimeout事件处理程序。
			例：
			var xdr() = new XDomainRequest();
			xdr.onload = function(){
				alert(xdr.responseText);
			};
			xdr.onerror = function(){
				alert("An error occurred.");
			};
			xdr.timeout = 1000;
			xdr.ontimeout = function(){
				alert("Request took too long.");
			};
			xdr.open("get", "http://www.somewhere-else.com/page/");
			xdr.send(null);

		为了支持POST请求，XDR对象提供了contentType属性，表示发送数据的格式。
			例：
			var xdr = new XDomainRequest();
			xdr.onload = function(){
				alert(xdr.responseText);
			};
			xdr.onerror = function(){
				alert("An error occurred.");
			};
			xdr.open("get","http://www.somewhere-else.com/page/");
			xdr.contentType = "application/x-www-form-urlencoded";
			xdr.send(null);
			这个属性是通过XDR对象影响头部信息的唯一方式。


###	21.42 其他浏览器对CORS的实现
		通过XMLHttpRequest对象实现了对CORS的原生支持。

		要请求位于另一个域中的资源，使用标准的XHR对象，并在 open() 方法中传入绝对URL即可。
			例：
			var xhr = new XMLHttpRequest();
			xhr.onload = function(){
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					alert(xhr.responseText);
				} else {
					alert("Request was unsuccessful: " + xhr.status);
				}
			};
			xhr.open("get", "http://www.somewhere-else.com/page/", true);
			xhr.send(null);

		与IE的XDR对象不同，通过跨域XHR对象可以访问status和statusText属性，而且还支持同步请求。
		跨域XHR对象也有一些限制（为了安全）：
			1. 不能使用 setRequestHeader() 设置自定义头部。
			2. 不能发送和接收cookie。
			3. 调用 gerAllResponseHeaders()方法总会返回空字符串。

			由于无论同源和跨源请求都是用相同的接口。对于本地资源，最好使用相对URL，在访问远程资源时再使用绝对URL。
	
###	21.43  Preflighted Requests 
		一种透明服务器验证机制，支持开发人员使用自定义的头部、GET或POST之外的方法、以及不同类型的主体内容。
		
		在使用下列高级选项来发送请求时，就会向服务器发送一个Preflight请求。这种请求使用OPTIONS方法，发送下列头部：
			1. Origin：与简单的请求相同
			2. Access-Control-Request-Method：请求自身使用的方法
			3. Access-Control-Request-Headers：（可选）自定义的头部信息，多个头部以逗号分隔。

			例：
				以下是一个带有自定义头部NCZ的使用POST方法发送的请求。
				Origin: http://www.nczonline.net
				Access-Control-Request-Method: POST
				Access-Control-Request-Headers: NCZ

		发送请求后，服务器可以决定是否允许这种类型的请求。服务器通过在响应中发送如下头部与浏览器进行沟通。
			1. Access-Control-Allow-Origin: 与简单的请求相同
			2. Access-Control-Allow-Methods: 允许的方法，多个方法以逗号分隔
			3. Access-Control-Allow-Headers: 允许的头部，多个头部以逗号分隔
			4. Access-Control-Max-Age: 应该将这个Preflight请求缓存多长时间（单位为秒）

			例：
				Access-Control-Allow-Origin: http://www.nczonline.net
				Access-Control-Allow-Methods: POST, GET
				Access-Control-Allow-Headers: NCZ
				Access-Control-Max-Age: 1728000

		Preflight请求结束后，结果将按照响应中指定的时间缓存起来。而为此付出的代价只是第一次发送这种请求时会多一次HTTP请求。


###	21.44 带凭据的请求
		默认情况下，跨源请求不提供凭据（cookie、HTTP认证及客户端SSL证明等）。通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据。如果服务器接受带凭据的请求，会用下面的HTTP头部来响应：
			Access-Control-Allow-Credentials: true
		如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给JavaScript（于是，responseText中将是空字符串，status的值为0，而且会调用onerror()事件处理程序）。另外，服务器还可以在Preflight响应中发送这个HTTP请求，表示允许源发送带凭据的请求。

###	21.45 *跨浏览器的CORS
		检测XHR是否支持CORS的最简单方式，就是检查是否存在withCredentials属性。再结合检测XDomainRequest对象是否存在，就可以兼顾所有浏览器：

			function createCORSRequest(method, url){
				var xhr = new XMLHttpRequest();
				if ("withCredentials" in xhr) {
					xhr.open(method, url, true);
				} else if (typeof XDomainRequest != "undefined"){
					xhr = new XDomainRequest();
					xhr.open(method,url);
				} else {
					xhr = null;
				}
				return xhr;
			}

			var request = createCORSRequest("get", "http://www.somewhere-else.com/page/");
			if(request){
				request.onload = function(){
					//对request.responseText进行处理
				};
				request.send();
			}

	其他浏览器的XMLHttpRequest对象与IE中的XDomainRequest对象类似，也提供了相应的接口。两个对象的共同属性和方法如下（这些方法都可以在createCORSRequest()函数返回的对象中使用）：
		1. abort()：用于停止正在进行的请求
		2. onerror：用于替代onreadystatechange检测错误
		3. onload：用于替代onreadystatechange检测成功
		4. responseText：用于取得响应内容
		5. send()：用于发送请求


## 21.5 其他跨域技术
	
###	21.51 图像Ping
		与服务器进行简单、单向的跨域通信的一种方式。

		请求的数据通过查询字符串形式发送，响应则可以是任意内容，但通常是像素图或204响应。
		通过图像Ping，浏览器得不到任何具体的数据，但通过侦听load和error事件，可以知道响应是什么时候接收到的。
			例：
			var img = new Image();
			img.onload = img.onerror = function(){
				alert("Done!")
			};
			img.src = "http://www.example.con/test?name=Nicholas";

			这里创建了一个Image的实例，然后将onload和onerror事件处理程序指定为同一个函数。这样无论是什么响应，只要请求完成，就能得到通知。
			请求从设置src属性那一刻开始，而这个例子在请求中发送了一个name参数。

		图像Ping常用于跟踪用户点击页面或动态广告曝光次数。
		缺点：只能发送GET请求，并且无法访问服务器的响应文本。

###	21.52 JSONP（JSON with padding）
		JSONP是被包含在函数调用中的JSON。例：
			callback({"name":"Nicholas"});

		JSONP由两部分组成：回调函数和数据。
			回调函数是当响应到来时应该在页面中调用的函数。回调函数的名字一般是在请求中指定的。
			数据就是传入回调函数中的JSON数据。

			典型的JSONP请求，例：
				http://freegeoip.net/json/?callback=handleResponse

			这个URL是在请求一个JSONP地理定位服务。通过查询字符串来制定JSON服务的回调参数是很常见的，就像上面的URL所示，这里指定的回调函数名字叫handleResponse()。

		JSONP通过动态<script>元素来使用，使用时可以为src属性指定一个跨域URL。与<img>一样，<script>元素可以跨域加载资源。
		因为JSONP是有效的JavaScript代码，所以在请求完成后，即在JSONP响应加载到页面中以后，就会立即执行。
			*例：
			function handleResponse(response){
				alert("You're at IP address " + response.ip + ", which is in " + response.city + ", " +response.region_name);
			}

			var script = document.createElement("script");
			script.src = "http://freegeoip.net/json/?callback=handleResponse";
			document.body.insertBefore(script, document.body.firstChild);

		优点：能够直接访问响应文本，支持在浏览器和服务器之间双向通信。

		不足：
			1. JSONP从其他域加载代码执行，若引用的域不安全，就会有安全风险。
			2. 确定JSONP请求是否失败并不容易。HTML5给<script>元素新增了一个onerror事件处理程序，不过目前尚未得到浏览器支持。

###	21.53 Comet
		一种更高级的Ajax技术（服务器推送）。
		Ajax是从页面向服务器请求数据的技术，而Comet则是一种服务器项页面推送数据的技术。
		Comet可以让信息近乎实时地被推送到页面上，非常适合处理体育比赛的分数和股票报价。

		两种实现Comet的方式：长轮询、流。
		



			








		







