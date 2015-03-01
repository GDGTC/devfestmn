BrowserSpecific = 
{
    getWindowHeight: function()
    {
        return $(window).height();
    },
    getWindowWidth: function()
    {
        return $(window).width();
    },    
    logMessage: function(message)
    {
        console.log("[Kaspersky URL Advisor]: " + message);
    },
    errorMessage: function(message)
    {
        console.error("[Kaspersky URL Advisor]: " + message);
    },
    setSetting: function(settingName, settingValue)
    {
        localStorage[settingName] = settingValue;
    },
    getSetting: function(settingName)
    {
        if(!localStorage[settingName])
            return true;
        else
            return localStorage[settingName];
    },
    dispatchMessage: function(name, message)
    {
        chrome.extension.sendRequest({event: "message", name: name, message: message});            
    },
    addEventListener: function(name, handler, flag)
    {
        chrome.extension.onRequest.addListener(handler);
    },
    getElementPosition: function(element)
    {
        //var box = getOffsetRect(element);
        var box = element.getBoundingClientRect();
        var position_v = "";
        var position_h = "";
           
        // [TODO] каким-то образом куда-то запрятывать размеры балунов
        if(box.top >= 145)
            position_v = "top";
        else
            position_v = "bottom";
        
        if((document.width - box.right) >= 309)
            position_h = "right";
        else
            position_h = "left";
            
        return {v: position_v, h: position_h, top: box.top, right: (document.width - box.right)};
    },

    dispatchToActiveTab: function(name, message)
    {
        //getCurrent
        //chrome.tabs.sendRequest(windowList[i].tabs[j].id, {event: "message", name: name, message: message});
        
        chrome.tabs.getSelected(null, function(tab)
        {
            chrome.tabs.sendRequest(tab.id, {event: "message", name: name, message: message}, function(response)
            {
                console.log("message sent");
            });
        });
        
        //safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(name, message);
    },
    
    dispatchToAllTabs: function(name, message)
    {
        chrome.windows.getAll({ populate: true }, function(windowList){
            tabs = {};
            tabIds = [];
            for (var i = 0; i < windowList.length; i++)
            {
              for (var j = 0; j < windowList[i].tabs.length; j++)
              {
                var tab = windowList[i].tabs[j];
                chrome.tabs.sendRequest(windowList[i].tabs[j].id, {event: "message", name: name, message: message});
              }
            }
        });    
    }
}