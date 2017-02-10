# Document
## Properties
- **`document.characterSet`** (read-only)  
    Returns the character set being used by the document.
    
- **`document.doctype`** (read-only)  
    Returns the Document Type Definition (DTD) of the current document.
    
- **`document.documentURI`** (read-only)  
    Returns the document location as a string.

- **`document.URL`** (read-only)  
    Returns the document location as a string.
```javascript
console.log(document.documentURI === document.URL);  // true
```

- **`document.domain`** (read-only)  
     Returns the domain of the current document.

- **`document.location`** (read-only)  
     Returns a Location object, which contains information about the URL of the document and provides methods for changing that URL and loading another URL. Though `document.location` is a read-only Location object, you can also assign a DOMString to it. This means that you can work with document.location as if it were a string in most cases: `document.location = 'http://www.example.com'` is a synonym of `document.location.href = 'http://www.example.com'`.

- **`document.referrer`** (read-only)  
    Returns the URI of the page that linked to this page. The value is an empty string if the user navigated to the page directly.
 
- **`document.implementation`** (read-only)  
    Returns the DOM implementation associated with the current document.
    
- **`document.visibilityState`**  (read-only)   
    Returns a string denoting the visibility state of the document. Possible values are `visible`,  `hidden`,  `prerender`, and `unloaded`.

- **`Document.designMode`**  
    Gets/sets the ability to edit the whole document.

- **`document.dir`** (read-only)  
    Gets directionality (rtl/ltr) of the document

- **`document.readyState`** (read-only)
    Returns loading status of the document.
    values: `loading`, `interactive`, `complete`.
    When the value of this property changes a `readystatechange` event fires on the document object.
    
    
    
- **`document.defaultView`** (read-only)  
    Returns a reference to the `window` object.

- **`document.documentElement`** (read-only)  
    Returns the Element that is a direct child of the document. For HTML documents, this is normally the `<html>` element.

- **`document.styleSheets`** (read-only)  (not HTMLCollection)  
    Returns a list of the style sheet objects on the current document.

- **`document.scripts`** (read-only)  (HTMLCollection)  
    Returns all the `<script>` elements on the document.

- **`document.activeElement`** (read-only)  
    Returns the currently focused element.

- **`document.head`** (read-only)  
    Returns the `<head>` element of the current document.
    
- **`document.body`**
    Returns the `<body>` element of the current document.

- **`document.title`**
    Sets or gets title of the current document.

- **`document.cookie`**  
    Returns a semicolon-separated list of the cookies for that document or sets a single cookie.
    
- **`document.embeds`** (read-only)  (get HTMLCollection)
    Returns a list of the embedded `<embed>` elements within the current document.
    
- **`document.plugins`** (read-only)  (get HTMLCollection)
    Returns an `HTMLCollection` object containing one or more `HTMLEmbedElements` or null which represent the `<embed>` elements in the current document.

```javascript
console.log(document.embeds === document.plugins);  // true
```

> An HTMLCollection in the HTML DOM is live; it is automatically updated when the underlying document is changed. HTMLCollection has `length` property(read-only) and `item()` , `namedItem()` methods.

- **`document.forms`** (read-only)  (get HTMLCollection)
    Returns a list of the <form> elements within the current document.

- **`document.images`** (read-only)  (get HTMLCollection)
    Returns a list of the images in the current document.

- **`document.links`** (read-only)  (get HTMLCollection)
    Returns a list of all the hyperlinks in the document.

- **`document.lastModified`** (read-only)
    Returns the date on which the document was last modified.


### Event handlers
The Web platform provides several ways to get notified of DOM events.

Two common styles are: the generalized `addEventListener()` and a set of specific `on-event` handlers.

The **on-event** handlers are a group of properties offered by DOM elements (both interactive - such as links, buttons, images, forms - and not), the base document itself, and so on, to help manage how that element reacts to events like being clicked, detecting pressed keys, getting focus, etc. -- and they are usually named accordingly, such as `onclick`, `onkeypress`, `onfocus`, etc.

####EventTarget
EventTarget is an interface implemented by objects that can receive events and may have listeners for them.  
`element`, `document`, and `window` are the most common event targets, but other objects can be event targets too, for example XMLHttpRequest, AudioNode, AudioContext, and others.  
Many event targets (including elements, documents, and windows) also support setting event handlers via on... properties and attributes.

##### EventTarget's methods

- `EventTarget.addEventListener()`
- `EventTarget.removeEventListener()`
- `EventTarget.dispatchEvent()` ???












