// Launcher
(function()
{
    BrowserSpecific.dispatchMessage("request_settings");
    BrowserSpecific.dispatchMessage("klvkbd_LocalizationsRequest");          
        
    setTimeout(function(){
        FocusManager.parse_for_input();
    }, 0);

})();