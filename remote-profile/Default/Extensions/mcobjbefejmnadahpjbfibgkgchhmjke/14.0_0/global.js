
function sendSettingsToContent()
{
    console.log("Sending setting to content on startup: " + BrowserSpecific.getSetting("show_kb_on_pass"));
    BrowserSpecific.dispatchToAllTabs("setting_value", {name: "show_kb_on_pass", value: BrowserSpecific.getSetting("show_kb_on_pass")});
}
    
function handle_message(event)
{
    if(event.name == "keyboard_shown")
    {
        BrowserSpecific.keyboard_shown = true;
    }
    if(event.name == "kb_toggle")
    {
        BrowserSpecific.dispatchToActiveTab("kb_toggle", event.message);
    }
    if(event.name == "request_settings")
    {
        console.log("request_settings");
        sendSettingsToContent();
    }
    if(event.name == "set_setting")
    {
        BrowserSpecific.setSetting(event.message.name, event.message.value);
        BrowserSpecific.dispatchToAllTabs("setting_value", {name: event.message.name, value: event.message.value});
    }
    else
    {
        BrowserSpecific.dispatchToActiveTab(event.name, event.message);
    }
}
    
function performCommand()
{
    BrowserSpecific.keyboard_shown = false;
    setTimeout(function(){
           if(BrowserSpecific.keyboard_shown == false)
           {
               BrowserSpecific.dispatchToActiveTab("kb_appear", "force");
               BrowserSpecific.keyboard_shown = true;
           }
       },100);
    BrowserSpecific.dispatchToActiveTab("kb_toggle", "toolbar");
}
    
// Browser-specific message handlers
//safari.application.addEventListener("message", handle_message, false);
//safari.extension.settings.addEventListener("change", sendSettingsToContent, false);
//safari.application.addEventListener("command", performCommand, false);
    
chrome.browserAction.onClicked.addListener(performCommand);    
    
chrome.extension.onRequest.addListener(handle_message);    
