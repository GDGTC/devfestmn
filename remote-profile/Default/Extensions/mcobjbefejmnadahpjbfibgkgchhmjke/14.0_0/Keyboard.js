var Keyboard = 
{
    div_width: 646,
    div_height: 248,
    isVisible: false,
    layout: "",
    kb_div: "",
    pos: {},
    attached: false,
    current_layout: "none",
    keep_kb_alive: false,
    recalculate: true,
    
    /*
        This is not a silver bullet :(
    */
    calculateFrameOffset: function(frameHref)
    {
        var calculationBody = function(framesArray, attr)
        {
            for(var i = 0; i < $(framesArray).length; i++)
            {
                var src = $(framesArray[i]).attr(attr);
                var a = document.createElement('a');
                a.href = src;
                var absSrc = a.href;

                if(absSrc == frameHref)
                    return { frameY : $(framesArray[i]).offset().top,
                             frameX : $(framesArray[i]).offset().left };
            }    
            return "";        
        };

        {
            var allFrames = $("iframe");        
            var result = calculationBody(allFrames, "src");
            if(typeof result != "undefined" && typeof result != "string")
                return result;
        }
        {
            var allFrames = $("frame");        
            var result = calculationBody(allFrames, "src");
            if(typeof result != "undefined" && typeof result != "string")
                return result;
        }
        {
            var allFrames = $("object");        
            var result = calculationBody(allFrames, "data");
            if(typeof result != "undefined" && typeof result != "string")
                return result;
        }
        
        return { frameX : 0,
                 frameY : 0 };
    },
    
    get_position: function(event)
    {
        var KeyboardWidth = Keyboard.div_width;
        var KeyboardHeight = Keyboard.div_height;                    
    
        // Check if it is possible to somehow inject keyboard
        // if(BrowserSpecific.getWindowWidth() < KeyboardWidth || BrowserSpecific.getWindowHeight() < KeyboardHeight)
        // {
        //     KeyboardHeight.pos = { top  : "-999px",
        //                            left : "-999px" };
        //     return;
        // }
        
        // Select proper predefined position
        //   1        2
        // 3 KKKKKKKKKK 4
        //   KKKKKKKKKK 
        // 7 KKKKKKKKKK 8
        //   5        6        
        if(typeof event != "string")
        {
            Keyboard.pos.recalculate = false;
            
            var windowHeight = BrowserSpecific.getWindowHeight();
            var windowWidth = BrowserSpecific.getWindowWidth();

            var frameOffset = Keyboard.calculateFrameOffset(event.windowLocation);
            var frameX = frameOffset.frameX;
            var frameY = frameOffset.frameY;

            var eventTop = event.top + frameY;// + event.screenY;
            var eventLeft = event.left + frameX;// + event.screenX;
            
            if(eventLeft + KeyboardWidth <= BrowserSpecific.getWindowWidth() &&
               eventTop + event.height + KeyboardHeight <= BrowserSpecific.getWindowHeight())
            {
                // 1!
                Keyboard.pos.top = eventTop + event.height + 10;
                Keyboard.pos.left = eventLeft;       
            }
            else if(eventLeft + event.width >= KeyboardWidth &&
                    eventTop + event.height + KeyboardHeight <= BrowserSpecific.getWindowHeight())
            {
                // 2!
                Keyboard.pos.top = eventTop + event.height + 10;
                Keyboard.pos.left = eventLeft - KeyboardWidth + event.width;
            }            
            else if(eventLeft + event.width + KeyboardWidth <= BrowserSpecific.getWindowWidth() &&
                    eventTop + KeyboardHeight <= BrowserSpecific.getWindowHeight())
            {
                // 3                
                Keyboard.pos.top = eventTop;
                Keyboard.pos.left = eventLeft + event.width + 10;
            }
            else if(eventLeft - KeyboardWidth >= 0 &&
                    eventTop + KeyboardHeight < BrowserSpecific.getWindowHeight())
            {
                // 4
                Keyboard.pos.top = eventTop;
                Keyboard.pos.left = eventLeft - KeyboardWidth - 10;                        
            }
            else if(eventLeft + KeyboardWidth <= BrowserSpecific.getWindowWidth() &&
                    eventTop >= KeyboardHeight)
            {
                // 5
                Keyboard.pos.top = eventTop - KeyboardHeight - 10;
                Keyboard.pos.left = eventLeft;
            }
            else if(eventLeft - KeyboardWidth + event.width >= 0 &&
                    eventTop >= KeyboardHeight)
            {
                // 6!
                Keyboard.pos.top = eventTop - KeyboardHeight - 10;
                Keyboard.pos.left = eventLeft - KeyboardWidth + event.width;
            }
            else if(eventLeft + event.width + KeyboardWidth <= BrowserSpecific.getWindowWidth() &&
                    eventTop - KeyboardHeight + event.height >= 0)
            {
                // 7
                Keyboard.pos.top = eventTop - KeyboardHeight + event.height;
                Keyboard.pos.left = eventLeft + event.width + 10;                        
            }
            else if(eventLeft >= KeyboardWidth &&
                    eventTop - KeyboardHeight + event.height >= 0)
            {
                // 8
                Keyboard.pos.top = eventTop - KeyboardHeight + event.height;
                Keyboard.pos.left = eventLeft - KeyboardWidth - 10;                                                
            }       
            else
            {
                console.log("x_x");                
            }
            
            return;
        }
        
        // Put keyboard to the bottom
        {
            Keyboard.pos.recalculate = false;

            var calculated_width = (0.5 * BrowserSpecific.getWindowWidth()  - 323);
            var calculated_height = (BrowserSpecific.getWindowHeight()  - 231 - 50);

            Keyboard.pos = { top  : calculated_height,
                             left : calculated_width,
                             recalculate : true };                      
        }
        return;
        
        // Get random position for keyboard        
        {              
          Keyboard.pos.recalculate = false;
                        
          var calculated_width = (Math.random() * (BrowserSpecific.getWindowWidth()  - 646));
          var calculated_height = (Math.random() * (BrowserSpecific.getWindowHeight()  - 231));

          Keyboard.pos = { top  : calculated_height,
                           left : calculated_width,
                           recalculate : true };          
          
          if((Math.abs(Keyboard.pos.top - event.top) < 248) && (Math.abs(Keyboard.pos.left - event.left) < 646))
              Keyboard.pos.top = event.top + 50;
        }        
    },
    
    checkIfShouldRecalculateForElement: function(event)
    {
        if(typeof event == "string")
            return false;
            
        if(typeof(Keyboard.pos.top) == "undefined" || typeof(Keyboard.pos.left) == "undefined")
            return true;
        
        var windowHeight = BrowserSpecific.getWindowHeight();
        var windowWidth = BrowserSpecific.getWindowWidth();

        var frameOffset = Keyboard.calculateFrameOffset(event.windowLocation);
        var frameX = frameOffset.frameX;
        var frameY = frameOffset.frameY;

        var eventTop = event.top + frameY;// + event.screenY;
        var eventLeft = event.left + frameX;// + event.screenX;
        
        return ((eventTop < (Keyboard.pos.top + Keyboard.div_height) && eventTop > Keyboard.pos.top &&
          eventLeft < (Keyboard.pos.left + Keyboard.div_width) && eventLeft > Keyboard.pos.left) ||

         ((eventTop + event.height) < (Keyboard.pos.top + Keyboard.div_height) && (eventTop + event.height) > Keyboard.pos.top &&
          eventLeft < (Keyboard.pos.left + Keyboard.div_width) && eventLeft > Keyboard.pos.left) ||

         (eventTop < (Keyboard.pos.top + Keyboard.div_height) && eventTop > Keyboard.pos.top &&
          (eventLeft + event.width) < (Keyboard.pos.left + Keyboard.div_width) && (eventLeft + event.width) > Keyboard.pos.left) ||

         ((eventTop + event.height) < (Keyboard.pos.top + Keyboard.div_height) && (eventTop + event.height) > Keyboard.pos.top &&
          (eventLeft + event.width) < (Keyboard.pos.left + Keyboard.div_width) && (eventLeft + event.width) > Keyboard.pos.left));
    },
    
    appear: function(event)
    {        
        if(window.top != window)
            return;
        // if no keyboard, inject
        if(window.top == window && $(".kl_keyboard").length == 0)
            Keyboard.insert_keyboard($("body")[0], "en", false);
        
        if(typeof event == "string" && event != "toolbar") return;        
        if((event == "force") && (window.top != window)) return;
        // if((event != "force") && (FocusManager.focused_element == "no element")) return;

        BrowserSpecific.dispatchMessage("keyboard_shown", "");
        
        // textbox dimensions
        // event.top, event.left, event.height, event.width
        Keyboard.isVisible = true;
        
        // Get random position
        if($(Keyboard.kb_div).is(':animated'))
            $(Keyboard.kb_div).stop(true);
        
        // Check if keyboard is already on screen
        if($(Keyboard.kb_div).css('top') == "5555px")
        {
            $(Keyboard.kb_div).fadeTo(0, 0, function()
            {
                // console.log("received event:");
                // console.log(event);
                if(Keyboard.checkIfShouldRecalculateForElement(event) || Keyboard.recalculate)
                {
                    Keyboard.user_moved = false;
                    Keyboard.recalculate = false;
                    if(typeof event == "string" && typeof FocusManager.focused_element == "object")
                    {
                        var relativeObject = $(FocusManager.focused_element);                        
                        Keyboard.get_position({ top    : relativeObject.offset().top,
                                                left   : relativeObject.offset().left,
                                                height : relativeObject.height(),
                                                width  : relativeObject.width() });
                    }
                    else
                        Keyboard.get_position(event);
                }

                var randomDeltaX = Math.random() * 50.0;
                if(parseInt(Keyboard.pos.left) > 50.0)
                    randomDeltaX *= -1.0;
                $(Keyboard.kb_div).css({'top'  : Keyboard.pos.top  + "px",
                                        'left' : (parseInt(randomDeltaX) + parseInt(Keyboard.pos.left)) + "px"});        
            });
        }
        
        // Performe appear animation itself
        $(Keyboard.kb_div).fadeTo(300, 1);
    },
    
    disappear: function(event)
    {        
        Keyboard.isVisible = false;
        
        BrowserSpecific.dispatchMessage("keyboard_shown", "");
        
        // Remove opened layouts list
        $('.kl_layout_selector').find('.kl_layout_selector_option').each(function()
        {
            if($(this).is('.kl_option_visible'))
            {
                $(this).toggleClass('kl_option_visible', 'kl_option_hidden');
            }
        });
        
        // Performe disappear animation itself
        if($(Keyboard.kb_div).is(':animated'))
            $(Keyboard.kb_div).stop(true);
        
        $(Keyboard.kb_div).fadeTo(300, 0, function() { 
            // remove settings popup
            $('.kl_popup_settings').remove();
            
            // remove selector popup
            $('.kl_layout_list_container').hide();
            
            // move keyboard away
            $(Keyboard.kb_div).css({'top'  : '5555px',
                                    'left' : '5555px'});
        });
    },
    
    change_layout: function(requested_layout)
    {        
        $(Keyboard.kb_div).hide();
        
        if(Keyboard.current_layout == "none")
            Keyboard.kb_div.appendChild(Layout.get_layout(requested_layout));
        else
            $(".kl_layout").replaceWith(Layout.get_layout(requested_layout));
        
        Keyboard.current_layout = Layout.requested_layout;
        
        $(Keyboard.kb_div).show();
    },
    
    make_settings_popup: function()
    {
        // Popup settings
        var settings_button = $("<div></div>")[0];
        settings_button.setAttribute("class", "kl_kb_settings_button");
        $(settings_button).text(Localization.getString("preferences_button_label"));
        settings_button.addEventListener("click", function(event) {
            if($('.kl_popup_settings').is(":visible"))
            {
                // hide
                $('.kl_popup_settings').children().fadeOut("fast");
                $('.kl_popup_settings').fadeOut("fast", function(){
                    $('.kl_popup_settings').remove();
                });
            }
            else
            {
                // create baloon
                var options_sheet = $('<div class="kl_popup_settings"></div>').appendTo($(settings_button));
                var settings_baloon_top = $('<div class="kl_popup_settings_top"></div>').appendTo($(options_sheet));
                var settings_baloon_content = $('<div class="kl_popup_settings_middle"></div>').appendTo($('.kl_popup_settings'));
                $('<input type="checkbox" class="kl_popup_settings_checkbox" name="show_kb_on_pass" ' + (FocusManager["show_kb_on_pass"]?'checked':'') + '></input>').appendTo($(settings_baloon_content)).click(function(event)
                {
                    event.stopPropagation();
                    BrowserSpecific.dispatchMessage("set_setting", {name : 'show_kb_on_pass', value : !FocusManager["show_kb_on_pass"] });
                    // FocusManager["show_kb_on_pass"] = !FocusManager["show_kb_on_pass"];
                });                                 
                $('<div class="kl_popup_settings_label">' + Localization.getString("show_kb_on_pass") + '</div>').appendTo($(settings_baloon_content));
                var settings_baloon_bottom = $('<div class="kl_popup_settings_bottom"></div>').appendTo($(options_sheet));                                                               

                // show
                $('.kl_popup_settings').fadeIn("fast");             
                $('.kl_popup_settings').children().fadeIn("fast");                  
            }
        });

        return settings_button;
    },
    
    insert_keyboard: function(where, requested_layout, force)
    {
        Keyboard.kb_div = $("<div></div>")[0];
        Keyboard.kb_div.setAttribute("class", "kl_keyboard");        

        if(false)
        {   // [TODO] if "always display keyboard" flag
            Keyboard.kb_div.addEventListener("mouseover", Keyboard.appear);
            Keyboard.kb_div.addEventListener("mouseout",  Keyboard.disappear);
        }
        var hook = $("<div></div>")[0];
        hook.setAttribute("class", "kl_hook");
        //hook.innerText = Localization.getString("keyboard_title");
        //BrowserSpecific.dispatchMessage("set_setting", {name : 'show_kb_on_pass', value : false });
        
        // Close keyboard button
        var close_button = $("<div></div>")[0];
        close_button.setAttribute("class", "kl_kb_close_button");
        close_button.addEventListener("click", function() { Keyboard.disappear(); $('.kl_popup_settings').hide(); });
        //close_button.innerText = "X";//Localization.getString("disable_autoshow");
        hook.appendChild(close_button);
        
        hook.appendChild(Keyboard.make_settings_popup());
        Keyboard.kb_div.appendChild(hook);
        Keyboard.change_layout(requested_layout); 

        // Append Keyboard only to the main window
        if(force == true || (window.top && window.top.location.href == document.location.href) || (window.location.href == document.location.href))
        {
            $(Keyboard.kb_div).css({'top'  : '5555px',
                                    'left' : '5555px'});
                                    
            $(window).resize(function(){
                Keyboard.recalculate = true;
                Keyboard.pos.recalculate = true; 
            });
                                    
            $(Keyboard.kb_div).appendTo(where);
            $(".kl_keyboard").draggable({ disabled: false,
                                          stop: function(event){
                                              Keyboard.pos.top = $(event.target).offset().top;
                                              Keyboard.pos.left = $(event.target).offset().left;
                                              Keyboard.user_moved = true;
                                              BrowserSpecific.dispatchMessage("klvkbd_user_moved", true);
                                          }});            
            Keyboard.attached = true;
        }
        else
            Keyboard.current_layout = "none";
    }
}

function handle_message(message)
{
    if (message.name == "klvkbd_user_moved")
    {
        Keyboard.user_moved = message.message;        
    }
    if (message.name == "klvkbd_shouldRecalculate")
    {
        Keyboard.recalculate = message.message;
    }
    if (message.name == "klvkbd_appendTextToLastFocused")
    {
        FocusManager.really_append_text_to_last_focused(message.message);
    }    
    if (message.name == "klvkbd_appendText")
    {
        FocusManager.really_append_text(message.message);
    }
    if (message.name == "kb_toggle")
    {
        if(Keyboard.isVisible == true)
            Keyboard.disappear();
        else
            Keyboard.appear(message.message);
    }
    if (message.name == "kb_appear")
    {
        Keyboard.appear(message.message);
    }
    if (message.name == "kb_disappear")
    {
        if(Keyboard.keep_kb_alive)
            Keyboard.keep_kb_alive = false;
        else
            Keyboard.disappear();
    }
    if(message.name == "setting_value")
    {
        FocusManager[message.message.name] = message.message.value;
    }
}

BrowserSpecific.addEventListener("message", handle_message, true);