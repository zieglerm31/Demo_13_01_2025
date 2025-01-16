

function inputvalidation(session : any, event : any, localParams: any ){
    let log = session.log;

    try {
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


