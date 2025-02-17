"use strict";
var Capabilities;
(function (Capabilities) {
    Capabilities["REL1XX"] = "REL1XX";
    Capabilities["FORKING"] = "FORKING";
    Capabilities["PRECONDITION"] = "PRECONDITION";
    Capabilities["PEM"] = "PEM";
    Capabilities["UPDATE"] = "UPDATE";
})(Capabilities || (Capabilities = {}));
var Annotype;
(function (Annotype) {
    Annotype["CONNECT"] = "CONNECT";
    Annotype["RINGING"] = "RING";
})(Annotype || (Annotype = {}));
var CallPollActionType;
(function (CallPollActionType) {
    CallPollActionType["Accept"] = "accept";
    CallPollActionType["Forward"] = "forward";
    CallPollActionType["Reject"] = "reject";
})(CallPollActionType || (CallPollActionType = {}));
var CallStartActionType;
(function (CallStartActionType) {
    CallStartActionType[CallStartActionType["Abort"] = 0] = "Abort";
    CallStartActionType[CallStartActionType["Forward"] = 1] = "Forward";
    CallStartActionType[CallStartActionType["RejectMrf"] = 2] = "RejectMrf";
})(CallStartActionType || (CallStartActionType = {}));
var MediaOperationActionType;
(function (MediaOperationActionType) {
    MediaOperationActionType["PerformMediaOperation"] = "performMediaOperation";
})(MediaOperationActionType || (MediaOperationActionType = {}));
var MediaOperationContentType;
(function (MediaOperationContentType) {
    MediaOperationContentType["MSML"] = "application/msml+xml";
})(MediaOperationContentType || (MediaOperationContentType = {}));
;
;
function SendINFOPromptandCollect(session, event, localParams) {
    var content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<msml  version=\"1.1\">\n<dialogstart name=\"dialognamedefault\" target=\"conn:";
    content = content + session["mrf"]["downStreamToTag"];
    content = content + "\" type=\"application/moml+xml\">\n";
    content = content + "<collect fdt=\"10s\" idt=\"16s\">\n";
    content = content + "<play barge=\"true\">\n         <audio uri=\"file:///appl/wav/simpleplay.wav\"/>\n      </play>\n";
    content = content + "<pattern digits=\"x\">\n         <send target=\"source\" event=\"done\"\n               namelist=\"dtmf.digits dtmf.end\"/>\n      </pattern>\n";
    content = content + "<noinput>\n         <send target=\"source\" event=\"done\"\n               namelist=\"dtmf.end\"/>\n      </noinput>\n";
    content = content + "<nomatch>\n         <send target=\"source\" event=\"done\"\n               namelist=\"dtmf.end\"/>\n      </nomatch>\n";
    content = content + "</collect>\n";
    content = content + "</dialogstart>\n</msml>\n";
    var outevent = {
        "callid": session["fsm-id"],
        "event-type": "sip",
        "queue": "TASV4_1",
        "id": 2,
        "action": {
            "legaction": "performMediaOperation",
            "performMediaOperation": {
                "ContentType": "application/msml+xml",
                "Content": content
            },
            "type": 3
        },
        "event-name": "sip.media.playAnnouncement",
        "eventname": "callEarlyAnswered",
        "session": session["fsm-id"]
    };
    return outevent;
}
function inputvalidation(session, event, localParams) {
    var log = session.log;
    try {
        if (session["s_SIPInvite"] != null) {
            if (session["s_SIPInvite"]["event-type"] !== null && (session["s_SIPInvite"]["event-type"] === "sip" || session["s_SIPInvite"]["event-type"] === "occp")) {
                if (session["s_SIPInvite"]["event-name"] !== null && session["s_SIPInvite"]["event-name"] === "sip.callStart.NONE")
                    log.debug("got sip invite");
                else
                    return "error.input.sipinviteincorrecteventname";
            }
            else {
                return "error.input.sipinviteincorrecteventtype";
            }
        }
        else {
            return "error.input.sipinvitemissing";
        }
        return "true";
        if (event["announcement"] != null) {
            log.debug("announcement: {}", event["announcement"]);
            session["mrf"]["announcement"] = event["announcement"];
        }
        else {
            return "error.input.actionmissing";
        }
        if ((event["action"] != null) && ((event["action"] === "promptandcollect") || (event["action"] === "playannouncement"))) {
            log.debug("action: {}", event["action"]);
            if (event["action"] === "promptandcollect")
                session["mrf"]["action"] = "promptandcollect";
            else if (event["action"] === "playannouncement")
                session["mrf"]["action"] = "playannouncement";
            else
                return "error.input.actionincorrect";
        }
        else {
            return "error.input.actionmissing";
        }
        if (event["earlydialog"] != null) {
            log.debug("earlydialog: {}", event["earlydialog"]);
            if (event["earlydialog"] === true) {
                session["mrf"]["earlydialog"] = true;
                return "true";
            }
            else if (event["earlydialog"] === false) {
                session["mrf"]["earlydialog"] = false;
                return "false";
            }
            else {
                return "error.input.earlydialogincorrect";
            }
        }
        else {
            return "error.input.earlydialog";
        }
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}
function armMRFevents(sessionData, eventData, localParams) {
    var ret;
    var status2;
    var events;
    events = events || {};
    events.InfoPollEvent = "null";
    events.SuccessResponsePollEvent = "null";
    events.RawContentPollEvent = "test/test";
    var headerVars;
    headerVars = headerVars || {};
    headerVars.disableSendDefaultReason = "Disabled";
    headerVars.disableSendNoAnswerReason = "Disabled";
    var ringingTones;
    ringingTones = ringingTones || [];
    var comf;
    comf = comf || {};
    comf.anno_name = "comfort";
    comf.anno_type = Annotype.CONNECT;
    var ring;
    ring = ring || {};
    ring.anno_name = "ringing";
    ring.anno_type = Annotype.RINGING;
    ringingTones.push(comf, ring);
    var capabilities = sessionData.inCapabilities;
    if (capabilities != null) {
        capabilities.push(Capabilities.PEM);
        capabilities.push(Capabilities.FORKING);
        capabilities.push(Capabilities.UPDATE);
        capabilities.push(Capabilities.INFO);
        sessionData.outCapabilities = JSON.stringify(capabilities);
    }
    sessionData.events = JSON.stringify(events);
    sessionData.headerrulevar = JSON.stringify(headerVars);
    sessionData.headerrulesselect = "SipServiceSpecificRulesSet";
    sessionData.ringingtones = JSON.stringify(ringingTones);
    sessionData.upstreamCapabilities = JSON.stringify([]);
    return "success";
}
function handle200OKINVITE(session, event, localParams) {
    var log = session.log;
    try {
        var eventData = localParams.message;
        session["mrf"]["headerrulevar=null"];
        session["mrf"]["headerrulesselect"] = null;
        session["mrf"]["ringingtones"] = null;
        var pollAction = void 0;
        pollAction = pollAction || {};
        pollAction.type = CallPollActionType.Accept;
        session.sendAction = JSON.stringify(pollAction);
        session["mrf"]["time200OKINVITE"] = Math.floor(new Date() / 1000);
        var to = eventData.SIP.To;
        if (to != null) {
            log.debug("received from MRF to tag:{}", to);
            session["mrf"]["callstate"] = "MRFCONNECTED200OK";
            session["mrf"]["downStreamToTag"] = to.tag;
            return "success";
        }
        else {
            log.debug("received from MRF no to tag:{}", to);
            return "error.nototag";
        }
    }
    catch (e) {
        log.debug("handle200OKINVITE Log: {}", e);
        return "error.exception";
    }
}
function handle200OKINFO(session, event, localParams) {
    var log = session.log;
    try {
        session["mrf"]["time200OKINFO"] = Math.floor(new Date() / 1000);
        session["mrf"]["callstate"] = "MRFCONNECTED";
        if (event["event-name"] == "sip.mediaOperationNotification.*") {
            if (event.event["type"] == "200") {
                if (event.SIP.content.json.msml.result.description == "OK") {
                    log.debug("handle200OKINFO:Recevied 200OKINFO and its ok");
                    return "received.OK";
                }
                else {
                    log.debug("handle200OKINFO:Recevied 200OKINFO and its NOT ok {}", event.SIP.content.json.msml.result.description);
                    return "received.NOK";
                }
            }
            else if (event.event["type"] == "INFO") {
                session["mrf"]["dtmfdigits"] = "initialized";
                if (event.SIP.content.json.msml.event.name != null && event.SIP.content.json.msml.event.name.size() > 1) {
                    for (var i = 0; i <= event.SIP.content.json.msml.event.name.size() - 1; i++) {
                        log.debug("handle200OKINFO:index and event-name {} - {}", i, event.SIP.content.json.msml.event.name.get(i));
                        if (event.SIP.content.json.msml.event.name.get(i).equals("dtmf.digits")) {
                            log.debug("handle200OKINFO:received dtmf.digits as {}", event.SIP.content.json.msml.event.value[i - 1]);
                            session["mrf"]["dtmfdigits"] = event.SIP.content.json.msml.event.value[i - 1];
                        }
                        else if (event.SIP.content.json.msml.event.name.get(i).equals("dtmf.end")) {
                            log.debug("handle200OKINFO:received dtmf.end");
                        }
                        else if (event.SIP.content.json.msml.event.name.get(i).equals("msml.dialog.exit")) {
                            log.debug("handle200OKINFO:received msml.dialog.exit - return with MRF dialog closed.");
                            return "mrfdialog.closed";
                        }
                        else {
                            log.debug("handle200OKINFO:received other event name");
                        }
                    }
                }
                log.debug("handle200OKINFO:Return the decoded dtmf.digits: {}", session["mrf"]["dtmfdigits"]);
                return session["mrf"]["dtmfdigits"];
            }
            else {
                return "unexpectedeventtype." + event.event["type"];
            }
        }
    }
    catch (e) {
        log.debug("handle200OKINFO:Log: {}", e);
        return "error.exception";
    }
}
function callAnswered(session, event, localParams) {
    var log = session.log;
    try {
        session["mrf"]["callstate"] = "ANSWERED";
        session["mrf"]["answertime"] = Math.floor(new Date() / 1000);
        return "success";
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}
function checkDisconnectReason(session, event, localParams) {
    var log = session.log;
    try {
        session["mrf"]["callstate"] = "ConnectError";
        session["mrf"]["connecterrortime"] = Math.floor(new Date() / 1000);
        var eventsStack = event['events-stack'];
        if (eventsStack != null && eventsStack.size() > 0) {
            for (var i = eventsStack.size() - 1; i >= 0; i--) {
                if (eventsStack.get(i).equals("leg.timeout") && i >= (eventsStack.size() - 2)) {
                    session.loginfo = session.loginfo + "TIMEOUT;";
                    return "error.mrf.connect.timeout";
                }
            }
        }
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.mrf.connect.exception";
    }
    return "error.mrf.connect.others";
}
function setrelease(session, event, localParams) {
    var log = session.log;
    try {
        session["mrf"]["callstate"] = "Released";
        session["mrf"]["releasetime"] = Math.floor(new Date() / 1000);
        return "success";
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.release";
    }
}
function prepareCallRouting(session, eventData, localParams) {
    var ret;
    ret = ret || {};
    ret.resultCode = "success";
    var status2;
    var events;
    events = events || {};
    events.InfoPollEvent = "null";
    events.SuccessResponsePollEvent = "null";
    events.RawContentPollEvent = "test/test";
    var headerVars;
    headerVars = headerVars || {};
    headerVars.disableSendDefaultReason = "Disabled";
    headerVars.disableSendNoAnswerReason = "Disabled";
    var ringingTones;
    ringingTones = ringingTones || [];
    var comf;
    comf = comf || {};
    comf.anno_name = "comfort";
    comf.anno_type = Annotype.CONNECT;
    var ring;
    ring = ring || {};
    ring.anno_name = "ringing";
    ring.anno_type = Annotype.RINGING;
    ringingTones.push(comf, ring);
    var capabilities = sessionData.inCapabilities;
    if (capabilities != null) {
        capabilities.push(Capabilities.PEM);
        capabilities.push(Capabilities.FORKING);
        sessionData.outCapabilities = JSON.stringify(capabilities);
    }
    session.events = JSON.stringify(events);
    session.headerrulevar = JSON.stringify(headerVars);
    session.headerrulesselect = "SipServiceSpecificRulesSet";
    session.ringingtones = JSON.stringify(ringingTones);
    session.upstreamCapabilities = JSON.stringify([]);
    status2 = "success";
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFXQSxJQUFLLFlBTUo7QUFORCxXQUFLLFlBQVk7SUFDZixpQ0FBaUIsQ0FBQTtJQUNqQixtQ0FBa0IsQ0FBQTtJQUNsQiw2Q0FBMkIsQ0FBQTtJQUMzQiwyQkFBUyxDQUFBO0lBQ1QsaUNBQWUsQ0FBQTtBQUNqQixDQUFDLEVBTkksWUFBWSxLQUFaLFlBQVksUUFNaEI7QUFzREQsSUFBSyxRQUdKO0FBSEQsV0FBSyxRQUFRO0lBQ1gsK0JBQW1CLENBQUE7SUFDbkIsNEJBQWdCLENBQUE7QUFDbEIsQ0FBQyxFQUhJLFFBQVEsS0FBUixRQUFRLFFBR1o7QUF1QkQsSUFBSyxrQkFJSjtBQUpELFdBQUssa0JBQWtCO0lBQ3RCLHVDQUFpQixDQUFBO0lBQ2pCLHlDQUFtQixDQUFBO0lBQ25CLHVDQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBSXRCO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3ZCLCtEQUFTLENBQUE7SUFDVCxtRUFBVyxDQUFBO0lBQ1gsdUVBQWEsQ0FBQTtBQUNkLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCO0FBZ0NELElBQUssd0JBRUo7QUFGRCxXQUFLLHdCQUF3QjtJQUM1QiwyRUFBK0MsQ0FBQTtBQUNoRCxDQUFDLEVBRkksd0JBQXdCLEtBQXhCLHdCQUF3QixRQUU1QjtBQUVELElBQUsseUJBRUo7QUFGRCxXQUFLLHlCQUF5QjtJQUM3QiwwREFBNkIsQ0FBQTtBQUM5QixDQUFDLEVBRkkseUJBQXlCLEtBQXpCLHlCQUF5QixRQUU3QjtBQW1GRCxDQUFDO0FBQ0QsQ0FBQztBQW1HRCxTQUFTLHdCQUF3QixDQUFDLE9BQWEsRUFBRSxLQUFXLEVBQUUsV0FBZ0I7SUEwQjFFLElBQUksT0FBTyxHQUFHLDZIQUE2SCxDQUFDO0lBQzVJ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dkIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBQyxTQUFTLENBQUM7SUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLElBQUksWUFBWSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUM7SUFDOUMsSUFBSSxZQUFZLElBQUUsSUFBSSxFQUFDO1FBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLFdBQVcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM5RDtJQUNELE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxPQUFPLENBQUMsYUFBYSxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxDQUFDLGlCQUFpQixHQUFHLDRCQUE0QixDQUFDO0lBQ3pELE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxPQUFPLENBQUMsb0JBQW9CLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRCxPQUFPLEdBQUcsU0FBUyxDQUFDO0lBQ3BCLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLy9pbnRlcmZhY2UgZGVmaW5pdGlvblxyXG5cclxuaW50ZXJmYWNlIExlZyB7XHJcbiAgYWRkcmVzcyA6IHN0cmluZztcclxuICBuYW1lIDogc3RyaW5nXHJcbn1cclxuaW50ZXJmYWNlIENhbGwge1xyXG4gIHN0YXRlIDogbnVtYmVyXHJcbn1cclxuXHJcbmVudW0gQ2FwYWJpbGl0aWVzIHtcclxuICBSRUwxWFggPSBcIlJFTDFYWFwiLFxyXG4gIEZPUktJTkc9IFwiRk9SS0lOR1wiLFxyXG4gIFBSRUNPTkRJVElPTj1cIlBSRUNPTkRJVElPTlwiLFxyXG4gIFBFTT1cIlBFTVwiLFxyXG4gIFVQREFURT1cIlVQREFURVwiXHJcbn1cclxuXHJcbmludGVyZmFjZSBNZXNzYWdlIHtcclxuICBtZXRob2QgOiBbc3RyaW5nXTtcclxuICB0eXBlIDogW3N0cmluZ107XHJcbiAgYm9keSA6IFtzdHJpbmddXHJcbn1cclxuXHJcbmludGVyZmFjZSBTSVAge1xyXG4gIGNhcGFiaWxpdGllcyA6IFtDYXBhYmlsaXRpZXNdO1xyXG4gIG1lc3NhZ2UgOiBNZXNzYWdlXHJcbn1cclxuXHJcbmludGVyZmFjZSBDYWxsU3RhcnQge1xyXG4gIGNvbnRhY3QgOiBzdHJpbmc7XHJcbiAgY2F1c2U6IHN0cmluZztcclxuICBsZWcgOiBzdHJpbmdcclxufVxyXG5cclxuaW50ZXJmYWNlIENhbGxQb2xsIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIGxlZzogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBFdmVudCB7XHJcbiAgbmFtZSA6IHN0cmluZztcclxuICBjYWxsU3RhcnQ/IDogQ2FsbFN0YXJ0O1xyXG4gIGNhbGxQb2xsPyA6IENhbGxQb2xsXHJcbn1cclxuXHJcblxyXG5pbnRlcmZhY2UgT0NDUEV2ZW50IHtcclxuICBjYWxsaWQgOiBzdHJpbmc7XHJcbiAgY2FsbCA6IENhbGw7XHJcbiAgYXMgOiBzdHJpbmc7XHJcbiAgZXZlbnR0aW1lIDogbnVtYmVyO1xyXG4gIFNJUCA6IFNJUDtcclxuICBldmVudDogRXZlbnRcclxufVxyXG5cclxuaW50ZXJmYWNlIEV2ZW50cyB7XHJcbiAgU3VjY2Vzc1Jlc3BvbnNlUG9sbEV2ZW50PyA6IHN0cmluZztcclxuICBSYXdDb250ZW50UG9sbEV2ZW50PyA6IHN0cmluZztcclxuICBJbmZvUG9sbEV2ZW50Pzogc3RyaW5nXHJcbn1cclxuLyoqXHJcbiAgRGVmaW5lIGhlYWRlciB2YXJpYWJsZXMgdXNlZCBieSBhcHBsaWNhdGlvblxyXG4qL1xyXG5pbnRlcmZhY2UgSGVhZGVyVmFycyB7XHJcbiAgZGlzYWJsZVNlbmREZWZhdWx0UmVhc29uPyA6IHN0cmluZztcclxuICBkaXNhYmxlU2VuZE5vQW5zd2VyUmVhc29uPyA6IHN0cmluZ1xyXG59XHJcblxyXG5lbnVtIEFubm90eXBlIHtcclxuICBDT05ORUNUID0gXCJDT05ORUNUXCIsXHJcbiAgUklOR0lORyA9IFwiUklOR1wiXHJcbn1cclxuXHJcbmludGVyZmFjZSBSaW5naW5nVG9uZSB7XHJcbiAgYW5ub19uYW1lIDogc3RyaW5nO1xyXG4gIGFubm9fdHlwZSA6IEFubm90eXBlXHJcbn1cclxuXHJcbmludGVyZmFjZSBTZXNzaW9uIHtcclxuICBsb2cgOiBhbnk7XHJcbiAgaW5DYXBhYmlsaXRpZXMgOiBbQ2FwYWJpbGl0aWVzXTtcclxuICBvdXRDYXBhYmlsaXRpZXM/IDogc3RyaW5nO1xyXG4gIGV2ZW50cz8gOiBzdHJpbmc7XHJcbiAgaGVhZGVycnVsZXZhcj8gOiBzdHJpbmc7XHJcbiAgaGVhZGVycnVsZXNzZWxlY3Q/IDogc3RyaW5nO1xyXG4gIHJpbmdpbmd0b25lcz8gOiBzdHJpbmc7XHJcbiAgc2VuZEFjdGlvbj8gOiBzdHJpbmcgO1xyXG4gIFNJUEhlbHBlciA6IGFueTtcclxuICBTSVBJbml0aWFsSW52aXRlPyA6IGFueTtcclxuICBTSVBNZXNzYWdlPyA6IGFueTtcclxuICBTSVBNZXNzYWdlVHlwZT8gOiBhbnlcclxufVxyXG5cclxuXHJcbmVudW0gQ2FsbFBvbGxBY3Rpb25UeXBlIHtcclxuIEFjY2VwdCA9IFwiYWNjZXB0XCIsXHJcbiBGb3J3YXJkID0gXCJmb3J3YXJkXCIsXHJcbiBSZWplY3QgPSBcInJlamVjdFwiLFxyXG59XHJcblxyXG5lbnVtIENhbGxTdGFydEFjdGlvblR5cGUge1xyXG4gQWJvcnQgPSAwLFxyXG4gRm9yd2FyZCA9IDEsXHJcbiBSZWplY3RNcmYgPSAyXHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiBTZXQgYWN0aW9uIGZvciBDYWxsU3RhcnQgZXZlbnRcclxuKi9cclxuaW50ZXJmYWNlIENhbGxTdGFydEFjdGlvbiB7XHJcbiB0eXBlIDogQ2FsbFN0YXJ0QWN0aW9uVHlwZTtcclxuIGVycm9yY29kZSA6IG51bWJlcjtcclxuIGNhdXNlIDogc3RyaW5nIDtcclxuIHVyaSA6IHN0cmluZztcclxuIGVhcmx5bWVkaWEgOiBudW1iZXI7XHJcbiBsZWduYW1lIDogc3RyaW5nIFxyXG59XHJcblxyXG4vKipcclxuIFNldCBhY3Rpb24gZm9yIENhbGxQb2xsIGV2ZW50XHJcbiovXHJcbmludGVyZmFjZSBDYWxsUG9sbEFjdGlvbiB7XHJcbiB0eXBlIDogQ2FsbFBvbGxBY3Rpb25UeXBlXHJcbn1cclxuXHJcblxyXG4vKipcclxuIEFwcGxpY2F0aW9uIGNhbiBzZXQgYWN0aW9uIGZvciBhIHNwZWNpZmljIGxlZywgdGhpcyBpcyBhcHBsaWNhYmxlIGZvciBNUkYgY29udGFjdFxyXG4gKi9cclxuaW50ZXJmYWNlIExlZ0FjdGlvbiB7XHJcbiB0eXBlIDogQ2FsbFN0YXJ0QWN0aW9uVHlwZSA7XHJcbiBsZWdhY3Rpb24gOiBzdHJpbmdcclxufVxyXG5cclxuZW51bSBNZWRpYU9wZXJhdGlvbkFjdGlvblR5cGUge1xyXG4gUGVyZm9ybU1lZGlhT3BlcmF0aW9uID0gXCJwZXJmb3JtTWVkaWFPcGVyYXRpb25cIlxyXG59XHJcblxyXG5lbnVtIE1lZGlhT3BlcmF0aW9uQ29udGVudFR5cGUge1xyXG4gTVNNTCA9IFwiYXBwbGljYXRpb24vbXNtbCt4bWxcIlxyXG59XHJcblxyXG5pbnRlcmZhY2UgUGVyZm9ybU1lZGlhT3BlcmF0aW9uIHtcclxuIENvbnRlbnRUeXBlIDogTWVkaWFPcGVyYXRpb25Db250ZW50VHlwZTtcclxuIENvbnRlbnQgOiBzdHJpbmdcclxufVxyXG5cclxuaW50ZXJmYWNlIE1lZGlhT3BlcmF0aW9uQWN0aW9uIHtcclxuIHR5cGUgOiBudW1iZXI7XHJcbiBsZWdhY3Rpb24gOiBNZWRpYU9wZXJhdGlvbkFjdGlvblR5cGU7XHJcbiBwZXJmb3JtTWVkaWFPcGVyYXRpb24gOiBQZXJmb3JtTWVkaWFPcGVyYXRpb25cclxufVxyXG5cclxuaW50ZXJmYWNlIEFjdGlvbiB7XHJcbiBhY3Rpb24gOiBhbnkgXHJcbn1cclxuXHJcblxyXG5pbnRlcmZhY2UgSGVhZGVyIHtcclxuIGhlYWRlciA6IHN0cmluZztcclxuIHZhbHVlIDogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUUhlYWRlciB7XHJcbiBQcml2YWN5IDogc3RyaW5nO1xyXG4gUmVhc29uIDogc3RyaW5nIDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBhcmFtZXRlciB7XHJcbiB0cmFuc3BvcnQgOiBzdHJpbmc7XHJcbiB1c2VyIDogc3RyaW5nIDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVSSSB7XHJcbiBzY2hlbWUgOiBzdHJpbmc7XHJcbiBhdXRob3JpdHkgOiBzdHJpbmcgO1xyXG4gZ3IgOiBzdHJpbmcgO1xyXG4gaG9zdDogc3RyaW5nIDtcclxuIGxyIDogc3RyaW5nIDtcclxuIG1hZGRyIDogc3RyaW5nIDtcclxuIHBvcnQgOiBudW1iZXIgIDtcclxuIHVzZXIgOiBzdHJpbmcgO1xyXG4gcGFyYW1ldGVycyA6IFtQYXJhbWV0ZXJdO1xyXG4gcWhlYWRlciA6IFtRSGVhZGVyXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEFkZHJlc3Mge1xyXG4gZGlzcGxheU5hbWUgOiBzdHJpbmc7XHJcbiB1cmkgOiBVUkkgXHJcbn1cclxuXHJcbmludGVyZmFjZSBIaXN0b3J5SW5mbyBpbXBsZW1lbnRzIEhlYWRlciB7XHJcbiBhZGRyZXNzIDogQWRkcmVzcztcclxuIGluZGV4IDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBQQUkgaW1wbGVtZW50cyBIZWFkZXIgIHtcclxuIGFkZHJlc3MgOiBBZGRyZXNzXHJcbn1cclxuXHJcbmludGVyZmFjZSBGcm9tIGltcGxlbWVudHMgSGVhZGVyIHtcclxuIGFkZHJlc3MgOiBBZGRyZXNzO1xyXG4gdGFnIDogc3RyaW5nIDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRvIGltcGxlbWVudHMgSGVhZGVyIHtcclxuIGFkZHJlc3MgOiBBZGRyZXNzO1xyXG4gdGFnIDogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUENWIGltcGxlbWVudHMgSGVhZGVyIHtcclxuIGljaWRfZ2VuZXJhdGVkX2F0OiBzdHJpbmcgO1xyXG4gaWNpZF92YWx1ZSA6IHN0cmluZyA7XHJcbiBvYWlkIDogc3RyaW5nO1xyXG4gdGFpZCA6IHN0cmluZztcclxuIG9zaWQgOiBzdHJpbmc7XHJcbiB0c2lkIDogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzdWx0Q29kZSB7XHJcbiAgcmVzdWx0Q29kZSA6IHN0cmluZyA7XHJcbn1cclxuXG47Ly9NQUlOQkxPQ0tcbjtcbi8qXG4vL2NvbmZpZyBpcyBcIm1yZl9hbm5vdW5jZW1lbnRzXCJcbntcbiAgXCJhbm5vVGVzdFwiOiB7XG4gICAgXCJtYXh0aW1lXCI6IDE1MDAsXG4gICAgXCJwYXRoXCI6IFwiZmlsZTovLy90bXAvYW5ub3MvXCIsXG4gICAgXCJ2YXJpYWJsZVwiOiBcIlwiLFxuICAgIFwiYmFyZ2VcIjogMSxcbiAgICBcInByb21wdFwiOiBcInRlc3RBbm5vLndhdlwiLFxuICAgIFwiZHRtZlwiOiB7XG4gICAgICBcImNsZWFyZGJcIjogMSxcbiAgICAgIFwiaWR0XCI6IDEsXG4gICAgICBcImZkdFwiOiAxLFxuICAgICAgXCJtaW5cIjogMSxcbiAgICAgIFwibWF4XCI6IDEsXG4gICAgICBcInJ0ZlwiOiBcIipcIixcbiAgICAgIFwiY2FuY2VsXCI6IFwiI1wiXG4gICAgfSxcbiAgICBcImFubmlkXCI6IFwiYW5ub1Byb21wdENvbGxlY3RcIixcbiAgICBcImludGVydmFsXCI6IDEwMCxcbiAgICBcIml0ZXJhdGVcIjogMSxcbiAgICBcImNsZWFyZGJcIjogMVxuICB9LFxufVxuXG4vLyBYTUwgaW4gbmV4dXMtc2lwLjMuMC4xLTEuamFyXG48P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiPz4gXG48bXNtbCB2ZXJzaW9uPVwiMS4xXCI+IFxuXHQ8ZGlhbG9nc3RhcnQgbmFtZT1cImFubm9Qcm9tcHRDb2xsZWN0XCIgdGFyZ2V0PVwiY29ubjpjYTQ1ODU1MVwiIHR5cGU9XCJhcHBsaWNhdGlvbi9tb21sK3htbFwiPiBcblx0XHQ8cGxheSBpbnRlcnZhbD1cIjEwMG1zXCIgaXRlcmF0ZT1cIjFcIiBjbGVhcmRiPVwidHJ1ZVwiIG1heHRpbWU9XCI1MDAwMG1zXCIgYmFyZ2U9XCJ0cnVlXCI+IFxuXHRcdFx0PGF1ZGlvIHVyaT1cImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcIi8+IFxuXHRcdFx0PHBsYXlleGl0PiBcblx0XHRcdFx0PGV4aXQgbmFtZWxpc3Q9XCJwbGF5LmVuZCBwbGF5LmFtdFwiLz4gXG5cdFx0XHQ8L3BsYXlleGl0PiBcblx0XHQ8L3BsYXk+IFxuXHQ8L2RpYWxvZ3N0YXJ0PiBcbjwvbXNtbD5cblx0ICBcbi8vIFhNTCBpbiBuZXh1cy1zaXAuMy4wLj8/PyBmdXR1cmUgLSBzdXBwb3J0IHByb21wdCBhbmQgY29sbGVjdFxuLy8gcGF0dGVybiBkaWdpdHMgeCBpcyB3aWxkY2FyZCwgeHggYXJlIHR3byB3aWxkY2FyZCBkaWdpdHMsIDEgaXMgdGhlIGRpZ2l0IG9uZSBleGFjdGx5LCBcbi8vIDxwYXR0ZXJuIGRpZ2l0cz1cIjFcIiBpdGVyYXRlPVwiZm9yZXZlclwiPiAgXG51c2luZyBjb2xsZWN0XG48P3htbCB2ZXJzaW9uPVwiMS4wXCI/PlxuPG1zbWwgdmVyc2lvbj1cIjEuMVwiPlxuXHQ8ZGlhbG9nc3RhcnQgdGFyZ2V0PVwiY29ubjoke1RBUkdFVH1cIiB0eXBlPVwiYXBwbGljYXRpb24vbW9tbCt4bWxcIiBuYW1lPVwiZGlhbG9nbmFtZWRlZmF1bHRcIj5cblx0XHQ8Z3JvdXAgdG9wb2xvZ3k9XCJwYXJhbGxlbFwiPlxuXHRcdFx0PHBsYXkgaWQ9XCJiZWZvcmViYXJnZXBsYXlcIj5cblx0XHRcdFx0PGF1ZGlvIHVyaT1cImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcIiBmb3JtYXQ9XCJhdWRpby93YXZcIiAgLz5cblx0XHRcdFx0PHBsYXlleGl0PlxuXHRcdFx0XHRcdDxzZW5kIHRhcmdldD1cImNvbGxlY3RcIiBldmVudD1cInN0YXJ0dGltZXJcIi8+XG5cdFx0XHRcdDwvcGxheWV4aXQ+XG5cdFx0XHQ8L3BsYXk+XG5cdFx0XHQ8Y29sbGVjdCBjbGVhcmRiPVwidHJ1ZVwiIGZkdD1cIjVzXCIgaWR0PVwiM3NcIj5cblx0XHRcdFx0PHBhdHRlcm4gZGlnaXRzPVwieFwiPlxuXHRcdFx0XHRcdDxzZW5kIHRhcmdldD1cInNvdXJjZVwiIGV2ZW50PVwiZGlhbG9nbmFtZWRlZmF1bHRcIiBuYW1lbGlzdD1cImR0bWYuZGlnaXRzIGR0bWYuZW5kXCIvPlxuXHRcdFx0XHQ8L3BhdHRlcm4+XG5cdFx0XHRcdDxkZXRlY3Q+XG5cdFx0XHRcdFx0PHNlbmQgdGFyZ2V0PVwicGxheS5iZWZvcmViYXJnZXBsYXlcIiBldmVudD1cInRlcm1pbmF0ZVwiLz5cblx0XHRcdFx0PC9kZXRlY3Q+XG5cdFx0XHRcdDxub2lucHV0PlxuXHRcdFx0XHRcdDxzZW5kIHRhcmdldD1cInNvdXJjZVwiIGV2ZW50PVwiZGlhbG9nbmFtZWRlZmF1bHRcIiBuYW1lbGlzdD1cImR0bWYuZGlnaXRzIGR0bWYuZW5kXCIvPlxuXHRcdFx0XHQ8L25vaW5wdXQ+XG5cdFx0XHRcdDxub21hdGNoPlxuXHRcdFx0XHRcdDxzZW5kIHRhcmdldD1cInNvdXJjZVwiIGV2ZW50PVwiZGlhbG9nbmFtZWRlZmF1bHRcIiBuYW1lbGlzdD1cImR0bWYuZGlnaXRzIGR0bWYuZW5kXCIvPlxuXHRcdFx0XHQ8L25vbWF0Y2g+XG5cdFx0XHQ8L2NvbGxlY3Q+XG5cdFx0PC9ncm91cD5cblx0PC9kaWFsb2dzdGFydD5cbjwvbXNtbD5cblxuICAgICAgPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIj8+XG4gICAgICA8bXNtbCB2ZXJzaW9uPVwiMS4xXCI+XG4gICAgICAgPGRpYWxvZ3N0YXJ0IHRhcmdldD1cImNvbm46MTIzNDVcIiBuYW1lPVwiMTIzNDVcIj5cblxuICAgICAgICAgPGNvbGxlY3QgZmR0PVwiMTBzXCIgaWR0PVwiMTZzXCI+XG4gICAgICAgICAgICA8cGxheSBiYXJnZT1cInRydWVcIj5cbiAgICAgICAgICAgICAgIDxhdWRpbyB1cmk9XCJmaWxlOi8vcHJvbXB0LndhdlwiLz5cbiAgICAgICAgICAgIDwvcGxheT5cbiAgICAgICAgICAgIDxwYXR0ZXJuIGRpZ2l0cz1cInh4eHgjXCI+XG4gICAgICAgICAgICAgICA8c2VuZCB0YXJnZXQ9XCJzb3VyY2VcIiBldmVudD1cImRvbmVcIlxuICAgICAgICAgICAgICAgICAgICAgbmFtZWxpc3Q9XCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFwiLz5cbiAgICAgICAgICAgIDwvcGF0dGVybj5cbiAgICAgICAgICAgIDxub2lucHV0PlxuICAgICAgICAgICAgICAgPHNlbmQgdGFyZ2V0PVwic291cmNlXCIgZXZlbnQ9XCJkb25lXCJcbiAgICAgICAgICAgICAgICAgICAgIG5hbWVsaXN0PVwiZHRtZi5lbmRcIi8+XG4gICAgICAgICAgICA8L25vaW5wdXQ+XG4gICAgICAgICAgICA8bm9tYXRjaD5cbiAgICAgICAgICAgICAgIDxzZW5kIHRhcmdldD1cInNvdXJjZVwiIGV2ZW50PVwiZG9uZVwiXG4gICAgICAgICAgICAgICAgICAgICBuYW1lbGlzdD1cImR0bWYuZW5kXCIvPlxuICAgICAgICAgICAgPC9ub21hdGNoPlxuICAgICAgICAgPC9jb2xsZWN0PlxuICAgICAgIDwvZGlhbG9nc3RhcnQ+XG4gICAgICA8L21zbWw+XG5cblxuXG4qL1xuXG5mdW5jdGlvbiBTZW5kSU5GT1Byb21wdGFuZENvbGxlY3Qoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcbiAgICAvL3NldCB0aGUgeG1sIGNvbm4gaWQgLS0+IHNlc3Npb25bXCJtcmZcIl1bXCJkb3duU3RyZWFtVG9UYWdcIl1cblxuLypcbiAgICBsZXQgb3V0ZXZlbnQgPSB7XG4gICAgXCJjYWxsaWRcIjogc2Vzc2lvbltcImZzbS1pZFwiXSxcbiAgICBcImV2ZW50LXR5cGVcIjogXCJzaXBcIixcbiAgICBcInF1ZXVlXCI6IFwiVEFTVjRfMVwiLFxuICAgIFwiaWRcIjogMixcbiAgICBcInRpbWVzdGFtcFwiOiAxNzM5Nzg0ODM0NTYzLFxuICAgIFwiYWN0aW9uXCI6IHtcbiAgICAgIFwibGVnYWN0aW9uXCI6IFwicGVyZm9ybU1lZGlhT3BlcmF0aW9uXCIsXG4gICAgICBcInBlcmZvcm1NZWRpYU9wZXJhdGlvblwiOiB7XG4gICAgICAgIFwiQ29udGVudFR5cGVcIjogXCJhcHBsaWNhdGlvbi9tc21sK3htbFwiLFxuICAgICAgICBcIkNvbnRlbnRcIjogXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/Plxcbjxtc21sICB2ZXJzaW9uPVxcXCIxLjFcXFwiPlxcbjxkaWFsb2dzdGFydCBuYW1lPVxcXCJhbm5vUHJvbXB0Q29sbGVjdFxcXCIgdGFyZ2V0PVxcXCJjb25uOjViMDA3YzQwXFxcIiB0eXBlPVxcXCJhcHBsaWNhdGlvbi9tb21sK3htbFxcXCI+XFxuPHBsYXkgaW50ZXJ2YWw9XFxcIjEwMG1zXFxcIiBpdGVyYXRlPVxcXCIxXFxcIiBjbGVhcmRiPVxcXCJ0cnVlXFxcIiBtYXh0aW1lPVxcXCI1MDAwMG1zXFxcIiBiYXJnZT1cXFwidHJ1ZVxcXCI+XFxuIDxhdWRpbyB1cmk9XFxcImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcXFwiLz5cXG4gPHBsYXlleGl0PlxcbiAgIDxleGl0IG5hbWVsaXN0PVxcXCJwbGF5LmVuZCBwbGF5LmFtdFxcXCIvPlxcbiA8L3BsYXlleGl0PlxcbjwvcGxheT5cXG48L2RpYWxvZ3N0YXJ0PlxcbjwvbXNtbD5cIlxuICAgICAgfSxcbiAgICAgIFwidHlwZVwiOiAzXG4gICAgfSxcbiAgICBcImV2ZW50LW5hbWVcIjogXCJzaXAubWVkaWEucGxheUFubm91bmNlbWVudFwiLFxuICAgIFwiZXZlbnRuYW1lXCI6IFwiY2FsbEVhcmx5QW5zd2VyZWRcIixcbiAgICBcInNlc3Npb25cIjogc2Vzc2lvbltcImZzbS1pZFwiXSxcbiAgICBcImV2ZW50dGltZVwiOiAxNzM5Nzg0ODM0NTc5XG4gIH07XG5cbiAgXCJDb250ZW50XCI6IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48bXNtbCAgdmVyc2lvbj1cXFwiMS4xXFxcIj5cXG48ZGlhbG9nc3RhcnQgbmFtZT1cXFwiYW5ub1Byb21wdENvbGxlY3RcXFwiIHRhcmdldD1cXFwiY29ubjpcXFwic2Vzc2lvbltcIm1yZlwiXVtcImRvd25TdHJlYW1Ub1RhZ1wiXSB0eXBlPVxcXCJhcHBsaWNhdGlvbi9tb21sK3htbFxcXCI+XFxuPHBsYXkgaW50ZXJ2YWw9XFxcIjEwMG1zXFxcIiBpdGVyYXRlPVxcXCIxXFxcIiBjbGVhcmRiPVxcXCJ0cnVlXFxcIiBtYXh0aW1lPVxcXCI1MDAwMG1zXFxcIiBiYXJnZT1cXFwidHJ1ZVxcXCI+XFxuIDxhdWRpbyB1cmk9XFxcImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcXFwiLz5cXG4gPHBsYXlleGl0PlxcbiAgIDxleGl0IG5hbWVsaXN0PVxcXCJwbGF5LmVuZCBwbGF5LmFtdFxcXCIvPlxcbiA8L3BsYXlleGl0PlxcbjwvcGxheT5cXG48L2RpYWxvZ3N0YXJ0PlxcbjwvbXNtbD5cIlxuKi9cbiAgICBsZXQgY29udGVudCA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48bXNtbCAgdmVyc2lvbj1cXFwiMS4xXFxcIj5cXG48ZGlhbG9nc3RhcnQgbmFtZT1cXFwiZGlhbG9nbmFtZWRlZmF1bHRcXFwiIHRhcmdldD1cXFwiY29ubjpcIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIHNlc3Npb25bXCJtcmZcIl1bXCJkb3duU3RyZWFtVG9UYWdcIl07XG4gICAgY29udGVudCA9IGNvbnRlbnQgKyBcIlxcXCIgdHlwZT1cXFwiYXBwbGljYXRpb24vbW9tbCt4bWxcXFwiPlxcblwiO1xuICAgICAgICAvL2NvbnRlbnQgPSBjb250ZW50ICsgXCI8cGxheSBpbnRlcnZhbD1cXFwiMTAwbXNcXFwiIGl0ZXJhdGU9XFxcIjFcXFwiIGNsZWFyZGI9XFxcInRydWVcXFwiIG1heHRpbWU9XFxcIjUwMDAwbXNcXFwiIGJhcmdlPVxcXCJ0cnVlXFxcIj5cXG4gPGF1ZGlvIHVyaT1cXFwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlxcXCIvPlxcbiA8cGxheWV4aXQ+XFxuICAgPGV4aXQgbmFtZWxpc3Q9XFxcInBsYXkuZW5kIHBsYXkuYW10XFxcIi8+XFxuIDwvcGxheWV4aXQ+XFxuPC9wbGF5PlxcbjwvZGlhbG9nc3RhcnQ+XFxuPC9tc21sPlwiO1xuICAgICAgICAvL09DTVAgcmVzcG9uc2UgLSBncm91cHMgbm90IHN1cHBvcnRlZCAgICAgPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwieWVzXCI/Pjxtc21sIHZlcnNpb249XCIxLjFcIj4gICAgPHJlc3VsdCByZXNwb25zZT1cIjQwMlwiPiAgICAgICAgPGRlc2NyaXB0aW9uPkdyb3VwcyBub3Qgc3VwcG9ydGVkPC9kZXNjcmlwdGlvbj4gICAgPC9yZXN1bHQ+PC9tc21sPlxuICAgICAgICAvL2NvbnRlbnQgPSBjb250ZW50ICsgXCI8Z3JvdXAgdG9wb2xvZ3k9XFxcInBhcmFsbGVsXFxcIj5cXG5cIjtcbiAgICAgICAgLy9jb250ZW50ID0gY29udGVudCArIFwiPHBsYXkgaWQ9XFxcImJlZm9yZWJhcmdlcGxheVxcXCI+PGF1ZGlvIHVyaT1cXFwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlxcXCIgZm9ybWF0PVxcXCJhdWRpby93YXZcXFwiICAvPjxwbGF5ZXhpdD48c2VuZCB0YXJnZXQ9XFxcImNvbGxlY3RcXFwiIGV2ZW50PVxcXCJzdGFydHRpbWVyXFxcIi8+PC9wbGF5ZXhpdD48L3BsYXk+XFxuXCI7XG4gICAgICAgIC8vY29udGVudCA9IGNvbnRlbnQgKyBcIjxjb2xsZWN0IGNsZWFyZGI9XFxcInRydWVcXFwiIGZkdD1cXFwiNXNcXFwiIGlkdD1cXFwiM3NcXFwiPjxwYXR0ZXJuIGRpZ2l0cz1cXFwieFxcXCI+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgbmFtZWxpc3Q9XFxcImR0bWYuZGlnaXRzIGR0bWYuZW5kXFxcIi8+PC9wYXR0ZXJuPlxcblwiO1xuICAgICAgICAvL09DTVAgcmVzcG9uc2UgLSBvbmx5IHNvdXJjZSBzdXBwb3J0ZWQgICAgIDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cInllc1wiPz48bXNtbCB2ZXJzaW9uPVwiMS4xXCI+ICAgIDxyZXN1bHQgcmVzcG9uc2U9XCI0MTBcIj4gICAgICAgIDxkZXNjcmlwdGlvbj5Pbmx5ICdzb3VyY2UnIHN1cHBvcnRlZDwvZGVzY3JpcHRpb24+ICAgIDwvcmVzdWx0PjwvbXNtbD5cbiAgICAgICAgLy9jb250ZW50ID0gY29udGVudCArIFwiPGRldGVjdD48c2VuZCB0YXJnZXQ9XFxcInBsYXkuYmVmb3JlYmFyZ2VwbGF5XFxcIiBldmVudD1cXFwidGVybWluYXRlXFxcIi8+PC9kZXRlY3Q+XFxuPG5vaW5wdXQ+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgbmFtZWxpc3Q9XFxcImR0bWYuZGlnaXRzIGR0bWYuZW5kXFxcIi8+PC9ub2lucHV0Plxcbjxub21hdGNoPjxzZW5kIHRhcmdldD1cXFwic291cmNlXFxcIiBldmVudD1cXFwiZGlhbG9nbmFtZWRlZmF1bHRcXFwiIG5hbWVsaXN0PVxcXCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFxcXCIvPjwvbm9tYXRjaD5cXG48L2NvbGxlY3Q+XFxuXCI7XG4gICAgICAgIC8vY29udGVudCA9IGNvbnRlbnQgKyBcIjxkZXRlY3Q+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJ0ZXJtaW5hdGVcXFwiLz48L2RldGVjdD5cXG48bm9pbnB1dD48c2VuZCB0YXJnZXQ9XFxcInNvdXJjZVxcXCIgZXZlbnQ9XFxcImRpYWxvZ25hbWVkZWZhdWx0XFxcIiBuYW1lbGlzdD1cXFwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcXFwiLz48L25vaW5wdXQ+XFxuPG5vbWF0Y2g+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgbmFtZWxpc3Q9XFxcImR0bWYuZGlnaXRzIGR0bWYuZW5kXFxcIi8+PC9ub21hdGNoPlxcbjwvY29sbGVjdD5cXG5cIjtcbiAgICAgICAgLy9jb250ZW50ID0gY29udGVudCArIFwiPC9ncm91cD5cXG5cIjtcbiAgICBcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPGNvbGxlY3QgZmR0PVxcXCIxMHNcXFwiIGlkdD1cXFwiMTZzXFxcIj5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPHBsYXkgYmFyZ2U9XFxcInRydWVcXFwiPlxcbiAgICAgICAgIDxhdWRpbyB1cmk9XFxcImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcXFwiLz5cXG4gICAgICA8L3BsYXk+XFxuXCI7XG4gICAgY29udGVudCA9IGNvbnRlbnQgKyBcIjxwYXR0ZXJuIGRpZ2l0cz1cXFwieFxcXCI+XFxuICAgICAgICAgPHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkb25lXFxcIlxcbiAgICAgICAgICAgICAgIG5hbWVsaXN0PVxcXCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFxcXCIvPlxcbiAgICAgIDwvcGF0dGVybj5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPG5vaW5wdXQ+XFxuICAgICAgICAgPHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkb25lXFxcIlxcbiAgICAgICAgICAgICAgIG5hbWVsaXN0PVxcXCJkdG1mLmVuZFxcXCIvPlxcbiAgICAgIDwvbm9pbnB1dD5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPG5vbWF0Y2g+XFxuICAgICAgICAgPHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkb25lXFxcIlxcbiAgICAgICAgICAgICAgIG5hbWVsaXN0PVxcXCJkdG1mLmVuZFxcXCIvPlxcbiAgICAgIDwvbm9tYXRjaD5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPC9jb2xsZWN0PlxcblwiO1xuICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCI8L2RpYWxvZ3N0YXJ0PlxcbjwvbXNtbD5cXG5cIjtcblxuICAgIGxldCBvdXRldmVudCA9IHtcbiAgICBcImNhbGxpZFwiOiBzZXNzaW9uW1wiZnNtLWlkXCJdLFxuICAgIFwiZXZlbnQtdHlwZVwiOiBcInNpcFwiLFxuICAgIFwicXVldWVcIjogXCJUQVNWNF8xXCIsXG4gICAgXCJpZFwiOiAyLFxuICAgIFwiYWN0aW9uXCI6IHtcbiAgICAgIFwibGVnYWN0aW9uXCI6IFwicGVyZm9ybU1lZGlhT3BlcmF0aW9uXCIsXG4gICAgICBcInBlcmZvcm1NZWRpYU9wZXJhdGlvblwiOiB7XG4gICAgICAgIFwiQ29udGVudFR5cGVcIjogXCJhcHBsaWNhdGlvbi9tc21sK3htbFwiLFxuICAgICAgICBcIkNvbnRlbnRcIjogY29udGVudFxuICAgICAgfSxcbiAgICAgIFwidHlwZVwiOiAzXG4gICAgfSxcbiAgICBcImV2ZW50LW5hbWVcIjogXCJzaXAubWVkaWEucGxheUFubm91bmNlbWVudFwiLFxuICAgIFwiZXZlbnRuYW1lXCI6IFwiY2FsbEVhcmx5QW5zd2VyZWRcIixcbiAgICBcInNlc3Npb25cIjogc2Vzc2lvbltcImZzbS1pZFwiXVxuICB9O1xuICByZXR1cm4gb3V0ZXZlbnQ7XG59XG5cblxuZnVuY3Rpb24gaW5wdXR2YWxpZGF0aW9uKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHtcblxuICAgICAgICAvL3NpcCBpbnZpdGUgaXMgaW4gI3Nlc3Npb25bXCJzX1NJUEludml0ZVwiXVxuICAgICAgICBpZiAoIHNlc3Npb25bXCJzX1NJUEludml0ZVwiXSAhPSBudWxsICkge1xuICAgICAgICAgICAgaWYoIHNlc3Npb25bXCJzX1NJUEludml0ZVwiXVtcImV2ZW50LXR5cGVcIl0hPT1udWxsICYmIChzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC10eXBlXCJdPT09XCJzaXBcIiB8fCBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC10eXBlXCJdPT09XCJvY2NwXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYoIHNlc3Npb25bXCJzX1NJUEludml0ZVwiXVtcImV2ZW50LW5hbWVcIl0hPT1udWxsICYmIHNlc3Npb25bXCJzX1NJUEludml0ZVwiXVtcImV2ZW50LW5hbWVcIl0gPT09IFwic2lwLmNhbGxTdGFydC5OT05FXCIpXG4gICAgICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZyhcImdvdCBzaXAgaW52aXRlXCIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuc2lwaW52aXRlaW5jb3JyZWN0ZXZlbnRuYW1lXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LnNpcGludml0ZWluY29ycmVjdGV2ZW50dHlwZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuc2lwaW52aXRlbWlzc2luZ1wiO1xuICAgICAgICB9XG5cbi8vaW50ZXJpbVxuICAgIHJldHVybiBcInRydWVcIjtcblxuXG5cblxuICAgICAgICAvL2Fubm91bmNlbWVudCBzdHJpbmdcbiAgICAgICAgaWYgKCBldmVudFtcImFubm91bmNlbWVudFwiXSAhPSBudWxsICkge1xuICAgICAgICAgICAgbG9nLmRlYnVnKFwiYW5ub3VuY2VtZW50OiB7fVwiLCBldmVudFtcImFubm91bmNlbWVudFwiXSk7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImFubm91bmNlbWVudFwiXSA9IGV2ZW50W1wiYW5ub3VuY2VtZW50XCJdOyAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5hY3Rpb25taXNzaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvL3Byb21wdGFuZGNvbGxlY3QsIHBsYXlhbm5vdW5jZW1lbnRcbiAgICAgICAgaWYgKCAoZXZlbnRbXCJhY3Rpb25cIl0gIT0gbnVsbCkgJiYgKChldmVudFtcImFjdGlvblwiXT09PVwicHJvbXB0YW5kY29sbGVjdFwiKSB8fCAoZXZlbnRbXCJhY3Rpb25cIl09PT1cInBsYXlhbm5vdW5jZW1lbnRcIikpICkge1xuICAgICAgICAgICAgbG9nLmRlYnVnKFwiYWN0aW9uOiB7fVwiLCBldmVudFtcImFjdGlvblwiXSk7XG4gICAgICAgICAgICBpZiAoIGV2ZW50W1wiYWN0aW9uXCJdPT09XCJwcm9tcHRhbmRjb2xsZWN0XCIgKSBcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYWN0aW9uXCJdID0gXCJwcm9tcHRhbmRjb2xsZWN0XCI7XG4gICAgICAgICAgICBlbHNlIGlmICggZXZlbnRbXCJhY3Rpb25cIl09PT1cInBsYXlhbm5vdW5jZW1lbnRcIiApIFxuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJhY3Rpb25cIl0gPSBcInBsYXlhbm5vdW5jZW1lbnRcIjtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5hY3Rpb25pbmNvcnJlY3RcIjsgICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmFjdGlvbm1pc3NpbmdcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZWFybHkgZGlhbG9nIGlzIGJvb2xlYW4gdHJ1ZS9mYWxzZVxuICAgICAgICBpZiAoIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0gIT0gbnVsbCApIHtcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhcImVhcmx5ZGlhbG9nOiB7fVwiLCBldmVudFtcImVhcmx5ZGlhbG9nXCJdKTtcbiAgICAgICAgICAgIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJlYXJseWRpYWxvZ1wiXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidHJ1ZVwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiZWFybHlkaWFsb2dcIl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJmYWxzZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5lYXJseWRpYWxvZ2luY29ycmVjdFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuZWFybHlkaWFsb2dcIjtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nLmRlYnVnKFwiTG9nOiB7fVwiLCBlKTtcbiAgICAgICAgcmV0dXJuIFwiZXJyb3IuZXhjZXB0aW9uXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhcm1NUkZldmVudHMoc2Vzc2lvbkRhdGE6YW55LGV2ZW50RGF0YTphbnksbG9jYWxQYXJhbXM6YW55KTogYW55IHtcbiBsZXQgcmV0OiBSZXN1bHRDb2RlIDtcblxuICAgIGxldCBzdGF0dXMyIDogc3RyaW5nO1xuICAgIGxldCBldmVudHMgOiBFdmVudHM7XG4gICAgZXZlbnRzID0gZXZlbnRzIHx8IHt9O1xuICAgIGV2ZW50cy5JbmZvUG9sbEV2ZW50PVwibnVsbFwiO1xuICAgIGV2ZW50cy5TdWNjZXNzUmVzcG9uc2VQb2xsRXZlbnQ9XCJudWxsXCI7XG4gICAgZXZlbnRzLlJhd0NvbnRlbnRQb2xsRXZlbnQ9XCJ0ZXN0L3Rlc3RcIjtcblxuICAgIGxldCBoZWFkZXJWYXJzIDogSGVhZGVyVmFycztcbiAgICBoZWFkZXJWYXJzID0gaGVhZGVyVmFycyB8fCB7fTtcbiAgICBoZWFkZXJWYXJzLmRpc2FibGVTZW5kRGVmYXVsdFJlYXNvbiA9IFwiRGlzYWJsZWRcIjtcbiAgICBoZWFkZXJWYXJzLmRpc2FibGVTZW5kTm9BbnN3ZXJSZWFzb24gPSBcIkRpc2FibGVkXCI7XG5cbiAgICBsZXQgcmluZ2luZ1RvbmVzIDogW1JpbmdpbmdUb25lXTtcbiAgICByaW5naW5nVG9uZXMgPSByaW5naW5nVG9uZXMgfHwgW107XG4gICAgbGV0IGNvbWYgOiBSaW5naW5nVG9uZTtcbiAgICBjb21mID0gY29tZiB8fCB7fTtcbiAgICBjb21mLmFubm9fbmFtZT1cImNvbWZvcnRcIjtcbiAgICBjb21mLmFubm9fdHlwZT1Bbm5vdHlwZS5DT05ORUNUO1xuICAgIGxldCByaW5nIDogUmluZ2luZ1RvbmU7XG4gICAgcmluZyA9IHJpbmcgfHwge307XG4gICAgcmluZy5hbm5vX25hbWU9XCJyaW5naW5nXCI7XG4gICAgcmluZy5hbm5vX3R5cGU9QW5ub3R5cGUuUklOR0lORztcbiAgICByaW5naW5nVG9uZXMucHVzaChjb21mLCByaW5nKTtcblxuICAgIGxldCBjYXBhYmlsaXRpZXMgPSBzZXNzaW9uRGF0YS5pbkNhcGFiaWxpdGllcztcbiAgICBpZiggY2FwYWJpbGl0aWVzIT1udWxsKXtcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2goQ2FwYWJpbGl0aWVzLlBFTSk7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5GT1JLSU5HKTtcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2goQ2FwYWJpbGl0aWVzLlVQREFURSk7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5JTkZPKTtcbiAgICAgICAgc2Vzc2lvbkRhdGEub3V0Q2FwYWJpbGl0aWVzID0gSlNPTi5zdHJpbmdpZnkoY2FwYWJpbGl0aWVzKTtcbiAgICB9XG5cbiAgICBzZXNzaW9uRGF0YS5ldmVudHMgPSBKU09OLnN0cmluZ2lmeShldmVudHMpO1xuICAgIHNlc3Npb25EYXRhLmhlYWRlcnJ1bGV2YXI9SlNPTi5zdHJpbmdpZnkoaGVhZGVyVmFycyk7XG4gICAgc2Vzc2lvbkRhdGEuaGVhZGVycnVsZXNzZWxlY3QgPSBcIlNpcFNlcnZpY2VTcGVjaWZpY1J1bGVzU2V0XCI7XG4gICAgc2Vzc2lvbkRhdGEucmluZ2luZ3RvbmVzID0gSlNPTi5zdHJpbmdpZnkocmluZ2luZ1RvbmVzKTtcbiAgICBzZXNzaW9uRGF0YS51cHN0cmVhbUNhcGFiaWxpdGllcz1KU09OLnN0cmluZ2lmeShbXSk7XG5cbiAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG59XG5cblxuZnVuY3Rpb24gaGFuZGxlMjAwT0tJTlZJVEUoc2Vzc2lvbjphbnksZXZlbnQ6T0NDUFNJUC5PQ0NQRXZlbnQsbG9jYWxQYXJhbXM6YW55KSB7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgLy90aGUgcmVjZWl2ZWQgZXZlbnQgaXMgbm93IGluIGxvY2FsUGFyYW1zXG4gICAgICAgIGxldCBldmVudERhdGEgPSBsb2NhbFBhcmFtcy5tZXNzYWdlO1xuICAgICAgICAvL3Nlc3Npb24uZXZlbnRzID0gbnVsbDtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImhlYWRlcnJ1bGV2YXI9bnVsbFwiXTtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImhlYWRlcnJ1bGVzc2VsZWN0XCJdID0gbnVsbDtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcInJpbmdpbmd0b25lc1wiXSA9IG51bGw7XG5cbiAgICAgICAgbGV0IHBvbGxBY3Rpb24gOiBDYWxsUG9sbEFjdGlvbjtcbiAgICAgICAgcG9sbEFjdGlvbiA9IHBvbGxBY3Rpb24gfHwge307XG4gICAgICAgIHBvbGxBY3Rpb24udHlwZSA9IENhbGxQb2xsQWN0aW9uVHlwZS5BY2NlcHQ7XG4gICAgICAgIHNlc3Npb24uc2VuZEFjdGlvbiA9IEpTT04uc3RyaW5naWZ5KHBvbGxBY3Rpb24pO1xuXG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJ0aW1lMjAwT0tJTlZJVEVcIl0gID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLzEwMDApO1xuXG4gICAgICAgIC8vc2F2ZSB0byB0YWdcbiAgICAgICAgbGV0IHRvIDogVG8gPSBldmVudERhdGEuU0lQLlRvO1xuICAgICAgICBpZiggdG8hPW51bGwpIHtcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhcInJlY2VpdmVkIGZyb20gTVJGIHRvIHRhZzp7fVwiLHRvKTtcbiAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjYWxsc3RhdGVcIl0gID0gXCJNUkZDT05ORUNURUQyMDBPS1wiO1xuICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImRvd25TdHJlYW1Ub1RhZ1wiXT10by50YWc7XG4gICAgICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJyZWNlaXZlZCBmcm9tIE1SRiBubyB0byB0YWc6e31cIix0byk7XG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5ub3RvdGFnXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJoYW5kbGUyMDBPS0lOVklURSBMb2c6IHt9XCIsIGUpO1xuICAgICAgICByZXR1cm4gXCJlcnJvci5leGNlcHRpb25cIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZTIwME9LSU5GTyhzZXNzaW9uOmFueSxldmVudDpPQ0NQU0lQLkV2ZW50LGxvY2FsUGFyYW1zOkxvY2FsUGFyYW1ldGVycyk6IGFueXtcbiAgICBcbiAgICBsZXQgbG9nID0gc2Vzc2lvbi5sb2c7XG5cbiAgICB0cnkgeyAgICAgICAgXG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJ0aW1lMjAwT0tJTkZPXCJdICA9IE1hdGguZmxvb3IobmV3IERhdGUoKS8xMDAwKTtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImNhbGxzdGF0ZVwiXSAgPSBcIk1SRkNPTk5FQ1RFRFwiOyAgICAgICAgXG4gICAgICAgIGlmIChldmVudFtcImV2ZW50LW5hbWVcIl09PVwic2lwLm1lZGlhT3BlcmF0aW9uTm90aWZpY2F0aW9uLipcIikgIHtcbiAgICAgICAgICAgIGlmIChldmVudC5ldmVudFtcInR5cGVcIl09PVwiMjAwXCIpICB7XG4gICAgICAgICAgICAgICAgLy9UaGlzIGlzIHRoZSAyMDBvayBmb3IgU0lQIElORk8gLSBubyBEVE1GIGV0YyBpcyBwcmVzZW50XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5yZXN1bHQuZGVzY3JpcHRpb249PVwiT0tcIikgIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nLmRlYnVnKFwiaGFuZGxlMjAwT0tJTkZPOlJlY2V2aWVkIDIwME9LSU5GTyBhbmQgaXRzIG9rXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJyZWNlaXZlZC5PS1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZyhcImhhbmRsZTIwME9LSU5GTzpSZWNldmllZCAyMDBPS0lORk8gYW5kIGl0cyBOT1Qgb2sge31cIixldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwucmVzdWx0LmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicmVjZWl2ZWQuTk9LXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5ldmVudFtcInR5cGVcIl09PVwiSU5GT1wiKSAge1xuICAgICAgICAgICAgICAgIC8vVGhpcyBpcyB0aGUgaW5jb21pbmcgU0lQIElORk8gd2l0aCBlaXRoZXIgYSB0aW1lb3V0IG9yIG5vbWF0Y2ggb3IgYSBtYXRjaCB3aXRoIHRoZSBkaWdpdFxuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJkdG1mZGlnaXRzXCJdID0gXCJpbml0aWFsaXplZFwiO1xuICAgICAgICAgICAgICAgIGlmKCBldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQubmFtZSE9bnVsbCAmJiBldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQubmFtZS5zaXplKCk+MSApe1xuICAgICAgICAgICAgICAgICAgICAvLyBuYW1lWzFdIC0+IHZhbHVlWzBdICAgIGFuZCBuYW1lWzJdIC0+IHZhbHVlWzFdXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8PWV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5ldmVudC5uYW1lLnNpemUoKS0xO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJoYW5kbGUyMDBPS0lORk86aW5kZXggYW5kIGV2ZW50LW5hbWUge30gLSB7fVwiLCBpLCBldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQubmFtZS5nZXQoaSkpOyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQubmFtZS5nZXQoaSkuZXF1YWxzKFwiZHRtZi5kaWdpdHNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJoYW5kbGUyMDBPS0lORk86cmVjZWl2ZWQgZHRtZi5kaWdpdHMgYXMge31cIiwgZXZlbnQuU0lQLmNvbnRlbnQuanNvbi5tc21sLmV2ZW50LnZhbHVlW2ktMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJkdG1mZGlnaXRzXCJdICA9IGV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5ldmVudC52YWx1ZVtpLTFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZXZlbnQuU0lQLmNvbnRlbnQuanNvbi5tc21sLmV2ZW50Lm5hbWUuZ2V0KGkpLmVxdWFscyhcImR0bWYuZW5kXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nLmRlYnVnKFwiaGFuZGxlMjAwT0tJTkZPOnJlY2VpdmVkIGR0bWYuZW5kXCIpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZXZlbnQuU0lQLmNvbnRlbnQuanNvbi5tc21sLmV2ZW50Lm5hbWUuZ2V0KGkpLmVxdWFscyhcIm1zbWwuZGlhbG9nLmV4aXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJoYW5kbGUyMDBPS0lORk86cmVjZWl2ZWQgbXNtbC5kaWFsb2cuZXhpdCAtIHJldHVybiB3aXRoIE1SRiBkaWFsb2cgY2xvc2VkLlwiKTsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibXJmZGlhbG9nLmNsb3NlZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJoYW5kbGUyMDBPS0lORk86cmVjZWl2ZWQgb3RoZXIgZXZlbnQgbmFtZVwiKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKFwiaGFuZGxlMjAwT0tJTkZPOlJldHVybiB0aGUgZGVjb2RlZCBkdG1mLmRpZ2l0czoge31cIixzZXNzaW9uW1wibXJmXCJdW1wiZHRtZmRpZ2l0c1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlc3Npb25bXCJtcmZcIl1bXCJkdG1mZGlnaXRzXCJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ1bmV4cGVjdGVkZXZlbnR0eXBlLlwiICsgZXZlbnQuZXZlbnRbXCJ0eXBlXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJoYW5kbGUyMDBPS0lORk86TG9nOiB7fVwiLCBlKTtcbiAgICAgICAgcmV0dXJuIFwiZXJyb3IuZXhjZXB0aW9uXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxsQW5zd2VyZWQoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcbiAgICBsZXQgbG9nID0gc2Vzc2lvbi5sb2c7XG5cbiAgICB0cnkgeyAgICAgICAgXG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjYWxsc3RhdGVcIl0gID0gXCJBTlNXRVJFRFwiO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYW5zd2VydGltZVwiXSAgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkvMTAwMCk7XG4gICAgICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLmV4Y2VwdGlvblwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tEaXNjb25uZWN0UmVhc29uKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHsgIFxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiQ29ubmVjdEVycm9yXCI7XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjb25uZWN0ZXJyb3J0aW1lXCJdICA9IE1hdGguZmxvb3IobmV3IERhdGUoKS8xMDAwKTsgICAgICAgIFxuICAgICAgICBsZXQgZXZlbnRzU3RhY2s9ZXZlbnRbJ2V2ZW50cy1zdGFjayddO1xuICAgICAgICBpZiggZXZlbnRzU3RhY2shPW51bGwgJiYgZXZlbnRzU3RhY2suc2l6ZSgpPjAgKXtcbiAgICAgICAgICAgIGZvcih2YXIgaT1ldmVudHNTdGFjay5zaXplKCktMTtpPj0wO2ktLSl7XG4gICAgICAgICAgICAgICAgaWYoIGV2ZW50c1N0YWNrLmdldChpKS5lcXVhbHMoXCJsZWcudGltZW91dFwiKSAmJiBpPj0oZXZlbnRzU3RhY2suc2l6ZSgpLTIpKXtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbi5sb2dpbmZvID0gc2Vzc2lvbi5sb2dpbmZvK1wiVElNRU9VVDtcIjsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLm1yZi5jb25uZWN0LnRpbWVvdXRcIjsgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLm1yZi5jb25uZWN0LmV4Y2VwdGlvblwiO1xuICAgIH0gICAgICAgIFxuICAgIHJldHVybiBcImVycm9yLm1yZi5jb25uZWN0Lm90aGVyc1wiO1xufVxuXG5mdW5jdGlvbiBzZXRyZWxlYXNlKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHsgIFxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiUmVsZWFzZWRcIjtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcInJlbGVhc2V0aW1lXCJdICA9IE1hdGguZmxvb3IobmV3IERhdGUoKS8xMDAwKTsgICAgICAgIFxuICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJMb2c6IHt9XCIsIGUpO1xuICAgICAgICByZXR1cm4gXCJlcnJvci5yZWxlYXNlXCI7XG4gICAgfSAgICAgICAgXG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDYWxsUm91dGluZyhzZXNzaW9uOmFueSxldmVudERhdGE6YW55LGxvY2FsUGFyYW1zOmFueSk6IGFueSB7XG4gbGV0IHJldDogUmVzdWx0Q29kZSA7XG4gICAgcmV0ID0gcmV0IHx8IHt9O1xuICAgIHJldC5yZXN1bHRDb2RlPVwic3VjY2Vzc1wiO1xuICAgIGxldCBzdGF0dXMyIDogc3RyaW5nO1xuICAgIGxldCBldmVudHMgOiBFdmVudHM7XG4gICAgZXZlbnRzID0gZXZlbnRzIHx8IHt9O1xuICAgIGV2ZW50cy5JbmZvUG9sbEV2ZW50PVwibnVsbFwiO1xuICAgIGV2ZW50cy5TdWNjZXNzUmVzcG9uc2VQb2xsRXZlbnQ9XCJudWxsXCI7XG4gICAgZXZlbnRzLlJhd0NvbnRlbnRQb2xsRXZlbnQ9XCJ0ZXN0L3Rlc3RcIjtcbiAgICBsZXQgaGVhZGVyVmFycyA6IEhlYWRlclZhcnM7XG4gICAgaGVhZGVyVmFycyA9IGhlYWRlclZhcnMgfHwge307XG4gICAgaGVhZGVyVmFycy5kaXNhYmxlU2VuZERlZmF1bHRSZWFzb24gPSBcIkRpc2FibGVkXCI7XG4gICAgaGVhZGVyVmFycy5kaXNhYmxlU2VuZE5vQW5zd2VyUmVhc29uID0gXCJEaXNhYmxlZFwiO1xuICAgIGxldCByaW5naW5nVG9uZXMgOiBbUmluZ2luZ1RvbmVdO1xuICAgIHJpbmdpbmdUb25lcyA9IHJpbmdpbmdUb25lcyB8fCBbXTtcbiAgICBsZXQgY29tZiA6IFJpbmdpbmdUb25lO1xuICAgIGNvbWYgPSBjb21mIHx8IHt9O1xuICAgIGNvbWYuYW5ub19uYW1lPVwiY29tZm9ydFwiO1xuICAgIGNvbWYuYW5ub190eXBlPUFubm90eXBlLkNPTk5FQ1Q7XG4gICAgbGV0IHJpbmcgOiBSaW5naW5nVG9uZTtcbiAgICByaW5nID0gcmluZyB8fCB7fTtcbiAgICByaW5nLmFubm9fbmFtZT1cInJpbmdpbmdcIjtcbiAgICByaW5nLmFubm9fdHlwZT1Bbm5vdHlwZS5SSU5HSU5HO1xuICAgIHJpbmdpbmdUb25lcy5wdXNoKGNvbWYsIHJpbmcpO1xuICAgIGxldCBjYXBhYmlsaXRpZXMgPSBzZXNzaW9uRGF0YS5pbkNhcGFiaWxpdGllcztcbiAgICBpZiggY2FwYWJpbGl0aWVzIT1udWxsKXtcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2goQ2FwYWJpbGl0aWVzLlBFTSk7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5GT1JLSU5HKTtcbiAgICAgICAgc2Vzc2lvbkRhdGEub3V0Q2FwYWJpbGl0aWVzID0gSlNPTi5zdHJpbmdpZnkoY2FwYWJpbGl0aWVzKTtcbiAgICB9XG4gICAgc2Vzc2lvbi5ldmVudHMgPSBKU09OLnN0cmluZ2lmeShldmVudHMpO1xuICAgIHNlc3Npb24uaGVhZGVycnVsZXZhcj1KU09OLnN0cmluZ2lmeShoZWFkZXJWYXJzKTtcbiAgICBzZXNzaW9uLmhlYWRlcnJ1bGVzc2VsZWN0ID0gXCJTaXBTZXJ2aWNlU3BlY2lmaWNSdWxlc1NldFwiO1xuICAgIHNlc3Npb24ucmluZ2luZ3RvbmVzID0gSlNPTi5zdHJpbmdpZnkocmluZ2luZ1RvbmVzKTtcbiAgICBzZXNzaW9uLnVwc3RyZWFtQ2FwYWJpbGl0aWVzPUpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICBzdGF0dXMyID0gXCJzdWNjZXNzXCI7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==