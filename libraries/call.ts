
//DEPS:mrfinterfaces:LATEST

function armevents(sessionData:any,eventData:any,localParams:any): any {
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
    headerVars.privateServiceMode = "b2bua";

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

    sessionData.events = JSON.stringify(events);
    sessionData.headerrulevar=JSON.stringify(headerVars);
    sessionData.headerrulesselect = "SipServiceSpecificRulesSet";
    sessionData.ringingtones = JSON.stringify(ringingTones);
    sessionData.upstreamCapabilities=JSON.stringify([]);

    return "success";
}


function prepareCallPollAccept(session:any,event:OCCPSIP.OCCPEvent,localParams:any) {
    let log = session.log;

    try {
        let pollAction : CallPollAction;
        pollAction = pollAction || {};
        pollAction.type = CallPollActionType.Accept;
        session.sendAction = JSON.stringify(pollAction);

        return "success";        
    } catch (e) {
        log.debug("prepareCallPollAccept Log: {}", e);
        return "error.exception";
    }
}

function callended(session : any, eventData : any, localParams: any ){
    let ret: string = "success";
    /* enter here your code */

    let log : any = session.log;
    let callstateold = session.callstate;
    session.callstate  ="CLOSED";
    session.timeend= Math.floor(new Date()/1000);
    try {
        if (session.timeanswer!=null) {
            session.duration= session.timeend - session.timeanswer;
        } else {
            session.duration="not-started";    
        }
    } catch (e) {
        session.duration="exception";
    }

    log.error("Call_{}:State_{}->{}+",session["trace-skey"],callstateold,session.callstate);  
    session.loginfo = session.loginfo+session.callstate+";duration="+session.duration+";";   

    //prepare the LOG line - send to the log_sipdemo process 
    let logline : LOG = {};
    try{
            logline.MSISDN = session["s_normalizedNumber"];
            logline.ServiceSessionId = session["fsm-id"];
            logline.MsgType = "SIP.INVITE";
            logline.MsgSessionId = session["fsm-id"];
            logline.MsgId = session["s_initialSIP"]["SIP"]["Call-ID"]["value"]";
            logline.MsgDetails = "";
            logline.Servicedetails = "";
            logline.callAnswered = session.timeanswer;
            logline.callEnded = session.timeend;
            logline.callDuration = session.duration;
            session.loginfo="";

        //timestamp added by GW before it put it into the queue to RTE
        logline.GwEventTime = session.timeanswer; 

        let now : Date = new Date();
        let logDate : string = formatDate(now);
        let logTime : string = formatTime(now);
        logline.LogLineTime = logDate+ "." + logTime + "."+("000" + now.getMilliseconds().toString()).slice(-3);        
    } catch (e) {
        logline.MSISDN = "";
        logline.ServiceSessionId = "";
        logline.MsgType = "";
        logline.MsgSessionId = "";
        logline.MsgId = "";
        logline.MsgDetails = "";
        logline.Servicedetails = "error at CCRContinue logline";
        logline.callAnswered = "na";
        logline.callEnded = "na";
        logline.callDuration = "na";
        logline.LogLineTime = "";
    };
    logline.TraceLevel = session["fsm-trace-level"];    
    session.logline=logline;    
    return ret;
}


function getdisconnectreason(session:any,event any,localParams:any) {
    /*
    events-stack		[5]
    0	:	sip.callStart.NONE
    1:	sip.callPoll.SIPSuccessResponsePollEvent
    2	:	sip.callAnswered.SipCallLegUaClient
    3	:	leg.max_call_duration
    4	:	sip.callStart.DISCONNECTED    
    */
    let log = session.log;

    try {

        //prepare the LOG line - send to the log_sipdemo process 
        let logline : LOG = {};
        try{
            logline.MSISDN = session["s_normalizedNumber"];
            logline.ServiceSessionId = session["fsm-id"];
            logline.MsgType = "SIP.INVITE";
            logline.MsgSessionId = session["fsm-id"];
            logline.MsgId = session["s_initialSIP"]["SIP"]["Call-ID"]["value"]";
            logline.MsgDetails = "";
            logline.Servicedetails = "";
            logline.callAnswered = session.timeanswer;
            logline.callEnded = session.timeend;
            logline.callDuration = session.duration;
            session.loginfo="";

            //timestamp added by GW before it put it into the queue to RTE
            logline.GwEventTime = session.timeanswer; 

            let now : Date = new Date();
            let logDate : string = formatDate(now);
            let logTime : string = formatTime(now);
            logline.LogLineTime = logDate+ "." + logTime + "."+("000" + now.getMilliseconds().toString()).slice(-3);        
        } catch (e) {
            logline.MSISDN = "";
            logline.ServiceSessionId = "";
            logline.MsgType = "";
            logline.MsgSessionId = "";
            logline.MsgId = "";
            logline.MsgDetails = "";
            logline.Servicedetails = "error at CCRContinue logline";
            logline.callAnswered = "na";
            logline.callEnded = "na";
            logline.callDuration = "na";
            logline.LogLineTime = "";
        };
        logline.TraceLevel = session["fsm-trace-level"];    
        session.logline=logline;          

        let events=event["events-stack"].length;
        let index=events-1;
        if (event["events-stack"][index] === "leg.timeout") {
            return "reason.timeout";
        } else if (event["events-stack"][index] === "leg.max_call_duration") {
            return "reason.max_call_duration";
        } else {
            return "reason." + event["events-stack"][index];        
        }
        
    } catch (e) {
        log.debug("getdisconnectreason Log: {}", e);
        return "reason.exception";
    }
}




function setPreconditionForwadCallb2b(session:any,event:any,localParams:any): ResultCode {

    let ret: ResultCode ;
    ret = ret || {};
    ret.resultCode="success";
    
    let events : Events;
    events = events || {};

    
    events.SIPPollEvent="null";
    //typos in the below
    events.SIP18xInformatoinalEvent="null";
    events.SdpAnswerEvent="null";
    events.SIPReINVITEEvent="null";
    events.SDPOfferPollEvent="null";
    events.SipRingingPollEvent="null";
    events.SipSdpOfferPollEvent="null";
    events.SIPegClosedEvent="null";
    
    events.CallBeingForwardedPollEvent="null";
    events.SIPSdpAnswerPollEvent="null";

    events.RingingPollEvent="null";




    events.SIP18xAnswerEvent="null";
    events.SIPRingingPollEvent="null";
    //needs a handle
    events.InfoPollEvent="null";
    events.SuccessResponsePollEvent="null";
    events.RawContentPollEvent="test/test";
    session.events = JSON.stringify(events);  

    //let unsub = {"InfoPollEvent":"", "SuccessResponsePollEvent":"", "SIPRingingPollEvent":"", "RawContentPollEvent":""};
    //session.unsubscribeEvents=JSON.stringify(unsub);
    //let unsub = {"SIP18xAnswerEvent":""};
    //session.unsubscribeEvents=JSON.stringify(unsub);

    //Set headers for outgoing message
    let headerVars : HeaderVars;
    headerVars = headerVars || {};
    headerVars.disableSendDefaultReason = "Disabled";
    headerVars.disableSendNoAnswerReason = "Disabled";
    //Specify the Mode for the SNF, so SNF adds itself to Record-Route (needed for b2bua) or not (proxy)
    //not needed here - this is in SNF to apply some rules for b2b
    //headerVars.privateServiceMode = "b2bua";
    
    session.headerrulevar=JSON.stringify(headerVars);
    session.headerrulesselect = "SipServiceSpecificRulesSet";


    
    /*
    //this requires a Supported: 100Rel in the incoming request and sends a 183 to A with Require: 100Rel 
    let capabilities : any[] = [];
    capabilities.push(Capabilities.PEM);
    capabilities.push(Capabilities.REL1XX);
    capabilities.push(Capabilities.UPDATE);
    capabilities.push(Capabilities.FORKING);
    session.upstreamCapabilities = JSON.stringify(capabilities);
    */

    /*
    let capabilities = session.s_InitialCapabilities;
    if( capabilities!=null){
        capabilities.push(Capabilities.PEM);
        capabilities.push(Capabilities.FORKING);
        session.outCapabilities = JSON.stringify(capabilities);
    }
    */

    // session.ringingtones = JSON.stringify(ringingTones);

    return ret;
}


function checkSDPAnswerAction(session:any,event:any,localParams:any)  {
    //eventData is now last messgae
    let eventData = localParams.message;

    //add the poll actions (accept, forward, reject) to the callpoll ansewr event
    //InformationalEvent is a high-level interface typically specialized for concrete events. The CallUser is not required to take any action for this event, these are purely informational.
    //PollEvent is an event on which the CallUser is expected to take an action upon receiving the event. The action is usually by invoking the PollEvent methods accept, reject or forward.
    let pollAction : CallPollAction;
    pollAction = pollAction || {};
    //pollAction.type = CallPollActionType.Accept;
    pollAction.type = CallPollActionType.Reject;
    session.sendAction = JSON.stringify(pollAction);

    return true;
}


function modifydisposition(session:any,event:any,localParams:any) {
    let initialMsg = localParams.message;
    if (initialMsg["SIP"]["capabilities"] != null) {
        if (initialMsg["SIP"]["capabilities"].indexOf(Capabilities.FORKING) > -1) {
            //it is present. means the SIP header "Request-Disposition: no-fork" is NOT present. This instructs TAS to not send 183 before forwarding the INVITE
            let capabilities : any[] = [];
            
            //the below creates exception 
            //capabilities = initialMsg.SIP.capabilities;
            //capabilities.push(Capabilities.FORKING);
            //this would be remove
            //let index= initialMsg["SIP"]["capabilities"].indexOf(Capabilities.FORKING);
            //initialMsg["SIP"]["capabilities"].splice(index, 1); // 2nd parameter means remove one item only
            session.upstreamCapabilities = JSON.stringify(capabilities);    
        }
    }

    if (initialMsg["SIP"]["R-URI"]["value"] == "sip:972000019@172.31.11.142:5062") {
        session.destlist = ["sip:9900004@172.31.11.142:5062", "sip:9900099@172.31.11.142:5062"];
    }
    

    return true;
}


function setdestinationlist(session:any,event:any,localParams:any) {
    let initialMsg = localParams.message;

    if (initialMsg["SIP"]["R-URI"]["value"] == "sip:972000019@172.31.11.142:5062") {
        session.destlist = ["sip:9900011@172.31.11.142:5062", "sip:9900022@172.31.11.142:5064", "sip:9900033@172.31.11.142:5065"];
    }
    
    return true;
}
