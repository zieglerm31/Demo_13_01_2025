
//DEPS:mrfinterfaces:LATEST

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

function handle200OKINFO(session : any, event : any, localParams: any ){
    let log = session.log;

    try {
        let ret: any = {"dummy":1,"event-name":"dummy","event-type":"dummy","session":session["fsm-id"]};
        session["mrf"]["callstate"]  = "MRFCONNECTED";
        return ret;
    } catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
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




