## Document

- **`document.characterSet`** (read-only)  
    Returns the character set being used by the document.
    
- **`document.doctype`** (read-only)  
    Returns the Document Type Definition (DTD) of the current document.
    
- **`document.documentElement`** (read-only)  
    Returns the Element that is a direct child of the document. For HTML documents, this is normally the `<html>` element.
    
- **`document.documentURI`** (read-only)  
    Returns the document location as a string.
    
- **`document.domain Read only`**  
     Returns the domain of the current document.
    
- **`document.implementation`** (read-only)  
    Returns the DOM implementation associated with the current document.
    
- **`document.styleSheets`** (read-only)  
    Returns a list of the style sheet objects on the current document.
    
- **`document.visibilityState`**  (read-only)   
    Returns a string denoting the visibility state of the document. Possible values are `visible`,  `hidden`,  `prerender`, and `unloaded`.

- **`Document.designMode`**  
    Gets/sets the ability to edit the whole document.

- **`document.dir`** (read-only)  
    Gets directionality (rtl/ltr) of the document
    
    
    
### Extension for HTML document
- **`document.activeElement`** (read-only)  
    Returns the currently focused element.

- **`document.head`** (read-only)  
    Returns the `<head>` element of the current document.
    
- **`document.body`**
    Returns the `<body>` element of the current document.
    
- **`document.cookie`**  
    Returns a semicolon-separated list of the cookies for that document or sets a single cookie.
    
- **`document.defaultView`** (read-only)  
    Returns a reference to the `window` object.
    
- **`document.embeds`** (read-only)  (get HTMLCollection)
    Returns a list of the embedded `<embed>` elements within the current document.

> An HTMLCollection in the HTML DOM is live; it is automatically updated when the underlying document is changed. HTMLCollection has `length` property(read-only) and `item()` , `namedItem()` methods.

- **`document.forms`** (read-only)  (get HTMLCollection)
    Returns a list of the <form> elements within the current document.

- **`document.images`** (read-only)  (get HTMLCollection)
    Returns a list of the images in the current document.






















