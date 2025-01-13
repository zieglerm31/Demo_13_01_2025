
function normalization_1(session : any, event : any, localParams: any ){

   let fromURI : string;
   fromURI = event.initial.SIP.From.address.uri.user;  //972507000118
   session.normalizedNumber = fromURI.substring(3, 11);
return true;
}


function createXML(session : any, event : any, localParams: any ){
   let x : string;
   session.xml1= "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sms><user><username>SendSMSwhileOff</username><password>Aa87!6179</password></user><source>019</source><destinations><phone>";

   session.xml2= "</phone></destinations><message>test</message><response>0</response></sms>";

   session.xml= session.xml1 + session.normalizedNumber + session.xml2;
return true;
}
