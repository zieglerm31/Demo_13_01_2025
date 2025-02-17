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
    content = content + "<group topology=\"parallel\">\n";
    content = content + "<play id=\"beforebargeplay\"><audio uri=\"file:///appl/wav/simpleplay.wav\" format=\"audio/wav\"  /><playexit><send target=\"collect\" event=\"starttimer\"/></playexit></play>\n";
    content = content + "<collect cleardb=\"true\" fdt=\"5s\" idt=\"3s\"><pattern digits=\"x\"><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></pattern>\n";
    content = content + "<detect><send target=\"play.beforebargeplay\" event=\"terminate\"/></detect>\n<noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput>\n<nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch>\n</collect>\n";
    content = content + "</group>\n";
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
        if (event.SIP.content.json.msml.event.name[2] != null) {
            if (event.SIP.content.json.msml.event.name[2] == "dtmf.digits") {
                log.debug("Got DTMF digits;");
                if (event.SIP.content.json.msml.event.value[1] != null) {
                    session["mrf"]["dtmfdigit"] = event.SIP.content.json.msml.event.value[1];
                }
                else {
                    session["mrf"]["dtmfdigit"] = "0";
                }
            }
            else {
                log.debug("No DTMF digits;");
            }
        }
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
    return session["mrf"]["dtmfdigit"];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFXQSxJQUFLLFlBTUo7QUFORCxXQUFLLFlBQVk7SUFDZixpQ0FBaUIsQ0FBQTtJQUNqQixtQ0FBa0IsQ0FBQTtJQUNsQiw2Q0FBMkIsQ0FBQTtJQUMzQiwyQkFBUyxDQUFBO0lBQ1QsaUNBQWUsQ0FBQTtBQUNqQixDQUFDLEVBTkksWUFBWSxLQUFaLFlBQVksUUFNaEI7QUFzREQsSUFBSyxRQUdKO0FBSEQsV0FBSyxRQUFRO0lBQ1gsK0JBQW1CLENBQUE7SUFDbkIsNEJBQWdCLENBQUE7QUFDbEIsQ0FBQyxFQUhJLFFBQVEsS0FBUixRQUFRLFFBR1o7QUF1QkQsSUFBSyxrQkFJSjtBQUpELFdBQUssa0JBQWtCO0lBQ3RCLHVDQUFpQixDQUFBO0lBQ2pCLHlDQUFtQixDQUFBO0lBQ25CLHVDQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBSXRCO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3ZCLCtEQUFTLENBQUE7SUFDVCxtRUFBVyxDQUFBO0lBQ1gsdUVBQWEsQ0FBQTtBQUNkLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCO0FBZ0NELElBQUssd0JBRUo7QUFGRCxXQUFLLHdCQUF3QjtJQUM1QiwyRUFBK0MsQ0FBQTtBQUNoRCxDQUFDLEVBRkksd0JBQXdCLEtBQXhCLHdCQUF3QixRQUU1QjtBQUVELElBQUsseUJBRUo7QUFGRCxXQUFLLHlCQUF5QjtJQUM3QiwwREFBNkIsQ0FBQTtBQUM5QixDQUFDLEVBRkkseUJBQXlCLEtBQXpCLHlCQUF5QixRQUU3QjtBQW1GRCxDQUFDO0FBQ0QsQ0FBQztBQTZFRCxTQUFTLHdCQUF3QixDQUFDLE9BQWEsRUFBRSxLQUFXLEVBQUUsV0FBZ0I7SUEwQjFFLElBQUksT0FBTyxHQUFHLDZIQUE2SCxDQUFDO0lBQzVJ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QUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEQsT0FBTyxDQUFDLG9CQUFvQixHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEQsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUNwQixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vaW50ZXJmYWNlIGRlZmluaXRpb25cclxuXHJcbmludGVyZmFjZSBMZWcge1xyXG4gIGFkZHJlc3MgOiBzdHJpbmc7XHJcbiAgbmFtZSA6IHN0cmluZ1xyXG59XHJcbmludGVyZmFjZSBDYWxsIHtcclxuICBzdGF0ZSA6IG51bWJlclxyXG59XHJcblxyXG5lbnVtIENhcGFiaWxpdGllcyB7XHJcbiAgUkVMMVhYID0gXCJSRUwxWFhcIixcclxuICBGT1JLSU5HPSBcIkZPUktJTkdcIixcclxuICBQUkVDT05ESVRJT049XCJQUkVDT05ESVRJT05cIixcclxuICBQRU09XCJQRU1cIixcclxuICBVUERBVEU9XCJVUERBVEVcIlxyXG59XHJcblxyXG5pbnRlcmZhY2UgTWVzc2FnZSB7XHJcbiAgbWV0aG9kIDogW3N0cmluZ107XHJcbiAgdHlwZSA6IFtzdHJpbmddO1xyXG4gIGJvZHkgOiBbc3RyaW5nXVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU0lQIHtcclxuICBjYXBhYmlsaXRpZXMgOiBbQ2FwYWJpbGl0aWVzXTtcclxuICBtZXNzYWdlIDogTWVzc2FnZVxyXG59XHJcblxyXG5pbnRlcmZhY2UgQ2FsbFN0YXJ0IHtcclxuICBjb250YWN0IDogc3RyaW5nO1xyXG4gIGNhdXNlOiBzdHJpbmc7XHJcbiAgbGVnIDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBDYWxsUG9sbCB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHR5cGU6IHN0cmluZztcclxuICBsZWc6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRXZlbnQge1xyXG4gIG5hbWUgOiBzdHJpbmc7XHJcbiAgY2FsbFN0YXJ0PyA6IENhbGxTdGFydDtcclxuICBjYWxsUG9sbD8gOiBDYWxsUG9sbFxyXG59XHJcblxyXG5cclxuaW50ZXJmYWNlIE9DQ1BFdmVudCB7XHJcbiAgY2FsbGlkIDogc3RyaW5nO1xyXG4gIGNhbGwgOiBDYWxsO1xyXG4gIGFzIDogc3RyaW5nO1xyXG4gIGV2ZW50dGltZSA6IG51bWJlcjtcclxuICBTSVAgOiBTSVA7XHJcbiAgZXZlbnQ6IEV2ZW50XHJcbn1cclxuXHJcbmludGVyZmFjZSBFdmVudHMge1xyXG4gIFN1Y2Nlc3NSZXNwb25zZVBvbGxFdmVudD8gOiBzdHJpbmc7XHJcbiAgUmF3Q29udGVudFBvbGxFdmVudD8gOiBzdHJpbmc7XHJcbiAgSW5mb1BvbGxFdmVudD86IHN0cmluZ1xyXG59XHJcbi8qKlxyXG4gIERlZmluZSBoZWFkZXIgdmFyaWFibGVzIHVzZWQgYnkgYXBwbGljYXRpb25cclxuKi9cclxuaW50ZXJmYWNlIEhlYWRlclZhcnMge1xyXG4gIGRpc2FibGVTZW5kRGVmYXVsdFJlYXNvbj8gOiBzdHJpbmc7XHJcbiAgZGlzYWJsZVNlbmROb0Fuc3dlclJlYXNvbj8gOiBzdHJpbmdcclxufVxyXG5cclxuZW51bSBBbm5vdHlwZSB7XHJcbiAgQ09OTkVDVCA9IFwiQ09OTkVDVFwiLFxyXG4gIFJJTkdJTkcgPSBcIlJJTkdcIlxyXG59XHJcblxyXG5pbnRlcmZhY2UgUmluZ2luZ1RvbmUge1xyXG4gIGFubm9fbmFtZSA6IHN0cmluZztcclxuICBhbm5vX3R5cGUgOiBBbm5vdHlwZVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU2Vzc2lvbiB7XHJcbiAgbG9nIDogYW55O1xyXG4gIGluQ2FwYWJpbGl0aWVzIDogW0NhcGFiaWxpdGllc107XHJcbiAgb3V0Q2FwYWJpbGl0aWVzPyA6IHN0cmluZztcclxuICBldmVudHM/IDogc3RyaW5nO1xyXG4gIGhlYWRlcnJ1bGV2YXI/IDogc3RyaW5nO1xyXG4gIGhlYWRlcnJ1bGVzc2VsZWN0PyA6IHN0cmluZztcclxuICByaW5naW5ndG9uZXM/IDogc3RyaW5nO1xyXG4gIHNlbmRBY3Rpb24/IDogc3RyaW5nIDtcclxuICBTSVBIZWxwZXIgOiBhbnk7XHJcbiAgU0lQSW5pdGlhbEludml0ZT8gOiBhbnk7XHJcbiAgU0lQTWVzc2FnZT8gOiBhbnk7XHJcbiAgU0lQTWVzc2FnZVR5cGU/IDogYW55XHJcbn1cclxuXHJcblxyXG5lbnVtIENhbGxQb2xsQWN0aW9uVHlwZSB7XHJcbiBBY2NlcHQgPSBcImFjY2VwdFwiLFxyXG4gRm9yd2FyZCA9IFwiZm9yd2FyZFwiLFxyXG4gUmVqZWN0ID0gXCJyZWplY3RcIixcclxufVxyXG5cclxuZW51bSBDYWxsU3RhcnRBY3Rpb25UeXBlIHtcclxuIEFib3J0ID0gMCxcclxuIEZvcndhcmQgPSAxLFxyXG4gUmVqZWN0TXJmID0gMlxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gU2V0IGFjdGlvbiBmb3IgQ2FsbFN0YXJ0IGV2ZW50XHJcbiovXHJcbmludGVyZmFjZSBDYWxsU3RhcnRBY3Rpb24ge1xyXG4gdHlwZSA6IENhbGxTdGFydEFjdGlvblR5cGU7XHJcbiBlcnJvcmNvZGUgOiBudW1iZXI7XHJcbiBjYXVzZSA6IHN0cmluZyA7XHJcbiB1cmkgOiBzdHJpbmc7XHJcbiBlYXJseW1lZGlhIDogbnVtYmVyO1xyXG4gbGVnbmFtZSA6IHN0cmluZyBcclxufVxyXG5cclxuLyoqXHJcbiBTZXQgYWN0aW9uIGZvciBDYWxsUG9sbCBldmVudFxyXG4qL1xyXG5pbnRlcmZhY2UgQ2FsbFBvbGxBY3Rpb24ge1xyXG4gdHlwZSA6IENhbGxQb2xsQWN0aW9uVHlwZVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiBBcHBsaWNhdGlvbiBjYW4gc2V0IGFjdGlvbiBmb3IgYSBzcGVjaWZpYyBsZWcsIHRoaXMgaXMgYXBwbGljYWJsZSBmb3IgTVJGIGNvbnRhY3RcclxuICovXHJcbmludGVyZmFjZSBMZWdBY3Rpb24ge1xyXG4gdHlwZSA6IENhbGxTdGFydEFjdGlvblR5cGUgO1xyXG4gbGVnYWN0aW9uIDogc3RyaW5nXHJcbn1cclxuXHJcbmVudW0gTWVkaWFPcGVyYXRpb25BY3Rpb25UeXBlIHtcclxuIFBlcmZvcm1NZWRpYU9wZXJhdGlvbiA9IFwicGVyZm9ybU1lZGlhT3BlcmF0aW9uXCJcclxufVxyXG5cclxuZW51bSBNZWRpYU9wZXJhdGlvbkNvbnRlbnRUeXBlIHtcclxuIE1TTUwgPSBcImFwcGxpY2F0aW9uL21zbWwreG1sXCJcclxufVxyXG5cclxuaW50ZXJmYWNlIFBlcmZvcm1NZWRpYU9wZXJhdGlvbiB7XHJcbiBDb250ZW50VHlwZSA6IE1lZGlhT3BlcmF0aW9uQ29udGVudFR5cGU7XHJcbiBDb250ZW50IDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBNZWRpYU9wZXJhdGlvbkFjdGlvbiB7XHJcbiB0eXBlIDogbnVtYmVyO1xyXG4gbGVnYWN0aW9uIDogTWVkaWFPcGVyYXRpb25BY3Rpb25UeXBlO1xyXG4gcGVyZm9ybU1lZGlhT3BlcmF0aW9uIDogUGVyZm9ybU1lZGlhT3BlcmF0aW9uXHJcbn1cclxuXHJcbmludGVyZmFjZSBBY3Rpb24ge1xyXG4gYWN0aW9uIDogYW55IFxyXG59XHJcblxyXG5cclxuaW50ZXJmYWNlIEhlYWRlciB7XHJcbiBoZWFkZXIgOiBzdHJpbmc7XHJcbiB2YWx1ZSA6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFFIZWFkZXIge1xyXG4gUHJpdmFjeSA6IHN0cmluZztcclxuIFJlYXNvbiA6IHN0cmluZyA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQYXJhbWV0ZXIge1xyXG4gdHJhbnNwb3J0IDogc3RyaW5nO1xyXG4gdXNlciA6IHN0cmluZyA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBVUkkge1xyXG4gc2NoZW1lIDogc3RyaW5nO1xyXG4gYXV0aG9yaXR5IDogc3RyaW5nIDtcclxuIGdyIDogc3RyaW5nIDtcclxuIGhvc3Q6IHN0cmluZyA7XHJcbiBsciA6IHN0cmluZyA7XHJcbiBtYWRkciA6IHN0cmluZyA7XHJcbiBwb3J0IDogbnVtYmVyICA7XHJcbiB1c2VyIDogc3RyaW5nIDtcclxuIHBhcmFtZXRlcnMgOiBbUGFyYW1ldGVyXTtcclxuIHFoZWFkZXIgOiBbUUhlYWRlcl07XHJcbn1cclxuXHJcbmludGVyZmFjZSBBZGRyZXNzIHtcclxuIGRpc3BsYXlOYW1lIDogc3RyaW5nO1xyXG4gdXJpIDogVVJJIFxyXG59XHJcblxyXG5pbnRlcmZhY2UgSGlzdG9yeUluZm8gaW1wbGVtZW50cyBIZWFkZXIge1xyXG4gYWRkcmVzcyA6IEFkZHJlc3M7XHJcbiBpbmRleCA6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUEFJIGltcGxlbWVudHMgSGVhZGVyICB7XHJcbiBhZGRyZXNzIDogQWRkcmVzc1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRnJvbSBpbXBsZW1lbnRzIEhlYWRlciB7XHJcbiBhZGRyZXNzIDogQWRkcmVzcztcclxuIHRhZyA6IHN0cmluZyA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBUbyBpbXBsZW1lbnRzIEhlYWRlciB7XHJcbiBhZGRyZXNzIDogQWRkcmVzcztcclxuIHRhZyA6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFBDViBpbXBsZW1lbnRzIEhlYWRlciB7XHJcbiBpY2lkX2dlbmVyYXRlZF9hdDogc3RyaW5nIDtcclxuIGljaWRfdmFsdWUgOiBzdHJpbmcgO1xyXG4gb2FpZCA6IHN0cmluZztcclxuIHRhaWQgOiBzdHJpbmc7XHJcbiBvc2lkIDogc3RyaW5nO1xyXG4gdHNpZCA6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFJlc3VsdENvZGUge1xyXG4gIHJlc3VsdENvZGUgOiBzdHJpbmcgO1xyXG59XHJcblxuOy8vTUFJTkJMT0NLXG47XG4vKlxuLy9jb25maWcgaXMgXCJtcmZfYW5ub3VuY2VtZW50c1wiXG57XG4gIFwiYW5ub1Rlc3RcIjoge1xuICAgIFwibWF4dGltZVwiOiAxNTAwLFxuICAgIFwicGF0aFwiOiBcImZpbGU6Ly8vdG1wL2Fubm9zL1wiLFxuICAgIFwidmFyaWFibGVcIjogXCJcIixcbiAgICBcImJhcmdlXCI6IDEsXG4gICAgXCJwcm9tcHRcIjogXCJ0ZXN0QW5uby53YXZcIixcbiAgICBcImR0bWZcIjoge1xuICAgICAgXCJjbGVhcmRiXCI6IDEsXG4gICAgICBcImlkdFwiOiAxLFxuICAgICAgXCJmZHRcIjogMSxcbiAgICAgIFwibWluXCI6IDEsXG4gICAgICBcIm1heFwiOiAxLFxuICAgICAgXCJydGZcIjogXCIqXCIsXG4gICAgICBcImNhbmNlbFwiOiBcIiNcIlxuICAgIH0sXG4gICAgXCJhbm5pZFwiOiBcImFubm9Qcm9tcHRDb2xsZWN0XCIsXG4gICAgXCJpbnRlcnZhbFwiOiAxMDAsXG4gICAgXCJpdGVyYXRlXCI6IDEsXG4gICAgXCJjbGVhcmRiXCI6IDFcbiAgfSxcbn1cblxuLy8gWE1MIGluIG5leHVzLXNpcC4zLjAuMS0xLmphclxuPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIj8+IFxuPG1zbWwgdmVyc2lvbj1cIjEuMVwiPiBcblx0PGRpYWxvZ3N0YXJ0IG5hbWU9XCJhbm5vUHJvbXB0Q29sbGVjdFwiIHRhcmdldD1cImNvbm46Y2E0NTg1NTFcIiB0eXBlPVwiYXBwbGljYXRpb24vbW9tbCt4bWxcIj4gXG5cdFx0PHBsYXkgaW50ZXJ2YWw9XCIxMDBtc1wiIGl0ZXJhdGU9XCIxXCIgY2xlYXJkYj1cInRydWVcIiBtYXh0aW1lPVwiNTAwMDBtc1wiIGJhcmdlPVwidHJ1ZVwiPiBcblx0XHRcdDxhdWRpbyB1cmk9XCJmaWxlOi8vL2FwcGwvd2F2L3NpbXBsZXBsYXkud2F2XCIvPiBcblx0XHRcdDxwbGF5ZXhpdD4gXG5cdFx0XHRcdDxleGl0IG5hbWVsaXN0PVwicGxheS5lbmQgcGxheS5hbXRcIi8+IFxuXHRcdFx0PC9wbGF5ZXhpdD4gXG5cdFx0PC9wbGF5PiBcblx0PC9kaWFsb2dzdGFydD4gXG48L21zbWw+XG5cdCAgXG4vLyBYTUwgaW4gbmV4dXMtc2lwLjMuMC4/Pz8gZnV0dXJlIC0gc3VwcG9ydCBwcm9tcHQgYW5kIGNvbGxlY3Rcbi8vIHBhdHRlcm4gZGlnaXRzIHggaXMgd2lsZGNhcmQsIHh4IGFyZSB0d28gd2lsZGNhcmQgZGlnaXRzLCAxIGlzIHRoZSBkaWdpdCBvbmUgZXhhY3RseSwgXG4vLyA8cGF0dGVybiBkaWdpdHM9XCIxXCIgaXRlcmF0ZT1cImZvcmV2ZXJcIj4gIFxudXNpbmcgY29sbGVjdFxuPD94bWwgdmVyc2lvbj1cIjEuMFwiPz5cbjxtc21sIHZlcnNpb249XCIxLjFcIj5cblx0PGRpYWxvZ3N0YXJ0IHRhcmdldD1cImNvbm46JHtUQVJHRVR9XCIgdHlwZT1cImFwcGxpY2F0aW9uL21vbWwreG1sXCIgbmFtZT1cImRpYWxvZ25hbWVkZWZhdWx0XCI+XG5cdFx0PGdyb3VwIHRvcG9sb2d5PVwicGFyYWxsZWxcIj5cblx0XHRcdDxwbGF5IGlkPVwiYmVmb3JlYmFyZ2VwbGF5XCI+XG5cdFx0XHRcdDxhdWRpbyB1cmk9XCJmaWxlOi8vL2FwcGwvd2F2L3NpbXBsZXBsYXkud2F2XCIgZm9ybWF0PVwiYXVkaW8vd2F2XCIgIC8+XG5cdFx0XHRcdDxwbGF5ZXhpdD5cblx0XHRcdFx0XHQ8c2VuZCB0YXJnZXQ9XCJjb2xsZWN0XCIgZXZlbnQ9XCJzdGFydHRpbWVyXCIvPlxuXHRcdFx0XHQ8L3BsYXlleGl0PlxuXHRcdFx0PC9wbGF5PlxuXHRcdFx0PGNvbGxlY3QgY2xlYXJkYj1cInRydWVcIiBmZHQ9XCI1c1wiIGlkdD1cIjNzXCI+XG5cdFx0XHRcdDxwYXR0ZXJuIGRpZ2l0cz1cInhcIj5cblx0XHRcdFx0XHQ8c2VuZCB0YXJnZXQ9XCJzb3VyY2VcIiBldmVudD1cImRpYWxvZ25hbWVkZWZhdWx0XCIgbmFtZWxpc3Q9XCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFwiLz5cblx0XHRcdFx0PC9wYXR0ZXJuPlxuXHRcdFx0XHQ8ZGV0ZWN0PlxuXHRcdFx0XHRcdDxzZW5kIHRhcmdldD1cInBsYXkuYmVmb3JlYmFyZ2VwbGF5XCIgZXZlbnQ9XCJ0ZXJtaW5hdGVcIi8+XG5cdFx0XHRcdDwvZGV0ZWN0PlxuXHRcdFx0XHQ8bm9pbnB1dD5cblx0XHRcdFx0XHQ8c2VuZCB0YXJnZXQ9XCJzb3VyY2VcIiBldmVudD1cImRpYWxvZ25hbWVkZWZhdWx0XCIgbmFtZWxpc3Q9XCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFwiLz5cblx0XHRcdFx0PC9ub2lucHV0PlxuXHRcdFx0XHQ8bm9tYXRjaD5cblx0XHRcdFx0XHQ8c2VuZCB0YXJnZXQ9XCJzb3VyY2VcIiBldmVudD1cImRpYWxvZ25hbWVkZWZhdWx0XCIgbmFtZWxpc3Q9XCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFwiLz5cblx0XHRcdFx0PC9ub21hdGNoPlxuXHRcdFx0PC9jb2xsZWN0PlxuXHRcdDwvZ3JvdXA+XG5cdDwvZGlhbG9nc3RhcnQ+XG48L21zbWw+XG5cblxuXG5cblxuKi9cblxuZnVuY3Rpb24gU2VuZElORk9Qcm9tcHRhbmRDb2xsZWN0KHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgLy9zZXQgdGhlIHhtbCBjb25uIGlkIC0tPiBzZXNzaW9uW1wibXJmXCJdW1wiZG93blN0cmVhbVRvVGFnXCJdXG5cbi8qXG4gICAgbGV0IG91dGV2ZW50ID0ge1xuICAgIFwiY2FsbGlkXCI6IHNlc3Npb25bXCJmc20taWRcIl0sXG4gICAgXCJldmVudC10eXBlXCI6IFwic2lwXCIsXG4gICAgXCJxdWV1ZVwiOiBcIlRBU1Y0XzFcIixcbiAgICBcImlkXCI6IDIsXG4gICAgXCJ0aW1lc3RhbXBcIjogMTczOTc4NDgzNDU2MyxcbiAgICBcImFjdGlvblwiOiB7XG4gICAgICBcImxlZ2FjdGlvblwiOiBcInBlcmZvcm1NZWRpYU9wZXJhdGlvblwiLFxuICAgICAgXCJwZXJmb3JtTWVkaWFPcGVyYXRpb25cIjoge1xuICAgICAgICBcIkNvbnRlbnRUeXBlXCI6IFwiYXBwbGljYXRpb24vbXNtbCt4bWxcIixcbiAgICAgICAgXCJDb250ZW50XCI6IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48bXNtbCAgdmVyc2lvbj1cXFwiMS4xXFxcIj5cXG48ZGlhbG9nc3RhcnQgbmFtZT1cXFwiYW5ub1Byb21wdENvbGxlY3RcXFwiIHRhcmdldD1cXFwiY29ubjo1YjAwN2M0MFxcXCIgdHlwZT1cXFwiYXBwbGljYXRpb24vbW9tbCt4bWxcXFwiPlxcbjxwbGF5IGludGVydmFsPVxcXCIxMDBtc1xcXCIgaXRlcmF0ZT1cXFwiMVxcXCIgY2xlYXJkYj1cXFwidHJ1ZVxcXCIgbWF4dGltZT1cXFwiNTAwMDBtc1xcXCIgYmFyZ2U9XFxcInRydWVcXFwiPlxcbiA8YXVkaW8gdXJpPVxcXCJmaWxlOi8vL2FwcGwvd2F2L3NpbXBsZXBsYXkud2F2XFxcIi8+XFxuIDxwbGF5ZXhpdD5cXG4gICA8ZXhpdCBuYW1lbGlzdD1cXFwicGxheS5lbmQgcGxheS5hbXRcXFwiLz5cXG4gPC9wbGF5ZXhpdD5cXG48L3BsYXk+XFxuPC9kaWFsb2dzdGFydD5cXG48L21zbWw+XCJcbiAgICAgIH0sXG4gICAgICBcInR5cGVcIjogM1xuICAgIH0sXG4gICAgXCJldmVudC1uYW1lXCI6IFwic2lwLm1lZGlhLnBsYXlBbm5vdW5jZW1lbnRcIixcbiAgICBcImV2ZW50bmFtZVwiOiBcImNhbGxFYXJseUFuc3dlcmVkXCIsXG4gICAgXCJzZXNzaW9uXCI6IHNlc3Npb25bXCJmc20taWRcIl0sXG4gICAgXCJldmVudHRpbWVcIjogMTczOTc4NDgzNDU3OVxuICB9O1xuXG4gIFwiQ29udGVudFwiOiBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPG1zbWwgIHZlcnNpb249XFxcIjEuMVxcXCI+XFxuPGRpYWxvZ3N0YXJ0IG5hbWU9XFxcImFubm9Qcm9tcHRDb2xsZWN0XFxcIiB0YXJnZXQ9XFxcImNvbm46XFxcInNlc3Npb25bXCJtcmZcIl1bXCJkb3duU3RyZWFtVG9UYWdcIl0gdHlwZT1cXFwiYXBwbGljYXRpb24vbW9tbCt4bWxcXFwiPlxcbjxwbGF5IGludGVydmFsPVxcXCIxMDBtc1xcXCIgaXRlcmF0ZT1cXFwiMVxcXCIgY2xlYXJkYj1cXFwidHJ1ZVxcXCIgbWF4dGltZT1cXFwiNTAwMDBtc1xcXCIgYmFyZ2U9XFxcInRydWVcXFwiPlxcbiA8YXVkaW8gdXJpPVxcXCJmaWxlOi8vL2FwcGwvd2F2L3NpbXBsZXBsYXkud2F2XFxcIi8+XFxuIDxwbGF5ZXhpdD5cXG4gICA8ZXhpdCBuYW1lbGlzdD1cXFwicGxheS5lbmQgcGxheS5hbXRcXFwiLz5cXG4gPC9wbGF5ZXhpdD5cXG48L3BsYXk+XFxuPC9kaWFsb2dzdGFydD5cXG48L21zbWw+XCJcbiovXG4gICAgbGV0IGNvbnRlbnQgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPG1zbWwgIHZlcnNpb249XFxcIjEuMVxcXCI+XFxuPGRpYWxvZ3N0YXJ0IG5hbWU9XFxcImRpYWxvZ25hbWVkZWZhdWx0XFxcIiB0YXJnZXQ9XFxcImNvbm46XCI7XG4gICAgY29udGVudCA9IGNvbnRlbnQgKyBzZXNzaW9uW1wibXJmXCJdW1wiZG93blN0cmVhbVRvVGFnXCJdO1xuICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCJcXFwiIHR5cGU9XFxcImFwcGxpY2F0aW9uL21vbWwreG1sXFxcIj5cXG5cIjtcbiAgICAvL2NvbnRlbnQgPSBjb250ZW50ICsgXCI8cGxheSBpbnRlcnZhbD1cXFwiMTAwbXNcXFwiIGl0ZXJhdGU9XFxcIjFcXFwiIGNsZWFyZGI9XFxcInRydWVcXFwiIG1heHRpbWU9XFxcIjUwMDAwbXNcXFwiIGJhcmdlPVxcXCJ0cnVlXFxcIj5cXG4gPGF1ZGlvIHVyaT1cXFwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlxcXCIvPlxcbiA8cGxheWV4aXQ+XFxuICAgPGV4aXQgbmFtZWxpc3Q9XFxcInBsYXkuZW5kIHBsYXkuYW10XFxcIi8+XFxuIDwvcGxheWV4aXQ+XFxuPC9wbGF5PlxcbjwvZGlhbG9nc3RhcnQ+XFxuPC9tc21sPlwiO1xuICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCI8Z3JvdXAgdG9wb2xvZ3k9XFxcInBhcmFsbGVsXFxcIj5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPHBsYXkgaWQ9XFxcImJlZm9yZWJhcmdlcGxheVxcXCI+PGF1ZGlvIHVyaT1cXFwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlxcXCIgZm9ybWF0PVxcXCJhdWRpby93YXZcXFwiICAvPjxwbGF5ZXhpdD48c2VuZCB0YXJnZXQ9XFxcImNvbGxlY3RcXFwiIGV2ZW50PVxcXCJzdGFydHRpbWVyXFxcIi8+PC9wbGF5ZXhpdD48L3BsYXk+XFxuXCI7XG4gICAgY29udGVudCA9IGNvbnRlbnQgKyBcIjxjb2xsZWN0IGNsZWFyZGI9XFxcInRydWVcXFwiIGZkdD1cXFwiNXNcXFwiIGlkdD1cXFwiM3NcXFwiPjxwYXR0ZXJuIGRpZ2l0cz1cXFwieFxcXCI+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgbmFtZWxpc3Q9XFxcImR0bWYuZGlnaXRzIGR0bWYuZW5kXFxcIi8+PC9wYXR0ZXJuPlxcblwiO1xuICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCI8ZGV0ZWN0PjxzZW5kIHRhcmdldD1cXFwicGxheS5iZWZvcmViYXJnZXBsYXlcXFwiIGV2ZW50PVxcXCJ0ZXJtaW5hdGVcXFwiLz48L2RldGVjdD5cXG48bm9pbnB1dD48c2VuZCB0YXJnZXQ9XFxcInNvdXJjZVxcXCIgZXZlbnQ9XFxcImRpYWxvZ25hbWVkZWZhdWx0XFxcIiBuYW1lbGlzdD1cXFwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcXFwiLz48L25vaW5wdXQ+XFxuPG5vbWF0Y2g+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgbmFtZWxpc3Q9XFxcImR0bWYuZGlnaXRzIGR0bWYuZW5kXFxcIi8+PC9ub21hdGNoPlxcbjwvY29sbGVjdD5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPC9ncm91cD5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPC9kaWFsb2dzdGFydD5cXG48L21zbWw+XFxuXCI7XG5cbiAgICBsZXQgb3V0ZXZlbnQgPSB7XG4gICAgXCJjYWxsaWRcIjogc2Vzc2lvbltcImZzbS1pZFwiXSxcbiAgICBcImV2ZW50LXR5cGVcIjogXCJzaXBcIixcbiAgICBcInF1ZXVlXCI6IFwiVEFTVjRfMVwiLFxuICAgIFwiaWRcIjogMixcbiAgICBcImFjdGlvblwiOiB7XG4gICAgICBcImxlZ2FjdGlvblwiOiBcInBlcmZvcm1NZWRpYU9wZXJhdGlvblwiLFxuICAgICAgXCJwZXJmb3JtTWVkaWFPcGVyYXRpb25cIjoge1xuICAgICAgICBcIkNvbnRlbnRUeXBlXCI6IFwiYXBwbGljYXRpb24vbXNtbCt4bWxcIixcbiAgICAgICAgXCJDb250ZW50XCI6IGNvbnRlbnRcbiAgICAgIH0sXG4gICAgICBcInR5cGVcIjogM1xuICAgIH0sXG4gICAgXCJldmVudC1uYW1lXCI6IFwic2lwLm1lZGlhLnBsYXlBbm5vdW5jZW1lbnRcIixcbiAgICBcImV2ZW50bmFtZVwiOiBcImNhbGxFYXJseUFuc3dlcmVkXCIsXG4gICAgXCJzZXNzaW9uXCI6IHNlc3Npb25bXCJmc20taWRcIl1cbiAgfTtcbiAgcmV0dXJuIG91dGV2ZW50O1xufVxuXG5cbmZ1bmN0aW9uIGlucHV0dmFsaWRhdGlvbihzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcblxuICAgIHRyeSB7XG5cbiAgICAgICAgLy9zaXAgaW52aXRlIGlzIGluICNzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1cbiAgICAgICAgaWYgKCBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl0gIT0gbnVsbCApIHtcbiAgICAgICAgICAgIGlmKCBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC10eXBlXCJdIT09bnVsbCAmJiAoc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtdHlwZVwiXT09PVwic2lwXCIgfHwgc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtdHlwZVwiXT09PVwib2NjcFwiKSkge1xuICAgICAgICAgICAgICAgIGlmKCBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC1uYW1lXCJdIT09bnVsbCAmJiBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC1uYW1lXCJdID09PSBcInNpcC5jYWxsU3RhcnQuTk9ORVwiKVxuICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJnb3Qgc2lwIGludml0ZVwiKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LnNpcGludml0ZWluY29ycmVjdGV2ZW50bmFtZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5zaXBpbnZpdGVpbmNvcnJlY3RldmVudHR5cGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LnNpcGludml0ZW1pc3NpbmdcIjtcbiAgICAgICAgfVxuXG4vL2ludGVyaW1cbiAgICByZXR1cm4gXCJ0cnVlXCI7XG5cblxuXG5cbiAgICAgICAgLy9hbm5vdW5jZW1lbnQgc3RyaW5nXG4gICAgICAgIGlmICggZXZlbnRbXCJhbm5vdW5jZW1lbnRcIl0gIT0gbnVsbCApIHtcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhcImFubm91bmNlbWVudDoge31cIiwgZXZlbnRbXCJhbm5vdW5jZW1lbnRcIl0pO1xuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJhbm5vdW5jZW1lbnRcIl0gPSBldmVudFtcImFubm91bmNlbWVudFwiXTsgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuYWN0aW9ubWlzc2luZ1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wcm9tcHRhbmRjb2xsZWN0LCBwbGF5YW5ub3VuY2VtZW50XG4gICAgICAgIGlmICggKGV2ZW50W1wiYWN0aW9uXCJdICE9IG51bGwpICYmICgoZXZlbnRbXCJhY3Rpb25cIl09PT1cInByb21wdGFuZGNvbGxlY3RcIikgfHwgKGV2ZW50W1wiYWN0aW9uXCJdPT09XCJwbGF5YW5ub3VuY2VtZW50XCIpKSApIHtcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhcImFjdGlvbjoge31cIiwgZXZlbnRbXCJhY3Rpb25cIl0pO1xuICAgICAgICAgICAgaWYgKCBldmVudFtcImFjdGlvblwiXT09PVwicHJvbXB0YW5kY29sbGVjdFwiICkgXG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImFjdGlvblwiXSA9IFwicHJvbXB0YW5kY29sbGVjdFwiO1xuICAgICAgICAgICAgZWxzZSBpZiAoIGV2ZW50W1wiYWN0aW9uXCJdPT09XCJwbGF5YW5ub3VuY2VtZW50XCIgKSBcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYWN0aW9uXCJdID0gXCJwbGF5YW5ub3VuY2VtZW50XCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuYWN0aW9uaW5jb3JyZWN0XCI7ICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5hY3Rpb25taXNzaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvL2Vhcmx5IGRpYWxvZyBpcyBib29sZWFuIHRydWUvZmFsc2VcbiAgICAgICAgaWYgKCBldmVudFtcImVhcmx5ZGlhbG9nXCJdICE9IG51bGwgKSB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJlYXJseWRpYWxvZzoge31cIiwgZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSk7XG4gICAgICAgICAgICBpZiAoIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiZWFybHlkaWFsb2dcIl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBcInRydWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImVhcmx5ZGlhbG9nXCJdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZmFsc2VcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuZWFybHlkaWFsb2dpbmNvcnJlY3RcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmVhcmx5ZGlhbG9nXCI7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLmV4Y2VwdGlvblwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXJtTVJGZXZlbnRzKHNlc3Npb25EYXRhOmFueSxldmVudERhdGE6YW55LGxvY2FsUGFyYW1zOmFueSk6IGFueSB7XG4gbGV0IHJldDogUmVzdWx0Q29kZSA7XG5cbiAgICBsZXQgc3RhdHVzMiA6IHN0cmluZztcbiAgICBsZXQgZXZlbnRzIDogRXZlbnRzO1xuICAgIGV2ZW50cyA9IGV2ZW50cyB8fCB7fTtcbiAgICBldmVudHMuSW5mb1BvbGxFdmVudD1cIm51bGxcIjtcbiAgICBldmVudHMuU3VjY2Vzc1Jlc3BvbnNlUG9sbEV2ZW50PVwibnVsbFwiO1xuICAgIGV2ZW50cy5SYXdDb250ZW50UG9sbEV2ZW50PVwidGVzdC90ZXN0XCI7XG5cbiAgICBsZXQgaGVhZGVyVmFycyA6IEhlYWRlclZhcnM7XG4gICAgaGVhZGVyVmFycyA9IGhlYWRlclZhcnMgfHwge307XG4gICAgaGVhZGVyVmFycy5kaXNhYmxlU2VuZERlZmF1bHRSZWFzb24gPSBcIkRpc2FibGVkXCI7XG4gICAgaGVhZGVyVmFycy5kaXNhYmxlU2VuZE5vQW5zd2VyUmVhc29uID0gXCJEaXNhYmxlZFwiO1xuXG4gICAgbGV0IHJpbmdpbmdUb25lcyA6IFtSaW5naW5nVG9uZV07XG4gICAgcmluZ2luZ1RvbmVzID0gcmluZ2luZ1RvbmVzIHx8IFtdO1xuICAgIGxldCBjb21mIDogUmluZ2luZ1RvbmU7XG4gICAgY29tZiA9IGNvbWYgfHwge307XG4gICAgY29tZi5hbm5vX25hbWU9XCJjb21mb3J0XCI7XG4gICAgY29tZi5hbm5vX3R5cGU9QW5ub3R5cGUuQ09OTkVDVDtcbiAgICBsZXQgcmluZyA6IFJpbmdpbmdUb25lO1xuICAgIHJpbmcgPSByaW5nIHx8IHt9O1xuICAgIHJpbmcuYW5ub19uYW1lPVwicmluZ2luZ1wiO1xuICAgIHJpbmcuYW5ub190eXBlPUFubm90eXBlLlJJTkdJTkc7XG4gICAgcmluZ2luZ1RvbmVzLnB1c2goY29tZiwgcmluZyk7XG5cbiAgICBsZXQgY2FwYWJpbGl0aWVzID0gc2Vzc2lvbkRhdGEuaW5DYXBhYmlsaXRpZXM7XG4gICAgaWYoIGNhcGFiaWxpdGllcyE9bnVsbCl7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5QRU0pO1xuICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChDYXBhYmlsaXRpZXMuRk9SS0lORyk7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5VUERBVEUpO1xuICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChDYXBhYmlsaXRpZXMuSU5GTyk7XG4gICAgICAgIHNlc3Npb25EYXRhLm91dENhcGFiaWxpdGllcyA9IEpTT04uc3RyaW5naWZ5KGNhcGFiaWxpdGllcyk7XG4gICAgfVxuXG4gICAgc2Vzc2lvbkRhdGEuZXZlbnRzID0gSlNPTi5zdHJpbmdpZnkoZXZlbnRzKTtcbiAgICBzZXNzaW9uRGF0YS5oZWFkZXJydWxldmFyPUpTT04uc3RyaW5naWZ5KGhlYWRlclZhcnMpO1xuICAgIHNlc3Npb25EYXRhLmhlYWRlcnJ1bGVzc2VsZWN0ID0gXCJTaXBTZXJ2aWNlU3BlY2lmaWNSdWxlc1NldFwiO1xuICAgIHNlc3Npb25EYXRhLnJpbmdpbmd0b25lcyA9IEpTT04uc3RyaW5naWZ5KHJpbmdpbmdUb25lcyk7XG4gICAgc2Vzc2lvbkRhdGEudXBzdHJlYW1DYXBhYmlsaXRpZXM9SlNPTi5zdHJpbmdpZnkoW10pO1xuXG4gICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xufVxuXG5cbmZ1bmN0aW9uIGhhbmRsZTIwME9LSU5WSVRFKHNlc3Npb246YW55LGV2ZW50Ok9DQ1BTSVAuT0NDUEV2ZW50LGxvY2FsUGFyYW1zOmFueSkge1xuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcblxuICAgIHRyeSB7XG4gICAgICAgIC8vdGhlIHJlY2VpdmVkIGV2ZW50IGlzIG5vdyBpbiBsb2NhbFBhcmFtc1xuICAgICAgICBsZXQgZXZlbnREYXRhID0gbG9jYWxQYXJhbXMubWVzc2FnZTtcbiAgICAgICAgLy9zZXNzaW9uLmV2ZW50cyA9IG51bGw7XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJoZWFkZXJydWxldmFyPW51bGxcIl07XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJoZWFkZXJydWxlc3NlbGVjdFwiXSA9IG51bGw7XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJyaW5naW5ndG9uZXNcIl0gPSBudWxsO1xuXG4gICAgICAgIGxldCBwb2xsQWN0aW9uIDogQ2FsbFBvbGxBY3Rpb247XG4gICAgICAgIHBvbGxBY3Rpb24gPSBwb2xsQWN0aW9uIHx8IHt9O1xuICAgICAgICBwb2xsQWN0aW9uLnR5cGUgPSBDYWxsUG9sbEFjdGlvblR5cGUuQWNjZXB0O1xuICAgICAgICBzZXNzaW9uLnNlbmRBY3Rpb24gPSBKU09OLnN0cmluZ2lmeShwb2xsQWN0aW9uKTtcblxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1widGltZTIwME9LSU5WSVRFXCJdICA9IE1hdGguZmxvb3IobmV3IERhdGUoKS8xMDAwKTtcblxuICAgICAgICAvL3NhdmUgdG8gdGFnXG4gICAgICAgIGxldCB0byA6IFRvID0gZXZlbnREYXRhLlNJUC5UbztcbiAgICAgICAgaWYoIHRvIT1udWxsKSB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJyZWNlaXZlZCBmcm9tIE1SRiB0byB0YWc6e31cIix0byk7XG4gICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiTVJGQ09OTkVDVEVEMjAwT0tcIjtcbiAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJkb3duU3RyZWFtVG9UYWdcIl09dG8udGFnO1xuICAgICAgICAgICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nLmRlYnVnKFwicmVjZWl2ZWQgZnJvbSBNUkYgbm8gdG8gdGFnOnt9XCIsdG8pO1xuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3Iubm90b3RhZ1wiO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nLmRlYnVnKFwiaGFuZGxlMjAwT0tJTlZJVEUgTG9nOiB7fVwiLCBlKTtcbiAgICAgICAgcmV0dXJuIFwiZXJyb3IuZXhjZXB0aW9uXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGUyMDBPS0lORk8oc2Vzc2lvbjphbnksZXZlbnQ6T0NDUFNJUC5FdmVudCxsb2NhbFBhcmFtczpMb2NhbFBhcmFtZXRlcnMpOiBhbnl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHsgICAgICAgIFxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1widGltZTIwME9LSU5GT1wiXSAgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkvMTAwMCk7XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjYWxsc3RhdGVcIl0gID0gXCJNUkZDT05ORUNURURcIjtcbiAgICAgICAgaWYgKGV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5ldmVudC5uYW1lWzJdIT1udWxsKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuU0lQLmNvbnRlbnQuanNvbi5tc21sLmV2ZW50Lm5hbWVbMl09PVwiZHRtZi5kaWdpdHNcIikge1xuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZyhcIkdvdCBEVE1GIGRpZ2l0cztcIik7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5ldmVudC52YWx1ZVsxXSE9bnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiZHRtZmRpZ2l0XCJdPWV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5ldmVudC52YWx1ZVsxXTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImR0bWZkaWdpdFwiXT1cIjBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZyhcIk5vIERUTUYgZGlnaXRzO1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nLmRlYnVnKFwiTG9nOiB7fVwiLCBlKTtcbiAgICAgICAgcmV0dXJuIFwiZXJyb3IuZXhjZXB0aW9uXCI7XG4gICAgfVxuICAgIHJldHVybiBzZXNzaW9uW1wibXJmXCJdW1wiZHRtZmRpZ2l0XCJdO1xufVxuXG5mdW5jdGlvbiBjYWxsQW5zd2VyZWQoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcbiAgICBsZXQgbG9nID0gc2Vzc2lvbi5sb2c7XG5cbiAgICB0cnkgeyAgICAgICAgXG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjYWxsc3RhdGVcIl0gID0gXCJBTlNXRVJFRFwiO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYW5zd2VydGltZVwiXSAgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkvMTAwMCk7XG4gICAgICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLmV4Y2VwdGlvblwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tEaXNjb25uZWN0UmVhc29uKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHsgIFxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiQ29ubmVjdEVycm9yXCI7XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjb25uZWN0ZXJyb3J0aW1lXCJdICA9IE1hdGguZmxvb3IobmV3IERhdGUoKS8xMDAwKTsgICAgICAgIFxuICAgICAgICBsZXQgZXZlbnRzU3RhY2s9ZXZlbnRbJ2V2ZW50cy1zdGFjayddO1xuICAgICAgICBpZiggZXZlbnRzU3RhY2shPW51bGwgJiYgZXZlbnRzU3RhY2suc2l6ZSgpPjAgKXtcbiAgICAgICAgICAgIGZvcih2YXIgaT1ldmVudHNTdGFjay5zaXplKCktMTtpPj0wO2ktLSl7XG4gICAgICAgICAgICAgICAgaWYoIGV2ZW50c1N0YWNrLmdldChpKS5lcXVhbHMoXCJsZWcudGltZW91dFwiKSAmJiBpPj0oZXZlbnRzU3RhY2suc2l6ZSgpLTIpKXtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbi5sb2dpbmZvID0gc2Vzc2lvbi5sb2dpbmZvK1wiVElNRU9VVDtcIjsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLm1yZi5jb25uZWN0LnRpbWVvdXRcIjsgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLm1yZi5jb25uZWN0LmV4Y2VwdGlvblwiO1xuICAgIH0gICAgICAgIFxuICAgIHJldHVybiBcImVycm9yLm1yZi5jb25uZWN0Lm90aGVyc1wiO1xufVxuXG5mdW5jdGlvbiBzZXRyZWxlYXNlKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHsgIFxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiUmVsZWFzZWRcIjtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcInJlbGVhc2V0aW1lXCJdICA9IE1hdGguZmxvb3IobmV3IERhdGUoKS8xMDAwKTsgICAgICAgIFxuICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJMb2c6IHt9XCIsIGUpO1xuICAgICAgICByZXR1cm4gXCJlcnJvci5yZWxlYXNlXCI7XG4gICAgfSAgICAgICAgXG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDYWxsUm91dGluZyhzZXNzaW9uOmFueSxldmVudERhdGE6YW55LGxvY2FsUGFyYW1zOmFueSk6IGFueSB7XG4gbGV0IHJldDogUmVzdWx0Q29kZSA7XG4gICAgcmV0ID0gcmV0IHx8IHt9O1xuICAgIHJldC5yZXN1bHRDb2RlPVwic3VjY2Vzc1wiO1xuICAgIGxldCBzdGF0dXMyIDogc3RyaW5nO1xuICAgIGxldCBldmVudHMgOiBFdmVudHM7XG4gICAgZXZlbnRzID0gZXZlbnRzIHx8IHt9O1xuICAgIGV2ZW50cy5JbmZvUG9sbEV2ZW50PVwibnVsbFwiO1xuICAgIGV2ZW50cy5TdWNjZXNzUmVzcG9uc2VQb2xsRXZlbnQ9XCJudWxsXCI7XG4gICAgZXZlbnRzLlJhd0NvbnRlbnRQb2xsRXZlbnQ9XCJ0ZXN0L3Rlc3RcIjtcbiAgICBsZXQgaGVhZGVyVmFycyA6IEhlYWRlclZhcnM7XG4gICAgaGVhZGVyVmFycyA9IGhlYWRlclZhcnMgfHwge307XG4gICAgaGVhZGVyVmFycy5kaXNhYmxlU2VuZERlZmF1bHRSZWFzb24gPSBcIkRpc2FibGVkXCI7XG4gICAgaGVhZGVyVmFycy5kaXNhYmxlU2VuZE5vQW5zd2VyUmVhc29uID0gXCJEaXNhYmxlZFwiO1xuICAgIGxldCByaW5naW5nVG9uZXMgOiBbUmluZ2luZ1RvbmVdO1xuICAgIHJpbmdpbmdUb25lcyA9IHJpbmdpbmdUb25lcyB8fCBbXTtcbiAgICBsZXQgY29tZiA6IFJpbmdpbmdUb25lO1xuICAgIGNvbWYgPSBjb21mIHx8IHt9O1xuICAgIGNvbWYuYW5ub19uYW1lPVwiY29tZm9ydFwiO1xuICAgIGNvbWYuYW5ub190eXBlPUFubm90eXBlLkNPTk5FQ1Q7XG4gICAgbGV0IHJpbmcgOiBSaW5naW5nVG9uZTtcbiAgICByaW5nID0gcmluZyB8fCB7fTtcbiAgICByaW5nLmFubm9fbmFtZT1cInJpbmdpbmdcIjtcbiAgICByaW5nLmFubm9fdHlwZT1Bbm5vdHlwZS5SSU5HSU5HO1xuICAgIHJpbmdpbmdUb25lcy5wdXNoKGNvbWYsIHJpbmcpO1xuICAgIGxldCBjYXBhYmlsaXRpZXMgPSBzZXNzaW9uRGF0YS5pbkNhcGFiaWxpdGllcztcbiAgICBpZiggY2FwYWJpbGl0aWVzIT1udWxsKXtcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2goQ2FwYWJpbGl0aWVzLlBFTSk7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5GT1JLSU5HKTtcbiAgICAgICAgc2Vzc2lvbkRhdGEub3V0Q2FwYWJpbGl0aWVzID0gSlNPTi5zdHJpbmdpZnkoY2FwYWJpbGl0aWVzKTtcbiAgICB9XG4gICAgc2Vzc2lvbi5ldmVudHMgPSBKU09OLnN0cmluZ2lmeShldmVudHMpO1xuICAgIHNlc3Npb24uaGVhZGVycnVsZXZhcj1KU09OLnN0cmluZ2lmeShoZWFkZXJWYXJzKTtcbiAgICBzZXNzaW9uLmhlYWRlcnJ1bGVzc2VsZWN0ID0gXCJTaXBTZXJ2aWNlU3BlY2lmaWNSdWxlc1NldFwiO1xuICAgIHNlc3Npb24ucmluZ2luZ3RvbmVzID0gSlNPTi5zdHJpbmdpZnkocmluZ2luZ1RvbmVzKTtcbiAgICBzZXNzaW9uLnVwc3RyZWFtQ2FwYWJpbGl0aWVzPUpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICBzdGF0dXMyID0gXCJzdWNjZXNzXCI7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==