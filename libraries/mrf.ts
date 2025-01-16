

function inputvalidation(session : any, event : any, localParams: any ){
    let log = session.log;

    try {
        if ( event["earlydialog"] != null ) {
            log.debug("earlydialog: {}", event["earlydialog"]);
        } else {
            return "error.input.earlydialog";
        }
        //promptandcollect, playannouncement
        if ( (event["action"] != null) && ((event["action"]==="promptandcollect") || (event["action"]==="playannouncement")) ) {
            log.debug("action: {}", event["action"]);
        } else {
            return "error.input.action";
        }
        return "success";
    } catch (e) {
        log.debug("Log: {}", e);
        return "error";
    }
}


