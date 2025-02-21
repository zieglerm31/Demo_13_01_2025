
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



function extractAndCompare(session : any, event : any, localParams: any ){
   let log = session.log;

   try {
      let x : string;
      try {
         if ( session.s_initialSIP.SIP["P-Access-Network-Info"].cellId != null)
            x= session.s_initialSIP.SIP["P-Access-Network-Info"].cellId
         else 
            return "error.PANIcellid.null";
      } catch (e) {
         return "error.noPANIcellid.exception";
      }

      if (x.substring(0,5) =="42501") {
         session.w="1";
         session.ann_name="maxspeechtimeout.wav";
      } else if (x.substring(0,5) =="42503") {
         session.w="2";
         session.ann_name="help.wav";
      } else {
         session.w="3";
         session.ann_name="error.wav";
      }
      session.ann_name="file:///appl/wav/" + session.ann_name;
      return session.ann_name;
   } catch (e) {
      log.debug("extractAndCompare.Log: {}", e);
      return "error";
   }
}
