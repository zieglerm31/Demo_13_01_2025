
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
        //the received event is now in localParams
        let eventData = localParams.message;
        //session.events = null;

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
        logline.MSISDN = session.CalledParty;
        logline.ServiceSessionId = session["fsm-id"];
        logline.MsgType = "SIP.INVITE";
        logline.MsgSessionId = session["fsm-id"];
        logline.MsgId = "callid";
        logline.MsgDetails = session.loginfo;
        logline.Servicedetails = "";
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
        logline.LogLineTime = "";
    };
    logline.TraceLevel = session["fsm-trace-level"];    
    session.logline=logline;    
    return ret;
}