var Localization = 
{
    locale: "en",
    strings: {},
    
    getString: function(token)
    {
        // If this is Chrome
        if(typeof chrome != "undefined" &&
           typeof chrome.i18n != "undefined" &&
           typeof chrome.i18n.getMessage != "undefined")
            return chrome.i18n.getMessage(token);        
        
        var local_locale = window.navigator.language;        
        var locale_array = local_locale.split("-");
    
        // Trying to find proper locale for extension
        for(var i = locale_array.length - 1; i >= 0; i--)
        {
            locale = "";
            for(var j = 0; j <= i; j++)
                if(j == 0)
                    locale += locale_array[j];
                else
                    locale += "-" + locale_array[j];
            if(typeof Localization.strings[locale] != "undefined" && typeof Localization.strings[locale][token] != "undefined")
                return Localization.strings[locale][token];
        }

         // Try to use default en locale
        if(typeof(Localization.strings["en"]) != "undefined" && typeof Localization.strings["en"][token] != "undefined")
            return Localization.strings["en"][token];
            
         // Try to use any locale
        for(var i in Localization.strings)
            if(typeof Localization.strings[i][token] != "undefined")
                return Localization.strings[i][token];
             
         // There is no locale
        if(typeof Localization.strings[token] != "undefined")
            return Localization.strings[token];
            
        // There is nothing
        return token;
    }
}

BrowserSpecific.addEventListener("klvkbd_LocalizationsResponse", function(payload){
    Localization.strings = payload;
}, true);