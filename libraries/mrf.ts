
//DEPS:mrfinterfaces:LATEST

/*
//config is "mrf_announcements"
{
  "annoTest": {
    "maxtime": 1500,
    "path": "file:///tmp/annos/",
    "variable": "",
    "barge": 1,
    "prompt": "testAnno.wav",
    "dtmf": {
      "cleardb": 1,
      "idt": 1,
      "fdt": 1,
      "min": 1,
      "max": 1,
      "rtf": "*",
      "cancel": "#"
    },
    "annid": "annoPromptCollect",
    "interval": 100,
    "iterate": 1,
    "cleardb": 1
  },
}

*/

function inputvalidation(session : any, event : any, localParams: any ){
    let log = session.log;

    try {

        //sip invite is in #session["s_SIPInvite"]
        if ( session["s_SIPInvite"] != null ) {
            if( session["s_SIPInvite"]["event-type"]!==null && (session["s_SIPInvite"]["event-type"]==="sip" || session["s_SIPInvite"]["event-type"]==="occp")) {
                if( session["s_SIPInvite"]["event-name"]!==null && session["s_SIPInvite"]["event-name"] === "sip.callStart.NONE")
                    log.debug("got sip invite");
                else
                    return "error.input.sipinviteincorrecteventname";
            } else {
                return "error.input.sipinviteincorrecteventtype";
            }
        } else {
            return "error.input.sipinvitemissing";
        }

//interim
    return "true";




        //announcement string
        if ( event["announcement"] != null ) {
            log.debug("announcement: {}", event["announcement"]);
                session["mrf"]["announcement"] = event["announcement"];           
        } else {
            return "error.input.actionmissing";
        }

        //promptandcollect, playannouncement
        if ( (event["action"] != null) && ((event["action"]==="promptandcollect") || (event["action"]==="playannouncement")) ) {
            log.debug("action: {}", event["action"]);
            if ( event["action"]==="promptandcollect" ) 
                session["mrf"]["action"] = "promptandcollect";
            else if ( event["action"]==="playannouncement" ) 
                session["mrf"]["action"] = "playannouncement";
            else
                return "error.input.actionincorrect";            
        } else {
            return "error.input.actionmissing";
        }

        //early dialog is boolean true/false
        if ( event["earlydialog"] != null ) {
            log.debug("earlydialog: {}", event["earlydialog"]);
            if ( event["earlydialog"] === true) {
                session["mrf"]["earlydialog"] = true;
                return "true";
            } else if ( event["earlydialog"] === false) {
                session["mrf"]["earlydialog"] = false;
                return "false";
            } else {
                return "error.input.earlydialogincorrect";
            }
        } else {
            return "error.input.earlydialog";
        }
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}

function handle200OKINVITE(session:any,event:OCCPSIP.OCCPEvent,localParams:any) {
    let log = session.log;

    try {
        //the received event is now in localParams
        let eventData = localParams.message;
        //session.events = null;
        session["mrf"]["headerrulevar=null"];
        session["mrf"]["headerrulesselect"] = null;
        session["mrf"]["ringingtones"] = null;

        let pollAction : CallPollAction;
        pollAction = pollAction || {};
        pollAction.type = CallPollActionType.Accept;
        session["mrf"]["sendAction"] = JSON.stringify(pollAction);

        session["mrf"]["time200OKINVITE"]  = Math.floor(new Date()/1000);

        //save to tag
        let to : To = eventData.SIP.To;
        if( to!=null) {
            log.debug("received from MRF to tag:{}",to);
            session["mrf"]["callstate"]  = "MRFCONNECTED200OK";
            session["mrf"]["downStreamToTag"]=to.tag;
            return "success";
        } else {
            log.debug("received from MRF no to tag:{}",to);
            return "error.nototag";
        }
        
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}

function handle200OKINFO(session:any,event:OCCPSIP.Event,localParams:LocalParameters): any{
    let log = session.log;

    try {        
        session["mrf"]["time200OKINFO"]  = Math.floor(new Date()/1000);
        session["mrf"]["callstate"]  = "MRFCONNECTED";
        if (event.SIP.content.json.msml.event.name[2]!=null) {
            if (event.SIP.content.json.msml.event.name[2]=="dtmf.digits") {
                log.debug("Got DTMF digits;");
                if (event.SIP.content.json.msml.event.value[1]!=null) {
                    session["mrf"]["dtmfdigit"]=event.SIP.content.json.msml.event.value[1];                
                } else {
                    session["mrf"]["dtmfdigit"]="0";
                }
            } else {
                log.debug("No DTMF digits;");
            }
        }
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
    return session["mrf"]["dtmfdigit"];
}

function callAnswered(session : any, event : any, localParams: any ){
    let log = session.log;

    try {        
        session["mrf"]["callstate"]  = "ANSWERED";
        session["mrf"]["answertime"]  = Math.floor(new Date()/1000);
        return "success";
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}

function checkDisconnectReason(session : any, event : any, localParams: any ){
    let log = session.log;

    try {  
        session["mrf"]["callstate"]  = "ConnectError";
        session["mrf"]["connecterrortime"]  = Math.floor(new Date()/1000);        
        let eventsStack=event['events-stack'];
        if( eventsStack!=null && eventsStack.size()>0 ){
            for(var i=eventsStack.size()-1;i>=0;i--){
                if( eventsStack.get(i).equals("leg.timeout") && i>=(eventsStack.size()-2)){
                    session.loginfo = session.loginfo+"TIMEOUT;"; 
                    return "error.mrf.connect.timeout";               
                }
            }
        }
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.mrf.connect.exception";
    }        
    return "error.mrf.connect.others";
}

function setrelease(session : any, event : any, localParams: any ){
    let log = session.log;

    try {  
        session["mrf"]["callstate"]  = "Released";
        session["mrf"]["releasetime"]  = Math.floor(new Date()/1000);        
        return "success";
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.release";
    }        
}
