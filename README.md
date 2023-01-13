# same-Tank
how to use:

-create a button:
    GUI_create(id, Class, text, x, y,width, height, color, border, fontSize, callback, ONOFF)
    
-create a Modal:
// Modal is a plate
   GUI_create_Modal(id, Class, x, y, width, height, color, borderColor)

-create GUI_create_slider:
   GUI_create_slider(id, Class, min, max, step, value, x, y, width, height, callback)
   
-create Text_create:
   Text_create = (id, Class, x, y, text)

-create GUI_changeName:
   GUI_changeName(id, text)
   
-create GUI_hide_or_show:
   // if you are not true or false, it will reverse the current state
   GUI_hide_or_show(type, id_class, truefalse)
   
-create GUI_delete:
   GUI_delete(type, id_class)
