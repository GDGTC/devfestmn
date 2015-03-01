// Saves options to localStorage.
function save_options()
{
    // Save kavExt_show_kb_on_pass Option
    var kavExt_show_kb_on_pass_checkBox = document.getElementById("kavExt_show_kb_on_pass");
    localStorage["show_kb_on_pass"] = kavExt_show_kb_on_pass_checkBox.checked;   
    
    restore_options();
    set_state("saved");
}

function set_labels()
{
    document.getElementsByClassName("kaspersky_title")[0].innerHTML = chrome.i18n.getMessage("options_title");
    document.getElementById("kavExt_show_kb_on_pass_label").innerHTML = chrome.i18n.getMessage("show_kb_on_pass");    
    document.title = chrome.i18n.getMessage("options_title");
    document.getElementById("save_button").innerHTML = chrome.i18n.getMessage("saveOptions_button");            
}

// Restores select box state to saved value from localStorage.
function restore_options()
{
    set_labels();

    // Restore kavExt_show_kb_on_pass Option
    var kavExt_show_kb_on_pass = localStorage["show_kb_on_pass"];

    var kavExt_show_kb_on_pass_checkBox = document.getElementById("kavExt_show_kb_on_pass");
    kavExt_show_kb_on_pass_checkBox.checked = (kavExt_show_kb_on_pass == "true");
    
    BrowserSpecific.dispatchToAllTabs("setting_value", {name: 'show_kb_on_pass', value: kavExt_show_kb_on_pass_checkBox.checked});
    
    set_state("unchanged");
}

function set_state(state)
{
    var status = document.getElementById("status");
    status.setAttribute("class", "status " + state);

    switch(state)
    {
        case "saved":
        status.innerHTML = chrome.i18n.getMessage("options_saved_button");
        break;
        case "changed":
        status.innerHTML = chrome.i18n.getMessage("options_changed_button");
        break;
        case "unchanged":
        status.innerHTML = chrome.i18n.getMessage("options_unchanged_button");
        break;
    }
}

function option_changed()
{
    set_state("changed");
}

$(document.body).ready(function(){
    $("#save_button").click(function(){
        save_options();
    });

    $("#kavExt_show_kb_on_pass").click(function(){
        option_changed();
    });
        
    restore_options();
});