# same-Tank
<p>same-Tank is a JavaScript library that allows you to create and manipulate elements on a webpage in a similar way to the popular game diep.io.

#Installation
<p>-To use same-Tank, you can either download the library from GitHub and include it in your project, or install it using npm:

#GUI_create
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

#GUI_create_Modal
<p>-The GUI_create_Modal function allows you to create a Modal element on your webpage. A Modal element is a plate. It takes the following parameters:

<p>.id: The id of the Modal element.
<p>.Class: The class of the Modal element.
<p>.x: The x-coordinate of the Modal.
<p>.y: The y-coordinate of the Modal.
<p>.width: The width of the Modal.
<p>.height: The height of the Modal.
<p>.color: The background color of the Modal.
<p>.borderColor: The border color of the Modal.
  
GUI_create_slider
The GUI_create_slider function allows you to create a slider element on your webpage. It takes the following parameters:

id: The id of the slider element.
Class: The class of the slider element.
min: The minimum value of the slider.
max: The maximum value of the slider.
step: The step value of the slider.
value: The initial value of the slider.
x: The x-coordinate of the slider.
y: The y-coordinate of the slider.
width: The width of the slider.
height: The height of the slider.
callback: A callback function that will be called when the slider value changes.
Text_create
The Text_create function allows you to create a text element on your webpage. It takes the following parameters:

id: The id of the text element.
Class: The class of the text element.
x: The x-coord
y: The y-coordinate of the text element.
text: The text content of the element.
  
GUI_changeName
The GUI_changeName function allows you to change the text content of an element on your webpage. It takes the following parameters:

id: The id of the element you want to change the text content of.
text: The new text content of the element.
GUI_hide_or_show
The GUI_hide_or_show function allows you to hide or show an element on your webpage. It takes the following parameters:

type: The type of the element you want to hide or show, either "id" or "class".
id_class: The id or class name of the element you want to hide or show.
truefalse: A boolean value indicating whether to hide or show the element. If no value is provided, the function will reverse the current visibility state of the element.
  
GUI_delete
The GUI_delete function allows you to delete an element from your webpage. It takes the following parameters:

type: The type of the element you want to delete, either "id" or "class".
id_class: The id or class name of the element you want to delete.
