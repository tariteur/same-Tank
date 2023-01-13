# same-Tank
<p>same-Tank is a JavaScript library that allows you to create and manipulate elements on a webpage, However, the styles of the elements created with the same-Tank library are only usable on the diep.io game.

## Installation
<p>-To use same-Tank, // @require https://greasyfork.org/scripts/456843-diep-shortcut/code/diep_Shortcut.js?version=1138235

## GUI_create
<p>-The GUI_create function allows you to create a button element on your webpage. It takes the following parameters:

<p>.id: The id of the button element.
<p>.Class: The class of the button element.
<p>.text: The text displayed on the button.
<p>.x: The x-coordinate of the button.
<p>.y: The y-coordinate of the button.
<p>.width: The width of the button.
<p>.height: The height of the button.
<p>.color: The background color of the button.
<p>.border: The border of the button.
<p>.fontSize: The font size of the button.
<p>.callback: A callback function that will be called when the button is clicked.
<p>.ONOFF: The initial state of the button.
  
```javascript
GUI_create(id, Class, text, x, y,width, height, color, border, fontSize, callback, ONOFF)
```
  
## GUI_create_Modal
<p>-The GUI_create_Modal function allows you to create a Modal element on your webpage. A Modal element is a plate. It takes the following parameters:

<p>.id: The id of the Modal element.
<p>.Class: The class of the Modal element.
<p>.x: The x-coordinate of the Modal.
<p>.y: The y-coordinate of the Modal.
<p>.width: The width of the Modal.
<p>.height: The height of the Modal.
<p>.color: The background color of the Modal.
<p>.borderColor: The border color of the Modal.
  
```javascript
GUI_create_Modal(id, Class, x, y, width, height, color, borderColor)
```
## GUI_create_slider
<p>The GUI_create_slider function allows you to create a slider element on your webpage. It takes the following parameters:

<p>.id: The id of the slider element.
<p>.Class: The class of the slider element.
<p>.min: The minimum value of the slider.
<p>.max: The maximum value of the slider.
<p>.step: The step value of the slider.
<p>.value: The initial value of the slider.
<p>.x: The x-coordinate of the slider.
<p>.y: The y-coordinate of the slider.
<p>.width: The width of the slider.
<p>.height: The height of the slider.
<p>.callback: A callback function that will be called when the slider value changes.
  
```javascript
GUI_create_slider(id, Class, min, max, step, value, x, y, width, height, callback)
```
## Text_create
<p>The Text_create function allows you to create a text element on your webpage. It takes the following parameters:

<p>.id: The id of the text element.
<p>.Class: The class of the text element.
<p>.x: The x-coord
<p>.y: The y-coordinate of the text element.
<p>t.ext: The text content of the element.
  
```javascript
Text_create(id, Class, x, y, text)
```
## GUI_changeName
<p>The GUI_changeName function allows you to change the text content of an element on your webpage. It takes the following parameters:

<p>.id: The id of the element you want to change the text content of.
<p>.text: The new text content of the element.
  
```javascript
GUI_changeName(id, text)
```
## GUI_hide_or_show
<p>The GUI_hide_or_show function allows you to hide or show an element on your webpage. It takes the following parameters:

<p>type: The type of the element you want to hide or show, either "id" or "class".
<p>.id_class: The id or class name of the element you want to hide or show.
<p>.truefalse: A boolean value indicating whether to hide or show the element. If no value is provided, the function will reverse the current visibility state of the <p>element.
  
```javascript
GUI_hide_or_show(type, id_class, truefalse)
```
# GUI_delete
<p>The GUI_delete function allows you to delete an element from your webpage. It takes the following parameters:

<p>.type: The type of the element you want to delete, either "id" or "class".
<p>.id_class: The id or class name of the element you want to delete.
  
```javascript
GUI_delete(type, id_class) 
```
