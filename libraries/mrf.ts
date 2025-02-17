
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

// XML in nexus-sip.3.0.1-1.jar
<?xml version="1.0" encoding="UTF-8"?> 
<msml version="1.1"> 
	<dialogstart name="annoPromptCollect" target="conn:ca458551" type="application/moml+xml"> 
		<play interval="100ms" iterate="1" cleardb="true" maxtime="50000ms" barge="true"> 
			<audio uri="file:///appl/wav/simpleplay.wav"/> 
			<playexit> 
				<exit namelist="play.end play.amt"/> 
			</playexit> 
		</play> 
	</dialogstart> 
</msml>
	  
// XML in nexus-sip.3.0.??? future - support prompt and collect
// pattern digits x is wildcard, xx are two wildcard digits, 1 is the digit one exactly, 
// <pattern digits="1" iterate="forever">  
using collect
<?xml version="1.0"?>
<msml version="1.1">
	<dialogstart target="conn:${TARGET}" type="application/moml+xml" name="dialognamedefault">
		<group topology="parallel">
			<play id="beforebargeplay">
				<audio uri="file:///appl/wav/simpleplay.wav" format="audio/wav"  />
				<playexit>
					<send target="collect" event="starttimer"/>
				</playexit>
			</play>
			<collect cleardb="true" fdt="5s" idt="3s">
				<pattern digits="x">
					<send target="source" event="dialognamedefault" namelist="dtmf.digits dtmf.end"/>
				</pattern>
				<detect>
					<send target="play.beforebargeplay" event="terminate"/>
				</detect>
				<noinput>
					<send target="source" event="dialognamedefault" namelist="dtmf.digits dtmf.end"/>
				</noinput>
				<nomatch>
					<send target="source" event="dialognamedefault" namelist="dtmf.digits dtmf.end"/>
				</nomatch>
			</collect>
		</group>
	</dialogstart>
</msml>





*/

function SendINFOPromptandCollect(session : any, event : any, localParams: any ){
    //set the xml conn id --> session["mrf"]["downStreamToTag"]

/*
    let outevent = {
    "callid": session["fsm-id"],
    "event-type": "sip",
    "queue": "TASV4_1",
    "id": 2,
    "timestamp": 1739784834563,
    "action": {
      "legaction": "performMediaOperation",
      "performMediaOperation": {
        "ContentType": "application/msml+xml",
        "Content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<msml  version=\"1.1\">\n<dialogstart name=\"annoPromptCollect\" target=\"conn:5b007c40\" type=\"application/moml+xml\">\n<play interval=\"100ms\" iterate=\"1\" cleardb=\"true\" maxtime=\"50000ms\" barge=\"true\">\n <audio uri=\"file:///appl/wav/simpleplay.wav\"/>\n <playexit>\n   <exit namelist=\"play.end play.amt\"/>\n </playexit>\n</play>\n</dialogstart>\n</msml>"
      },
      "type": 3
    },
    "event-name": "sip.media.playAnnouncement",
    "eventname": "callEarlyAnswered",
    "session": session["fsm-id"],
    "eventtime": 1739784834579
  };

  "Content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<msml  version=\"1.1\">\n<dialogstart name=\"annoPromptCollect\" target=\"conn:\"session["mrf"]["downStreamToTag"] type=\"application/moml+xml\">\n<play interval=\"100ms\" iterate=\"1\" cleardb=\"true\" maxtime=\"50000ms\" barge=\"true\">\n <audio uri=\"file:///appl/wav/simpleplay.wav\"/>\n <playexit>\n   <exit namelist=\"play.end play.amt\"/>\n </playexit>\n</play>\n</dialogstart>\n</msml>"
*/
    let content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<msml  version=\"1.1\">\n<dialogstart name=\"dialognamedefault\" target=\"conn:";
    content = content + session["mrf"]["downStreamToTag"];
    content = content + "\" type=\"application/moml+xml\">\n";
    //content = content + "<play interval=\"100ms\" iterate=\"1\" cleardb=\"true\" maxtime=\"50000ms\" barge=\"true\">\n <audio uri=\"file:///appl/wav/simpleplay.wav\"/>\n <playexit>\n   <exit namelist=\"play.end play.amt\"/>\n </playexit>\n</play>\n</dialogstart>\n</msml>";
    content = content + "<group topology=\"parallel\">";
    content = content + "<play id=\"beforebargeplay\"><audio uri=\"file:///appl/wav/simpleplay.wav\" format=\"audio/wav\"  /><playexit><send target=\"collect\" event=\"starttimer\"/></playexit></play>";
    content = content + "<collect cleardb=\"true\" fdt=\"5s\" idt=\"3s\"><pattern digits=\"x\"><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></pattern>";
    content = content + "<detect><send target=\"play.beforebargeplay\" event=\"terminate\"/></detect><noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput><nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch></collect>";
    content = content + "</group>";
    content = content + "</dialogstart></msml>";

    let outevent = {
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

function armMRFevents(sessionData:any,eventData:any,localParams:any): any {
 let ret: ResultCode ;

    let status2 : string;
    let events : Events;
    events = events || {};
    events.InfoPollEvent="null";
    events.SuccessResponsePollEvent="null";
    events.RawContentPollEvent="test/test";

    let headerVars : HeaderVars;
    headerVars = headerVars || {};
    headerVars.disableSendDefaultReason = "Disabled";
    headerVars.disableSendNoAnswerReason = "Disabled";

    let ringingTones : [RingingTone];
    ringingTones = ringingTones || [];
    let comf : RingingTone;
    comf = comf || {};
    comf.anno_name="comfort";
    comf.anno_type=Annotype.CONNECT;
    let ring : RingingTone;
    ring = ring || {};
    ring.anno_name="ringing";
    ring.anno_type=Annotype.RINGING;
    ringingTones.push(comf, ring);

    let capabilities = sessionData.inCapabilities;
    if( capabilities!=null){
        capabilities.push(Capabilities.PEM);
        capabilities.push(Capabilities.FORKING);
        capabilities.push(Capabilities.UPDATE);
        capabilities.push(Capabilities.INFO);
        sessionData.outCapabilities = JSON.stringify(capabilities);
    }

    sessionData.events = JSON.stringify(events);
    sessionData.headerrulevar=JSON.stringify(headerVars);
    sessionData.headerrulesselect = "SipServiceSpecificRulesSet";
    sessionData.ringingtones = JSON.stringify(ringingTones);
    sessionData.upstreamCapabilities=JSON.stringify([]);

    return "success";
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
        session.sendAction = JSON.stringify(pollAction);

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
        log.debug("handle200OKINVITE Log: {}", e);
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

function prepareCallRouting(session:any,eventData:any,localParams:any): any {
 let ret: ResultCode ;
    ret = ret || {};
    ret.resultCode="success";
    let status2 : string;
    let events : Events;
    events = events || {};
    events.InfoPollEvent="null";
    events.SuccessResponsePollEvent="null";
    events.RawContentPollEvent="test/test";
    let headerVars : HeaderVars;
    headerVars = headerVars || {};
    headerVars.disableSendDefaultReason = "Disabled";
    headerVars.disableSendNoAnswerReason = "Disabled";
    let ringingTones : [RingingTone];
    ringingTones = ringingTones || [];
    let comf : RingingTone;
    comf = comf || {};
    comf.anno_name="comfort";
    comf.anno_type=Annotype.CONNECT;
    let ring : RingingTone;
    ring = ring || {};
    ring.anno_name="ringing";
    ring.anno_type=Annotype.RINGING;
    ringingTones.push(comf, ring);
    let capabilities = sessionData.inCapabilities;
    if( capabilities!=null){
        capabilities.push(Capabilities.PEM);
        capabilities.push(Capabilities.FORKING);
        sessionData.outCapabilities = JSON.stringify(capabilities);
    }
    session.events = JSON.stringify(events);
    session.headerrulevar=JSON.stringify(headerVars);
    session.headerrulesselect = "SipServiceSpecificRulesSet";
    session.ringingtones = JSON.stringify(ringingTones);
    session.upstreamCapabilities=JSON.stringify([]);
    status2 = "success";
    return ret;
}
