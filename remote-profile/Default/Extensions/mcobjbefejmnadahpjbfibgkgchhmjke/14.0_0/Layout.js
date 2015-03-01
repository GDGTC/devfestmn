var Helper =
{
    swapElements: function(toDelete, toInsert)
    {
        try
        {
            // Replacing Element
            $(toDelete).after($(toInsert));
            $(toDelete).remove();
        }
        catch(err)
        {
            console.error("Error while swapping " + toDelete + " with " + toInsert + " : " + err.description);
        }
    }
}

var Layout = 
{
    button_is_down: false,
    current_timer: "",
    requested_layout: "none",
    shifted: false,
    capsed: false,
    alted: false,
    shift_button: "",
    layouts: { },    
    
    modifiers: {},
    modifiers_to_remove_on_next_click: {},
    
    get_set: function(set_name, set_class)
    {
        var layout = $("<div></div>")[0];
        layout.setAttribute("class", "kl_set");
        //layout.setAttribute("id", "kl_" + set_name + "_set");
        layout.setAttribute("id", "kl_current_set");
                
        // console.info("requested layout set: " + set_name);
        
        var set_objects = Layout.layouts[Layout.requested_layout][set_name];
        if(!set_objects)
            return set_objects;
        
        if(set_objects.length == 1) // Check if set is alias
            set_objects = Layout.layouts[Layout.requested_layout][set_objects];
        for(var i = 0; i < set_objects.length; i++)
        {
            // Check if key is modifier
            var modifier = "";
            var modifier_type = "";
            
            if(set_objects[i].split("[")[1] && set_objects[i].split("]")[0])
            {
                modifier_type = "modifier";
                modifier = set_objects[i].split("[")[1].split("]")[0];
            }
            if(set_objects[i].split("{")[1] && set_objects[i].split("}")[0])
            {
                modifier_type = "modifier_long";
                modifier = set_objects[i].split("{")[1].split("}")[0];            
            }
            if(modifier != "" && modifier_type != "")
            {
                if(modifier == "capslock")
                    layout.appendChild(Layout.make_button("capslock", false, "kl_system kl_system_capslock", modifier_type));
                else if(modifier == "shift") 
                    layout.appendChild(Layout.make_button("shift", false, "kl_system kl_system_shift", modifier_type));
                else if(modifier == "shiftUS") 
                    layout.appendChild(Layout.make_button("shift", false, "kl_system kl_system_shiftUS", modifier_type));                    
                else if(modifier == "rightshift")
                    layout.appendChild(Layout.make_button("shift", false, "kl_system kl_system_shift_right", modifier_type));
                else if(modifier == "alt")
                    layout.appendChild(Layout.make_button("alt", false, "kl_system kl_system_alt", modifier_type));
                else
                    layout.appendChild(Layout.make_button(modifier, false, set_class + " kl_modifier", modifier_type));
                
                continue;
            }
             
            // Regular buttons
            if(set_objects[i] == "tab")
                layout.appendChild(Layout.make_button("Tab", "\t", "kl_system", "tab"));
            else if(set_objects[i] == "empty")
                layout.appendChild(Layout.make_button("Empty", false, "kl_empty", "empty"));
            else if(set_objects[i] == "backspace")
                layout.appendChild(Layout.make_button("Backspace", false, "kl_system kl_system_backspace", "backspace"));
            else if(set_objects[i] == "return")
                layout.appendChild(Layout.make_button("Return", false, "kl_system kl_system_return", "return"));
            else if(set_objects[i] == "returnUS")
                layout.appendChild(Layout.make_button("Return", false, "kl_button kl_system kl_system_returnUS", "returnUS"));
            else if(set_objects[i] == "space")
                layout.appendChild(Layout.make_button(" ", " ", "kl_system kl_system_space", "symbol"));
            else if(set_objects[i] == "EOL")
                layout.appendChild(Layout.make_spacer());
            else if(set_objects[i] == "selector")
            {
                var amountOfLayout = 0;
                var requested_layout = Layout.requested_layout;
                var selector = $('<div class="kl_layout_selector kl_top_round_corners kl_bottom_round_corners"></div>');
                
                $('<div class="kl_layout_selector_icon_button" style="background-image: url(\'data:image/png;base64,' + Layout.layouts[Layout.requested_layout]["icon"] + '\') !important;"></div>').appendTo($(selector));
// $('<div class="kl_layout_selector_icon_button"></div>').appendTo($(selector));                
                $('<div class="kl_layout_selector_label_button">' + Layout.layouts[Layout.requested_layout]["name"] + '</div>').appendTo($(selector));
                
                var list_container = $('<div class="kl_layout_list_container"></div>').appendTo($(selector));
                
                var layout_selector_top = $('<div class="kl_layout_selector_option_top"></div>').appendTo($(list_container));

                for(var another_layout in Layout.layouts)
                {
                    amountOfLayout++;
                    if(Layout.requested_layout == another_layout) continue;
                    
                    var another_option = $('<div class="kl_layout_selector_option kl_layout_selector_option_middle" ' + 'locale="' + another_layout + '"></div>').hide();
                   $('<div class="kl_layout_selector_icon" style="background-image: url(\'data:image/png;base64,' + Layout.layouts[another_layout]["icon"] + '\') !important;"></div>').appendTo($(another_option));
                    $('<div class="kl_layout_selector_label">' + Layout.layouts[another_layout]["name"] + '</div>').appendTo($(another_option));
                    $(another_option).attr('locale', another_layout);
                    $(another_option).click(function(){$(Keyboard.change_layout($(this).attr('locale')));});
                    $(another_option).appendTo(list_container);
                }
                var layout_selector_bottom = $('<div class="kl_layout_selector_option_bottom"></div>').appendTo($(list_container));
                                
                $(selector).appendTo(layout);

                if(amountOfLayout <= 1)
                    continue;

                $(selector).click(function(){
                    if(!$('.kl_layout_list_container').is(":visible"))
                    {
                        $('.kl_layout_list_container').show();
                        $('.kl_layout_list_container').attr("style", "display: block; margin-top: -" + $('.kl_layout_list_container').height() + "px !important;");
                        setTimeout(function(){
                            $("body").one("click", function() {
                                $('.kl_layout_list_container').hide();
                            });                        
                        }, 100);
                    }
                    else
                    {
                        $('.kl_layout_list_container').hide();
                    }
                });                
            }
            else
                layout.appendChild(Layout.make_button(set_objects[i], set_objects[i], set_class, "symbol"));
        }
        return layout;
    },

    make_spacer: function()
    {
        var button = $("<div></div>")[0];
        button.setAttribute("class", "kl_spacer");
        button.kl_type   = "spacer";
                
        return button;
    },
    
    change_modifiers: function(from, to)
    {
        if(from == to)
            return undefined;

        for(var i = 0; i < Layout.layouts[Layout.requested_layout]["sets"].length; i++)
        {
            var available_set = Layout.layouts[Layout.requested_layout]["sets"][i];
            // console.log($("#kl_current_set")[0]);
            //var another_set = $("#kl_" + available_set + from + "_set")[0];
            var another_set = $("#kl_current_set")[0];            
            var new_set = Layout.get_set(available_set + to, "kl_" + available_set);
            if(new_set)
            {
                Helper.swapElements(another_set, new_set);
                return "true";
            }
            else
                return new_set;
        }
    },
        
    make_returnUS_button: function(text, value, kl_class, kl_type)
    {
        var button = $("<div></div>")[0];
        button.setAttribute("class", "" + kl_class);
        //button.innerText = text;
        button.value     = value;
        button.kl_type   = "return";
        button.addEventListener("mousedown", Layout.button_pressed);
        button.addEventListener("mouseup",   Layout.button_released);
        button.addEventListener("mouseout",  Layout.button_outed);
        button.setAttribute("onselectstart", "return false;");
        button.setAttribute("focus", "return false;");        
        
        // Upper part
        var canvas = $("<canvas></canvas>")[0];
        canvas.setAttribute("class", "button_canvas");     
        canvas.width = "64";
        canvas.height= "32";         
        canvas.innerText = text;      
        var ctx = canvas.getContext('2d');
        ctx.beginPath();            
        canvas.setAttribute("class", "system_button_canvas");
        ctx.moveTo(29, 23);
        ctx.lineTo(29, 15);
        ctx.lineTo(21, 15);
        ctx.moveTo(29, 23);
        ctx.lineTo(6, 23);
        ctx.moveTo(6, 23);
        ctx.lineTo(14, 18);
        ctx.moveTo(6, 23);
        ctx.lineTo(14, 28);
        ctx.strokeStyle = "#888";
        ctx.stroke();
        ctx.closePath();

        // Create button
        var buttonEl = $("<div></div>")[0];
        buttonEl.setAttribute("class", "kl_system_shift");        
        buttonEl.appendChild(canvas);
        button.appendChild(buttonEl);
        
        return button;
    },
    
    make_return_button: function(text, value, kl_class, kl_type)
    {
        var button = $("<div></div>")[0];
        button.setAttribute("class", "" + kl_class);
        //button.innerText = text;
        button.value     = value;
        button.kl_type   = kl_type;
        button.addEventListener("mousedown", Layout.button_pressed);
        button.addEventListener("mouseup",   Layout.button_released);
        button.addEventListener("mouseout",  Layout.button_outed);
        button.setAttribute("onselectstart", "return false;");
        button.setAttribute("focus", "return false;");        
        
        // Lower shadow
        var lower_shadow = $("<div></div>")[0];
        lower_shadow.setAttribute("class", "kl_return_lower_shadow");
        button.appendChild(lower_shadow);
        // Upper part
        var upper_return = $("<div></div>")[0];
        upper_return.setAttribute("class", "kl_return_upper");
        var canvas = $("<canvas></canvas>")[0];
        canvas.setAttribute("class", "button_canvas");     
        canvas.width = "32";
        canvas.height= "50";         
        canvas.innerText = text;      
        var ctx = canvas.getContext('2d');
        ctx.beginPath();            
        canvas.setAttribute("class", "system_button_canvas");
        ctx.moveTo(29, 23);
        ctx.lineTo(29, 15);
        ctx.lineTo(21, 15);
        ctx.moveTo(29, 23);
        ctx.lineTo(6, 23);
        ctx.moveTo(6, 23);
        ctx.lineTo(14, 18);
        ctx.moveTo(6, 23);
        ctx.lineTo(14, 28);
        ctx.strokeStyle = "#888";
        ctx.stroke();
        ctx.closePath();
        upper_return.appendChild(canvas);
        button.appendChild(upper_return);
        // Lower part
        var lower_return = $("<div></div>")[0];
        lower_return.setAttribute("class", "kl_return_lower");
        button.appendChild(lower_return);        
        
        return button;
    },
    
    make_button: function(text, value, kl_class, kl_type)
    {        
        if(kl_type == "return")
            return Layout.make_return_button(text, value, kl_class, kl_type);
        else if(kl_type == "returnUS")
        {
            return Layout.make_returnUS_button(text, value, kl_class, kl_type);
        }
        else
        {
            var button = $("<div></div>")[0];

            if(kl_class == "kl_empty")
                button.setAttribute("class", kl_class);
            else
                button.setAttribute("class", "kl_button " + kl_class);
            button.value     = value;
            button.kl_type   = kl_type;
            button.addEventListener("mousedown", Layout.button_pressed);
            button.addEventListener("mouseup",   Layout.button_released);
            button.addEventListener("mouseout",  Layout.button_outed);
            button.setAttribute("onselectstart", "return false;");
            button.setAttribute("focus", "return false;");        

            var canvas = $("<canvas></canvas>")[0];
            canvas.setAttribute("class", "button_canvas");            
            if(kl_type == "backspace")
                canvas.width = "64";
            else
                canvas.width = "32";
            canvas.height= "32";         
            canvas.innerText = text;      
            var ctx = canvas.getContext('2d');
            ctx.beginPath();            
            
            if(kl_type == "modifier_long" || kl_type == "modifier")
            {                
                // Manage event listeners
                button.removeEventListener("mousedown", Layout.button_pressed);                                
                button.addEventListener("mousedown", function(e){
                                            if(Layout.modifiers[text])
                                            {
                                                var prev_m = "";
                                                for(var m in Layout.modifiers)
                                                prev_m += "_" + m;
                                                delete Layout.modifiers[text];
                                                var next_m = "";
                                                for(var m in Layout.modifiers)
                                                next_m += "_" + m;
                                                
                                                // Change layout
                                                var result = Layout.change_modifiers(prev_m, next_m);                                            
                                        
                                                if(!result)
                                                    Layout.modifiers[text] = text;
                                            }
                                            else
                                            {
                                                var prev_m = "";
                                                for(var m in Layout.modifiers)
                                                prev_m += "_" + m;
                                                Layout.modifiers[text] = text;
                                                var next_m = "";
                                                for(var m in Layout.modifiers)
                                                next_m += "_" + m;
                                                
                                                if(kl_type == "modifier")
                                                    Layout.modifiers_to_remove_on_next_click[text] = text;
                                        
                                                // Change layout
                                                var result = Layout.change_modifiers(prev_m, next_m);                                                    
                                                if(!result)
                                                    delete Layout.modifiers[text];
                                            }
                                        });
                
                if(text == "capslock")
                {
                    canvas.setAttribute("class", "system_button_canvas");
                    if(Layout.modifiers[text])
                    {                        
                        ctx.beginPath();
                        ctx.fillStyle = "#3c6";
                        ctx.arc(5, 5, 2, 0, Math.PI*2.0, true);
                        ctx.fill();
                        ctx.closePath();
                    }
                    else
                    {
                        ctx.beginPath();
                        ctx.fillStyle = "#888";
                        ctx.arc(5, 5, 2, 0, Math.PI*2.0, true);
                        ctx.fill();
                        ctx.closePath();                                            
                    }                     
                    ctx.beginPath();
                    ctx.lineWidth = 1.1;
                    ctx.lineCap = 'square';
                    ctx.lineJoin = 'miter';
                    
                    ctx.moveTo(06, 17);
                    ctx.lineTo(10, 17);
                    ctx.lineTo(10, 22);
                    ctx.lineTo(16, 22);
                    ctx.lineTo(16, 17);
                    ctx.lineTo(20, 17);
                    ctx.lineTo(13, 10);
                    ctx.moveTo(06, 17);
                    ctx.lineTo(13, 10);
                    
                    ctx.moveTo(10, 24);
                    ctx.lineTo(10, 27);
                    ctx.lineTo(16, 27);
                    ctx.lineTo(16, 24);
                    ctx.lineTo(10, 24);
                    
                    ctx.strokeStyle = "#888";
                    ctx.stroke();
                    
                    button.removeEventListener("mousedown", Layout.button_pressed);                
                    button.addEventListener("mouseup",   Layout.button_pressed);
                    
                    // Graphics
                    button.addEventListener("mousedown", function(e){
                                                if(Layout.modifiers[text])
                                                {
                                                    var ctx = $('.kl_system_capslock')[0].childNodes[0].getContext('2d');
                                                    ctx.beginPath();
                                                    ctx.fillStyle = "#3c6";
                                                    ctx.arc(5, 5, 2, 0, Math.PI*2.0, true);
                                                    ctx.fill();
                                                    ctx.closePath();
                                                }
                                                else
                                                {
                                                    var ctx = $('.kl_system_capslock')[0].childNodes[0].getContext('2d');
                                                    ctx.beginPath();
                                                    ctx.fillStyle = "#888";
                                                    ctx.arc(5, 5, 2, 0, Math.PI*2.0, true);
                                                    ctx.fill();
                                                    ctx.closePath();                                            
                                                }
                                            });
                }
                else if(text == "alt")
                {
                    // ctx.font = "10px Helvetica";
                    // ctx.fillStyle = "#888";
                    // ctx.fillText("alt", 01, 13);
                    
                    ctx.beginPath();
                    
                    ctx.lineWidth = 1.1;
                    ctx.lineCap = 'square';
                    ctx.lineJoin = 'miter';
                    
                    ctx.moveTo(00, 20);
                    ctx.lineTo(06, 20);
                    ctx.lineTo(11, 27);
                    ctx.lineTo(19, 27);
                    ctx.moveTo(11, 20);
                    ctx.lineTo(19, 20);
                    
                    ctx.strokeStyle = "#888";
                    ctx.stroke();                    
                    
                    if(Layout.modifiers[text])
                        $(button).css({border : 'solid 1px #ff0 !important'});
                    else
                        $(button).css({border : ' '});
                    
                    button.removeEventListener("mousedown", Layout.button_pressed);                
                    button.addEventListener("mouseup",   Layout.button_pressed);     
                                                                    
                    // Graphics
                    button.addEventListener("mousedown", function(e){
                                                if(Layout.modifiers[text])
                                                    $('.kl_system_alt').css({border : 'solid 1px #ff0 !important'});
                                                else
                                                    $('.kl_system_alt').css({border : ' '});
                                            });                                                
                }
                else if(text == "shift")
                {
                    canvas.setAttribute("class", "system_button_canvas");
                    ctx.beginPath();
                    
                    ctx.lineWidth = 1.1;
                    ctx.lineCap = 'square';
                    ctx.lineJoin = 'miter';
                    
                    ctx.moveTo(06, 22);
                    ctx.lineTo(10, 22);
                    ctx.lineTo(10, 27);
                    ctx.lineTo(16, 27);
                    ctx.lineTo(16, 22);
                    ctx.lineTo(20, 22);
                    ctx.lineTo(13, 15);
                    ctx.moveTo(06, 22);
                    ctx.lineTo(13, 15);
                    
                    ctx.strokeStyle = "#888";
                    ctx.stroke();
                    
                    if(Layout.modifiers[text])
                        $(button).css({border : 'solid 1px #9cf !important'});          
                    else
                        $(button).css({border : ' '});                                    
                    
                    button.removeEventListener("mousedown", Layout.button_pressed);                
                    button.addEventListener("mouseup",   Layout.button_pressed);
                                                                    
                    // Graphics
                    button.addEventListener("mousedown", function(e){
                                                if(Layout.modifiers[text])
                                                {
                                                    $('.kl_system_shift').css(      {border : 'solid 1px #9cf !important'});                  
                                                    $('.kl_system_shift_right').css({border : 'solid 1px #9cf !important'});          
                                                }
                                                else
                                                {
                                                    $('.kl_system_shift').css(      {border : ' '});                        
                                                    $('.kl_system_shift_right').css({border : ' '});                                    
                                                }                                                                    
                                            });                                                
                                                                    
                }
                else
                {
                    // [TODO] strange place for this code
                    if(text != "tab" && text != "backspace")
                    {
                        // Text as text, or as canvas text
                        //button.innerText = text;
                        ctx.font = "15px Helvetica";
                        ctx.fillStyle = "#888";
                        ctx.fillText(text, 6, 15);                            
                    }
                }                
            }            
            else if(kl_type == "symbol")
            {
                // Text as text, or as canvas text
                //button.innerText = text;
                ctx.font = "15px Helvetica";
                ctx.fillStyle = "#888";
                ctx.fillText(text, 6, 15);                
            }
            else if(kl_type == "empty")
            {
                
            }
            // Drawing system buttons icons
            else if(kl_type == "backspace")
            {
                canvas.setAttribute("class", "system_button_canvas");
                ctx.moveTo(57, 23);
                ctx.lineTo(37, 23);
                ctx.moveTo(37, 23);
                ctx.lineTo(45, 18);
                ctx.moveTo(37, 23);
                ctx.lineTo(45, 28);
                ctx.strokeStyle = "#888";
                ctx.stroke();
            }
            else if(kl_type == "tab")
            {
                canvas.setAttribute("class", "system_button_canvas");
                ctx.beginPath();
                ctx.moveTo(00, 23);
                ctx.lineTo(20, 23);
                ctx.moveTo(20, 23);
                ctx.lineTo(13, 18);
                ctx.moveTo(20, 23);
                ctx.lineTo(13, 28);
                
                ctx.moveTo(21, 17);
                ctx.lineTo(21, 29);
                ctx.strokeStyle = "#888";
                ctx.stroke();
            }
            
            ctx.closePath();
            button.appendChild(canvas);
            
            return button;
        }
    },
    
    make_empty_button: function(text, kl_class)
    {
        var button = $("<div></div>")[0];
        button.setAttribute("class", "kl_button " + kl_class);
        button.innerText = text;
        return button;    
    },
    
    fire_backspace: function(event)
    {
        if(Layout.button_is_down)
        {
            object = 
            {
                obj_event: "",
                func: function() { Layout.fire_backspace(object.obj_event); }
            }
            object.obj_event = event;
            
            FocusManager.backspace("symbol");
            Layout.current_timer = setTimeout(object.func, 160);
        }
    },
    
    fire_text_append: function(obj)
    {
        if(Layout.button_is_down)
        {
            object = 
            {
                obj: "",
                func: function() { Layout.fire_text_append(object.obj); }
            }
            object.obj = obj;
            
            FocusManager.append_text(obj.value);
            Layout.current_timer = setTimeout(object.func, 160);
        }
    },
    
    backspace_button_pressed: function(event)
    {
        Layout.button_is_down = true;
        
        object = 
        {
            obj_event: "",
            func: function()
            {
                Layout.fire_backspace(object.obj_event);
            }
        }
        object.obj_event = event;
        
        FocusManager.backspace("symbol");
        Layout.current_timer = setTimeout(object.func, 320);
    },
    
    button_pressed: function(event)
    {
        var obj = this;
        
        if(obj.kl_type == "symbol")
        {
            Layout.button_is_down = true;

            object = 
            {
                obj: "",
                func: function()
                {
                    Layout.fire_text_append(object.obj);
                }
            }
            object.obj = obj;
            
            FocusManager.append_text(obj.value);
            Layout.current_timer = setTimeout(object.func, 320);
            
            // Remove one-click modifiers
            var prev_m = "";
            for(var m in Layout.modifiers)
                prev_m += "_" + m;        
            for(var m in Layout.modifiers_to_remove_on_next_click)
                delete Layout.modifiers[m];
            var next_m = "";
            for(var m in Layout.modifiers)
                next_m += "_" + m;
            
            // Change layout
            Layout.change_modifiers(prev_m, next_m);               
            
            Layout.button_is_down = false;
            clearTimeout(Layout.current_timer);                    
        }
        else if(obj.kl_type == "backspace")
        {
            Layout.backspace_button_pressed(event);
        }
        else if(obj.kl_type == "return")
        {
            FocusManager.return_pressed();
        }
        else if(obj.kl_type == "tab")
        {
            FocusManager.tab_pressed();
        }
    },
    
    button_outed: function(event)
    {
        var obj = this;
        
        if(obj.kl_type == "symbol")
        {
            Layout.button_is_down = false;
            clearTimeout(Layout.current_timer);        
        }
        //else if
    },
    
    button_released: function(event)
    {
        var obj = this;
        
        if(obj.kl_type == "symbol"    ||
           obj.kl_type == "backspace" ||
           obj.kl_type == "capslock"  ||
           obj.kl_type == "tab")
        {
            Layout.button_is_down = false;
            clearTimeout(Layout.current_timer);
            
            if(Layout.shifted)
            {
                Layout.shift_button_pressed(Layout.shift_button);
            }
        }
    },
    
    get_layout: function(requested_layout)
    {
        Layout.shifted = false;
        Layout.capsed  = false;
        Layout.modifiers = {};
        
        if(!Layout.layouts[requested_layout])
        {
            console.error("No layout with name " + requested_layout);
            requested_layout = Layout.requested_layout;
            $(Keyboard.kb_div).animate({ 'margin-left': '10px' }, 90).animate({'margin-left': '-10px'}, 70).animate({'margin-left':'5px'}, 30).animate({'margin-left':'-5px'}, 30).animate({'margin-left': '0px'}, 20);
            
            for(var another_layout in Layout.layouts)
            {
                requested_layout = another_layout;
                break;
            }
        }
        Layout.requested_layout = requested_layout;
    
        var layout = $("<div></div>")[0];
        layout.setAttribute("class", "kl_layout");

        for(var i = 0; i < Layout.layouts[requested_layout]["sets"].length; i++)
        {
            var available_set = Layout.layouts[requested_layout]["sets"][i];
            layout.appendChild(Layout.get_set(available_set, "kl_" + available_set));
        }
        
        return layout;
    }
}
