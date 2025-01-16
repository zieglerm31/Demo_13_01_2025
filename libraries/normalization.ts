
function normalization_1(session : any, event : any, localParams: any ){

let log = session.log;

try {

   let fromURI : string;
   session.s_initialSIP_lib = event;
   fromURI = event.SIP.From.address.uri.user;  //972507000118
   log.debug("Log From-1: {}", fromURI);
   session.s_normalizedNumber = fromURI.substring(3, 11);

   return "success";

} catch (e) {

   log.debug("Log: {}", e);
   return "error";
}


}


function createXML(session : any, event : any, localParams: any ){

   let x : string;
   session.s_xml1= "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sms><user><username>SendSMSwhileOff</username><password>Aa87!6179</password></user><source>019</source><destinations><phone>";

   session.s_xml2= "</phone></destinations><message>test</message><response>0</response></sms>";

   session.s_xml= session.xml1 + session.normalizedNumber + session.xml2;

   return "success";

}

function extractAndcompare(session : any, event : any, localParams: any ){

   let x : string;
   x= session.s_initialSIP_lib.SIP["P-Access-Network-Info"].cellId

   if (x.substring(0,5) =="42501")
   {
      session.w="1";
   }
   else if (x.substring(0,5) =="42503")
   {
      session.w="2";
   }
   else{
      session.w="3";
   }
    return session.w;
}


