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
    content = content + "<play id=\"beforebargeplay\"><audio uri=\"file:///appl/wav/simpleplay.wav\" format=\"audio/wav\"  /><playexit><send target=\"collect\" event=\"starttimer\"/></playexit></play>\n";
    content = content + "<collect cleardb=\"true\" fdt=\"5s\" idt=\"3s\"><pattern digits=\"x\"><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></pattern>\n";
    content = content + "<detect><send target=\"source\" event=\"terminate\"/></detect>\n<noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput>\n<nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch>\n</collect>\n";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFXQSxJQUFLLFlBTUo7QUFORCxXQUFLLFlBQVk7SUFDZixpQ0FBaUIsQ0FBQTtJQUNqQixtQ0FBa0IsQ0FBQTtJQUNsQiw2Q0FBMkIsQ0FBQTtJQUMzQiwyQkFBUyxDQUFBO0lBQ1QsaUNBQWUsQ0FBQTtBQUNqQixDQUFDLEVBTkksWUFBWSxLQUFaLFlBQVksUUFNaEI7QUFzREQsSUFBSyxRQUdKO0FBSEQsV0FBSyxRQUFRO0lBQ1gsK0JBQW1CLENBQUE7SUFDbkIsNEJBQWdCLENBQUE7QUFDbEIsQ0FBQyxFQUhJLFFBQVEsS0FBUixRQUFRLFFBR1o7QUF1QkQsSUFBSyxrQkFJSjtBQUpELFdBQUssa0JBQWtCO0lBQ3RCLHVDQUFpQixDQUFBO0lBQ2pCLHlDQUFtQixDQUFBO0lBQ25CLHVDQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBSXRCO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3ZCLCtEQUFTLENBQUE7SUFDVCxtRUFBVyxDQUFBO0lBQ1gsdUVBQWEsQ0FBQTtBQUNkLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCO0FBZ0NELElBQUssd0JBRUo7QUFGRCxXQUFLLHdCQUF3QjtJQUM1QiwyRUFBK0MsQ0FBQTtBQUNoRCxDQUFDLEVBRkksd0JBQXdCLEtBQXhCLHdCQUF3QixRQUU1QjtBQUVELElBQUsseUJBRUo7QUFGRCxXQUFLLHlCQUF5QjtJQUM3QiwwREFBNkIsQ0FBQTtBQUM5QixDQUFDLEVBRkkseUJBQXlCLEtBQXpCLHlCQUF5QixRQUU3QjtBQW1GRCxDQUFDO0FBQ0QsQ0FBQztBQTZFRCxTQUFTLHdCQUF3QixDQUFDLE9BQWEsRUFBRSxLQUFXLEVBQUUsV0FBZ0I7SUEwQjFFLElBQUksT0FBTyxHQUFHLDZIQUE2SCxDQUFDO0lBQzVJ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b0IsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDcEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vL2ludGVyZmFjZSBkZWZpbml0aW9uXHJcblxyXG5pbnRlcmZhY2UgTGVnIHtcclxuICBhZGRyZXNzIDogc3RyaW5nO1xyXG4gIG5hbWUgOiBzdHJpbmdcclxufVxyXG5pbnRlcmZhY2UgQ2FsbCB7XHJcbiAgc3RhdGUgOiBudW1iZXJcclxufVxyXG5cclxuZW51bSBDYXBhYmlsaXRpZXMge1xyXG4gIFJFTDFYWCA9IFwiUkVMMVhYXCIsXHJcbiAgRk9SS0lORz0gXCJGT1JLSU5HXCIsXHJcbiAgUFJFQ09ORElUSU9OPVwiUFJFQ09ORElUSU9OXCIsXHJcbiAgUEVNPVwiUEVNXCIsXHJcbiAgVVBEQVRFPVwiVVBEQVRFXCJcclxufVxyXG5cclxuaW50ZXJmYWNlIE1lc3NhZ2Uge1xyXG4gIG1ldGhvZCA6IFtzdHJpbmddO1xyXG4gIHR5cGUgOiBbc3RyaW5nXTtcclxuICBib2R5IDogW3N0cmluZ11cclxufVxyXG5cclxuaW50ZXJmYWNlIFNJUCB7XHJcbiAgY2FwYWJpbGl0aWVzIDogW0NhcGFiaWxpdGllc107XHJcbiAgbWVzc2FnZSA6IE1lc3NhZ2VcclxufVxyXG5cclxuaW50ZXJmYWNlIENhbGxTdGFydCB7XHJcbiAgY29udGFjdCA6IHN0cmluZztcclxuICBjYXVzZTogc3RyaW5nO1xyXG4gIGxlZyA6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ2FsbFBvbGwge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0eXBlOiBzdHJpbmc7XHJcbiAgbGVnOiBzdHJpbmdcclxufVxyXG5cclxuaW50ZXJmYWNlIEV2ZW50IHtcclxuICBuYW1lIDogc3RyaW5nO1xyXG4gIGNhbGxTdGFydD8gOiBDYWxsU3RhcnQ7XHJcbiAgY2FsbFBvbGw/IDogQ2FsbFBvbGxcclxufVxyXG5cclxuXHJcbmludGVyZmFjZSBPQ0NQRXZlbnQge1xyXG4gIGNhbGxpZCA6IHN0cmluZztcclxuICBjYWxsIDogQ2FsbDtcclxuICBhcyA6IHN0cmluZztcclxuICBldmVudHRpbWUgOiBudW1iZXI7XHJcbiAgU0lQIDogU0lQO1xyXG4gIGV2ZW50OiBFdmVudFxyXG59XHJcblxyXG5pbnRlcmZhY2UgRXZlbnRzIHtcclxuICBTdWNjZXNzUmVzcG9uc2VQb2xsRXZlbnQ/IDogc3RyaW5nO1xyXG4gIFJhd0NvbnRlbnRQb2xsRXZlbnQ/IDogc3RyaW5nO1xyXG4gIEluZm9Qb2xsRXZlbnQ/OiBzdHJpbmdcclxufVxyXG4vKipcclxuICBEZWZpbmUgaGVhZGVyIHZhcmlhYmxlcyB1c2VkIGJ5IGFwcGxpY2F0aW9uXHJcbiovXHJcbmludGVyZmFjZSBIZWFkZXJWYXJzIHtcclxuICBkaXNhYmxlU2VuZERlZmF1bHRSZWFzb24/IDogc3RyaW5nO1xyXG4gIGRpc2FibGVTZW5kTm9BbnN3ZXJSZWFzb24/IDogc3RyaW5nXHJcbn1cclxuXHJcbmVudW0gQW5ub3R5cGUge1xyXG4gIENPTk5FQ1QgPSBcIkNPTk5FQ1RcIixcclxuICBSSU5HSU5HID0gXCJSSU5HXCJcclxufVxyXG5cclxuaW50ZXJmYWNlIFJpbmdpbmdUb25lIHtcclxuICBhbm5vX25hbWUgOiBzdHJpbmc7XHJcbiAgYW5ub190eXBlIDogQW5ub3R5cGVcclxufVxyXG5cclxuaW50ZXJmYWNlIFNlc3Npb24ge1xyXG4gIGxvZyA6IGFueTtcclxuICBpbkNhcGFiaWxpdGllcyA6IFtDYXBhYmlsaXRpZXNdO1xyXG4gIG91dENhcGFiaWxpdGllcz8gOiBzdHJpbmc7XHJcbiAgZXZlbnRzPyA6IHN0cmluZztcclxuICBoZWFkZXJydWxldmFyPyA6IHN0cmluZztcclxuICBoZWFkZXJydWxlc3NlbGVjdD8gOiBzdHJpbmc7XHJcbiAgcmluZ2luZ3RvbmVzPyA6IHN0cmluZztcclxuICBzZW5kQWN0aW9uPyA6IHN0cmluZyA7XHJcbiAgU0lQSGVscGVyIDogYW55O1xyXG4gIFNJUEluaXRpYWxJbnZpdGU/IDogYW55O1xyXG4gIFNJUE1lc3NhZ2U/IDogYW55O1xyXG4gIFNJUE1lc3NhZ2VUeXBlPyA6IGFueVxyXG59XHJcblxyXG5cclxuZW51bSBDYWxsUG9sbEFjdGlvblR5cGUge1xyXG4gQWNjZXB0ID0gXCJhY2NlcHRcIixcclxuIEZvcndhcmQgPSBcImZvcndhcmRcIixcclxuIFJlamVjdCA9IFwicmVqZWN0XCIsXHJcbn1cclxuXHJcbmVudW0gQ2FsbFN0YXJ0QWN0aW9uVHlwZSB7XHJcbiBBYm9ydCA9IDAsXHJcbiBGb3J3YXJkID0gMSxcclxuIFJlamVjdE1yZiA9IDJcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuIFNldCBhY3Rpb24gZm9yIENhbGxTdGFydCBldmVudFxyXG4qL1xyXG5pbnRlcmZhY2UgQ2FsbFN0YXJ0QWN0aW9uIHtcclxuIHR5cGUgOiBDYWxsU3RhcnRBY3Rpb25UeXBlO1xyXG4gZXJyb3Jjb2RlIDogbnVtYmVyO1xyXG4gY2F1c2UgOiBzdHJpbmcgO1xyXG4gdXJpIDogc3RyaW5nO1xyXG4gZWFybHltZWRpYSA6IG51bWJlcjtcclxuIGxlZ25hbWUgOiBzdHJpbmcgXHJcbn1cclxuXHJcbi8qKlxyXG4gU2V0IGFjdGlvbiBmb3IgQ2FsbFBvbGwgZXZlbnRcclxuKi9cclxuaW50ZXJmYWNlIENhbGxQb2xsQWN0aW9uIHtcclxuIHR5cGUgOiBDYWxsUG9sbEFjdGlvblR5cGVcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gQXBwbGljYXRpb24gY2FuIHNldCBhY3Rpb24gZm9yIGEgc3BlY2lmaWMgbGVnLCB0aGlzIGlzIGFwcGxpY2FibGUgZm9yIE1SRiBjb250YWN0XHJcbiAqL1xyXG5pbnRlcmZhY2UgTGVnQWN0aW9uIHtcclxuIHR5cGUgOiBDYWxsU3RhcnRBY3Rpb25UeXBlIDtcclxuIGxlZ2FjdGlvbiA6IHN0cmluZ1xyXG59XHJcblxyXG5lbnVtIE1lZGlhT3BlcmF0aW9uQWN0aW9uVHlwZSB7XHJcbiBQZXJmb3JtTWVkaWFPcGVyYXRpb24gPSBcInBlcmZvcm1NZWRpYU9wZXJhdGlvblwiXHJcbn1cclxuXHJcbmVudW0gTWVkaWFPcGVyYXRpb25Db250ZW50VHlwZSB7XHJcbiBNU01MID0gXCJhcHBsaWNhdGlvbi9tc21sK3htbFwiXHJcbn1cclxuXHJcbmludGVyZmFjZSBQZXJmb3JtTWVkaWFPcGVyYXRpb24ge1xyXG4gQ29udGVudFR5cGUgOiBNZWRpYU9wZXJhdGlvbkNvbnRlbnRUeXBlO1xyXG4gQ29udGVudCA6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTWVkaWFPcGVyYXRpb25BY3Rpb24ge1xyXG4gdHlwZSA6IG51bWJlcjtcclxuIGxlZ2FjdGlvbiA6IE1lZGlhT3BlcmF0aW9uQWN0aW9uVHlwZTtcclxuIHBlcmZvcm1NZWRpYU9wZXJhdGlvbiA6IFBlcmZvcm1NZWRpYU9wZXJhdGlvblxyXG59XHJcblxyXG5pbnRlcmZhY2UgQWN0aW9uIHtcclxuIGFjdGlvbiA6IGFueSBcclxufVxyXG5cclxuXHJcbmludGVyZmFjZSBIZWFkZXIge1xyXG4gaGVhZGVyIDogc3RyaW5nO1xyXG4gdmFsdWUgOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBRSGVhZGVyIHtcclxuIFByaXZhY3kgOiBzdHJpbmc7XHJcbiBSZWFzb24gOiBzdHJpbmcgO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUGFyYW1ldGVyIHtcclxuIHRyYW5zcG9ydCA6IHN0cmluZztcclxuIHVzZXIgOiBzdHJpbmcgO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVVJJIHtcclxuIHNjaGVtZSA6IHN0cmluZztcclxuIGF1dGhvcml0eSA6IHN0cmluZyA7XHJcbiBnciA6IHN0cmluZyA7XHJcbiBob3N0OiBzdHJpbmcgO1xyXG4gbHIgOiBzdHJpbmcgO1xyXG4gbWFkZHIgOiBzdHJpbmcgO1xyXG4gcG9ydCA6IG51bWJlciAgO1xyXG4gdXNlciA6IHN0cmluZyA7XHJcbiBwYXJhbWV0ZXJzIDogW1BhcmFtZXRlcl07XHJcbiBxaGVhZGVyIDogW1FIZWFkZXJdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQWRkcmVzcyB7XHJcbiBkaXNwbGF5TmFtZSA6IHN0cmluZztcclxuIHVyaSA6IFVSSSBcclxufVxyXG5cclxuaW50ZXJmYWNlIEhpc3RvcnlJbmZvIGltcGxlbWVudHMgSGVhZGVyIHtcclxuIGFkZHJlc3MgOiBBZGRyZXNzO1xyXG4gaW5kZXggOiBzdHJpbmdcclxufVxyXG5cclxuaW50ZXJmYWNlIFBBSSBpbXBsZW1lbnRzIEhlYWRlciAge1xyXG4gYWRkcmVzcyA6IEFkZHJlc3NcclxufVxyXG5cclxuaW50ZXJmYWNlIEZyb20gaW1wbGVtZW50cyBIZWFkZXIge1xyXG4gYWRkcmVzcyA6IEFkZHJlc3M7XHJcbiB0YWcgOiBzdHJpbmcgO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVG8gaW1wbGVtZW50cyBIZWFkZXIge1xyXG4gYWRkcmVzcyA6IEFkZHJlc3M7XHJcbiB0YWcgOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQQ1YgaW1wbGVtZW50cyBIZWFkZXIge1xyXG4gaWNpZF9nZW5lcmF0ZWRfYXQ6IHN0cmluZyA7XHJcbiBpY2lkX3ZhbHVlIDogc3RyaW5nIDtcclxuIG9haWQgOiBzdHJpbmc7XHJcbiB0YWlkIDogc3RyaW5nO1xyXG4gb3NpZCA6IHN0cmluZztcclxuIHRzaWQgOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBSZXN1bHRDb2RlIHtcclxuICByZXN1bHRDb2RlIDogc3RyaW5nIDtcclxufVxyXG5cbjsvL01BSU5CTE9DS1xuO1xuLypcbi8vY29uZmlnIGlzIFwibXJmX2Fubm91bmNlbWVudHNcIlxue1xuICBcImFubm9UZXN0XCI6IHtcbiAgICBcIm1heHRpbWVcIjogMTUwMCxcbiAgICBcInBhdGhcIjogXCJmaWxlOi8vL3RtcC9hbm5vcy9cIixcbiAgICBcInZhcmlhYmxlXCI6IFwiXCIsXG4gICAgXCJiYXJnZVwiOiAxLFxuICAgIFwicHJvbXB0XCI6IFwidGVzdEFubm8ud2F2XCIsXG4gICAgXCJkdG1mXCI6IHtcbiAgICAgIFwiY2xlYXJkYlwiOiAxLFxuICAgICAgXCJpZHRcIjogMSxcbiAgICAgIFwiZmR0XCI6IDEsXG4gICAgICBcIm1pblwiOiAxLFxuICAgICAgXCJtYXhcIjogMSxcbiAgICAgIFwicnRmXCI6IFwiKlwiLFxuICAgICAgXCJjYW5jZWxcIjogXCIjXCJcbiAgICB9LFxuICAgIFwiYW5uaWRcIjogXCJhbm5vUHJvbXB0Q29sbGVjdFwiLFxuICAgIFwiaW50ZXJ2YWxcIjogMTAwLFxuICAgIFwiaXRlcmF0ZVwiOiAxLFxuICAgIFwiY2xlYXJkYlwiOiAxXG4gIH0sXG59XG5cbi8vIFhNTCBpbiBuZXh1cy1zaXAuMy4wLjEtMS5qYXJcbjw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PiBcbjxtc21sIHZlcnNpb249XCIxLjFcIj4gXG5cdDxkaWFsb2dzdGFydCBuYW1lPVwiYW5ub1Byb21wdENvbGxlY3RcIiB0YXJnZXQ9XCJjb25uOmNhNDU4NTUxXCIgdHlwZT1cImFwcGxpY2F0aW9uL21vbWwreG1sXCI+IFxuXHRcdDxwbGF5IGludGVydmFsPVwiMTAwbXNcIiBpdGVyYXRlPVwiMVwiIGNsZWFyZGI9XCJ0cnVlXCIgbWF4dGltZT1cIjUwMDAwbXNcIiBiYXJnZT1cInRydWVcIj4gXG5cdFx0XHQ8YXVkaW8gdXJpPVwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlwiLz4gXG5cdFx0XHQ8cGxheWV4aXQ+IFxuXHRcdFx0XHQ8ZXhpdCBuYW1lbGlzdD1cInBsYXkuZW5kIHBsYXkuYW10XCIvPiBcblx0XHRcdDwvcGxheWV4aXQ+IFxuXHRcdDwvcGxheT4gXG5cdDwvZGlhbG9nc3RhcnQ+IFxuPC9tc21sPlxuXHQgIFxuLy8gWE1MIGluIG5leHVzLXNpcC4zLjAuPz8/IGZ1dHVyZSAtIHN1cHBvcnQgcHJvbXB0IGFuZCBjb2xsZWN0XG4vLyBwYXR0ZXJuIGRpZ2l0cyB4IGlzIHdpbGRjYXJkLCB4eCBhcmUgdHdvIHdpbGRjYXJkIGRpZ2l0cywgMSBpcyB0aGUgZGlnaXQgb25lIGV4YWN0bHksIFxuLy8gPHBhdHRlcm4gZGlnaXRzPVwiMVwiIGl0ZXJhdGU9XCJmb3JldmVyXCI+ICBcbnVzaW5nIGNvbGxlY3Rcbjw/eG1sIHZlcnNpb249XCIxLjBcIj8+XG48bXNtbCB2ZXJzaW9uPVwiMS4xXCI+XG5cdDxkaWFsb2dzdGFydCB0YXJnZXQ9XCJjb25uOiR7VEFSR0VUfVwiIHR5cGU9XCJhcHBsaWNhdGlvbi9tb21sK3htbFwiIG5hbWU9XCJkaWFsb2duYW1lZGVmYXVsdFwiPlxuXHRcdDxncm91cCB0b3BvbG9neT1cInBhcmFsbGVsXCI+XG5cdFx0XHQ8cGxheSBpZD1cImJlZm9yZWJhcmdlcGxheVwiPlxuXHRcdFx0XHQ8YXVkaW8gdXJpPVwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlwiIGZvcm1hdD1cImF1ZGlvL3dhdlwiICAvPlxuXHRcdFx0XHQ8cGxheWV4aXQ+XG5cdFx0XHRcdFx0PHNlbmQgdGFyZ2V0PVwiY29sbGVjdFwiIGV2ZW50PVwic3RhcnR0aW1lclwiLz5cblx0XHRcdFx0PC9wbGF5ZXhpdD5cblx0XHRcdDwvcGxheT5cblx0XHRcdDxjb2xsZWN0IGNsZWFyZGI9XCJ0cnVlXCIgZmR0PVwiNXNcIiBpZHQ9XCIzc1wiPlxuXHRcdFx0XHQ8cGF0dGVybiBkaWdpdHM9XCJ4XCI+XG5cdFx0XHRcdFx0PHNlbmQgdGFyZ2V0PVwic291cmNlXCIgZXZlbnQ9XCJkaWFsb2duYW1lZGVmYXVsdFwiIG5hbWVsaXN0PVwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcIi8+XG5cdFx0XHRcdDwvcGF0dGVybj5cblx0XHRcdFx0PGRldGVjdD5cblx0XHRcdFx0XHQ8c2VuZCB0YXJnZXQ9XCJwbGF5LmJlZm9yZWJhcmdlcGxheVwiIGV2ZW50PVwidGVybWluYXRlXCIvPlxuXHRcdFx0XHQ8L2RldGVjdD5cblx0XHRcdFx0PG5vaW5wdXQ+XG5cdFx0XHRcdFx0PHNlbmQgdGFyZ2V0PVwic291cmNlXCIgZXZlbnQ9XCJkaWFsb2duYW1lZGVmYXVsdFwiIG5hbWVsaXN0PVwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcIi8+XG5cdFx0XHRcdDwvbm9pbnB1dD5cblx0XHRcdFx0PG5vbWF0Y2g+XG5cdFx0XHRcdFx0PHNlbmQgdGFyZ2V0PVwic291cmNlXCIgZXZlbnQ9XCJkaWFsb2duYW1lZGVmYXVsdFwiIG5hbWVsaXN0PVwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcIi8+XG5cdFx0XHRcdDwvbm9tYXRjaD5cblx0XHRcdDwvY29sbGVjdD5cblx0XHQ8L2dyb3VwPlxuXHQ8L2RpYWxvZ3N0YXJ0PlxuPC9tc21sPlxuXG5cblxuXG5cbiovXG5cbmZ1bmN0aW9uIFNlbmRJTkZPUHJvbXB0YW5kQ29sbGVjdChzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xuICAgIC8vc2V0IHRoZSB4bWwgY29ubiBpZCAtLT4gc2Vzc2lvbltcIm1yZlwiXVtcImRvd25TdHJlYW1Ub1RhZ1wiXVxuXG4vKlxuICAgIGxldCBvdXRldmVudCA9IHtcbiAgICBcImNhbGxpZFwiOiBzZXNzaW9uW1wiZnNtLWlkXCJdLFxuICAgIFwiZXZlbnQtdHlwZVwiOiBcInNpcFwiLFxuICAgIFwicXVldWVcIjogXCJUQVNWNF8xXCIsXG4gICAgXCJpZFwiOiAyLFxuICAgIFwidGltZXN0YW1wXCI6IDE3Mzk3ODQ4MzQ1NjMsXG4gICAgXCJhY3Rpb25cIjoge1xuICAgICAgXCJsZWdhY3Rpb25cIjogXCJwZXJmb3JtTWVkaWFPcGVyYXRpb25cIixcbiAgICAgIFwicGVyZm9ybU1lZGlhT3BlcmF0aW9uXCI6IHtcbiAgICAgICAgXCJDb250ZW50VHlwZVwiOiBcImFwcGxpY2F0aW9uL21zbWwreG1sXCIsXG4gICAgICAgIFwiQ29udGVudFwiOiBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPG1zbWwgIHZlcnNpb249XFxcIjEuMVxcXCI+XFxuPGRpYWxvZ3N0YXJ0IG5hbWU9XFxcImFubm9Qcm9tcHRDb2xsZWN0XFxcIiB0YXJnZXQ9XFxcImNvbm46NWIwMDdjNDBcXFwiIHR5cGU9XFxcImFwcGxpY2F0aW9uL21vbWwreG1sXFxcIj5cXG48cGxheSBpbnRlcnZhbD1cXFwiMTAwbXNcXFwiIGl0ZXJhdGU9XFxcIjFcXFwiIGNsZWFyZGI9XFxcInRydWVcXFwiIG1heHRpbWU9XFxcIjUwMDAwbXNcXFwiIGJhcmdlPVxcXCJ0cnVlXFxcIj5cXG4gPGF1ZGlvIHVyaT1cXFwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlxcXCIvPlxcbiA8cGxheWV4aXQ+XFxuICAgPGV4aXQgbmFtZWxpc3Q9XFxcInBsYXkuZW5kIHBsYXkuYW10XFxcIi8+XFxuIDwvcGxheWV4aXQ+XFxuPC9wbGF5PlxcbjwvZGlhbG9nc3RhcnQ+XFxuPC9tc21sPlwiXG4gICAgICB9LFxuICAgICAgXCJ0eXBlXCI6IDNcbiAgICB9LFxuICAgIFwiZXZlbnQtbmFtZVwiOiBcInNpcC5tZWRpYS5wbGF5QW5ub3VuY2VtZW50XCIsXG4gICAgXCJldmVudG5hbWVcIjogXCJjYWxsRWFybHlBbnN3ZXJlZFwiLFxuICAgIFwic2Vzc2lvblwiOiBzZXNzaW9uW1wiZnNtLWlkXCJdLFxuICAgIFwiZXZlbnR0aW1lXCI6IDE3Mzk3ODQ4MzQ1NzlcbiAgfTtcblxuICBcIkNvbnRlbnRcIjogXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/Plxcbjxtc21sICB2ZXJzaW9uPVxcXCIxLjFcXFwiPlxcbjxkaWFsb2dzdGFydCBuYW1lPVxcXCJhbm5vUHJvbXB0Q29sbGVjdFxcXCIgdGFyZ2V0PVxcXCJjb25uOlxcXCJzZXNzaW9uW1wibXJmXCJdW1wiZG93blN0cmVhbVRvVGFnXCJdIHR5cGU9XFxcImFwcGxpY2F0aW9uL21vbWwreG1sXFxcIj5cXG48cGxheSBpbnRlcnZhbD1cXFwiMTAwbXNcXFwiIGl0ZXJhdGU9XFxcIjFcXFwiIGNsZWFyZGI9XFxcInRydWVcXFwiIG1heHRpbWU9XFxcIjUwMDAwbXNcXFwiIGJhcmdlPVxcXCJ0cnVlXFxcIj5cXG4gPGF1ZGlvIHVyaT1cXFwiZmlsZTovLy9hcHBsL3dhdi9zaW1wbGVwbGF5LndhdlxcXCIvPlxcbiA8cGxheWV4aXQ+XFxuICAgPGV4aXQgbmFtZWxpc3Q9XFxcInBsYXkuZW5kIHBsYXkuYW10XFxcIi8+XFxuIDwvcGxheWV4aXQ+XFxuPC9wbGF5PlxcbjwvZGlhbG9nc3RhcnQ+XFxuPC9tc21sPlwiXG4qL1xuICAgIGxldCBjb250ZW50ID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/Plxcbjxtc21sICB2ZXJzaW9uPVxcXCIxLjFcXFwiPlxcbjxkaWFsb2dzdGFydCBuYW1lPVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgdGFyZ2V0PVxcXCJjb25uOlwiO1xuICAgIGNvbnRlbnQgPSBjb250ZW50ICsgc2Vzc2lvbltcIm1yZlwiXVtcImRvd25TdHJlYW1Ub1RhZ1wiXTtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiXFxcIiB0eXBlPVxcXCJhcHBsaWNhdGlvbi9tb21sK3htbFxcXCI+XFxuXCI7XG4gICAgLy9jb250ZW50ID0gY29udGVudCArIFwiPHBsYXkgaW50ZXJ2YWw9XFxcIjEwMG1zXFxcIiBpdGVyYXRlPVxcXCIxXFxcIiBjbGVhcmRiPVxcXCJ0cnVlXFxcIiBtYXh0aW1lPVxcXCI1MDAwMG1zXFxcIiBiYXJnZT1cXFwidHJ1ZVxcXCI+XFxuIDxhdWRpbyB1cmk9XFxcImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcXFwiLz5cXG4gPHBsYXlleGl0PlxcbiAgIDxleGl0IG5hbWVsaXN0PVxcXCJwbGF5LmVuZCBwbGF5LmFtdFxcXCIvPlxcbiA8L3BsYXlleGl0PlxcbjwvcGxheT5cXG48L2RpYWxvZ3N0YXJ0PlxcbjwvbXNtbD5cIjtcblxuICAgIC8vT0NNUCByZXNwb25zZSAtIGdyb3VwcyBub3Qgc3VwcG9ydGVkICAgICA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJ5ZXNcIj8+PG1zbWwgdmVyc2lvbj1cIjEuMVwiPiAgICA8cmVzdWx0IHJlc3BvbnNlPVwiNDAyXCI+ICAgICAgICA8ZGVzY3JpcHRpb24+R3JvdXBzIG5vdCBzdXBwb3J0ZWQ8L2Rlc2NyaXB0aW9uPiAgICA8L3Jlc3VsdD48L21zbWw+XG4gICAgLy9jb250ZW50ID0gY29udGVudCArIFwiPGdyb3VwIHRvcG9sb2d5PVxcXCJwYXJhbGxlbFxcXCI+XFxuXCI7XG4gICAgY29udGVudCA9IGNvbnRlbnQgKyBcIjxwbGF5IGlkPVxcXCJiZWZvcmViYXJnZXBsYXlcXFwiPjxhdWRpbyB1cmk9XFxcImZpbGU6Ly8vYXBwbC93YXYvc2ltcGxlcGxheS53YXZcXFwiIGZvcm1hdD1cXFwiYXVkaW8vd2F2XFxcIiAgLz48cGxheWV4aXQ+PHNlbmQgdGFyZ2V0PVxcXCJjb2xsZWN0XFxcIiBldmVudD1cXFwic3RhcnR0aW1lclxcXCIvPjwvcGxheWV4aXQ+PC9wbGF5PlxcblwiO1xuICAgIGNvbnRlbnQgPSBjb250ZW50ICsgXCI8Y29sbGVjdCBjbGVhcmRiPVxcXCJ0cnVlXFxcIiBmZHQ9XFxcIjVzXFxcIiBpZHQ9XFxcIjNzXFxcIj48cGF0dGVybiBkaWdpdHM9XFxcInhcXFwiPjxzZW5kIHRhcmdldD1cXFwic291cmNlXFxcIiBldmVudD1cXFwiZGlhbG9nbmFtZWRlZmF1bHRcXFwiIG5hbWVsaXN0PVxcXCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFxcXCIvPjwvcGF0dGVybj5cXG5cIjtcbiAgICAvL09DTVAgcmVzcG9uc2UgLSBvbmx5IHNvdXJjZSBzdXBwb3J0ZWQgICAgIDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cInllc1wiPz48bXNtbCB2ZXJzaW9uPVwiMS4xXCI+ICAgIDxyZXN1bHQgcmVzcG9uc2U9XCI0MTBcIj4gICAgICAgIDxkZXNjcmlwdGlvbj5Pbmx5ICdzb3VyY2UnIHN1cHBvcnRlZDwvZGVzY3JpcHRpb24+ICAgIDwvcmVzdWx0PjwvbXNtbD5cbiAgICAvL2NvbnRlbnQgPSBjb250ZW50ICsgXCI8ZGV0ZWN0PjxzZW5kIHRhcmdldD1cXFwicGxheS5iZWZvcmViYXJnZXBsYXlcXFwiIGV2ZW50PVxcXCJ0ZXJtaW5hdGVcXFwiLz48L2RldGVjdD5cXG48bm9pbnB1dD48c2VuZCB0YXJnZXQ9XFxcInNvdXJjZVxcXCIgZXZlbnQ9XFxcImRpYWxvZ25hbWVkZWZhdWx0XFxcIiBuYW1lbGlzdD1cXFwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcXFwiLz48L25vaW5wdXQ+XFxuPG5vbWF0Y2g+PHNlbmQgdGFyZ2V0PVxcXCJzb3VyY2VcXFwiIGV2ZW50PVxcXCJkaWFsb2duYW1lZGVmYXVsdFxcXCIgbmFtZWxpc3Q9XFxcImR0bWYuZGlnaXRzIGR0bWYuZW5kXFxcIi8+PC9ub21hdGNoPlxcbjwvY29sbGVjdD5cXG5cIjtcbiAgICBjb250ZW50ID0gY29udGVudCArIFwiPGRldGVjdD48c2VuZCB0YXJnZXQ9XFxcInNvdXJjZVxcXCIgZXZlbnQ9XFxcInRlcm1pbmF0ZVxcXCIvPjwvZGV0ZWN0Plxcbjxub2lucHV0PjxzZW5kIHRhcmdldD1cXFwic291cmNlXFxcIiBldmVudD1cXFwiZGlhbG9nbmFtZWRlZmF1bHRcXFwiIG5hbWVsaXN0PVxcXCJkdG1mLmRpZ2l0cyBkdG1mLmVuZFxcXCIvPjwvbm9pbnB1dD5cXG48bm9tYXRjaD48c2VuZCB0YXJnZXQ9XFxcInNvdXJjZVxcXCIgZXZlbnQ9XFxcImRpYWxvZ25hbWVkZWZhdWx0XFxcIiBuYW1lbGlzdD1cXFwiZHRtZi5kaWdpdHMgZHRtZi5lbmRcXFwiLz48L25vbWF0Y2g+XFxuPC9jb2xsZWN0PlxcblwiO1xuICAgIC8vY29udGVudCA9IGNvbnRlbnQgKyBcIjwvZ3JvdXA+XFxuXCI7XG4gICAgY29udGVudCA9IGNvbnRlbnQgKyBcIjwvZGlhbG9nc3RhcnQ+XFxuPC9tc21sPlxcblwiO1xuXG4gICAgbGV0IG91dGV2ZW50ID0ge1xuICAgIFwiY2FsbGlkXCI6IHNlc3Npb25bXCJmc20taWRcIl0sXG4gICAgXCJldmVudC10eXBlXCI6IFwic2lwXCIsXG4gICAgXCJxdWV1ZVwiOiBcIlRBU1Y0XzFcIixcbiAgICBcImlkXCI6IDIsXG4gICAgXCJhY3Rpb25cIjoge1xuICAgICAgXCJsZWdhY3Rpb25cIjogXCJwZXJmb3JtTWVkaWFPcGVyYXRpb25cIixcbiAgICAgIFwicGVyZm9ybU1lZGlhT3BlcmF0aW9uXCI6IHtcbiAgICAgICAgXCJDb250ZW50VHlwZVwiOiBcImFwcGxpY2F0aW9uL21zbWwreG1sXCIsXG4gICAgICAgIFwiQ29udGVudFwiOiBjb250ZW50XG4gICAgICB9LFxuICAgICAgXCJ0eXBlXCI6IDNcbiAgICB9LFxuICAgIFwiZXZlbnQtbmFtZVwiOiBcInNpcC5tZWRpYS5wbGF5QW5ub3VuY2VtZW50XCIsXG4gICAgXCJldmVudG5hbWVcIjogXCJjYWxsRWFybHlBbnN3ZXJlZFwiLFxuICAgIFwic2Vzc2lvblwiOiBzZXNzaW9uW1wiZnNtLWlkXCJdXG4gIH07XG4gIHJldHVybiBvdXRldmVudDtcbn1cblxuXG5mdW5jdGlvbiBpbnB1dHZhbGlkYXRpb24oc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcbiAgICBsZXQgbG9nID0gc2Vzc2lvbi5sb2c7XG5cbiAgICB0cnkge1xuXG4gICAgICAgIC8vc2lwIGludml0ZSBpcyBpbiAjc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdXG4gICAgICAgIGlmICggc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdICE9IG51bGwgKSB7XG4gICAgICAgICAgICBpZiggc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtdHlwZVwiXSE9PW51bGwgJiYgKHNlc3Npb25bXCJzX1NJUEludml0ZVwiXVtcImV2ZW50LXR5cGVcIl09PT1cInNpcFwiIHx8IHNlc3Npb25bXCJzX1NJUEludml0ZVwiXVtcImV2ZW50LXR5cGVcIl09PT1cIm9jY3BcIikpIHtcbiAgICAgICAgICAgICAgICBpZiggc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtbmFtZVwiXSE9PW51bGwgJiYgc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtbmFtZVwiXSA9PT0gXCJzaXAuY2FsbFN0YXJ0Lk5PTkVcIilcbiAgICAgICAgICAgICAgICAgICAgbG9nLmRlYnVnKFwiZ290IHNpcCBpbnZpdGVcIik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5zaXBpbnZpdGVpbmNvcnJlY3RldmVudG5hbWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuc2lwaW52aXRlaW5jb3JyZWN0ZXZlbnR0eXBlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5zaXBpbnZpdGVtaXNzaW5nXCI7XG4gICAgICAgIH1cblxuLy9pbnRlcmltXG4gICAgcmV0dXJuIFwidHJ1ZVwiO1xuXG5cblxuXG4gICAgICAgIC8vYW5ub3VuY2VtZW50IHN0cmluZ1xuICAgICAgICBpZiAoIGV2ZW50W1wiYW5ub3VuY2VtZW50XCJdICE9IG51bGwgKSB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJhbm5vdW5jZW1lbnQ6IHt9XCIsIGV2ZW50W1wiYW5ub3VuY2VtZW50XCJdKTtcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYW5ub3VuY2VtZW50XCJdID0gZXZlbnRbXCJhbm5vdW5jZW1lbnRcIl07ICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmFjdGlvbm1pc3NpbmdcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHJvbXB0YW5kY29sbGVjdCwgcGxheWFubm91bmNlbWVudFxuICAgICAgICBpZiAoIChldmVudFtcImFjdGlvblwiXSAhPSBudWxsKSAmJiAoKGV2ZW50W1wiYWN0aW9uXCJdPT09XCJwcm9tcHRhbmRjb2xsZWN0XCIpIHx8IChldmVudFtcImFjdGlvblwiXT09PVwicGxheWFubm91bmNlbWVudFwiKSkgKSB7XG4gICAgICAgICAgICBsb2cuZGVidWcoXCJhY3Rpb246IHt9XCIsIGV2ZW50W1wiYWN0aW9uXCJdKTtcbiAgICAgICAgICAgIGlmICggZXZlbnRbXCJhY3Rpb25cIl09PT1cInByb21wdGFuZGNvbGxlY3RcIiApIFxuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJhY3Rpb25cIl0gPSBcInByb21wdGFuZGNvbGxlY3RcIjtcbiAgICAgICAgICAgIGVsc2UgaWYgKCBldmVudFtcImFjdGlvblwiXT09PVwicGxheWFubm91bmNlbWVudFwiICkgXG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImFjdGlvblwiXSA9IFwicGxheWFubm91bmNlbWVudFwiO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmFjdGlvbmluY29ycmVjdFwiOyAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuYWN0aW9ubWlzc2luZ1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9lYXJseSBkaWFsb2cgaXMgYm9vbGVhbiB0cnVlL2ZhbHNlXG4gICAgICAgIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSAhPSBudWxsICkge1xuICAgICAgICAgICAgbG9nLmRlYnVnKFwiZWFybHlkaWFsb2c6IHt9XCIsIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0pO1xuICAgICAgICAgICAgaWYgKCBldmVudFtcImVhcmx5ZGlhbG9nXCJdID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImVhcmx5ZGlhbG9nXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cnVlXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBldmVudFtcImVhcmx5ZGlhbG9nXCJdID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJlYXJseWRpYWxvZ1wiXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBcImZhbHNlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmVhcmx5ZGlhbG9naW5jb3JyZWN0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5lYXJseWRpYWxvZ1wiO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJMb2c6IHt9XCIsIGUpO1xuICAgICAgICByZXR1cm4gXCJlcnJvci5leGNlcHRpb25cIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFybU1SRmV2ZW50cyhzZXNzaW9uRGF0YTphbnksZXZlbnREYXRhOmFueSxsb2NhbFBhcmFtczphbnkpOiBhbnkge1xuIGxldCByZXQ6IFJlc3VsdENvZGUgO1xuXG4gICAgbGV0IHN0YXR1czIgOiBzdHJpbmc7XG4gICAgbGV0IGV2ZW50cyA6IEV2ZW50cztcbiAgICBldmVudHMgPSBldmVudHMgfHwge307XG4gICAgZXZlbnRzLkluZm9Qb2xsRXZlbnQ9XCJudWxsXCI7XG4gICAgZXZlbnRzLlN1Y2Nlc3NSZXNwb25zZVBvbGxFdmVudD1cIm51bGxcIjtcbiAgICBldmVudHMuUmF3Q29udGVudFBvbGxFdmVudD1cInRlc3QvdGVzdFwiO1xuXG4gICAgbGV0IGhlYWRlclZhcnMgOiBIZWFkZXJWYXJzO1xuICAgIGhlYWRlclZhcnMgPSBoZWFkZXJWYXJzIHx8IHt9O1xuICAgIGhlYWRlclZhcnMuZGlzYWJsZVNlbmREZWZhdWx0UmVhc29uID0gXCJEaXNhYmxlZFwiO1xuICAgIGhlYWRlclZhcnMuZGlzYWJsZVNlbmROb0Fuc3dlclJlYXNvbiA9IFwiRGlzYWJsZWRcIjtcblxuICAgIGxldCByaW5naW5nVG9uZXMgOiBbUmluZ2luZ1RvbmVdO1xuICAgIHJpbmdpbmdUb25lcyA9IHJpbmdpbmdUb25lcyB8fCBbXTtcbiAgICBsZXQgY29tZiA6IFJpbmdpbmdUb25lO1xuICAgIGNvbWYgPSBjb21mIHx8IHt9O1xuICAgIGNvbWYuYW5ub19uYW1lPVwiY29tZm9ydFwiO1xuICAgIGNvbWYuYW5ub190eXBlPUFubm90eXBlLkNPTk5FQ1Q7XG4gICAgbGV0IHJpbmcgOiBSaW5naW5nVG9uZTtcbiAgICByaW5nID0gcmluZyB8fCB7fTtcbiAgICByaW5nLmFubm9fbmFtZT1cInJpbmdpbmdcIjtcbiAgICByaW5nLmFubm9fdHlwZT1Bbm5vdHlwZS5SSU5HSU5HO1xuICAgIHJpbmdpbmdUb25lcy5wdXNoKGNvbWYsIHJpbmcpO1xuXG4gICAgbGV0IGNhcGFiaWxpdGllcyA9IHNlc3Npb25EYXRhLmluQ2FwYWJpbGl0aWVzO1xuICAgIGlmKCBjYXBhYmlsaXRpZXMhPW51bGwpe1xuICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChDYXBhYmlsaXRpZXMuUEVNKTtcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2goQ2FwYWJpbGl0aWVzLkZPUktJTkcpO1xuICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChDYXBhYmlsaXRpZXMuVVBEQVRFKTtcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2goQ2FwYWJpbGl0aWVzLklORk8pO1xuICAgICAgICBzZXNzaW9uRGF0YS5vdXRDYXBhYmlsaXRpZXMgPSBKU09OLnN0cmluZ2lmeShjYXBhYmlsaXRpZXMpO1xuICAgIH1cblxuICAgIHNlc3Npb25EYXRhLmV2ZW50cyA9IEpTT04uc3RyaW5naWZ5KGV2ZW50cyk7XG4gICAgc2Vzc2lvbkRhdGEuaGVhZGVycnVsZXZhcj1KU09OLnN0cmluZ2lmeShoZWFkZXJWYXJzKTtcbiAgICBzZXNzaW9uRGF0YS5oZWFkZXJydWxlc3NlbGVjdCA9IFwiU2lwU2VydmljZVNwZWNpZmljUnVsZXNTZXRcIjtcbiAgICBzZXNzaW9uRGF0YS5yaW5naW5ndG9uZXMgPSBKU09OLnN0cmluZ2lmeShyaW5naW5nVG9uZXMpO1xuICAgIHNlc3Npb25EYXRhLnVwc3RyZWFtQ2FwYWJpbGl0aWVzPUpTT04uc3RyaW5naWZ5KFtdKTtcblxuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbn1cblxuXG5mdW5jdGlvbiBoYW5kbGUyMDBPS0lOVklURShzZXNzaW9uOmFueSxldmVudDpPQ0NQU0lQLk9DQ1BFdmVudCxsb2NhbFBhcmFtczphbnkpIHtcbiAgICBsZXQgbG9nID0gc2Vzc2lvbi5sb2c7XG5cbiAgICB0cnkge1xuICAgICAgICAvL3RoZSByZWNlaXZlZCBldmVudCBpcyBub3cgaW4gbG9jYWxQYXJhbXNcbiAgICAgICAgbGV0IGV2ZW50RGF0YSA9IGxvY2FsUGFyYW1zLm1lc3NhZ2U7XG4gICAgICAgIC8vc2Vzc2lvbi5ldmVudHMgPSBudWxsO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiaGVhZGVycnVsZXZhcj1udWxsXCJdO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiaGVhZGVycnVsZXNzZWxlY3RcIl0gPSBudWxsO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wicmluZ2luZ3RvbmVzXCJdID0gbnVsbDtcblxuICAgICAgICBsZXQgcG9sbEFjdGlvbiA6IENhbGxQb2xsQWN0aW9uO1xuICAgICAgICBwb2xsQWN0aW9uID0gcG9sbEFjdGlvbiB8fCB7fTtcbiAgICAgICAgcG9sbEFjdGlvbi50eXBlID0gQ2FsbFBvbGxBY3Rpb25UeXBlLkFjY2VwdDtcbiAgICAgICAgc2Vzc2lvbi5zZW5kQWN0aW9uID0gSlNPTi5zdHJpbmdpZnkocG9sbEFjdGlvbik7XG5cbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcInRpbWUyMDBPS0lOVklURVwiXSAgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkvMTAwMCk7XG5cbiAgICAgICAgLy9zYXZlIHRvIHRhZ1xuICAgICAgICBsZXQgdG8gOiBUbyA9IGV2ZW50RGF0YS5TSVAuVG87XG4gICAgICAgIGlmKCB0byE9bnVsbCkge1xuICAgICAgICAgICAgbG9nLmRlYnVnKFwicmVjZWl2ZWQgZnJvbSBNUkYgdG8gdGFnOnt9XCIsdG8pO1xuICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImNhbGxzdGF0ZVwiXSAgPSBcIk1SRkNPTk5FQ1RFRDIwME9LXCI7XG4gICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiZG93blN0cmVhbVRvVGFnXCJdPXRvLnRhZztcbiAgICAgICAgICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhcInJlY2VpdmVkIGZyb20gTVJGIG5vIHRvIHRhZzp7fVwiLHRvKTtcbiAgICAgICAgICAgIHJldHVybiBcImVycm9yLm5vdG90YWdcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcImhhbmRsZTIwME9LSU5WSVRFIExvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLmV4Y2VwdGlvblwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlMjAwT0tJTkZPKHNlc3Npb246YW55LGV2ZW50Ok9DQ1BTSVAuRXZlbnQsbG9jYWxQYXJhbXM6TG9jYWxQYXJhbWV0ZXJzKTogYW55e1xuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcblxuICAgIHRyeSB7ICAgICAgICBcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcInRpbWUyMDBPS0lORk9cIl0gID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLzEwMDApO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiTVJGQ09OTkVDVEVEXCI7XG4gICAgICAgIGlmIChldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQubmFtZVsyXSE9bnVsbCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LlNJUC5jb250ZW50Lmpzb24ubXNtbC5ldmVudC5uYW1lWzJdPT1cImR0bWYuZGlnaXRzXCIpIHtcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJHb3QgRFRNRiBkaWdpdHM7XCIpO1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQudmFsdWVbMV0hPW51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImR0bWZkaWdpdFwiXT1ldmVudC5TSVAuY29udGVudC5qc29uLm1zbWwuZXZlbnQudmFsdWVbMV07ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJkdG1mZGlnaXRcIl09XCIwXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJObyBEVE1GIGRpZ2l0cztcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XG4gICAgICAgIHJldHVybiBcImVycm9yLmV4Y2VwdGlvblwiO1xuICAgIH1cbiAgICByZXR1cm4gc2Vzc2lvbltcIm1yZlwiXVtcImR0bWZkaWdpdFwiXTtcbn1cblxuZnVuY3Rpb24gY2FsbEFuc3dlcmVkKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG4gICAgdHJ5IHsgICAgICAgIFxuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY2FsbHN0YXRlXCJdICA9IFwiQU5TV0VSRURcIjtcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImFuc3dlcnRpbWVcIl0gID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLzEwMDApO1xuICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJMb2c6IHt9XCIsIGUpO1xuICAgICAgICByZXR1cm4gXCJlcnJvci5leGNlcHRpb25cIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrRGlzY29ubmVjdFJlYXNvbihzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcblxuICAgIHRyeSB7ICBcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImNhbGxzdGF0ZVwiXSAgPSBcIkNvbm5lY3RFcnJvclwiO1xuICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiY29ubmVjdGVycm9ydGltZVwiXSAgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkvMTAwMCk7ICAgICAgICBcbiAgICAgICAgbGV0IGV2ZW50c1N0YWNrPWV2ZW50WydldmVudHMtc3RhY2snXTtcbiAgICAgICAgaWYoIGV2ZW50c1N0YWNrIT1udWxsICYmIGV2ZW50c1N0YWNrLnNpemUoKT4wICl7XG4gICAgICAgICAgICBmb3IodmFyIGk9ZXZlbnRzU3RhY2suc2l6ZSgpLTE7aT49MDtpLS0pe1xuICAgICAgICAgICAgICAgIGlmKCBldmVudHNTdGFjay5nZXQoaSkuZXF1YWxzKFwibGVnLnRpbWVvdXRcIikgJiYgaT49KGV2ZW50c1N0YWNrLnNpemUoKS0yKSl7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb24ubG9naW5mbyA9IHNlc3Npb24ubG9naW5mbytcIlRJTUVPVVQ7XCI7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5tcmYuY29ubmVjdC50aW1lb3V0XCI7ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoXCJMb2c6IHt9XCIsIGUpO1xuICAgICAgICByZXR1cm4gXCJlcnJvci5tcmYuY29ubmVjdC5leGNlcHRpb25cIjtcbiAgICB9ICAgICAgICBcbiAgICByZXR1cm4gXCJlcnJvci5tcmYuY29ubmVjdC5vdGhlcnNcIjtcbn1cblxuZnVuY3Rpb24gc2V0cmVsZWFzZShzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcblxuICAgIHRyeSB7ICBcbiAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImNhbGxzdGF0ZVwiXSAgPSBcIlJlbGVhc2VkXCI7XG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJyZWxlYXNldGltZVwiXSAgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkvMTAwMCk7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nLmRlYnVnKFwiTG9nOiB7fVwiLCBlKTtcbiAgICAgICAgcmV0dXJuIFwiZXJyb3IucmVsZWFzZVwiO1xuICAgIH0gICAgICAgIFxufVxuXG5mdW5jdGlvbiBwcmVwYXJlQ2FsbFJvdXRpbmcoc2Vzc2lvbjphbnksZXZlbnREYXRhOmFueSxsb2NhbFBhcmFtczphbnkpOiBhbnkge1xuIGxldCByZXQ6IFJlc3VsdENvZGUgO1xuICAgIHJldCA9IHJldCB8fCB7fTtcbiAgICByZXQucmVzdWx0Q29kZT1cInN1Y2Nlc3NcIjtcbiAgICBsZXQgc3RhdHVzMiA6IHN0cmluZztcbiAgICBsZXQgZXZlbnRzIDogRXZlbnRzO1xuICAgIGV2ZW50cyA9IGV2ZW50cyB8fCB7fTtcbiAgICBldmVudHMuSW5mb1BvbGxFdmVudD1cIm51bGxcIjtcbiAgICBldmVudHMuU3VjY2Vzc1Jlc3BvbnNlUG9sbEV2ZW50PVwibnVsbFwiO1xuICAgIGV2ZW50cy5SYXdDb250ZW50UG9sbEV2ZW50PVwidGVzdC90ZXN0XCI7XG4gICAgbGV0IGhlYWRlclZhcnMgOiBIZWFkZXJWYXJzO1xuICAgIGhlYWRlclZhcnMgPSBoZWFkZXJWYXJzIHx8IHt9O1xuICAgIGhlYWRlclZhcnMuZGlzYWJsZVNlbmREZWZhdWx0UmVhc29uID0gXCJEaXNhYmxlZFwiO1xuICAgIGhlYWRlclZhcnMuZGlzYWJsZVNlbmROb0Fuc3dlclJlYXNvbiA9IFwiRGlzYWJsZWRcIjtcbiAgICBsZXQgcmluZ2luZ1RvbmVzIDogW1JpbmdpbmdUb25lXTtcbiAgICByaW5naW5nVG9uZXMgPSByaW5naW5nVG9uZXMgfHwgW107XG4gICAgbGV0IGNvbWYgOiBSaW5naW5nVG9uZTtcbiAgICBjb21mID0gY29tZiB8fCB7fTtcbiAgICBjb21mLmFubm9fbmFtZT1cImNvbWZvcnRcIjtcbiAgICBjb21mLmFubm9fdHlwZT1Bbm5vdHlwZS5DT05ORUNUO1xuICAgIGxldCByaW5nIDogUmluZ2luZ1RvbmU7XG4gICAgcmluZyA9IHJpbmcgfHwge307XG4gICAgcmluZy5hbm5vX25hbWU9XCJyaW5naW5nXCI7XG4gICAgcmluZy5hbm5vX3R5cGU9QW5ub3R5cGUuUklOR0lORztcbiAgICByaW5naW5nVG9uZXMucHVzaChjb21mLCByaW5nKTtcbiAgICBsZXQgY2FwYWJpbGl0aWVzID0gc2Vzc2lvbkRhdGEuaW5DYXBhYmlsaXRpZXM7XG4gICAgaWYoIGNhcGFiaWxpdGllcyE9bnVsbCl7XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKENhcGFiaWxpdGllcy5QRU0pO1xuICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChDYXBhYmlsaXRpZXMuRk9SS0lORyk7XG4gICAgICAgIHNlc3Npb25EYXRhLm91dENhcGFiaWxpdGllcyA9IEpTT04uc3RyaW5naWZ5KGNhcGFiaWxpdGllcyk7XG4gICAgfVxuICAgIHNlc3Npb24uZXZlbnRzID0gSlNPTi5zdHJpbmdpZnkoZXZlbnRzKTtcbiAgICBzZXNzaW9uLmhlYWRlcnJ1bGV2YXI9SlNPTi5zdHJpbmdpZnkoaGVhZGVyVmFycyk7XG4gICAgc2Vzc2lvbi5oZWFkZXJydWxlc3NlbGVjdCA9IFwiU2lwU2VydmljZVNwZWNpZmljUnVsZXNTZXRcIjtcbiAgICBzZXNzaW9uLnJpbmdpbmd0b25lcyA9IEpTT04uc3RyaW5naWZ5KHJpbmdpbmdUb25lcyk7XG4gICAgc2Vzc2lvbi51cHN0cmVhbUNhcGFiaWxpdGllcz1KU09OLnN0cmluZ2lmeShbXSk7XG4gICAgc3RhdHVzMiA9IFwic3VjY2Vzc1wiO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=