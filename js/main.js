"use strict";

var botToken = "";
var updateOffset = -1;
var updateAnalyzer;
var cookies = localStorage;
var commands = {};
var started = 0;
var selectedChatId = 0;
var lastCommand = "";
var botUsername = "";
var knownChatIDs = {};
var botInfo;
var debug = false;
var startTime = 0;
var logTranslations = {
  "it-IT": {
    "startingBot": "Avviando il bot... Connessione in corso ai server telegram...",
    "emptyToken": "Bot non avviato! Bot token vuoto!",
    "stopSent": "Richiesta di arresto inviata!",
    "autoStart": "Bot in avvio secondo le tue impostazioni...",
    "userDidntStartBot": "L'utente selezionato precedentemente ha bloccato il bot o non lo ha mai avviato.",
    "unknownError": "Errore sconosciuto: ",
    "autoSelectCID1": "Selezionata chat ",
    "autoSelectCID2": " come da sessione precedente.",
    "updatingCommands": "Aggiornamento lista comandi in corso...",
    "updatedCommands": "Aggiornamento lista comandi completato!",
    "botStopped": "Bot arrestato!",
    "botStarted": "Bot avviato! Attenzione: Se chiudi questa pagina, verrà anche arrestato il tuo bot!",
    "helpCmd": "/help per i comandi della console.",
    "botInfo": "Info Bot:<br>Nome: {BOTNAME}<br>Username: {TMEBOTUSERNAME}",
    "wrongToken": "Token errato o non valido",
    "conflict": "Conflitto, il bot ha il webhook già settato, oppure qualche altro programma è sul bot",
    "connectionError": "Errore nella connessione: ",
    "messageNotSupported": "Messaggio non supportato",
    "sendMessageError": "Errore nell'invio del messaggio: ",
    "helpConsoleCommands": "Menù comandi:<br />/help: visualizza questo menù di aiuto<br />/select: GUI per selezionare la chat in cui inviare i messaggi<br />&lt;messaggio&gt;: invia messaggio nella chat_id selezionata",
    "removedChatIdSelection": "Rimossa selezione chat_id!",
    "selected": "Selezionato ",
    "noKnownChats": "Nessun chat_id conosciuto. Impossibile mostrare la GUI. Seleziona un chat_id manualmente con /select &lt;chat_id&gt;",
    "unknownCommand": "Comando sconosciuto. /help per una lista completa di comandi.",
    "messageTooLong": "Messaggio troppo lungo. Caratteri massimi consentiti: 4096 caratteri.",
    "emptyMessage": "Messaggio nullo.",
    "noChatSelected": "Per favore, prima di tentare di inviare un messaggio, usa /select",
    "consoleBotNotStarted": "Prima di scrivere comandi, perfavore, metti il token del bot. Se lo hai già fatto, assicurati di aver avviato il bot cliccando il pulsante \"Avvia\"",
    "messageSent": "Messaggio inviato: ",
    "logError": "[ERRORE]"
  },
  "en": {
    "startingBot": "Starting the bot... Connecting to telegram servers...",
    "emptyToken": "Bot not started! Bot token empty!",
    "stopSent": "Stop request sent!",
    "autoStart": "Starting the bot according to your settings...",
    "userDidntStartBot": "The user previously selected has blocked the bot or he hasn't started it at all.",
    "unknownError": "Unknown error: ",
    "autoSelectCID1": "Selected chat ",
    "autoSelectCID2": " as previous session.",
    "updatingCommands": "Updating commands list...",
    "updatedCommands": "Commands list updated!",
    "botStopped": "Bot stopped!",
    "botStarted": "Bot started! Warning: If you close this page, your bot will be stopped too!",
    "helpCmd": "/help for the console commands.",
    "botInfo": "Bot Info:<br>Name: {BOTNAME}<br>Username: {TMEBOTUSERNAME}",
    "wrongToken": "Wrong token or token not valid",
    "conflict": "Conflict, the bot has already setted webhook, or some other program is on the bot",
    "connectionError": "Connection error: ",
    "messageNotSupported": "Messsage not supported",
    "sendMessageError": "Message sending error: ",
    "helpConsoleCommands": "Commands menù:<br />/help: shows this help menu<br />/select: GUI to select chat to send messages in<br />&lt;messaggio&gt;: send message in selected chat",
    "removedChatIdSelection": "Removed chat_id selection!",
    "selected": "Selected ",
    "noKnownChats": "No known chat_id. Unable to show the GUI. Select a chat_id manually with /select &lt;chat_id&gt;",
    "unknownCommand": "Unknown command. /help for a commands list.",
    "messageTooLong": "Message too long. Maximum allowed characters: 4096 characters.",
    "emptyMessage": "Message empty.",
    "noChatSelected": "Please, before trying to send a message, use /select",
    "consoleBotNotStarted": "Before typing commands, enter the bot token. If you have already done it, make sure you've clicked the \"Start\" button",
    "messageSent": "Message sent",
    "logError": "[ERROR]"
  }
}
var translations = {
  "it-IT": {
    "commandsHelpTr": '/comando > Risposta<strong>;</strong><br>\
    Nella risposta, puoi usare <strong>photo</strong> seguito da un <strong>file_id/url</strong> (per mettere la descrizione alla foto, vai a capo) per inviare una foto, o un semplice testo per inviare una risposta testuale.<br>\
    Saranno aggiunti altri tipi di documenti/video presto.<br>\
    Per ricevere il file_id di una foto, manda una foto al tuo bot con descrizione /fileid\
    <br><br>\
    Nella risposta testuale puoi usare i seguenti codici:<br>\
    <code>{CHATID}</code>, <code>{USERID}</code>, <code>{CHATTITLE}</code>, <code>{NAME}</code>, <code>{FIRSTNAME}</code>, <code>{LASTNAME}</code>, <code>{MSGTEXT}</code>, <code>{HTMLESCAPEDMSGTEXT}</code>\
    <br>\
    <code>{CHATID}</code>: ID della chat<br>\
    <code>{USERID}</code>: ID utente<br>\
    <code>{CHATTITLE}</code>: Nel caso di un gruppo, il nome del gruppo, altrimenti il nome completo dell\'utente<br>\
    <code>{NAME}</code>: Nome completo dell\'utente<br>\
    <code>{FIRSTNAME}</code>: Nome dell\'utente<br>\
    <code>{LASTNAME}</code>: Cognome dell\'utente<br>\
    <code>{MSGTEXT}</code>: Testo messaggio inviato.<br>\
    <code>{HTMLESCAPEDMSGTEXT}</code>: Testo messaggio inviato escapato da HTML.\
    <br><br>\
    Mettendo <code>any</code> come comando, questo risponderà ad ogni comando.\
    <br><br>\
    Puoi usare le tastiere inline mettendo sull\'ultima linea della risposta al tuo comando <strong>[[[BOTTONE-COMANDO]]]</strong> e, una virgola prima dell\'ultima parentesi quadra per mettere un altro bottone sulla tastiera inline.\
    <br>Esempio: <strong>[[[Bottone1-comando1]],[[Bottone2-comando2]]]</strong>\
    Per rispondere ad un bottone cliccato, metti il callback data messo nel bottone come un normale comando\
    <code>comando1 > risposta1;</code> Il messaggio sarà modificato con risposta1',
    "tr-botToken": "Token del bot",
    "tr-botcommands": "Comandi del bot",
    "startBot": "Avvia!",
    "stopBot": "Arresta",
    "tr-autostart": "Avvia automaticamente il bot al caricamento della pagina",
    "tr-logallmsg": "Logga i messaggi da qualsiasi chat",
    "tr-createdby": "Creato da Pato05 <code>:)</code>",
    "tr-cmdHelpTitle": "Help comandi",
    "selectChId": "Seleziona la chat_id",
    "removeChatId": "Rimuovi selezione"
  },
  "en": {
    "tr-botToken": "Bot Token",
    "tr-botcommands": "Bot commands",
    "startBot": "Start!",
    "stopBot": "Stop",
    "tr-autostart": "Automatically start the bot at page load",
    "tr-logallmsg": "Log messages from every chat",
    "tr-createdby": "Created by Pato05 <code>:)</code>",
    "tr-cmdHelpTitle": "Commands Help",
    "selectChId": "Select the chat_id",
    "removeChatId": "Remove selection",
    "commandsHelpTr": '/command > Answer<strong>;</strong><br>\
    In the answer, you can use <strong>photo</strong> followed by <strong>file_id/url</strong> (to put the caption to a photo, start a new line) to send a photo, or a simple text to send a textual answer.<br>\
    Will be added new types of documents/videos soon<br>\
    To get a photo file_id, send a photo to your active bot with caption /fileid\
    <br><br>\
    In the textual answer or caption you can use these codes:<br>\
    <code>{CHATID}</code>, <code>{USERID}</code>, <code>{CHATTITLE}</code>, <code>{NAME}</code>, <code>{FIRSTNAME}</code>, <code>{LASTNAME}</code>, <code>{MSGTEXT}</code>, <code>{HTMLESCAPEDMSGTEXT}</code>\
    <br>\
    <code>{CHATID}</code>: Chat ID<br>\
    <code>{USERID}</code>: User ID<br>\
    <code>{CHATTITLE}</code>: In the case of a group, the group title, else the complete user\'s name<br>\
    <code>{NAME}</code>: Complete user\'s name<br>\
    <code>{FIRSTNAME}</code>: User\'s first name<br>\
    <code>{LASTNAME}</code>: User\'s last name<br>\
    <code>{MSGTEXT}</code>: Text of the message sent by the user<br>\
    <code>{HTMLESCAPEDMSGTEXT}</code>: Text of the message sent by the user HTML escaped.\
    <br><br>\
    Putting <code>any</code> as command, it will answer to each message.\
    <br><br>\
    You can use inline keyboards by putting at the last line <strong>[[[BUTTON-COMMAND]]]</strong> and, a comma before the last closing square bracket to put another keyboard button\
    <br>Example: <strong>[[[Button1-commmand1]],[[Button2-command2]]]</strong>\
    To answer a clicked button, just put the name of your callback data as a normal command\
    <code>command1 > answer1;</code> The message will be edited with answer1'
  }
}
var navLang = navigator.userLanguage || navigator.language;
var l = logTranslations[navLang] || logTranslations["en"];
String.prototype.splitTwo = function(by) {
  var arr = this.split(by);
  var str = this.substr(arr[0].length + by.length);
  return [arr[0], str];
}
String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex;
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};
async function log(text, prefix = "[INFO]", classes = "white-text") {
  var consoleElem = $("#console");
  var newSpan = $("<span>");
  newSpan.attr("class", classes)
  if(prefix != "") prefix += " ";
  newSpan.html(prefix + text);
  consoleElem.append(newSpan);
  consoleElem.append("<br>");
  consoleElem.scrollTop(consoleElem[0].scrollHeight - consoleElem.height());
}
$(document).ready(async function() {
  if (location.href.indexOf("#") != -1) {
    var hash = location.href.substr(location.href.indexOf("#")+1);
    if(hash == "debug=1") {
      debug = true;
      setTimeout(function(){log("DEBUG mode enabled", "[DEBUG]")}, 0);
    }
  }
  if(navLang in translations) {
    for(var [idelem, value] of Object.entries(translations[navLang])) {
      $("#"+idelem).html(value);
    }
  } else for(var [idelem, value] of Object.entries(translations["en"])) {
    $("#"+idelem).html(value);
  }
  $("#applyChatId").on("click", async function() {
    sendCommand("/select "+$("#selectChatId").val());
  });
  $("#removeChatId").on("click", async function() {
    sendCommand("/select 0");
  });
  $("#autoStart").on("change", updateBotSettings);
  $("#logAllMsg").on("change", updateBotSettings);
  $("#parseMode").on("change", updateBotSettings);
  $("#wpPreview").on("change", updateBotSettings);
  $("#ufUpdAnalyzer").on("change", updateBotSettings);
  $("#consoleCommandsGo").click(function() {
    var commandI = $("#consoleCommands");
    var command = commandI.val().replace(/\\n/g, "\n")
    lastCommand = commandI.val();
    sendCommand(commandI.val());
    commandI.val("");
  });
  $("#consoleCommands").focus(async function() {
    $("#consoleCommandsContainer").css("background", "rgb(15, 15, 15)");
  });
  $("#consoleCommands").blur(async function() {
    $("#consoleCommandsContainer").css("background", "#000");
  });
  $("#consoleCommands").keyup(async function(e) {
    if(e.keyCode == 13) {
      $("#consoleCommandsGo").click();
    } else if(e.keyCode == 38) {
      $(this).val(lastCommand);
    }
  });
  $("#startBot").click(function() {
    botToken = $("#token").val();
    if(botToken != "" && botToken) {
      $("#startBot").prop("disabled", true);
      log(l["startingBot"], "[INFO]", "blue-text");
      updateAnalyzer();
    } else {
      log(l["emptyToken"], l["logError"], "red-text");
    }
  });
  $("#stopBot").click(async function() {
    started = "stop";
    $("#stopBot").prop("disabled", true);
    log(l["stopSent"], "[INFO]", "yellow-text");
  });
  $("#commands").blur(async function() {
    updateCommands(true);
  });
  $("#updateCommands").click(updateCommands);
  if("commands" in cookies) {
    $("#commands").val(cookies["commands"]);
    if (cookies["commands"].indexOf("///////////") !== -1) {
      $("#commands").val($("#commands").val().split("///////////").join("\n"));
      updateCommands();
    }
  } else $("#commands").val("/start > Messaggio di avvio!;\n/help > Menù di aiuto!;");
  if("botToken" in cookies) {
    $("#token").val(cookies["botToken"]);
    botToken = $("#token").val();
  }
  if("botSettings" in cookies) {
    var bSettings = JSON.parse(cookies["botSettings"]);
    if ("parseMode" in bSettings)
      $("#parseMode").val(bSettings["parseMode"]);
    if ("wpPreview" in bSettings)
      $("#wpPreview").val(bSettings["wpPreview"]);
    if ("autoStart" in bSettings) {
      $("#autoStart").prop("checked", bSettings["autoStart"]);
      if(bSettings["autoStart"] == true) {
        setTimeout(function() {
          log(l["autoStart"], "[INFO]", "yellow-text");
          if (botToken != "" && botToken) {
            $("#startBot").click();
          } else {
            log(l["emptyToken"], l["logError"], "red-text");
            $("#autoStart").prop("checked", false);
            updateBotSettings();
          }
        }, 0);
      }
    }
    if ("logAllMsg" in bSettings)
      $("#logAllMsg").prop("checked", bSettings["logAllMsg"]);
    if ("knownChatIDs" in bSettings)
      knownChatIDs = JSON.parse(bSettings["knownChatIDs"]);
    if ("ufUpdAnalyzer" in bSettings)
      $("#ufUpdAnalyzer").prop("checked", bSettings["ufUpdAnalyzer"]);
    if ("selectedChatId" in bSettings && bSettings["selectedChatId"] != 0) {
      setTimeout(async function() {
        selectedChatId = bSettings["selectedChatId"];
        if(!selectedChatId in knownChatIDs) {
          request("getChat", {chat_id: selectedChatId}, function(response) {

          }, async function(xhr) {
            var response = JSON.parse(xhr.responseText);
            var err_code = response["error_code"];
            var desc = response["description"];
            if(err_code == 403) {
              log(l["userDidntStartBot"], l["logError"], "red-text");
            } else {
              log(l["unknownError"]+JSON.stringify(response), l["logError"], "red-text");
            }
            selectedChatId = "";
          });
        } else log(l["autoSelectCID1"]+knownChatIDs[selectedChatId]+l["autoSelectCID2"], "[INFO]", "yellow-text");
      }, 0);
    }
  }
  setTimeout(function() {
    M.updateTextFields();
    M.textareaAutoResize($('#commands'));
    $(".tooltipped").tooltip();
    $('select').formSelect();
    $(".modal").modal();
  }, 0);
  updateCommands(false);
});
async function updateCommands(doLog = true) {
  $("#updateCommands").prop("disabled", true);
  if(doLog) log(l["updatingCommands"], "[INFO]", "yellow-text");
  commands = {};
  var commandsString = $("#commands").val();
  var c = commandsString.split(/;$/gm);
  for(var command of c) {
    if(command.charAt(0) === "\n") command = command.substr(1);
    var commandArr = command.splitTwo(" > ");
    var photo = (commandArr[1].indexOf("photo ") == 0) ? true : false;
    if(photo) {
      commandArr[1] = commandArr[1].splitTwo("photo ")[1];
      var caption = "";
      if(commandArr[1].indexOf("\n") -1 < commandArr[1].length) {
        caption = commandArr[1].splitTwo("\n")[1];
        commandArr[1] = commandArr[1].splitTwo(caption)[0];
      }
    }
    var lineSplit = commandArr[1].split(/\n/);
    var lastLine = lineSplit[lineSplit.length - 1];
    var keyboard = [];
    if(lastLine.indexOf("[[[") === 0) {
      var m;
      if(debug) log("Building inline keyboard", "[DEBUG]");
      var search = /\[?(,? ?\[(\[(.+?)-(.+?)\])\])\]?/g;
      while (m = search.exec(lastLine)) {
        if(debug) log("Pushing <code>"+JSON.stringify(m)+"</code> into the keyboard array.", "[DEBUG]");
        keyboard.push([{text:m[3],callback_data:m[4]}]);
      }
      if(debug) log("Inline keyboard built.", "[DEBUG]");
      commandArr[1] = commandArr[1].substring(0, commandArr[1].lastIndexOf("\n"));
    }
    if(commandArr[0] in commands)
      commands[commandArr[0]].push((photo ? [commandArr[1], "photo", caption] : [commandArr[1], "text", keyboard]));
    else 
      commands[commandArr[0]] = photo ? [[commandArr[1], "photo", caption]] : [[commandArr[1], "text", keyboard]];
  }
  localStorage.setItem("commands", $("#commands").val());
  if(doLog) log(l["updatedCommands"], "[INFO]", "green-text");
  $("#updateCommands").prop("disabled", false);
}
function htmlEncode(string) {
  return $("<div>").text(string).html();
}
async function updateAnalyzer() {
  request("getUpdates",{
      offset: updateOffset
    }, async function(response) {
      var update = {};
      if(started == "stop") {
        $("#startBot").prop("disabled", false);
        log(l["botStopped"], "[INFO]", "blue-text");
        started = 0;
        return true;
      } else setTimeout(updateAnalyzer, ($("#ufUpdAnalyzer").prop("checked")) ? 0 : 500);
      if(response["result"] !== [] && response["result"] && response["result"].length > 0) {
        if(debug) {
          log("Received update "+htmlEncode(JSON.stringify(response)), "[DEBUG]");
          startTime = (new Date).getTime();
          log("Start Time: "+startTime, "[DEBUG]");
        }
        update = response["result"][0];
        updateOffset = update["update_id"];
        analyzeUpdate(update);
        updateOffset++;
      }
      if(started == 0) {
        localStorage.setItem("botToken", $("#token").val());
        log(l["botStarted"], "[INFO]", "blue-text");
        log(l["helpCmd"]);
        $("#stopBot").prop("disabled", false);
        request("getMe", {}, async function(response) {
          botInfo = response["result"];
          botUsername = botInfo["username"];
          var find = [
            "{BOTNAME}",
            "{TMEBOTUSERNAME}"
          ];
          var replace = [
            htmlEncode(botInfo["first_name"]),
            "<a href=\"https://t.me/"+botUsername+"\">@"+botUsername+"</a>"
          ]
          log(l["botInfo"].replaceArray(find, replace));
        });
        started = 1;
      }
    }, async function(xhr) {
    var response = xhr.responseText;
    var json = JSON.parse(xhr.responseText);
    var errormsg = "Errore sconosciuto"
    if (json["error_code"] == 403 || json["error_code"] == 404) errormsg = l["wrongToken"]
    else if (json["error_code"] == 409) errormsg = l["conflict"]
    log(l["connectionError"]+response+"<br />"+errormsg, l["logError"], "red-text");
    $("#stopBot").prop("disabled", true);
    $("#startBot").prop("disabled", false);
    started = 0;
  });
}
async function updateBotSettings() {
  if (botToken != "" && botToken) {
    if(debug) {
      log("Updating bot settings...", "[DEBUG]");
      var stTime = (new Date).getTime();
    }
    localStorage.setItem("botSettings", JSON.stringify({
      parseMode: $("#parseMode").val(),
      wpPreview: $("#wpPreview").val(),
      autoStart: $("#autoStart").prop("checked"),
      logAllMsg: $("#logAllMsg").prop("checked"),
      ufUpdAnalyzer: $("#ufUpdAnalyzer").prop("checked"),
      selectedChatId: selectedChatId,
      knownChatIDs: JSON.stringify(knownChatIDs),
    }));
    if(debug) log("Updated bot settings<br />Response time: "+((new Date).getTime() - stTime)+"ms", "[DEBUG]");
  }
}
async function analyzeUpdate(update) {
  var text = "";
  var message;
  var chat_id = 0;
  var name = "";
  var chat_name;
  var chat_title;
  var is_group = false;
  var last_name;
  var first_name;
  var user_id = 0;
  if(debug) {
    log("Analysing update: "+htmlEncode(JSON.stringify(update)), "[DEBUG]");
    
  }
  if ("message" in update){
    message = update["message"];
  if ("chat" in message) {
    chat_id = message["chat"]["id"];
    if("title" in message["chat"]) {
      chat_title = message["chat"]["title"];
      is_group = true;
    }
  } else {
    log(l["messageNotSupported"], "[WARNING]", "yellow-text");
    return false;
  }
  if("from" in message) {
    if ("first_name" in message["from"]) {
      first_name = message["from"]["first_name"];
      name = first_name;
    } else first_name = "";
    if("last_name" in message["from"]){
      last_name =  message["from"]["last_name"];
      name += " "+last_name;
    } else last_name = "";
    if("id" in message["from"]) user_id = message["from"]["id"];
    else user_id = 0;
  }
  if(typeof chat_title !== "undefined") {
    chat_name = chat_title;
  } else chat_name = name;
  if ("text" in message) {
    if(message["text"].charAt(0) == "/")
      text = message["text"].replace("@"+botUsername, "");
    else
      text = message["text"];
  } else if ("photo" in message) {
    var maxPhotoSize = message["photo"][(message["photo"].length - 1)]["file_id"];
    var caption = message["caption"];
    (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) && request("getFile", { file_id: maxPhotoSize }, async function(response) {
      var photoUrl = "https://api.telegram.org/file/bot" + botToken + "/" + response["result"]["file_path"];
      log("<span class=\"sentImg\"><img src=\""+photoUrl+"\"><br>"+(caption ? caption : "")+"</span>", "["+(is_group ? (htmlEncode(chat_title) + ": ") : "")+htmlEncode(name)+"]", ((selectedChatId == chat_id) ? "yellow-text" : "white-text"));
    }, async function(xhr) {
      if(xhr.responseText) log(xhr.responseText, l["logError"], "red-text")
    });
    text = "";
  }
  } else if ("callback_query" in update) {
    var callback_query = update["callback_query"];
    var data = callback_query["data"];
    var message = callback_query["message"];
    var callback_query_id = callback_query["id"];
    var from = callback_query["from"];
    var user_id = from["id"];
    if("first_name" in from)
      first_name = from["first_name"];
    name = first_name;
    if("last_name" in from) {
      last_name = from["last_name"];
      name += " "+last_name;
    }
    chat_id = callback_query["message"]["chat"]["id"];
  if(typeof chat_title !== "undefined") {
    chat_name = chat_title;
  } else chat_name = name;
    text = data;
    answerCallbackQuery(callback_query_id);
    if(debug) log("Callback Data: "+data, "["+htmlEncode(name)+"]", ((selectedChatId == user_id) ? "yellow-text" : "white-text"));
  } else {
    text = l["messageNotSupported"];
  }
  if((selectedChatId == chat_id || $("#logAllMsg").prop("checked")) && typeof data === "undefined") {
    if(text)
      log(htmlEncode(text), "["+(is_group ? (htmlEncode(chat_title) + ": ") : "")+htmlEncode(name)+"]", ((selectedChatId == chat_id) ? "yellow-text" : "white-text"));
  }
  knownChatIDs[chat_id] = chat_name;
  var find = [
    "{CHATID}",
    "{USERID}",
    "{CHATTITLE}",
    "{NAME}",
    "{FIRSTNAME}",
    "{LASTNAME}",
    "{MSGTEXT}",
    "{HTMLESCAPEDMSGTEXT}"
  ];
  var replace = [
    chat_id,
    user_id,
    ($("#parseMode").val() == "HTML") ? htmlEncode(chat_name) : chat_name,
    ($("#parseMode").val() == "HTML") ? htmlEncode(name) : name,
    ($("#parseMode").val() == "HTML") ? htmlEncode(first_name) : first_name,
    ($("#parseMode").val() == "HTML") ? htmlEncode(last_name) : last_name,
    text,
    htmlEncode(text)
  ];
  if(caption == "/fileid") {
    sendMessage(chat_id, "FileID: <code>" + maxPhotoSize + "</code>", {}, false, "HTML");
  }
  if(text in commands && text != "") {
    for(var ind of commands[text]) {
      if(ind[1] == "text") {
        var send_text = ind[0].replaceArray(find, replace);
        if(debug) log("Text to send: "+htmlEncode(send_text), "[DEBUG]");
        var reply_markup = {};
        if(2 in ind) {
          if(debug) log("Building reply_markup inline keyboard...", "[DEBUG]");
          reply_markup = {"inline_keyboard": ind[2]};
        }
        if(typeof data !== "undefined") editMessageText(chat_id, send_text, callback_query["message"]["message_id"], reply_markup);
        else sendMessage(chat_id, send_text, reply_markup);
      } else if(ind[1] == "photo") {
        var caption = "";
        if(2 in ind) {
          caption = ind[2].replaceArray(find, replace);
          if(debug) log("Caption to send: "+htmlEncode(caption), "[DEBUG]");
        }
        sendPhoto(chat_id, ind[0], caption);
      }
    }
  }
  if("any" in commands && typeof data === "undefined") {
    for(var ind of commands["any"]) {
      if(ind[1] == "text") {
        var send_text = ind[0].replaceArray(find, replace);
        if(debug) log("Text to send: "+htmlEncode(send_text), "[DEBUG]");
        sendMessage(chat_id, send_text);
      } else if(ind[1] == "photo") {
        var caption = "";
        if(2 in ind) {
          caption = ind[2].replaceArray(find, replace);
          if(debug) log("Caption to send: "+htmlEncode(caption), "[DEBUG]");
        }
        sendPhoto(chat_id, ind[0], caption);
      }
    }
  }
  if (debug) log("Response Time: "+((new Date).getTime() - startTime)+"ms", "[DEBUG]");
}
async function answerCallbackQuery(callback_query_id, text, show_alert) {
  var args = {
    callback_query_id: callback_query_id,
    text: text,
    show_alert: show_alert
  };
  request("answerCallbackQuery", args);

}
async function sendMessage(chat_id, messageText, reply_markup = {}, doLog = false, parse_mode = false, disable_web_page_preview = false) {
  if(!parse_mode) parse_mode = $("#parseMode").val();
  if(!disable_web_page_preview) disable_web_page_preview = $("#wpPreview").val();
  if((chat_id == undefined || chat_id == "") && !chat_id) {
    return false;
  } else {
    var args = {
      chat_id: chat_id,
      text: messageText,
      parse_mode: parse_mode,
      disable_web_page_preview: disable_web_page_preview,
      reply_markup: JSON.stringify(reply_markup)
    };
    request("sendMessage", args, async function(response) {
      if(doLog) log(response["result"]["text"], "["+l["messageSent"]+((chat_id in knownChatIDs) ? knownChatIDs[chat_id] : chat_id)+"]", "green-text");
    }, async function(xhr) {
      var response = xhr.responseText;
      log(l["sendMessageError"]+response, l["logError"], "red-text");
    }, true);
    return true;
  }
}
async function editMessageText(chat_id, messageText, message_id, reply_markup = {}, doLog = false, parse_mode = false, disable_web_page_preview = false) {
  if(!parse_mode) parse_mode = $("#parseMode").val();
  if(!disable_web_page_preview) disable_web_page_preview = $("#wpPreview").val();
  if((chat_id == undefined || chat_id == "") && !chat_id) {
    return false;
  } else {
    var args = {
      chat_id: chat_id,
      text: messageText,
      parse_mode: parse_mode,
      message_id: message_id,
      disable_web_page_preview: disable_web_page_preview,
      reply_markup: JSON.stringify(reply_markup)
    };
    request("editMessageText", args, async function() {}, async function(xhr) {
      var response = xhr.responseText;
      log(l["sendMessageError"]+response, l["logError"], "red-text");
    }, true);
  }
}
async function sendPhoto(chat_id, photo, caption = "", doLog = false, parse_mode = false, disable_web_page_preview = false) {
  if(!parse_mode) parse_mode = $("#parseMode").val();
  if(!disable_web_page_preview) disable_web_page_preview = $("#wpPreview").val();
  var args = {
    chat_id: chat_id,
    photo: photo,
    caption: caption,
    parse_mode = parse_mode,
    disable_web_page_preview: disable_web_page_preview
  };
  request("sendPhoto", args, async function(response) {
    if(doLog) request("getFile", { file_id: photo }, async function(response) {
          var photoUrl = "https://api.telegram.org/file/bot" + botToken + "/" + response["result"]["file_path"];
          log("<span class=\"sentImg\"><img src=\""+photoUrl+"\"></span>", "["+l["messageSent"]+": "+((chat_id in knownChatIDs) ? knownChatIDs[chat_id] : chat_id)+"]", "green-text");
        }, async function(xhr) {
          if(xhr.responseText) log(xhr.responseText, l["logError"], "red-text")
        });
  }, async function(xhr) {
    var response = xhr.responseText;
    log(l["sendMessageError"]+response, l["logError"], "red-text");
  }, true);
}
async function request(method, args = {}, successCb = async function() {}, errorCb = async function() {}, async = true) {
  $.ajax({
    url: "https://api.telegram.org/bot" + botToken + "/"+method,
    async: async,
    method: "POST",
    data: args,
    dataType: "json",
    success: successCb,
    error: errorCb
  });
}
async function sendCommand(command) {
  if(botToken != "" && botToken && started == 1)
    switch(command.splitTwo(" ",1)[0]) {
      case "/help":
        log(l["helpConsoleCommands"], "");
        break;
      case "/select":
        var cId = command.splitTwo(" ");
        if (1 in cId && cId[1]) {
          selectedChatId = cId[1];
          if (selectedChatId == 0)
            log(l["removedChatIdSelection"], "[INFO]", "green-text");
          else
            log(l["selected"]+selectedChatId+"!", "[INFO]", "green-text");
          updateBotSettings();
        } else {
          if($.isEmptyObject(knownChatIDs))
            log(l["noKnownChats"], l["logError"], "red-text");
          else {
            var opts = "";
            for(var chatId in knownChatIDs) {
              opts += "<option value=\""+chatId+"\""+((chatId == selectedChatId) ? " selected" : "")+">"+htmlEncode(knownChatIDs[chatId])+"</option>";
            }
            $("#selectChatId").html(opts).formSelect();
            $("#selectChatIdModal").modal("open");
          }
        }
        break;
      default:
        if(command.charAt(0) == "/")
          log(l["unknownCommand"], l["logError"], "red-text");
        else {
          if (selectedChatId != 0) {
            command = command.replace(/\\n/g, "\n")
            if(command.replace(new RegExp(" ", "g"), "").length > 0)
              if(command.length <= 4096)
                sendMessage(selectedChatId, command, {}, true);
              else
                log(l["messageTooLong"], l["logError"], "red-text");
            else
              log(l["emptyMessage"], l["logError"], "red-text");
          } else
            log(l["noChatSelected"], l["logError"], "red-text");
        }
        break;
      }
    else
      log(l["consoleBotNotStarted"], l["logError"], "red-text");
  }
