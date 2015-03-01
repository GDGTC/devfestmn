var FocusManager = 
    {
        show_kb_on_pass: true,
        focused_element: "no element",
        last_insert_length: 0,
        
        backspace: function(to_backspace)
        {
            FocusManager.focused_element.addEventListener("blur",  FocusManager.element_blur);

            if(to_backspace == "symbol")
            {
                if(FocusManager.focused_element != "no element")
                {
                    var left = FocusManager.focused_element.selectionStart;
                    var right = FocusManager.focused_element.selectionEnd;
                    
                    // Delete selection or previous element
                    if(right == left)
                        left -= 1;
                    
                    var a = FocusManager.focused_element.value.substring(0, left);
                    var b = FocusManager.focused_element.value.substring(right, FocusManager.focused_element.value.length);
                    
                    FocusManager.focused_element.value = a + b;
                    
                    FocusManager.focused_element.selectionStart = left;
                    FocusManager.focused_element.selectionEnd   = left;                    
                }
            }
            
            FocusManager.focused_element.removeEventListener("blur", FocusManager.element_blur);
        },
        
        return_pressed: function()
        {
            // Post form request
            $(FocusManager.focused_element).closest("form").submit();
        },
        
        tab_pressed: function()
        {
            Keyboard.keep_kb_alive = true;
  
            var parent_form = $(FocusManager.focused_element).closest('form');
            var index_org = $("input").index($(FocusManager.focused_element));
            FocusManager.focused_element = $('input:eq(' + (index_org + 1) + ')');
            setTimeout('FocusManager.focused_element.focus()', 0);
        },
        
        really_append_text_to_last_focused: function(text)
        {
            var tmp = FocusManager.focused_element;
            // FocusManager.focused_element = FocusManager.last_focused;
            // console.log(FocusManager.focused_element);
            FocusManager.really_append_text(text);
            
            // FocusManager.focused_element = tmp;            
        },
        
        really_append_text: function(text)
        {
            if(FocusManager.focused_element != "no element")
            {
                FocusManager.focused_element.focus();                
                
                var left = FocusManager.focused_element.selectionStart;
                var right = FocusManager.focused_element.selectionEnd;
                
                FocusManager.last_insert_length = text.length;
                
                var a = FocusManager.focused_element.value.substring(0, left);
                var b = FocusManager.focused_element.value.substring(right, FocusManager.focused_element.value.length);
            
                FocusManager.focused_element.value = a + text + b;
                
                //FocusManager.focused_element.select();
                FocusManager.focused_element.selectionStart = left + FocusManager.last_insert_length;
                FocusManager.focused_element.selectionEnd   = left + FocusManager.last_insert_length;  
            }
        },
        
        append_text: function(text)
        {
            if(typeof FocusManager.focused_element == "object")
                FocusManager.focused_element.addEventListener("blur",  FocusManager.element_blur);            
            BrowserSpecific.dispatchMessage("klvkbd_appendText", text);            
            if(typeof FocusManager.focused_element == "object")            
                FocusManager.focused_element.removeEventListener("blur", FocusManager.element_blur);
        },
        
        element_blur: function(event)
        {
            this.focus();
        },
        
        element_focus: function(event)
        {
            if(this.type.toLowerCase() == "text"   ||
               this.type.toLowerCase() == "search" ||
               this.type.toLowerCase() == "password" ||
               this.type.toLowerCase() == "email")
            {
                if(FocusManager.focused_element != this && !Keyboard.user_moved)
                {
                    Keyboard.recalculate = true;
                    BrowserSpecific.dispatchMessage("klvkbd_shouldRecalculate", true);
                }
                FocusManager.last_focused = FocusManager.focused_element;
                FocusManager.focused_element = this;                                                                                                              
                if(!Keyboard.attached)
                {
                    Keyboard.attached = true;
                    // Keyboard.insert_keyboard($(this).parent(), "en", true);
                }
            }
            else
            {
                FocusManager.last_focused = FocusManager.focused_element;
                FocusManager.focused_element = "no element";
            }
        },

        
        parse_for_input: function()
        {
            var forms = $('input');
            
            for(var i = 0; i < forms.length; i++)
            {
                if($(forms[i]).attr("kl_vkbd_parsed") == "true") continue;
                $(forms[i]).attr("kl_vkbd_parsed", "true");
                
                forms[i].addEventListener("focus", FocusManager.element_focus);                
                forms[i].addEventListener("focus", function(e)
                                          {
                                              // console.log(e);
                                              if((FocusManager['show_kb_on_pass'] == true || FocusManager['show_kb_on_pass'] == "true") && (this.type.toLowerCase() == "password"))
                                              {                                                
                                                var relativeObject = this;  
                                                if($(relativeObject).parents("form").length != 0)
                                                    relativeObject = $(relativeObject).parents("form")[0];
                                                var offset = $(relativeObject).offset();
                                                
                                                BrowserSpecific.dispatchMessage("kb_appear", {top: offset.top,
                                                                                              left: offset.left,
                                                                                              height: $(relativeObject).height(),
                                                                                              width: $(relativeObject).width(),
                                                                                              screenX: (window.top != window)?e.screenX:0,
                                                                                              screenY: (window.top != window)?e.screenY:0,
                                                                                              windowLocation: window.location.href});
                                              }
                                          });
                forms[i].addEventListener("blur",  function()
                                          {
                                              FocusManager.focused_element = "no element";
                                              BrowserSpecific.dispatchMessage("kb_toggle", "");
                                          });
            }
        }
    }