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
function log(text, prefix = "[INFO]", classes = "white-text") {
  var consoleElem = $("#console");
  var newSpan = $("<span>");
  newSpan.attr("class", classes)
  if(prefix != "") prefix += " ";
  newSpan.html(prefix + text);
  consoleElem.append(newSpan);
  consoleElem.append("<br>");
  consoleElem.scrollTop(consoleElem[0].scrollHeight - consoleElem.height());
}
$(document).ready(function() {
  if (location.href.indexOf("#") != -1) {
    var hash = location.href.substr(location.href.indexOf("#")+1);
    if(hash == "debug=1") {
      debug = true;
      setTimeout(function(){log("DEBUG mode enabled", "[DEBUG]")}, 0);
    }
  }
  $("#applyChatId").on("click", function() {
    sendCommand("/select "+$("#selectChatId").val());
  });
  $("#removeChatId").on("click", function() {
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
  $("#consoleCommands").focus(function() {
    $("#consoleCommandsContainer").css("background", "rgb(15, 15, 15)");
  });
  $("#consoleCommands").blur(function() {
    $("#consoleCommandsContainer").css("background", "#000");
  });
  $("#consoleCommands").keyup(function(e) {
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
      log("Avviando il bot... Connessione in corso ai server telegram...", "[INFO]", "blue-text");
      updateAnalyzer();
    } else {
      log("Bot non avviato! Bot token vuoto!", "[ERRORE]", "red-text");
    }
  });
  $("#stopBot").click(function() {
    started = "stop";
    $("#stopBot").prop("disabled", true);
    log("Richiesta di arresto inviata!", "[INFO]", "yellow-text");
  });
  $("#commands").blur(function() {
    updateCommands(true);
  });
  $("#updateCommands").click(updateCommands);
  if("commands" in cookies) {
    $("#commands").val(cookies["commands"].split("///////////").join("\n"));
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
          log("Bot in avvio secondo le tue impostazioni...", "[INFO]", "yellow-text");
          if (botToken != "" && botToken) {
            $("#startBot").click();
          } else {
            log("Bot token vuoto.", "[ERRORE]", "red-text");
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
      setTimeout(function() {
        selectedChatId = bSettings["selectedChatId"];
        if(!selectedChatId in knownChatIDs) {
          request("getChat", {chat_id: selectedChatId}, function(response) {

          }, function(xhr) {
            var response = JSON.parse(xhr.responseText);
            var err_code = response["error_code"];
            var desc = response["description"];
            if(err_code == 403) {
              log("L'utente selezionato precedentemente ha bloccato il bot o non lo ha mai avviato.", "[ERRORE]", "red-text");
            } else {
              log("Errore sconosciuto: "+JSON.stringify(response), "[ERRORE]", "red-text");
            }
            selectedChatId = "";
          });
        } else log("Selezionata chat "+knownChatIDs[selectedChatId]+" come da sessione precedente.", "[INFO]", "yellow-text");
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
function updateCommands(doLog = true) {
  $("#updateCommands").prop("disabled", true);
  if(doLog) log("Aggiornamento lista comandi in corso...", "[INFO]", "yellow-text");
  commands = {};
  var commandsString = $("#commands").val();
  var c = commandsString.split(/;$/gm);
  for(var command in c) {
    if(c[command].charAt(0) === "\n") c[command] = c[command].substr(1);
    var commandArr = c[command].splitTwo(" > ");
    if(commandArr[0] in commands)
      commands[commandArr[0]].push(commandArr[1]);
    else
      commands[commandArr[0]] = [commandArr[1]];
  }
  localStorage.setItem("commands", $("#commands").val().replace(/\n/g, "///////////"));
  if(doLog) log("Aggiornamento lista comandi completato!", "[INFO]", "green-text");
  $("#updateCommands").prop("disabled", false);
}
function htmlEncode(string) {
  return $("<div>").text(string).html();
}
function updateAnalyzer() {
  request("getUpdates",{
      offset: updateOffset
    }, function(response) {
      var update = {};
      if(started == "stop") {
        $("#startBot").prop("disabled", false);
        log("Bot arrestato!", "[INFO]", "blue-text");
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
        log("Bot avviato! Attenzione: Se chiudi questa pagina, verrà anche arrestato il tuo bot!", "[INFO]", "blue-text");
        log("/help per i comandi della console.");
        $("#stopBot").prop("disabled", false);
        setTimeout(function() {
          request("getMe", {}, function(response) {
            botInfo = response["result"];
            botUsername = botInfo["username"];
            log("Info Bot:<br>Nome: "+htmlEncode(botInfo["first_name"])+"<br>Username: <a href=\"https://t.me/"+botUsername+"\">@"+botUsername+"</a>");
          });
        }, 0);
        started = 1;
      }
    }, function(xhr) {
    var response = xhr.responseText;
    var json = JSON.parse(xhr.responseText);
    var errormsg = "Errore sconosciuto"
    if (json["error_code"] == 403 || json["error_code"] == 404) errormsg = "Possibile token errato o non valido"
    else if (json["error_code"] == 409) errormsg = "Possibile conflitto"
    log("Errore nella connessione: "+response+"<br />"+errormsg, "[ERRORE]", "red-text");
    $("#stopBot").prop("disabled", true);
    $("#startBot").prop("disabled", false);
    started = 0;
  });
}
function updateBotSettings() {
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
function analyzeUpdate(update) {
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
  if ("message" in update)
    message = update["message"];
  else
    message = {};
  if ("chat" in message) {
    chat_id = message["chat"]["id"];
    if("title" in message["chat"]) {
      chat_title = message["chat"]["title"];
      is_group = true;
    }
  } else {
    log("Messaggio non supportato", "[WARNING]", "yellow-text");
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
    (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) && request("getFile", { file_id: maxPhotoSize }, function(response) {
      var photoUrl = "https://api.telegram.org/file/bot" + botToken + "/" + response["result"]["file_path"];
      log("<span class=\"sentImg\"><img src=\""+photoUrl+"\"><br>"+(caption ? caption : "")+"</span>", "["+(is_group ? (htmlEncode(chat_title) + ": ") : "")+htmlEncode(name)+"]", ((selectedChatId == chat_id) ? "yellow-text" : "white-text"));
    }, function(xhr) {
      if(xhr.responseText) log(xhr.responseText, "[ERRORE]", "red-text")
    });
    text = "";
  } else {
    text = "Messaggio non supportato!";
  }
  if(selectedChatId == chat_id || $("#logAllMsg").prop("checked")) {
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
    sendMessage(chat_id, "FileID: <code>" + maxPhotoSize + "</code>", false, "HTML");
  }
  if(text in commands && text != "") {
    for(var ind of commands[text]) {
      var send_text = ind.replaceArray(find, replace);
      if(debug) log("Text to send: "+htmlEncode(send_text), "[DEBUG]");
      sendMessage(chat_id, send_text);
    }
  }
  if ("any" in commands) {
    for(var ind in commands["any"]) {
      var send_text = commands["any"][ind].replaceArray(find, replace);
      if(debug) log("Text to send: "+htmlEncode(send_text), "[DEBUG]");
      sendMessage(chat_id, send_text);
    }
  }
  if (debug) log("Response Time: "+((new Date).getTime() - startTime)+"ms", "[DEBUG]");
}
function sendMessage(chat_id, messageText, doLog = false, parse_mode = false, disable_web_page_preview = false) {
  if(!parse_mode) parse_mode = $("#parseMode").val();
  if(!disable_web_page_preview) disable_web_page_preview = $("#wpPreview").val();
  if(messageText.indexOf("photo") == 0) {
    var file_id = messageText.splitTwo(" ")[1];
    var args = {
      chat_id: chat_id,
      photo: file_id
    };
    request("sendPhoto", args, function(response) {
      if(doLog) request("getFile", { file_id: file_id }, function(response) {
            var photoUrl = "https://api.telegram.org/file/bot" + botToken + "/" + response["result"]["file_path"];
            log("<span class=\"sentImg\"><img src=\""+photoUrl+"\"></span>", "[Messaggio inviato: "+((chat_id in knownChatIDs) ? knownChatIDs[chat_id] : chat_id)+"]", "green-text");
          }, function(xhr) {
            if(xhr.responseText) log(xhr.responseText, "[ERRORE]", "red-text")
          });
    }, function(xhr) {
      var response = xhr.responseText;
      log("Errore nell'invio del messaggio: "+response, "[ERRORE]", "red-text");
    }, true);
  } else {
    if((chat_id == undefined || chat_id == "") && !chat_id) {
      return false;
    } else {
      var args = {
        chat_id: chat_id,
        text: messageText,
        parse_mode: parse_mode,
        disable_web_page_preview: disable_web_page_preview
      };
      request("sendMessage", args, function(response) {
        if(doLog) log(response["result"]["text"], "[Messaggio inviato: "+((chat_id in knownChatIDs) ? knownChatIDs[chat_id] : chat_id)+"]", "green-text");
      }, function(xhr) {
        var response = xhr.responseText;
        log("Errore nell'invio del messaggio: "+response, "[ERRORE]", "red-text");
      }, true);
      return true;
    }
  }
}
function request(method, args = {}, successCb = function() {}, errorCb = function() {}, async = true) {
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
function sendCommand(command) {
  if(botToken != "" && botToken && started == 1)
    switch(command.splitTwo(" ",1)[0]) {
      case "/help":
        log("Menù comandi:<br />/help: visualizza questo menù di aiuto<br />/select: GUI per selezionare la chat in cui inviare i messaggi<br />&lt;messaggio&gt;: invia messaggio nella chat_id selezionata", "");
        break;
      case "/select":
        var cId = command.splitTwo(" ");
        if (1 in cId && cId[1]) {
          selectedChatId = cId[1];
          if (selectedChatId == 0)
            log("Rimossa selezione chat_id!", "[INFO]", "green-text");
          else
            log("Selezionato "+selectedChatId+"!", "[INFO]", "green-text");
          updateBotSettings();
        } else {
          if($.isEmptyObject(knownChatIDs))
            log("Nessun chat_id conosciuto. Impossibile mostrare la GUI. Seleziona un chat_id manualmente con /select &lt;chat_id&gt;", "[ERRORE]", "red-text");
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
          log("Comando non valido. /help per una lista completa di comandi.", "[ERRORE]", "red-text");
        else {
          if (selectedChatId != 0) {
            command = command.replace(/\\n/g, "\n")
            if(command.replace(new RegExp(" ", "g"), "").length > 0)
              if(command.length <= 4096)
                sendMessage(selectedChatId, command, true);
              else
                log("Messaggio troppo lungo. Caratteri massimi consentiti: 4096 caratteri.", "[ERRORE]", "red-text");
            else
              log("Messaggio nullo.", "[ERRORE]", "red-text");
          } else
            log("Per favore, prima di tentare di inviare un messaggio, usa /select", "[ERRORE]", "red-text");
        }
        break;
      }
    else
      log("Prima di scrivere comandi, perfavore, metti il token del bot. Se lo hai già fatto, assicurati di aver avviato il bot cliccando il pulsante \"Avvia\"", "[ERRORE]", "red-text");
  }
