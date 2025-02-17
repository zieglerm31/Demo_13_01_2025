
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

      <?xml version="1.0" encoding="UTF-8"?>
      <msml version="1.1">
       <dialogstart target="conn:12345" name="12345">

         <collect fdt="10s" idt="16s">
            <play barge="true">
               <audio uri="file://prompt.wav"/>
            </play>
            <pattern digits="xxxx#">
               <send target="source" event="done"
                     namelist="dtmf.digits dtmf.end"/>
            </pattern>
            <noinput>
               <send target="source" event="done"
                     namelist="dtmf.end"/>
            </noinput>
            <nomatch>
               <send target="source" event="done"
                     namelist="dtmf.end"/>
            </nomatch>
         </collect>
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
        //OCMP response - groups not supported     <?xml version="1.0" encoding="UTF-8" standalone="yes"?><msml version="1.1">    <result response="402">        <description>Groups not supported</description>    </result></msml>
        //content = content + "<group topology=\"parallel\">\n";
        //content = content + "<play id=\"beforebargeplay\"><audio uri=\"file:///appl/wav/simpleplay.wav\" format=\"audio/wav\"  /><playexit><send target=\"collect\" event=\"starttimer\"/></playexit></play>\n";
        //content = content + "<collect cleardb=\"true\" fdt=\"5s\" idt=\"3s\"><pattern digits=\"x\"><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></pattern>\n";
        //OCMP response - only source supported     <?xml version="1.0" encoding="UTF-8" standalone="yes"?><msml version="1.1">    <result response="410">        <description>Only 'source' supported</description>    </result></msml>
        //content = content + "<detect><send target=\"play.beforebargeplay\" event=\"terminate\"/></detect>\n<noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput>\n<nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch>\n</collect>\n";
        //content = content + "<detect><send target=\"source\" event=\"terminate\"/></detect>\n<noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput>\n<nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch>\n</collect>\n";
        //content = content + "</group>\n";
    
    content = content + "<collect fdt=\"10s\" idt=\"16s\">\n";
    content = content + "<play barge=\"true\">\n         <audio uri=\"file:///appl/wav/simpleplay.wav\"/>\n      </play>\n";
    content = content + "<pattern digits=\"x\">\n         <send target=\"source\" event=\"done\"\n               namelist=\"dtmf.digits dtmf.end\"/>\n      </pattern>\n";
    content = content + "<noinput>\n         <send target=\"source\" event=\"done\"\n               namelist=\"dtmf.end\"/>\n      </noinput>\n";
    content = content + "<nomatch>\n         <send target=\"source\" event=\"done\"\n               namelist=\"dtmf.end\"/>\n      </nomatch>\n";
    content = content + "</collect>\n";
    content = content + "</dialogstart>\n</msml>\n";

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
        if (event["event-name"]=="sip.mediaOperationNotification.*")  {
            if (event.event["type"]=="200")  {
                //This is the 200ok for SIP INFO - no DTMF etc is present
                if (event.SIP.content.json.msml.result.description=="OK")  {
                    log.debug("Recevied 200OKINFO and its ok");
                    return "received.OK";
                } else {
                    log.debug("Recevied 200OKINFO and its NOT ok {}",event.SIP.content.json.msml.result.description);
                    return "received.NOK";
                }
            } else if (event.event["type"]=="INFO")  {
                //This is the incoming SIP INFO with either a timeout or nomatch or a match with the digit
                session["mrf"]["dtmfdigits"] = "initialized";
                if( event.SIP.content.json.msml.event.name!=null && event.SIP.content.json.msml.event.name.size()>1 ){
                    // name[1] -> value[0]    and name[2] -> value[1]
                    for(var i=1;i<=event.SIP.content.json.msml.event.name.size();i++){
                        if( event.SIP.content.json.msml.event.name.get(i).equals("dtmf.digits")) {
                            log.debug("received dtmf.digits as {}", event.SIP.content.json.msml.event.value[i-1]);
                            session["mrf"]["dtmfdigits"]  = event.SIP.content.json.msml.event.value[i-1];
                        } else {
                            log.debug("received dtmf.end");                            
                        }
                    }
                }
                log.debug("Return the decoded dtmf.digits: {}",session["mrf"]["dtmfdigits"];
                return session["mrf"]["dtmfdigits"];
            } else {
                return "unexpectedeventtype." + event.event["type"];
            }
        }
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
