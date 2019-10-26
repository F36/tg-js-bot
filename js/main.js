/*
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";
!function() {
  var botToken = "";
  var updateOffset = -1;
  var updateAnalyzer;
  var cookies = localStorage;
  var commands = {};
  var variables = {};
  var started = 0;
  var selectedChatId = 0;
  var lastCommand = "";
  var botUsername = "";
  var knownChatIDs = {};
  var botInfo;
  var debug = false;
  var cActionTime = 0;
  var startTime = new Date().getTime();
  var logs = [];
  const a = document.location.href;
  const whUrl = "https://easyjsbot.pato05mc.tk/offline.php";
  var logTranslations = {
    "it-IT": {
      startingBot: "Avviando il bot... Connessione in corso ai server telegram...",
      botIsRunning: "Il bot è attivo. Clicca Arresta prima di uscire dalla pagina, per favore.",
      emptyToken: "Bot non avviato! Bot token vuoto!",
      stopSent: "Richiesta di arresto inviata!",
      autoStart: "Bot in avvio secondo le tue impostazioni...",
      userDidntStartBot: "L'utente selezionato precedentemente ha bloccato il bot o non lo ha mai avviato.",
      unknownError: "Errore sconosciuto",
      autoSelectCID1: "Selezionata chat ",
      autoSelectCID2: " come da sessione precedente.",
      updatingCommands: "Aggiornamento lista comandi in corso...",
      updatedCommands: "Aggiornamento lista comandi completato!",
      botStopped: "Bot arrestato!",
      botStarted: "Bot avviato! Attenzione: Se chiudi questa pagina, verrà anche arrestato il tuo bot!",
      helpCmd: "/help per i comandi della console.",
      botInfo: "Info Bot:<br>Nome: {BOTNAME}<br>Username: {TMEBOTUSERNAME}",
      wrongToken: "Token errato o non valido",
      conflict: "Conflitto, il bot ha il webhook già settato, oppure qualche altro programma è sul bot",
      connectionError: "Errore nella connessione: ",
      messageNotSupported: "Messaggio non supportato",
      sendMessageError: "Errore nell'invio del messaggio: ",
      helpConsoleCommands: "Menù comandi:<br />/help: visualizza questo menù di aiuto<br />/select: GUI per selezionare la chat in cui inviare i messaggi<br />&lt;messaggio&gt;: invia messaggio nella chat_id selezionata",
      removedChatIdSelection: "Rimossa selezione chat_id!",
      selected: "Selezionato ",
      noKnownChats: "Nessun chat_id conosciuto. Impossibile mostrare la GUI. Seleziona un chat_id manualmente con /select &lt;chat_id&gt;",
      unknownCommand: "Comando sconosciuto. /help per una lista completa di comandi.",
      messageTooLong: "Messaggio troppo lungo. Caratteri massimi consentiti: 4096 caratteri.",
      emptyMessage: "Messaggio nullo.",
      noChatSelected: "Per favore, prima di tentare di inviare un messaggio, usa /select",
      consoleBotNotStarted: 'Prima di scrivere comandi, perfavore, metti il token del bot. Se lo hai già fatto, assicurati di aver avviato il bot cliccando il pulsante "Avvia"',
      messageSent: "Messaggio inviato: ",
      logError: "[ERRORE]",
      deleteMessageError: "Impossibile eliminare il messaggio ",
      regexpError: "Impossibile costruire la tastiera: l'espressione regolare non va avanti. Per favore, prova ad aggiornare il tuo browser, oppure avvia un'issue su Github",
      critError: "[ERRORE CRITICO]",
      hours: " ore ",
      minutes: " minuti ",
      seconds: " secondi ",
      settingWebhook: "Sto impostando il webhook...",
      botStoppedWebhookSet: "Bot arrestato e webhook settato!",
      errorWebhook: "Errore durante l'imposto del webhook: ",
      unknownWebhook: "C'è un webhook già impostato che non punta alla pagina offline.\n{0}\nVuoi rimuoverlo?"
    },
    en: {
      startingBot: "Starting the bot... Connecting to telegram servers...",
      botIsRunning: "Bot is still running. Please, click Stop before leaving the page.",
      emptyToken: "Bot not started! Bot token empty!",
      stopSent: "Stop request sent!",
      autoStart: "Starting the bot according to your settings...",
      userDidntStartBot: "The user previously selected has blocked the bot or he hasn't started it at all.",
      unknownError: "Unknown error",
      autoSelectCID1: "Selected chat ",
      autoSelectCID2: " as previous session.",
      updatingCommands: "Updating commands list...",
      updatedCommands: "Commands list updated!",
      botStopped: "Bot stopped!",
      botStarted: "Bot started! Warning: If you close this page, your bot will be stopped too!",
      helpCmd: "/help for the console commands.",
      botInfo: "Bot Info:<br>Name: {BOTNAME}<br>Username: {TMEBOTUSERNAME}",
      wrongToken: "Wrong token or token not valid",
      conflict: "Conflict, the bot has already setted webhook, or some other program is on the bot",
      connectionError: "Connection error: ",
      messageNotSupported: "Messsage not supported",
      sendMessageError: "Message sending error: ",
      helpConsoleCommands: "Commands menù:<br />/help: shows this help menu<br />/select: GUI to select chat to send messages in<br />&lt;messaggio&gt;: send message in selected chat",
      removedChatIdSelection: "Removed chat_id selection!",
      selected: "Selected ",
      noKnownChats: "No known chat_id. Unable to show the GUI. Select a chat_id manually with /select &lt;chat_id&gt;",
      unknownCommand: "Unknown command. /help for a commands list.",
      messageTooLong: "Message too long. Maximum allowed characters: 4096 characters.",
      emptyMessage: "Message empty.",
      noChatSelected: "Please, before trying to send a message, use /select",
      consoleBotNotStarted: 'Before typing commands, enter the bot token. If you have already done it, make sure you\'ve clicked the "Start" button',
      messageSent: "Message sent: ",
      logError: "[ERROR]",
      deleteMessageError: "Can't delete message ",
      regexpError: "Can't build keyboard: Regexp not going forward. Please update your browser or put an issue on Github.",
      critError: "[CRITICAL ERROR]",
      hours: " hours ",
      minutes: " minutes ",
      seconds: " seconds ",
      settingWebhook: "Setting the webhook...",
      botStoppedWebhookSet: "Bot stopped and webhook set!",
      errorWebhook: "Error while setting the webhook: ",
      unknownWebhook: "There is a webhook already set that doesn't point to the offline page.\n{0}\nDo you want to remove it?"
    }
  };
  var translations = {
    "it-IT": {
      commandsHelpTr:
        "/comando > Risposta<strong>;</strong>(se devi usare il punto e virgola, poi ritornare a capo, metti un \\ prima del ;. Esempio: <code>/start > Ciao\\;;</code>, invierà Ciao;)<br>\
        Nella risposta, puoi usare <strong>photo</strong> oppure <strong>sticker</strong> seguito da un <strong>file_id/url</strong> (per mettere la descrizione alla foto, vai a capo) per inviare una foto, o un semplice testo per inviare una risposta testuale.<br>\
        Saranno aggiunti altri tipi di documenti/video presto.<br>\
        Per ricevere il file_id di una foto, manda una foto al tuo bot con descrizione /fileid\
        <br><br>\
        Nella risposta testuale puoi usare i seguenti codici:<br>\
        <code>{CHATID}</code>, <code>{USERID}</code>, <code>{CHATTITLE}</code>, <code>{NAME}</code>, <code>{FIRSTNAME}</code>, <code>{LASTNAME}</code>, <code>{MSGTEXT}</code>, <code>{HTMLESCAPEDMSGTEXT}</code>, <code>{STARTTIME}</code>\
        <br>\
        <code>{CHATID}</code>: ID della chat<br>\
        <code>{USERID}</code>: ID utente<br>\
        <code>{CHATTITLE}</code>: Nel caso di un gruppo, il nome del gruppo, altrimenti il nome completo dell'utente<br>\
        <code>{NAME}</code>: Nome completo dell'utente<br>\
        <code>{FIRSTNAME}</code>: Nome dell'utente<br>\
        <code>{LASTNAME}</code>: Cognome dell'utente<br>\
        <code>{MSGTEXT}</code>: Testo messaggio inviato.<br>\
        <code>{HTMLESCAPEDMSGTEXT}</code>: Testo messaggio inviato escapato da HTML.\
        <code>{STARTTIME}</code>: Ore, minuti e secondi formattati basandosi sulla tua lingua.\
        <br><br>\
        Mettendo <code>any</code> come comando, questo risponderà ad ogni comando.\
        <br><br>\
        Puoi usare le tastiere inline mettendo sull'ultima linea della risposta al tuo comando <strong>[[[BOTTONE - COMANDO]]]</strong> e, una virgola prima dell'ultima parentesi quadra per mettere un altro bottone sull'altra linea della tastiera inline.\
        <br><code>[[[Bottone1 - comando1]],[[Bottone2 - comando2]]]</code>\
        <br>oppure, una virgola sulla parentesi direttamente successiva a COMANDO per un bottone sulla stessa linea\
        <br><code>[[[Bottone - comando],[Sono sulla stessa linea! - comando2]]]</code>\
        <br>Per rispondere ad un bottone cliccato, metti il callback data messo nel bottone come un normale comando\
        <code>comando1 > risposta1;</code> Il messaggio sarà modificato con risposta1\
        <br><br>Esempio pratico:<br>\
        <code>/start > Ciao! Clicca uno dei bottoni qui sotto:\
        <br>[[[Cosa fai? - //help],[Come sei stato creato? - //creato]],[[Ciao! - //saluto]]];\
        <br>//help > Non faccio niente :);\
        <br>//creato > Sono stato creato con EasyJSBot!;\
        <br>//saluto > Ciao!;</code><br><br>\
        <br>Puoi anche usare le tastiere tradizionali, la sintassi è (((RISPOSTA))) come con le tastiere inline, puoi ordinarle come vuoi:\
        <br><code>(((Ciao),(Come va?)))</code>: Ciao e Come va? saranno sulla stessa linea \
        <br><code>(((Ciao)),((Come va?)))</code>: Ciao e Come va? Saranno questa volta su linee diverse\
        <br>Facendo così, creerai una tastiera permanente, che si può rimuovere mettendo sulla risposta () che rimuoverà la tastiera\
        <br>Oppure, per nasconderla (necessiterai successivamente di rimuoverla), potrai mettere \", true\" alla fine delle parentesi <code>(((Ciao))), true</code> che creerà una\
        \"one time keyboard\" cioè, una tastiera che verrà nascosta automaticamente al click del bottone.\
        <br><br>Esempio pratico:<br>\
        <code>/start > Ciao, benvenuto sul bot. Clicca uno dei pulsanti:<br>\
        (((Come sei stato creato?),(Cosa puoi fare?)),((Ciao!)),((Rimuovi la tastiera)));<br>\
        Come sei stato creato? > Sono stato creato con EasyJSBot;<br>\
        Cosa puoi fare? > Niente, sono solo di test;<br>\
        Ciao! > Ciao!!;<br>\
        Rimuovi la tastiera > Ok! Invia /start se hai bisogno ancora di me!<br>\
        ();</code>\
        <br>Puoi usare anche le variabili: si dichiarano con $variabile = valore; Ex: <code>$saluto = Ciao!;</code>, e si possono usare dove\
        vuoi nella risposta, come keyboard inline, come keyboard tradizionali, ecc. <br>\
        I nomi delle variabili possono contenere i caratteri 0-9, A-Z, a-z e _. Qualsiasi altro carattere non è accettato e la variabile verrà ignorata.",
      "tr-botToken": "Token del bot",
      "tr-botcommands": "Comandi del bot",
      startBot: "Avvia!",
      stopBot: "Arresta",
      "tr-autostart":
        "Avvia automaticamente il bot al caricamento della pagina",
      "tr-logallmsg": "Logga i messaggi da qualsiasi chat",
      "tr-createdby": "Creato da Pato05 <code>:)</code>",
      "tr-cmdHelpTitle": "Help comandi",
      selectChId: "Seleziona la chat_id",
      removeChatId: "Rimuovi selezione",
      "tr-all": "Invia tutti i messaggi",
      "tr-random": "Messaggio casuale",
      "tr-wh": "Invia un messaggio quando il bot è offline",
      downloadLogs: "Scarica i log",
      downloadLogsText: "Come un file di testo",
      downloadLogsHTML: "Come un file HTML",
      "tr-onlymsgs": 'Solo messaggi',
      "tr-normallog": 'Normale',
      "lbl-logsVerbosity": 'Livello di verbosità dei logs',
      "tr-dlJS": "Tutti i livelli (solo HTML)"
    },
    en: {
      "tr-botToken": "Bot Token",
      "tr-botcommands": "Bot commands",
      startBot: "Start!",
      stopBot: "Stop",
      "tr-autostart": "Automatically start the bot at page load",
      "tr-logallmsg": "Log messages from every chat",
      "tr-createdby": "Created by Pato05 <code>:)</code>",
      "tr-cmdHelpTitle": "Commands Help",
      selectChId: "Select the chat_id",
      removeChatId: "Remove selection",
      commandsHelpTr:
        "/command > Answer<strong>;</strong> (if you have to use the semicolon, then return, put a \\ before ;. Example: <code>/start > Hello\\;;</code>, it will send Hello;)<br>\
        In the answer, you can use <strong>photo</strong> or <strong>sticker</strong> followed by <strong>file_id/url</strong> (to put the caption to a photo, start a new line) to send a photo, or a simple text to send a textual answer.<br>\
        Will be added new types of documents/videos soon (I'm too lazy to do it now.)<br>\
        To get a photo file_id, send a photo to your active bot with caption /fileid\
        <br><br>\
        In the textual answer or caption you can use these codes:<br>\
        <code>{CHATID}</code>, <code>{USERID}</code>, <code>{CHATTITLE}</code>, <code>{NAME}</code>, <code>{FIRSTNAME}</code>, <code>{LASTNAME}</code>, <code>{MSGTEXT}</code>, <code>{HTMLESCAPEDMSGTEXT}</code>, <code>{STARTTIME}</code>\
        <br>\
        <code>{CHATID}</code>: Chat ID<br>\
        <code>{USERID}</code>: User ID<br>\
        <code>{CHATTITLE}</code>: In the case of a group, the group title, else the complete user's name<br>\
        <code>{NAME}</code>: Complete user's name<br>\
        <code>{FIRSTNAME}</code>: User's first name<br>\
        <code>{LASTNAME}</code>: User's last name<br>\
        <code>{MSGTEXT}</code>: Text of the message sent by the user<br>\
        <code>{HTMLESCAPEDMSGTEXT}</code>: Text of the message sent by the user HTML escaped.\
        <code>{STARTTIME}</code>: Ore, minuti e secondi formattati basandosi sulla tua lingua.\
        <br><br>\
        Putting <code>any</code> as command, it will answer to each message.\
        <br><br>\
        You can use inline keyboards by putting at the end of your answer <strong>[[[BUTTON - COMMAND]]]</strong> and, a virgola before the last bracket to put a button on a new line.\
        <br><code>[[[Button1 - command1]],[[Button2 - Command2]]]</code>\
        <br>or, a virgola after the bracket directly next at COMMAND for a button on the same line\
        <br><code>[[[Button - command],[I'm on the same line! - command2]]]</code>\
        <br>To answer a clicked button, put your button command like a normal command\
        <code>command1 > answer1;</code> The message will be edited with answer1\
        <br><br>Pratical example:<br>\
        <code>/start > Hello! Click one of the buttons below:\
        <br>[[[What do you do? - //help],[How have you been created? - //created]],[[Hi! - //greeting]]];\
        <br>//help > I don't do nothing :);\
        <br>//created > I have been created with EasyJSBot!;\
        <br>//greeting > Hello there!;</code><br><br>\
        <br>You can use traditional keyboards too, the syntax is (((ANSWER))) and, like as inline keyboards, you can order them as you wish:\
        <br><code>(((Hello),(How are you?)))</code>: Hello and How are you? will be on the same line\
        <br><code>(((Ciao)),((Come va?)))</code>: Hello and How are you? will now be on different lines\
        <br>Doing that you'll create a permanent keyboard, that can be removed with () in the last line of the answer\
        <br>Or, to hide it (you will equally need to remove it after), if you put \", true\" at the end of the brackets <code>(((Ciao))), true</code> it will create a\
        \"one time keyboard\", a keyboard that will be hided when a button is clicked.\
        <br><br>Pratical example:<br>\
        <code>/start > Hello, welcome to the bot. Click one of the buttons:<br>\
        (((How have you been created?),(What can you do?)),((Hello!)),((Remove keyboard)));<br>\
        How have you been created? > I've been created with EasyJSBot;<br>\
        What can you do? > Nothing, I am only for testing;<br>\
        Hello! > Hello there!!;<br>\
        Remove keyboard > Ok! Send again /start if you need me!<br>\
        ();</code>\
        <br>You can use variables: you can declare them by $variable = value; Ex: <code>$greeting = Hello!;</code>, and you can use them everywhere\
        in the command response, as inline keyboard, as traditional keyboard, etc. <br>\
        Variable names can contain the characters 0-9, A-Z, a-z and _. If you use every other character, the variable will be ignored.",
      "tr-all": "Send all messages",
      "tr-random": "Random message",
      "tr-wh": "Send a message when the bot is offline",
      downloadLogs: "Download Logs",
      downloadLogsText: "As a text file",
      downloadLogsHTML: "As an HTML file",
      "tr-onlymsgs": 'Only messages',
      "tr-normallog": 'Normal',
      "lbl-logsVerbosity": 'Logs verbosity level',
      "tr-dlJS": "Every level (only HTML)"
    }
  };
  // Simple functions to work easily
  String.prototype.format = function() {
    let a = this;
    for (let k in arguments) {
      a = a.replace("{" + k + "}", arguments[k]);
    }
    return a;
  };
  var navLang = navigator.userLanguage || navigator.language;
  var l;
  function splitTwo(str, by) {
    var arr = str.split(by);
    str = str.substr(arr[0].length + by.length);
    return [arr[0], str];
  }
  function replaceArray(find, replace, str) {
    var regex;
    for (var i = 0; i < find.length; i++) {
      regex = new RegExp(find[i], "g");
      str = str.replace(regex, replace[i]);
    }
    return str;
  }
  async function log(text, type = "info", classes = "white-text") {
    var prefix;
    if (type === "info") {
      prefix = "[INFO]";
      classes = "white-text";
    } else if (type === "critical") {
      prefix = l["critError"];
      classes = "red-text";
    } else if (type === "error") {
      type = 'normal';
      prefix = l["logError"];
      classes = "red-text";
    } else if (type === "event") {
      type = 'normal';
      prefix = "[INFO]";
      classes = "blue-text";
    } else if (type === "waiting") {
      type = 'normal';
      prefix = "[INFO]";
      classes = "yellow-text";
    } else if (type === "success") {
      type = 'normal';
      prefix = "[INFO]";
      classes = "green-text";
    } else if (type === "warning") {
      type = 'normal';
      prefix = "[WARNING]";
      classes = "yellow-text";
    } else if (type === "") {
      prefix = "";
      classes = "white-text";
    } else if (type === "debug") {
      prefix = "[DEBUG]";
    } else {
      prefix = type;
      type = 'message';
    }
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let formatted = (hours < 10 ? '0' : '')+hours+':'+(minutes < 10 ? '0' : '')+minutes+':'+(seconds < 10 ? '0' : '')+seconds;
    if (prefix != "") prefix += " ";
    let newSpan = $("<span>");
    newSpan.attr("class", classes);
    logs.push({type: type, content: newSpan.html('['+formatted+'] '+prefix+text)[0].outerHTML + '<br>'});
    if(type === 'debug' && !debug) return;
    newSpan.html(prefix + text);
    let consoleElem = $("#console");
    consoleElem.append(newSpan);
    consoleElem.append("<br>");
    consoleElem.scrollTop(consoleElem[0].scrollHeight - consoleElem.height());
  }
  function updatePage() {
    l = logTranslations[navLang] || logTranslations["en"];
    for (let [idelem, value] of Object.entries((translations[navLang] || translations['en']))) {
      $("#" + idelem).html(value);
    }
    $("#logsVerbosity").formSelect();
  }
  $(document).ready(async function() {
    if (typeof a === "undefined" && a !== document.location.href) {
      log("Variable not set.", "critical");
    }
    if (location.href.indexOf("#") !== -1) {
      var hash = location.hash;
      if (hash == "#debug=1") {
        debug = true;
        setTimeout(function() {
          log("DEBUG mode enabled", "debug");
        }, 0);
      }
    }
    $("#applyChatId").on("click", async function() {
      sendCommand("/select " + $("#selectChatId").val());
    });
    $("#removeChatId").on("click", async function() {
      sendCommand("/select 0");
    });
    $("#autoStart").on("change", updateBotSettings);
    $("#logAllMsg").on("change", updateBotSettings);
    $("#parseMode").on("change", updateBotSettings);
    $("#wpPreview").on("change", updateBotSettings);
    $("#ufUpdAnalyzer").on("change", updateBotSettings);
    $("#sendAll").on("change", updateBotSettings);
    $("#offlineWebhook").on("change", updateBotSettings);
    $("#consoleCommandsGo").click(function() {
      let commandI = $("#consoleCommands");
      let command = commandI.val().replace(/\\n/g, "\n");
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
    $(window).on("beforeunload", function() {
      if (started != 0) return l["botIsRunning"];
    });
    $("#consoleCommands").keyup(async function(e) {
      if (e.keyCode == 13) {
        $("#consoleCommandsGo").click();
        cActionTime = 0;
      } else if (e.keyCode == 38) {
        $(this).val(lastCommand);
      } else if (started != 0 && selectedChatId !== 0) {
        let nowTime = Math.round(new Date().getTime() / 1000);
        if (nowTime - cActionTime > 5) {
          sendChatAction(selectedChatId, "typing");
          cActionTime = nowTime;
        }
      }
    });
    $("#startBot").click(function() {
      if(started != 0) {
        console.log("Don't mess with me ;)");
        return;
      }
      if (typeof a === "undefined" && a !== document.location.href) {
        log("Variable not set. Please, contact @Pato05 on Telegram.", "critical");
        return;
      }
      botToken = $("#token").val();
      if (botToken != "" && botToken) {
        $("#startBot").prop("disabled", true);
        log(l["startingBot"], "event");
        updateAnalyzer();
        log("Started updates loop", "debug");
      } else {
        log(l["emptyToken"], "error");
      }
    });
    $("#stopBot").click(async function() {
      if(started == 0 || started == "stop") {
        console.log("Don't mess with me ;)");
        return;
      }
      started = "stop";
      $("#stopBot").prop("disabled", true);
      log(l["stopSent"], "waiting");
    });
    $("#downloadLogsText").click(async function(e) {
      e.preventDefault();
      let date = new Date();
      let logsformatted = formatLogs($('#logsVerbosity').val() === 'jsHTML' ? 'debug' : $('#logsVerbosity').val());
      let stripped = logsformatted.replace(/<img(.+?)>/g, 'Immagine').replace(/<video(.+?)class="video_note"(.+?)<\/video>/g, 'Nota video').replace(/<video(.+?)<\/video>/g, 'Video').replace(/<audio(.+?)<\/audio>/g, 'Messaggio vocale').replace(/<span(.+?)>/g, '').replace(/(<br( \/)?>)?<\/span>/g, '').replace(/<br( \/)?>/g, "\n");
      console.log(stripped);
      let a = $("<a>")
                      .prop('href', 'data:application/octet-stream;charset=utf-8,'+encodeURIComponent($("<div>").html(stripped).text()))
                      .prop('download', 'easyjsbot-'+date.getHours()+date.getMinutes()+date.getSeconds()+date.getDay()+date.getMonth()+date.getFullYear()+'.log')
                      .css('display', 'none');
      $("body").append(a);
      a[0].click();
      a.remove();
    });
    $("#downloadLogsHTML").click(async function(e) {
      e.preventDefault();
      let style = '.sentImg>video.video_note{border-radius:50%;min-width:60%;min-height:60%;}.sentImg,.sentImg>img{display:inline-block;max-width:100%;max-height:30%;text-align:center}html,body{color:#fff;background-color:#000;font-family:Roboto,Montserrat,Lato,sans-serif;padding:15px;}a{text-decoration:none;color:#039be5;-webkit-tap-highlight-color:transparent;}.yellow-text{color:#ffeb3b}.blue-text{color:#2196F3}.red-text{color:#F44336}.green-text{color:#4CAF50}.white-text{color:#fff}';
      let html = '<html><head><!-- Generated by EasyJSBot (https://github.pato05mc.tk/tg-js-bot) --><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no"><meta name="generator" content="EasyJSBot Log"><title>EasyJSBot Log {0}</title><style>{1}</style></head><body>{2}</body></html>'
      let date = new Date();
      let day = date.getDay();
      let month = date.getMonth();
      let year = date.getFullYear();
      let verbosity = $('#logsVerbosity').val();
      let downloadtext = '';
      let formatted = (day < 10 ? '0' : '')+day+'/'+(month < 10 ? '0' : '')+month+'/'+year;
      if(verbosity === 'jsHTML') {
        let script = 'let logs='+JSON.stringify(logs)+';!function(){const e=function(){let e=document.getElementById("logs");e.innerHTML="";let n=this.value;""===n?n=0:"normal"===n?n=1:"debug"===n&&(n=2);for(let t of logs)n>0&&("normal"===t.type&&(e.innerHTML+=t.content),n>1&&"debug"===t.type&&(e.innerHTML+=t.content)),("critical"===t.type||"message"===t.type)&&(e.innerHTML+=t.content)};document.getElementById("verbositySelect").addEventListener("change",e),e()}();';
        style += '#verbositySelect{position:fixed;height:30px;width:150px;border:.1px solid #fff;top:0;right:0;background-color:#000;color:#fff;}select:focus{outline:none}';
        downloadtext = html.format(formatted, style, '<select id="verbositySelect"><option value="" selected="">'+translations[navLang]['tr-onlymsgs']+'</option><option value="normal">'+translations[navLang]['tr-normallog']+'</option><option value="debug">Debug</option></select><div id="logs"></div><script>'+"// Generated by EasyJSBot\n"+script+'</script>');
      } else {
        let logsformatted = formatLogs(verbosity);
        downloadtext = html.format(formatted, style, logsformatted);
      }
      let a = $("<a>")
                      .prop('href', 'data:application/octet-stream;charset=utf-8,'+encodeURIComponent(downloadtext))
                      .prop('download', 'easyjsbot-'+date.getHours()+date.getMinutes()+date.getSeconds()+day+month+year+'.log.html')
                      .css('display', 'none');
      $("body").append(a);
      a[0].click();
      a.remove();
    });
    $("#langIT").click(async function(e) {
      e.preventDefault();
      navLang = "it-IT";
      updatePage();
    });
    $("#langEN").click(async function(e) {
      e.preventDefault();
      navLang = "en";
      updatePage();
    });
    $("#commands").blur(async function() {
      updateCommands(true);
    });
    updatePage();
    $("#updateCommands").click(updateCommands);
    if ("commands" in cookies) {
      $("#commands").val(cookies["commands"]);
      if (cookies["commands"].indexOf("///////////") !== -1) {
        $("#commands").val(
          $("#commands")
            .val()
            .split("///////////")
            .join("\n")
        );
        updateCommands();
      }
    } else $("#commands").val("/start > Messaggio di avvio!;\n/help > Menù di aiuto!;");
    if ("botToken" in cookies) {
      $("#token").val(cookies["botToken"]);
      botToken = $("#token").val();
    }
    if ("botSettings" in cookies) {
      var bSettings = JSON.parse(cookies["botSettings"]);
      if ("parseMode" in bSettings) $("#parseMode").val(bSettings["parseMode"]);
      if ("wpPreview" in bSettings) $("#wpPreview").val(bSettings["wpPreview"]);
      if ("autoStart" in bSettings) {
        $("#autoStart").prop("checked", bSettings["autoStart"]);
        if (bSettings["autoStart"] == true) {
          setTimeout(function() {
            log(l["autoStart"], "waiting");
            if (botToken != "" && botToken) {
              $("#startBot").click();
            } else {
              log(l["emptyToken"], "error");
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
      if ("sendAll" in bSettings)
        $("#sendAll").prop("checked", bSettings["sendAll"]);
      if ("offlineWebhook" in bSettings)
        $("#offlineWebhook").prop("checked", bSettings["offlineWebhook"]);
      if ("selectedChatId" in bSettings && bSettings["selectedChatId"] != 0) {
        setTimeout(async function() {
          selectedChatId = bSettings["selectedChatId"];
          if (!selectedChatId in knownChatIDs) {
            request(
              "getChat",
              { chat_id: selectedChatId },
              function(response) {},
              async function(xhr) {
                let response = JSON.parse(xhr.responseText);
                let err_code = response["error_code"];
                let desc = response["description"];
                if (err_code == 403) {
                  log(l["userDidntStartBot"], "error");
                } else {
                  log(l["unknownError"] + ": " + JSON.stringify(response), "error");
                }
                selectedChatId = "";
              }
            );
          } else log(l["autoSelectCID1"] + htmlEncode(knownChatIDs[selectedChatId]) + l["autoSelectCID2"], "waiting");
        }, 0);
      }
    }
    M.updateTextFields();
    $("#commands").css("height", "auto");
    setTimeout(function() {
      M.textareaAutoResize($("#commands"));
    }, 200);
    $(".tooltipped").tooltip();
    $("select").formSelect();
    $(".modal").modal();
    $(".dropdown-trigger").dropdown();
    updateCommands(false);
    secCheck();
  });
  async function updateCommands(doLog = true) {
    $("#updateCommands").prop("disabled", true);
    if (doLog) log(l["updatingCommands"], "waiting");
    commands = {};
    var commandsString = $("#commands").val();
    var c = commandsString.split(/; *$/gm);
    var t = [];
    var k = 0;
    while (k !== c.length - 1) {
      (c[k].endsWith("\\") &&
        t.push(c[k].substr(0, c[k].length - 1) + ";" + c[k + 1]) &&
        k++) ||
        t.push(c[k]);
      k++;
    }
    c = t;
    t = undefined;
    for (var command of c) {
      if (command.charAt(0) === "\n") command = command.substr(1);
      var replaced = command.replace(/^(\$[A-Za-z0-9_]+) = (.+?)$/s, function(
        $1,
        $2,
        $3
      ) {
        variables[$2] = $3;
        return "";
      });
      if (replaced !== "" && command.indexOf(" > ") !== -1) {
        var commandArr = splitTwo(command, " > ");
        commandArr[1] = commandArr[1].replace(/\$[A-Za-z0-9_]+/g, function($1) {
          return $1 in variables ? variables[$1] : $1;
        });
        var photo = commandArr[1].indexOf("photo ") == 0 ? true : false;
        var sticker = false;
        var lineSplit = commandArr[1].split(/\n/g);
        var lastLine = lineSplit[lineSplit.length - 1];
        if (photo) {
          commandArr[1] = splitTwo(commandArr[1], "photo ")[1];
          var caption = "";
          if (
            commandArr[1].indexOf("\n") !== -1 &&
            (((caption = splitTwo(commandArr[1], "\n")[1]) !== "" &&
              (caption.indexOf("[[[") === -1 &&
                caption.indexOf("(((") === -1)) ||
              caption !== lastLine)
          ) {
            commandArr[1] = splitTwo(commandArr[1], caption)[0];
            caption = caption.substring(0, caption.lastIndexOf("\n"));
          } else caption = "";
        } else if (commandArr[1].indexOf("sticker ") === 0) {
          commandArr[1] = splitTwo(commandArr[1], "sticker ")[1];
          sticker = true;
        }
        var keyboard = null;
        if (lastLine.indexOf("[[[") === 0) {
          var m;
          keyboard = { inline_keyboard: [] };
          log("Building inline keyboard", "debug");
          var search = /\[?(,? ?\[?(,? ?\[(.*?) - (.*?)\]?)\])\]?/g;
          var i = 0;
          var e = 0;
          while ((m = search.exec(lastLine))) {
            var pushArr;
            if (
              m[4].indexOf("https://") === 0 ||
              m[4].indexOf("http://") === 0 ||
              m[4].indexOf("tg://") === 0
            ) {
              pushArr = { text: m[3], url: m[4] };
            } else {
              pushArr = { text: m[3], callback_data: m[4] };
            }
            log("Pushing <code>" + JSON.stringify(pushArr) + "</code> into the keyboard array.", "debug");
            e++;
            if (e > 1 && search.lastIndex < e) {
              log(l["regexpError"], "critical");
              alert(l["critError"] + " " + l["regexpError"]);
              return;
            }
            if (
              m[1].indexOf(", [[") === 0 ||
              m[1].indexOf(",[[") === 0 ||
              m[1].indexOf("[[") === 0
            ) {
              keyboard["inline_keyboard"].push([pushArr]);
              i++;
            } else {
              keyboard["inline_keyboard"][i - 1].push(pushArr);
            }
          }
          log("Inline keyboard built.", "debug");
          commandArr[1] = commandArr[1].substring(
            0,
            commandArr[1].lastIndexOf("\n")
          );
        } else if (lastLine.indexOf("(((") === 0) {
          var m;
          var i = 0;
          keyboard = { keyboard: [] };
          log("Building traditional keyboard", "debug");
          var search = /\(?(,? ?\(?(,? ?\((.*?)\)?)\))\)?/g;
          while ((m = search.exec(lastLine))) {
            var pushArr = { text: m[3] };
              log("Pushing <code>" + JSON.stringify(pushArr) + "</code> into the keyboard array.", "debug");
            if (
              m[1].indexOf(", ((") === 0 ||
              m[1].indexOf(",((") === 0 ||
              m[1].indexOf("((") === 0
            ) {
              keyboard["keyboard"].push([pushArr]);
              i++;
            } else {
              keyboard["keyboard"][i - 1].push(pushArr);
            }
          }
          if (lastLine.endsWith(",true") || lastLine.endsWith(", true")) {
            keyboard["one_time_keyboard"] = true;
            log("One time keyboard detected", "debug");
          }
          log("Keyboard built.", "debug");
          commandArr[1] = commandArr[1].substring(
            0,
            commandArr[1].lastIndexOf("\n")
          );
        } else if (lastLine.indexOf("()") === 0) {
          var m;
          keyboard = { remove_keyboard: true };
          log("Remove keyboard put into reply_markup", "debug");
          commandArr[1] = commandArr[1].substring(
            0,
            commandArr[1].lastIndexOf("\n")
          );
        }
        var i;
        if (photo) i = [commandArr[1], "photo", keyboard, caption];
        else if (sticker) i = [commandArr[1], "sticker", keyboard];
        else i = [commandArr[1], "text", keyboard];
        if (commandArr[0] in commands) commands[commandArr[0]].push(i);
        else commands[commandArr[0]] = [i];
      }
    }
    localStorage.setItem("commands", $("#commands").val());
    if (doLog) log(l["updatedCommands"], "success");
    $("#updateCommands").prop("disabled", false);
  }
  function htmlEncode(string) {
    return $("<div>")
      .text(string)
      .html();
  }
  async function updateAnalyzer() {
    request(
      "getUpdates",
      {
        offset: updateOffset
      },
      async function(response) {
        var update = {};
        if (started == "stop") {
          if ($("#offlineWebhook").prop("checked")) {
            log(l["settingWebhook"], "waiting");
            request(
              "setWebhook",
              {
                url:
                  whUrl + "?token=" + botToken + "&lang=" + navLang + "&d=" + a
              },
              async function() {
                $("#startBot").prop("disabled", false);
                log(l["botStopped"], "event");
              },
              async function(xhr) {
                log(l["errorWebhook"] + xhr.responseText, "error");
              }
            );
          } else {
            $("#startBot").prop("disabled", false);
            log(l["botStopped"], "event");
          }
          started = 0;
          return true;
        } else
          setTimeout(
            updateAnalyzer,
            $("#ufUpdAnalyzer").prop("checked") ? 0 : 500
          );
        if (
          response["result"] !== [] &&
          response["result"] &&
          response["result"].length > 0
        ) {
          if (debug) {
            log("Received update " + htmlEncode(JSON.stringify(response)),"debug");
            startTime = new Date().getTime();
            log("Start Time: " + startTime, "debug");
          }
          update = response["result"][0];
          updateOffset = update["update_id"];
          analyzeUpdate(update);
          updateOffset++;
        }
        if (started == 0) {
          localStorage.setItem("botToken", $("#token").val());
          log(l["botStarted"], "event");
          log(l["helpCmd"]);
          $("#stopBot").prop("disabled", false);
          request("getMe", {}, async function(response) {
            botInfo = response["result"];
            botUsername = botInfo["username"];
            var find = ["{BOTNAME}", "{TMEBOTUSERNAME}"];
            var replace = [
              htmlEncode(botInfo["first_name"]),
              '<a href="tg://resolve?domain=' +
                botUsername +
                '">@' +
                botUsername +
                "</a>"
            ];
            log(replaceArray(find, replace, l["botInfo"]));
          });
          started = 1;
        }
      },
      async function(xhr) {
        var response = xhr.responseText;
        var json = JSON.parse(response);
        var errormsg = l["unknownError"];
        if (json["error_code"] == 403 || json["error_code"] == 404)
          errormsg = l["wrongToken"];
        else if (json["error_code"] == 409) errormsg = l["conflict"];

        if (
          json["error_code"] === 409 &&
          json["description"] ===
            "Conflict: can't use getUpdates method while webhook is active; use deleteWebhook to delete the webhook first"
        ) {
          var wdel;
          request("getWebhookInfo", {}, async function(json) {
            if (json["result"]["url"].indexOf(whUrl) !== 0)
              if (!confirm(l["unknownWebhook"].format(json["result"]["url"])))
                return;
            request("deleteWebhook");
            wdel = true;
            started = 0;
            $("#stopBot").prop("disabled", false);
            $("#startBot").prop("disabled", true);
            updateAnalyzer();
            log("Started updates loop", "debug");
          });
        } else log(l["connectionError"] + errormsg, "error");
        started = 0;
        if (wdel) return;
        $("#stopBot").prop("disabled", true);
        $("#startBot").prop("disabled", false);
        return;
      }
    );
  }
  async function updateBotSettings() {
    if (botToken != "" && botToken) {
      log("Updating bot settings...", "debug");
      localStorage.setItem(
        "botSettings",
        JSON.stringify({
          parseMode: $("#parseMode").val(),
          wpPreview: $("#wpPreview").val(),
          autoStart: $("#autoStart").prop("checked"),
          logAllMsg: $("#logAllMsg").prop("checked"),
          ufUpdAnalyzer: $("#ufUpdAnalyzer").prop("checked"),
          selectedChatId: selectedChatId,
          knownChatIDs: JSON.stringify(knownChatIDs),
          sendAll: $("#sendAll").prop("checked"),
          offlineWebhook: $("#offlineWebhook").prop("checked")
        })
      );
        log("Updated bot settings","debug");
    }
  }
  async function analyzeUpdate(update) {
    var text = "";
    var message;
    var chat_id = 0;
    var name = "";
    var ptext;
    var chat_name;
    var chat_title;
    var is_group = false;
    var last_name;
    var first_name;
    var user_id = 0;
    var diffTime;
    if ("message" in update) {
      message = update["message"];
      if ("chat" in message) {
        chat_id = message["chat"]["id"];
        if ("title" in message["chat"]) {
          chat_title = message["chat"]["title"];
          is_group = true;
        }
      } else {
        log(l["messageNotSupported"], "warning");
        return false;
      }
      if ("from" in message) {
        if ("first_name" in message["from"]) {
          first_name = message["from"]["first_name"];
          name = first_name;
        } else first_name = "";
        if ("last_name" in message["from"]) {
          last_name = message["from"]["last_name"];
          name += " " + last_name;
        } else last_name = "";
        if ("id" in message["from"]) user_id = message["from"]["id"];
        else user_id = 0;
      }

      if (typeof chat_title !== "undefined") {
        chat_name = chat_title;
      } else chat_name = name;
      if ("text" in message) {
        text = message["text"];
        if (text.charAt(0) == "/" && text.indexOf("@" + botUsername) !== -1)
          ptext = text.replace("@" + botUsername, "");
        else ptext = text;
      } else if ("photo" in message) {
        var maxPhotoSize =
          message["photo"][message["photo"].length - 1]["file_id"];
        var caption = message["caption"];
        (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) &&
          request(
            "getFile",
            { file_id: maxPhotoSize },
            async function(response) {
              var photoUrl =
                "https://api.telegram.org/file/bot" +
                botToken +
                "/" +
                response["result"]["file_path"];
              log(
                '<span class="sentImg"><img src="' +
                  photoUrl +
                  '"><br>' +
                  (caption ? caption : "") +
                  "</span>",
                  "[" +
                  (is_group ? htmlEncode(chat_title) + ": " : "") +
                  htmlEncode(name) +
                  "]",
                selectedChatId == chat_id ? "yellow-text" : "white-text"
              );
            },
            async function(xhr) {
              if (xhr.responseText) log(xhr.responseText, "error");
            }
          );
        text = "";
      } else if ("video" in message) {
        var caption = message["caption"];
        var file_id = message["video"]["file_id"];
        (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) &&
          request(
            "getFile",
            { file_id: file_id },
            async function(response) {
              var video =
                "https://api.telegram.org/file/bot" +
                botToken +
                "/" +
                response["result"]["file_path"];
              log(
                '<span class="sentImg"><video src="' +
                  video +
                  '" controls></video><br>' +
                  (caption ? caption : "") +
                  "</span>",
                "[" +
                  (is_group ? htmlEncode(chat_title) + ": " : "") +
                  htmlEncode(name) +
                  "]",
                selectedChatId == chat_id ? "yellow-text" : "white-text"
              );
            },
            async function(xhr) {
              if (xhr.responseText) log(xhr.responseText, "error");
            }
          );
        text = "";
      } else if ("sticker" in message) {
        var file_id = message["sticker"]["file_id"];
        (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) &&
          request(
            "getFile",
            { file_id: file_id },
            async function(response) {
              var sticker =
                "https://api.telegram.org/file/bot" +
                botToken +
                "/" +
                response["result"]["file_path"];
              log(
                'Sticker: <span class="sentImg"><img class="sticker" src="' +
                  sticker +
                  '"><br>' +
                  (caption ? caption : "") +
                  "</span>",
                "[" +
                  (is_group ? htmlEncode(chat_title) + ": " : "") +
                  htmlEncode(name) +
                  "]",
                selectedChatId == chat_id ? "yellow-text" : "white-text"
              );
            },
            async function(xhr) {
              if (xhr.responseText) log(xhr.responseText, "error");
            }
          );
        text = "";
      } else if ("voice" in message) {
        var caption = message["caption"];
        var file_id = message["voice"]["file_id"];
        (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) &&
          request(
            "getFile",
            { file_id: file_id },
            async function(response) {
              var audio =
                "https://api.telegram.org/file/bot" +
                botToken +
                "/" +
                response["result"]["file_path"];
              log(
                '<span class="sentImg"><audio src="' +
                  audio +
                  '" controls></audio><br>' +
                  (caption ? caption : "") +
                  "</span>",
                "[" +
                  (is_group ? htmlEncode(chat_title) + ": " : "") +
                  htmlEncode(name) +
                  "]",
                selectedChatId == chat_id ? "yellow-text" : "white-text"
              );
            },
            async function(xhr) {
              if (xhr.responseText) log(xhr.responseText, "error");
            }
          );
        text = "";
      } else if ("video_note" in message) {
        var caption = message["caption"];
        var file_id = message["video_note"]["file_id"];
        (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) &&
          request(
            "getFile",
            { file_id: file_id },
            async function(response) {
              var video =
                "https://api.telegram.org/file/bot" +
                botToken +
                "/" +
                response["result"]["file_path"];
              log(
                '<span class="sentImg"><video class="video_note" src="' +
                  video +
                  '" controls></video><br>' +
                  (caption ? caption : "") +
                  "</span>",
                "[" +
                  (is_group ? htmlEncode(chat_title) + ": " : "") +
                  htmlEncode(name) +
                  "]",
                selectedChatId == chat_id ? "yellow-text" : "white-text"
              );
            },
            async function(xhr) {
              if (xhr.responseText) log(xhr.responseText, "error");
            }
          );
        text = "";
      }
    } else if ("callback_query" in update) {
      var callback_query = update["callback_query"];
      var data = callback_query["data"];
      var message = callback_query["message"];
      var callback_query_id = callback_query["id"];
      var from = callback_query["from"];
      var user_id = from["id"];
      if ("first_name" in from) first_name = from["first_name"];
      name = first_name;
      if ("last_name" in from) {
        last_name = from["last_name"];
        name += " " + last_name;
      }
      chat_id = callback_query["message"]["chat"]["id"];
      if ("chat" in message) {
        chat_id = message["chat"]["id"];
        if ("title" in message["chat"]) {
          chat_title = message["chat"]["title"];
          is_group = true;
        }
      }
      if (typeof chat_title !== "undefined") {
        chat_name = chat_title;
      } else chat_name = name;
      ptext = data;
      text = data;
      answerCallbackQuery(callback_query_id);
      log("[" + htmlEncode(name) + "] "+"Callback Data: " + data, 'debug', selectedChatId == user_id ? "yellow-text" : "white-text");
    } else {
      text = l["messageNotSupported"];
    }
    if (
      (selectedChatId == chat_id || $("#logAllMsg").prop("checked")) &&
      typeof data === "undefined"
    ) {
      if (text)
        log(
          htmlEncode(text),
          "[" +
            (is_group ? htmlEncode(chat_title) + ": " : "") +
            htmlEncode(name) +
            "]",
          selectedChatId == chat_id ? "yellow-text" : "white-text"
        );
    }
    knownChatIDs[chat_id] = chat_name;
    diffTime = new Date(new Date().getTime() - startTime);
    var find = [
      "{CHATID}",
      "{USERID}",
      "{CHATTITLE}",
      "{NAME}",
      "{FIRSTNAME}",
      "{LASTNAME}",
      "{MSGTEXT}",
      "{HTMLESCAPEDMSGTEXT}",
      "{STARTTIME}"
    ];
    var replace = [
      chat_id,
      user_id,
      $("#parseMode").val() == "HTML" ? htmlEncode(chat_name) : chat_name,
      $("#parseMode").val() == "HTML" ? htmlEncode(name) : name,
      $("#parseMode").val() == "HTML" ? htmlEncode(first_name) : first_name,
      $("#parseMode").val() == "HTML" ? htmlEncode(last_name) : last_name,
      text,
      htmlEncode(text),
      diffTime.getHours() -
        1 +
        l["hours"] +
        diffTime.getMinutes() +
        l["minutes"] +
        diffTime.getSeconds() +
        l["seconds"]
    ];
    if (caption == "/fileid") {
      sendMessage(
        chat_id,
        "FileID: <code>" + maxPhotoSize + "</code>",
        null,
        false,
        "HTML"
      );
    }
    if (ptext === "/fileid") {
      if ("reply_to_message" in message) {
        var reply = message["reply_to_message"];
        if ("photo" in reply)
          var file_id = reply["photo"][message["photo"].length - 1]["file_id"];
        else if ("video" in reply) var file_id = reply["video"]["file_id"];
        else if ("voice" in reply) var file_id = reply["voice"]["file_id"];
        else if ("video_note" in reply)
          var file_id = reply["video_note"]["file_id"];
        else if ("audio" in reply) var file_id = reply["audio"]["file_id"];
        else if ("document" in reply)
          var file_id = reply["document"]["file_id"];
        else if ("sticker" in reply) var file_id = reply["sticker"]["file_id"];
        else var file_id = "Not available or not compatible";
        sendMessage(
          chat_id,
          "File ID: <code>" + file_id + "</code>",
          null,
          false,
          "HTML"
        );
      }
    }
    if (ptext in commands && ptext != "") {
      for (var ind of commands[ptext]) {
        var reply_markup = null;
        if (!$("#sendAll").prop("checked")) {
          ind =
            commands[ptext][Math.floor(Math.random() * commands[ptext].length)];
          reply_markup = commands[ptext][0][2];
        }
        if (ind[1] == "text") {
          var send_text = replaceArray(find, replace, ind[0]);
          log("Text to send: " + htmlEncode(send_text), "debug");
          if (2 in ind && ind[2]) {
            reply_markup = ind[2];
            reply_markup = JSON.stringify(reply_markup);
            reply_markup = replaceArray(find, replace, reply_markup);
            reply_markup = JSON.parse(reply_markup);
          }
          if (typeof data !== "undefined") {
            if (
              !$.isEmptyObject(reply_markup) &&
              !("inline_keyboard" in reply_markup)
            ) {
              log("reply_markup is not an inline keyboard and request has been sent by a button, sending a new message and deleting the existing one.", "debug");
              deleteMessage(chat_id, message["message_id"]);
              sendMessage(chat_id, send_text, reply_markup);
            } else if ("photo" in message) {
              log("Message to edit is a photo. Incompatible types photo, text. Deleting previous message and sending a new one.", "debug");
              deleteMessage(chat_id, message["message_id"]);
              sendMessage(chat_id, send_text, reply_markup);
            } else if ("sticker" in message) {
              log("Message to edit is a sticker. Incompatible types sticker, text. Deleting previous message and sending a new one.", "debug");
              deleteMessage(chat_id, message["message_id"]);
              sendMessage(chat_id, send_text, reply_markup);
            } else
              editMessageText(
                chat_id,
                send_text,
                message["message_id"],
                reply_markup
              );
          } else sendMessage(chat_id, send_text, reply_markup);
        } else if (ind[1] == "photo") {
          var caption = "";
          var media = null;
          if (3 in ind) {
            caption = replaceArray(find, replace, ind[3]);
            log("Caption to send: " + htmlEncode(caption), "debug");
          }
          if (2 in ind && ind[2]) {
            reply_markup = ind[2];
            reply_markup = JSON.stringify(reply_markup);
            reply_markup = replaceArray(find, replace, reply_markup);
            reply_markup = JSON.parse(reply_markup);
          }
          if (typeof data !== "undefined") {
            if (
              !$.isEmptyObject(reply_markup) &&
              !("inline_keyboard" in reply_markup)
            ) {
              log("reply_markup is not an inline keyboard and request has been sent by a button, sending a new message and deleting the existing one.", "debug");
              deleteMessage(chat_id, message["message_id"]);
              sendPhoto(chat_id, ind[0], caption, reply_markup);
            } else if ("text" in message) {
              log("Message to edit is a text. Incompatible types photo, text. Deleting previous message and sending a new one.", "debug");
              deleteMessage(chat_id, message["message_id"]);
              sendPhoto(chat_id, ind[0], caption, reply_markup);
            } else if ("sticker" in message) {
              log("Message to edit is a sticker. Incompatible types photo, sticker. Deleting previous message and sending a new one", "debug");
              deleteMessage(chat_id, message["message_id"]);
              sendPhoto(chat_id, ind[0], caption, reply_markup);
            } else {
              media = {
                type: "photo",
                media: ind[0],
                caption: caption
              };
              editMessageMedia(
                chat_id,
                message["message_id"],
                media,
                reply_markup
              );
            }
          } else sendPhoto(chat_id, ind[0], caption, reply_markup);
        } else if (ind[1] == "sticker") {
          if (2 in ind && ind[2]) {
            reply_markup = ind[2];
            reply_markup = JSON.stringify(reply_markup);
            reply_markup = replaceArray(find, replace, reply_markup);
            reply_markup = JSON.parse(reply_markup);
          }
          if (typeof data !== "undefined") {
            deleteMessage(chat_id, message["message_id"]);
            log("Can't edit sticker.", "debug");
          }
          sendSticker(chat_id, ind[0], reply_markup);
        }
        if (!$("#sendAll").prop("checked")) {
          break;
        }
      }
    }
    if ("any" in commands && typeof data === "undefined") {
      for (var ind of commands["any"]) {
        if (!$("#sendAll").prop("checked")) {
          ind =
            commands["any"][Math.floor(Math.random() * commands["any"].length)];
        }
        if (ind[1] == "text") {
          var send_text = replaceArray(find, replace, ind[0]);
          log("Text to send: " + htmlEncode(send_text), "debug");
          var reply_markup = {};
          if (2 in ind) {
            reply_markup = ind[2];
          }
          sendMessage(chat_id, send_text, reply_markup);
        } else if (ind[1] == "photo") {
          var caption = "";
          if (2 in ind) {
            caption = replaceArray(find, replace, ind[2]);
            log("Caption to send: " + htmlEncode(caption), "debug");
          }
          sendPhoto(chat_id, ind[0], caption);
        }
        if (!$("#sendAll").prop("checked")) {
          break;
        }
      }
    }
    log("Response Time: " + (new Date().getTime() - startTime) + "ms","debug");
  }
  async function sendCommand(command) {
    if (botToken != "" && botToken && started == 1)
      switch (splitTwo(command, " ")[0]) {
        case "/help":
          log(l["helpConsoleCommands"], "");
          break;
        case "/select":
          var cId = splitTwo(command, " ");
          if (1 in cId && cId[1]) {
            selectedChatId = cId[1];
            if (selectedChatId == 0)
              log(l["removedChatIdSelection"], "success");
            else log(l["selected"] + selectedChatId + "!", "success");
            updateBotSettings();
          } else {
            if ($.isEmptyObject(knownChatIDs)) log(l["noKnownChats"], "error");
            else {
              var opts = "";
              for (var chatId in knownChatIDs) {
                opts +=
                  '<option value="' +
                  chatId +
                  '"' +
                  (chatId == selectedChatId ? " selected" : "") +
                  ">" +
                  htmlEncode(knownChatIDs[chatId]) +
                  "</option>";
              }
              $("#selectChatId")
                .html(opts)
                .formSelect();
              $("#selectChatIdModal").modal("open");
            }
          }
          break;
        default:
          if (command.charAt(0) == "/") log(l["unknownCommand"], "error");
          else {
            if (selectedChatId != 0) {
              command = command.replace(/\\n/g, "\n");
              if (command.replace(new RegExp(" ", "g"), "").length > 0)
                if (command.length <= 4096)
                  sendMessage(selectedChatId, command, {}, true);
                else log(l["messageTooLong"], "error");
              else log(l["emptyMessage"], "error");
            } else log(l["noChatSelected"], "error");
          }
          break;
      }
    else log(l["consoleBotNotStarted"], "error");
  }
  async function answerCallbackQuery(callback_query_id, text, show_alert) {
    var args = {
      callback_query_id: callback_query_id,
      text: text,
      show_alert: show_alert
    };
    request("answerCallbackQuery", args);
  }
  // Please, do not remove this part. If it is creating problems, contact @Pato05 on Telegram
  async function secCheck() {
    $.ajax({
      url: "https://easyjsbot.pato05mc.tk/protectedtransfer.php",
      async: true,
      method: "POST",
      data: { url: a, lang: navLang },
      dataType: "json",
      success: res => {
        if (res.isLegit != true) {
          $("body > main > div.container > div.card-panel").prepend(
            $("<div>")
              .addClass("row")
              .html(res.prep)
          );
        }
      },
      error: () => {
        log(
          "Security check failed. Please, contact @Pato05 on Telegram",
          "warning"
        );
      }
    });
  }
  async function deleteMessage(chat_id, message_id) {
    var args = {
      chat_id: chat_id,
      message_id: message_id
    };
    request(
      "deleteMessage",
      args,
      async function() {},
      async function(xhr) {
        var response = xhr.responseText;
        log(l["deleteMessageError"] + message_id + ": " + response, "error");
      },
      true
    );
  }
  async function sendChatAction(chat_id, action) {
    var args = {
      chat_id: chat_id,
      action: action
    };
    request("sendChatAction", args);
  }
  async function sendMessage(
    chat_id,
    messageText,
    reply_markup = null,
    doLog = false,
    parse_mode = false,
    disable_web_page_preview = false
  ) {
    if (!parse_mode) parse_mode = $("#parseMode").val();
    if (!disable_web_page_preview)
      disable_web_page_preview = $("#wpPreview").val();
    if ((chat_id == undefined || chat_id == "") && !chat_id) {
      return false;
    } else {
      var args = {
        chat_id: chat_id,
        text: messageText,
        parse_mode: parse_mode,
        disable_web_page_preview: disable_web_page_preview
      };
      if (reply_markup) args["reply_markup"] = JSON.stringify(reply_markup);
      request(
        "sendMessage",
        args,
        async function(response) {
          if (doLog)
            log(
              response["result"]["text"],
              "[" +
                l["messageSent"] +
                htmlEncode(chat_id in knownChatIDs ? knownChatIDs[chat_id] : chat_id) +
                "]",
              "green-text"
            );
        },
        async function(xhr) {
          var response = xhr.responseText;
          log(l["sendMessageError"] + response, "error");
        },
        true
      );
      return true;
    }
  }
  async function editMessageText(
    chat_id,
    messageText,
    message_id,
    reply_markup = null,
    doLog = false,
    parse_mode = false,
    disable_web_page_preview = false
  ) {
    if (!parse_mode) parse_mode = $("#parseMode").val();
    if (!disable_web_page_preview)
      disable_web_page_preview = $("#wpPreview").val();
    if ((chat_id == undefined || chat_id == "") && !chat_id) {
      return false;
    } else {
      var args = {
        chat_id: chat_id,
        text: messageText,
        parse_mode: parse_mode,
        message_id: message_id,
        disable_web_page_preview: disable_web_page_preview
      };
      if (reply_markup) args["reply_markup"] = JSON.stringify(reply_markup);
      request(
        "editMessageText",
        args,
        async function() {},
        async function(xhr) {
          var response = xhr.responseText;
          log(l["sendMessageError"] + response, "error");
        },
        true
      );
    }
  }
  async function editMessageMedia(
    chat_id,
    message_id,
    media,
    reply_markup = null,
    parse_mode = false
  ) {
    if (!parse_mode) parse_mode = $("#parseMode").val();
    if ((chat_id == undefined || chat_id == "") && !chat_id) {
      return false;
    } else {
      if (!("parse_mode" in media)) media["parse_mode"] = parse_mode;
      var args = {
        chat_id: chat_id,
        message_id: message_id,
        media: JSON.stringify(media)
      };
      if (reply_markup) args["reply_markup"] = JSON.stringify(reply_markup);
      request(
        "editMessageMedia",
        args,
        async function() {},
        async function(xhr) {
          var response = xhr.responseText;
          log(l["sendMessageError"] + response, "error");
        },
        true
      );
    }
  }
  async function sendPhoto(
    chat_id,
    photo,
    caption = "",
    reply_markup = null,
    doLog = false,
    parse_mode = false,
    disable_web_page_preview = false
  ) {
    if (!parse_mode) parse_mode = $("#parseMode").val();
    if (!disable_web_page_preview)
      disable_web_page_preview = $("#wpPreview").val();
    var args = {
      chat_id: chat_id,
      photo: photo,
      caption: caption,
      parse_mode: parse_mode,
      disable_web_page_preview: disable_web_page_preview
    };
    if (reply_markup) args["reply_markup"] = JSON.stringify(reply_markup);
    request(
      "sendPhoto",
      args,
      async function(response) {
        if (doLog)
          request(
            "getFile",
            { file_id: photo },
            async function(response) {
              var photoUrl =
                "https://api.telegram.org/file/bot" +
                botToken +
                "/" +
                response["result"]["file_path"];
              log(
                '<span class="sentImg"><img src="' + photoUrl + '"></span>',
                "[" +
                  l["messageSent"] +
                  ": " +
                  (chat_id in knownChatIDs ? knownChatIDs[chat_id] : chat_id) +
                  "]",
                "green-text"
              );
            },
            async function(xhr) {
              if (xhr.responseText) log(xhr.responseText, "error");
            }
          );
      },
      async function(xhr) {
        var response = xhr.responseText;
        log(l["sendMessageError"] + response, "error");
      },
      true
    );
  }
  async function sendSticker(chat_id, sticker, reply_markup = null) {
    var args = {
      chat_id: chat_id,
      sticker: sticker
    };
    if (reply_markup) args["reply_markup"] = JSON.stringify(reply_markup);
    request("sendSticker", args);
  }
  async function request(
    method,
    args = {},
    successCb = async function() {},
    errorCb = async function() {},
    async = true
  ) {
    method !== "getUpdates" && log("Doing a " + method + ' method request with POST args "' + htmlEncode(JSON.stringify(args)) + '"...', 'debug');
    $.ajax({
      url: "https://api.telegram.org/bot" + botToken + "/" + method,
      async: async,
      method: "POST",
      data: args,
      dataType: "json",
      success: successCb,
      error: errorCb
    });
    method !== "getUpdates" && log("Request of type " + method + " ended.", 'debug');
  }
  function formatLogs(verbosity = 'debug') {
    let logsformatted = '';
    if(verbosity === '') verbosity = 0;
    else if (verbosity === 'normal') verbosity = 1;
    else if (verbosity === 'debug') verbosity = 2;
    for(let a of logs) {
      if(verbosity > 0) {
        a['type'] === 'normal' && (logsformatted += a['content']);
        if(verbosity > 1) {
          a['type'] === 'debug' && (logsformatted += a['content']);
        }
      }
      (a['type'] === 'critical' || a['type'] === 'message') && (logsformatted += a['content']);
    }
    return logsformatted;
  }
}();
!function() {
  var times = 0;
  $("#easterEgg").click(async function() {
    times++;
    if(times > 5) {
      window.alert("Me: > typeof NaN\nJavascript: "+typeof NaN);
      times = 0;
    }
  });
}()
// Made with ❤️ by Pato05