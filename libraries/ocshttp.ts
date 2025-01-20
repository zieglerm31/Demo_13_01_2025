


function createXML(session : any, event : any, localParams: any ){

   let x : string;
   try{
    session.s_xml1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sms><user><username>SendSMSwhileOff</username><password>Aa87!6179</password></user><source>019</source><destinations><phone>";
    session.s_xml2 = "</phone></destinations><message>test</message><response>0</response></sms>";
    session.s_xml = session.s_xml1 + session.s_normalizedNumber + session.s_xml2;
    return "success";
   } catch (e) {
    return "exception." + e;
   }

}

function checkHttpResponse(session : any, event : any, localParams: any ){
    let log : any = session.log;
    log.debug("Event received:{}",event);
    let bodyStr=event.body;
    session.restResponse =0;
    session.callstate  ="HTTPRESPONSE_INIT";
    session.CalledPartyOverwritten="sip:+4390123123@" + session.s_SIPInvite.SIP.Contact.address.uri.host + ":" + session.s_SIPInvite.SIP.Contact.address.uri.port;
    try {
        //let body = JSON.parse(bodyStr);

        //for the poc only
        //if RURI ends with 4 -> scenario4
        //if RURI ends with 5 -> scenario5
        //if RURI ends with 0 -> scenario0
        if ( session.s_SIPInvite.SIP["R-URI"].address.uri.user.endsWith("0") ) {
            return "scenario.0";
        } else if ( session.s_SIPInvite.SIP["R-URI"].address.uri.user.endsWith("4") ) {
            return "scenario.4";
        } else if ( session.s_SIPInvite.SIP["R-URI"].address.uri.user.endsWith("5") ) {
            return "scenario.5";
        } else {
            log.debug("checkHttpResponse.uri:{}",session.s_SIPInvite.SIP["R-URI"].address.uri.user);
            return "scenario.undefined";
        }
        

        let body = event.body;
        session.restResponse = body.status;
        if (session.restResponse=="0") {
            session.callstate  ="HTTPRESPONSE_CONNECT";   
            if (body.paramX.match(session.Callingipv4)) {
                session.CalledPartyOverwritten="sip:+4390123123@test.com"
                session.loginfo = session.loginfo+"ParamX.match.OverwriteDestination. connect to "+session.CalledPartyOverwritten+";"; 
            }  else if (body.paramY.match(session.Callingipv4)) {
                session.CalledPartyOverwritten="sip:+4390123123@test.com"
                session.loginfo = session.loginfo+"ParamY.match.OverwriteDestination. connect to "+session.CalledPartyOverwritten+";"; 
            }  else {                
                session.CalledPartyOverwritten=session.CalledParty;
                session.loginfo = session.loginfo+"Param.do not match.Connect to Initial CalledParty;"; 
            }
        } else if (session.restResponse=="4") {
            session.callstate ="HTTPRESPONSE_MRFPC";
        } else if (session.restResponse=="5") {
            session.callstate ="HTTPRESPONSE_MRFBYE";
        } else {
            session.callstate ="HTTPRESPONSE_UNKNOWN"+session.callstate;
        }
    } catch (e) {
        log.error("checkHttpResponse Exception {}",e);
        session.callstate  ="HTTPRESPONSE_EXCEPTION";
        session.restResponse = "exception." +e;
    };

    
    let callstateold :string = session.callstate;    
    log.error("Call_{}:State_{}->{}+",session["trace-skey"],callstateold,session.callstate);   
    session.loginfo = session.loginfo+session.callstate+";"; 

    //session.CalledPartyOverwritten=["sip:+4090123123@test.com","sip:+4090123124@test.com"];

    return "scenario."+session.restResponse;
}


function failureHttpResponse(session : any, event : any, localParams: any ){     
    let eventname: string=   event["event-name"];
    if (event["event-name"].startsWith("sip")) {
        session.loginfo = session.loginfo+"SIP-event received while waiting for Http response ("+eventname+");"; 
        //bypass the TERIMATE call handler as the call is already terminated
        return "sip.callended"
    } else if (event["event-name"].startsWith("http")) {
        session.loginfo = session.loginfo+"HttpFailure response received ("+event.body.status+");"; 
    } else {
        session.loginfo = session.loginfo+"No SIP or HTTP event received while waiting for Http response ("+eventname+");"; 
    }
    //return event.body.status;
    return "success";
}
