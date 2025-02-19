
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
    //this function builds the MRF XML and sends it. a lib is used as the handerl sends only a default one that is only using play.end play.amt wihtout dtmf.

    //default values
    let mrf_used = {
        "announcement":"default",
        "collect": {
            "cleardb":"true",
            "edt":"1s",
            "fdt":"3s",
            "idt":"2s",
            "iterate":"1"
        },
        "play": {
            "barge":"true",
            "maxtime":"11s",
            "interval":"1",
            "cleardb":"true",
            "offset":"0",
            "audioiterate":"1",
            "audiouri":"file:///appl/wav/tictac.wav"            
        },
        "pattern": {
            "digits": "[1-2]",
            "format": "regex"
        }            
    };

    //default XML header
    let content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<msml  version=\"1.1\">\n<dialogstart name=\"dialognamedefault\" target=\"conn:";
    //add the dynamic to that from MRF received to tag
    content = content + session["mrf"]["downStreamToTag"];
    content = content + "\" type=\"application/moml+xml\">\n";

    let collect=false;
    //if this is only a playannouncement
    if ( session["mrf"]["collect"] != null) {
        //collect is present. this is a prompt and collect
        //overwrite default values
        mrf_used["collect"] = session["mrf"]["collect"];
        mrf_used["pattern"] = session["mrf"]["pattern"];
        mrf_used["play"] = session["mrf"]["play"];
        collect=true;
    } else {
        //this is only a play announcement
        mrf_used["play"] = session["mrf"]["play"];
        collect=false;
    }

    if (collect==true) {
        content = content + "<collect  cleardb=\"" + session["mrf"]["collect"]["cleardb"] + "\" edt=\"" + session["mrf"]["collect"]["edt"]  + "\" fdt=\"" + session["mrf"]["collect"]["fdt"]  + "\" idt=\"" + session["mrf"]["collect"]["idt"]  + "\"  iterate=\"" + session["mrf"]["collect"]["iterate"]  + "\">\n";
        content = content + "<play barge=\"" + session["mrf"]["play"]["barge"] + "\"> maxtime=\"" + session["mrf"]["play"]["maxtime"] + "\" <audio uri=\"" + session["mrf"]["play"]["audiouri"] + "\"/> </play>\n";
        content = content + "<pattern digits=\"" + session["mrf"]["pattern"]["digits"] + "\">  <send target=\"source\" event=\"done\" namelist=\"dtmf.digits dtmf.end\"/> </pattern>\n";
        content = content + "<noinput> <send target=\"source\" event=\"done\" namelist=\"dtmf.end\"/> </noinput>\n";
        content = content + "<nomatch> <send target=\"source\" event=\"done\" namelist=\"dtmf.end\"/> </nomatch>\n";
        content = content + "</collect>\n";        
    } else {
        content = content + "<play barge=\"" + session["mrf"]["play"]["barge"] + "\" maxtime=\"" + session["mrf"]["play"]["maxtime"] + "\" interval=\"" + session["mrf"]["play"]["interval"] + "\" cleardb=\"" + session["mrf"]["play"]["cleardb"] + "\" offset=\"" + session["mrf"]["play"]["offset"] + "\">\n";
        content = content + "<audio uri=\"" + session["mrf"]["play"]["audiouri"] + "\"" + "\" iterate=\"" + session["mrf"]["play"]["iterate"] + "\"/>\n";
        content = content + "<playexit>\n<exit namelist=\"play.end play.amt\"/>\n</playexit>\n";
        content = content + "</play>";
    }
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
        //let content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<msml  version=\"1.1\">\n<dialogstart name=\"dialognamedefault\" target=\"conn:";
        //content = content + session["mrf"]["downStreamToTag"];
        //content = content + "\" type=\"application/moml+xml\">\n";
        //content = content + "<play interval=\"100ms\" iterate=\"1\" cleardb=\"true\" maxtime=\"50000ms\" barge=\"true\">\n <audio uri=\"file:///appl/wav/simpleplay.wav\"/>\n <playexit>\n   <exit namelist=\"play.end play.amt\"/>\n </playexit>\n</play>\n</dialogstart>\n</msml>";
        //OCMP response - groups not supported     <?xml version="1.0" encoding="UTF-8" standalone="yes"?><msml version="1.1">    <result response="402">        <description>Groups not supported</description>    </result></msml>
        //content = content + "<group topology=\"parallel\">\n";
        //content = content + "<play id=\"beforebargeplay\"><audio uri=\"file:///appl/wav/simpleplay.wav\" format=\"audio/wav\"  /><playexit><send target=\"collect\" event=\"starttimer\"/></playexit></play>\n";
        //content = content + "<collect cleardb=\"true\" fdt=\"5s\" idt=\"3s\"><pattern digits=\"x\"><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></pattern>\n";
        //OCMP response - only source supported     <?xml version="1.0" encoding="UTF-8" standalone="yes"?><msml version="1.1">    <result response="410">        <description>Only 'source' supported</description>    </result></msml>
        //content = content + "<detect><send target=\"play.beforebargeplay\" event=\"terminate\"/></detect>\n<noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput>\n<nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch>\n</collect>\n";
        //content = content + "<detect><send target=\"source\" event=\"terminate\"/></detect>\n<noinput><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></noinput>\n<nomatch><send target=\"source\" event=\"dialognamedefault\" namelist=\"dtmf.digits dtmf.end\"/></nomatch>\n</collect>\n";
        //content = content + "</group>\n";

        /* supported OCMP4.8 collect parameters
        id: an optional identifier that may be referenced elsewhere for sending events to this primitive.
        cleardb: a boolean indication of whether the buffer for digit collection should be cleared of any collected digits when the element is instantiated.  If set to false, any digits currently in the buffer MUST be immediately compared against the pattern elements.
        fdt: defines the first-digit timer value.  The first-digit timer is started when DTMF detection is initially invoked.  If no DTMF digits are detected during this initial interval, the <noinput> element MUST be invoked.  Optional, default is 0 s (wait forever for the first digit).
        idt: defines the inter-digit timer to be used when digits are being collected.  When specified, the timer is started when the first digit is detected and restarted on each subsequent digit. Timer expiration is applied to all patterns.  After that, if any patterns remain active and a nomatch element is specified, the nomatch is executed and DTMF input MUST terminate.  The idt attribute should only be used when digit collection is being performed.  Optional, default is 4 s.
        edt: defines the extra-digit timer value.  Specifies the length of time the media server MUST wait after a match to detect a termination key, if one is specified by the <pattern> element. Optional, default is 4 s.
        iterate: specifies the number of times the <pattern>, <noinput>,  and <nomatch> elements may be executed unless those elements specify differently.  The value "forever" MAY be used to indicate that these may be executed any number of times.  Default is once '1'.
        */
        /* supported OCMP4.8 play parameters
        id: an optional identifier that may be referenced elsewhere for sending events to the play primitive.
        interval: specifies the delay between stopping one iteration and beginning another.  The attribute has no effect if iterate is not also specified.  Default is no interval. 
        iterate: specifies the number of times the media specified by the child media elements should be played.  Each iteration is a  complete play of each of the child media elements in document order.  Defaults to once '1'.
        maxtime: defines the maximum allowed time for the <play> to complete.
            in garge=true the announcement is not stopped at maxtime
        barge: defines whether or not audio announcements may be  interrupted by DTMF detection during play-out.  The DTMF digit barging the announcement is stored in the digit buffer.  Valid values for barge are "true" or "false", and the attribute is mandatory.  When barge is applied to a conference target, DTMF digit detected from any conference participant MUST terminate the announcement.
        cleardb: defines whether or not the digit buffer is cleared, prior  to starting the announcement.  Valid values for cleardb are "true" or "false", and the attribute is mandatory. 
        offset: defines an offset, measured in units of time, where the <play> is to begin media generation.  Offset is only valid when all child media elements are <audio>.
        */

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

        if ( session["mrf"] != null) {
            if ( session["mrf"]["earlydialog"] != null) {
                log.debug("mrf earlydialog present and {}",session["mrf"]["earlydialog"]);
            } else {
                session["mrf"]["earlydialog"] = true;
                log.debug("mrf earlydialog not present - use default");
            }
        } else {
            log.debug("mrf object not present - use default");
            session["mrf"]["earlydialog"] = true;
        }	
        return session["mrf"]["earlydialog"];
    } catch (e) {
        log.debug("Log.inputvalidation: {}", e);
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
                    log.debug("handle200OKINFO:Recevied 200OKINFO and its ok");
                    session["mrf"]["dtmfdigits"] = "initialized";
                    return "received.OK";
                } else {
                    log.debug("handle200OKINFO:Recevied 200OKINFO and its NOT ok {}",event.SIP.content.json.msml.result.description);
                    return "received.NOK";
                }
            } else if (event.event["type"]=="INFO")  {
                //This is the incoming SIP INFO with either a timeout or nomatch or a match with the digit
                if( event.SIP.content.json.msml.event.name!=null && event.SIP.content.json.msml.event.name.size()>1 ){
                    // name[1] -> value[0]    and name[2] -> value[1]
                    for(var i=0;i<=event.SIP.content.json.msml.event.name.size()-1;i++){
                        log.debug("handle200OKINFO:index and event-name {} - {}", i, event.SIP.content.json.msml.event.name.get(i));       
                        if( event.SIP.content.json.msml.event.name.get(i).equals("dtmf.digits")) {
                            log.debug("handle200OKINFO:received dtmf.digits as {}", event.SIP.content.json.msml.event.value[i-1]);
                            session["mrf"]["dtmfdigits"]  = event.SIP.content.json.msml.event.value[i-1];
                        } else if ( event.SIP.content.json.msml.event.name.get(i).equals("dtmf.end")) {
                            log.debug("handle200OKINFO:received dtmf.end");            
                        } else if ( event.SIP.content.json.msml.event.name.get(i).equals("msml.dialog.exit")) {
                            log.debug("handle200OKINFO:received msml.dialog.exit - return with MRF dialog closed.");    
                            return "mrfdialog.closed";
                        } else {
                            log.debug("handle200OKINFO:received other event name");                            
                        }
                    }
                }
                log.debug("handle200OKINFO:Return the decoded dtmf.digits: {}",session["mrf"]["dtmfdigits"]);
                return session["mrf"]["dtmfdigits"];
            } else {
                return "unexpectedeventtype." + event.event["type"];
            }
        }
    } catch (e) {
        log.debug("handle200OKINFO:Log: {}", e);
        return "error.exception";
    }
}

function mrfreturn(session : any, event : any, localParams: any ){
    return "dtmf.digit." + session["mrf"]["dtmfdigits"];
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
