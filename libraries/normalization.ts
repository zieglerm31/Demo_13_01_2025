
function normalization_1(session : any, event : any, localParams: any ){

   let x : string;
   x= session.initial.SIP.From.address.uri.user  //972507000118
   x.substring(3, 11);
   session.normalizedNumber=x;
return true;
}
