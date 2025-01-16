"use strict";
;
function inputvalidation(session, event, localParams) {
    var log = session.log;
    try {
        if (session["s_SIPInvite"] != null) {
            if (session["s_SIPInvite"]["event-type"] !== null && (session["s_SIPInvite"]["event-type"] === "sip" || session["s_SIPInvite"]["event-type"] === "occp")) {
                if (session["s_SIPInvite"]["event-name"] !== null && session["s_SIPInvite"]["event-name"] === "sip.callStart.NONE")
                    log.debug("got sip invite");
                else
                    return "error.input.sipinviteincorrecteventname";
            }
            else {
                return "error.input.sipinviteincorrecteventtype";
            }
        }
        else {
            return "error.input.sipinvitemissing";
        }
        if ((event["action"] != null) && ((event["action"] === "promptandcollect") || (event["action"] === "playannouncement"))) {
            log.debug("action: {}", event["action"]);
            if (event["action"] === "promptandcollect")
                session["mrf"]["action"] = "promptandcollect";
            else if (event["action"] === "playannouncement")
                session["mrf"]["action"] = "playannouncement";
            else
                return "error.input.actionincorrect";
        }
        else {
            return "error.input.actionmissing";
        }
        if (event["earlydialog"] != null) {
            log.debug("earlydialog: {}", event["earlydialog"]);
            if (event["earlydialog"] === true) {
                session["mrf"]["earlydialog"] = true;
                return "true";
            }
            else if (event["earlydialog"] === false) {
                session["mrf"]["earlydialog"] = false;
                return "false";
            }
            else {
                return "error.input.earlydialogincorrect";
            }
        }
        else {
            return "error.input.earlydialog";
        }
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}
function handle200OKINFO(session, event, localParams) {
    var log = session.log;
    try {
        var ret = { "dummy": 1, "event-name": "dummy", "event-type": "dummy", "session": session["fsm-id"] };
        session["mrf"]["callstate"] = "MRFCONNECTED";
        return ret;
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error.exception";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUNqRSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRXRCLElBQUk7UUFHQSxJQUFLLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLEVBQUc7WUFDbEMsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFHLEtBQUssSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUcsTUFBTSxDQUFDLEVBQUU7Z0JBQ2hKLElBQUksT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFHLElBQUksSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssb0JBQW9CO29CQUM1RyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O29CQUU1QixPQUFPLHlDQUF5QyxDQUFDO2FBQ3hEO2lCQUFNO2dCQUNILE9BQU8seUNBQXlDLENBQUM7YUFDcEQ7U0FDSjthQUFNO1lBQ0gsT0FBTyw4QkFBOEIsQ0FBQztTQUN6QztRQUdELElBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFHLGtCQUFrQixDQUFDLENBQUMsRUFBRztZQUNuSCxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBRyxrQkFBa0I7Z0JBQ3JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztpQkFDN0MsSUFBSyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUcsa0JBQWtCO2dCQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7O2dCQUU5QyxPQUFPLDZCQUE2QixDQUFDO1NBQzVDO2FBQU07WUFDSCxPQUFPLDJCQUEyQixDQUFDO1NBQ3RDO1FBR0QsSUFBSyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxFQUFHO1lBQ2hDLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxPQUFPLE1BQU0sQ0FBQzthQUNqQjtpQkFBTSxJQUFLLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLEVBQUU7Z0JBQ3hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RDLE9BQU8sT0FBTyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNILE9BQU8sa0NBQWtDLENBQUM7YUFDN0M7U0FDSjthQUFNO1lBQ0gsT0FBTyx5QkFBeUIsQ0FBQztTQUNwQztLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLGlCQUFpQixDQUFDO0tBQzVCO0FBQ0wsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLE9BQWEsRUFBRSxLQUFXLEVBQUUsV0FBZ0I7SUFDakUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUV0QixJQUFJO1FBQ0EsSUFBSSxHQUFHLEdBQVEsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUM7UUFDakcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFJLGNBQWMsQ0FBQztRQUM5QyxPQUFPLEdBQUcsQ0FBQztLQUNkO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLGlCQUFpQixDQUFDO0tBQzVCO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vTUFJTkJMT0NLXG47XHJcbmZ1bmN0aW9uIGlucHV0dmFsaWRhdGlvbihzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xyXG4gICAgbGV0IGxvZyA9IHNlc3Npb24ubG9nO1xyXG5cclxuICAgIHRyeSB7XHJcblxyXG4gICAgICAgIC8vc2lwIGludml0ZSBpcyBpbiAjc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdXHJcbiAgICAgICAgaWYgKCBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl0gIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgaWYoIHNlc3Npb25bXCJzX1NJUEludml0ZVwiXVtcImV2ZW50LXR5cGVcIl0hPT1udWxsICYmIChzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC10eXBlXCJdPT09XCJzaXBcIiB8fCBzZXNzaW9uW1wic19TSVBJbnZpdGVcIl1bXCJldmVudC10eXBlXCJdPT09XCJvY2NwXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiggc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtbmFtZVwiXSE9PW51bGwgJiYgc2Vzc2lvbltcInNfU0lQSW52aXRlXCJdW1wiZXZlbnQtbmFtZVwiXSA9PT0gXCJzaXAuY2FsbFN0YXJ0Lk5PTkVcIilcclxuICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJnb3Qgc2lwIGludml0ZVwiKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5zaXBpbnZpdGVpbmNvcnJlY3RldmVudG5hbWVcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LnNpcGludml0ZWluY29ycmVjdGV2ZW50dHlwZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuc2lwaW52aXRlbWlzc2luZ1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wcm9tcHRhbmRjb2xsZWN0LCBwbGF5YW5ub3VuY2VtZW50XHJcbiAgICAgICAgaWYgKCAoZXZlbnRbXCJhY3Rpb25cIl0gIT0gbnVsbCkgJiYgKChldmVudFtcImFjdGlvblwiXT09PVwicHJvbXB0YW5kY29sbGVjdFwiKSB8fCAoZXZlbnRbXCJhY3Rpb25cIl09PT1cInBsYXlhbm5vdW5jZW1lbnRcIikpICkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoXCJhY3Rpb246IHt9XCIsIGV2ZW50W1wiYWN0aW9uXCJdKTtcclxuICAgICAgICAgICAgaWYgKCBldmVudFtcImFjdGlvblwiXT09PVwicHJvbXB0YW5kY29sbGVjdFwiICkgXHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYWN0aW9uXCJdID0gXCJwcm9tcHRhbmRjb2xsZWN0XCI7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCBldmVudFtcImFjdGlvblwiXT09PVwicGxheWFubm91bmNlbWVudFwiICkgXHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiYWN0aW9uXCJdID0gXCJwbGF5YW5ub3VuY2VtZW50XCI7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmFjdGlvbmluY29ycmVjdFwiOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmFjdGlvbm1pc3NpbmdcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZWFybHkgZGlhbG9nIGlzIGJvb2xlYW4gdHJ1ZS9mYWxzZVxyXG4gICAgICAgIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSAhPSBudWxsICkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoXCJlYXJseWRpYWxvZzoge31cIiwgZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSk7XHJcbiAgICAgICAgICAgIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImVhcmx5ZGlhbG9nXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRydWVcIjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJlYXJseWRpYWxvZ1wiXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVycm9yLmlucHV0LmVhcmx5ZGlhbG9naW5jb3JyZWN0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5lYXJseWRpYWxvZ1wiO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBsb2cuZGVidWcoXCJMb2c6IHt9XCIsIGUpO1xyXG4gICAgICAgIHJldHVybiBcImVycm9yLmV4Y2VwdGlvblwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGUyMDBPS0lORk8oc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcclxuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCByZXQ6IGFueSA9IHtcImR1bW15XCI6MSxcImV2ZW50LW5hbWVcIjpcImR1bW15XCIsXCJldmVudC10eXBlXCI6XCJkdW1teVwiLFwic2Vzc2lvblwiOnNlc3Npb25bXCJmc20taWRcIl19O1xyXG4gICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJjYWxsc3RhdGVcIl0gID0gXCJNUkZDT05ORUNURURcIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XHJcbiAgICAgICAgcmV0dXJuIFwiZXJyb3IuZXhjZXB0aW9uXCI7XHJcbiAgICB9XHJcbn1cclxuIl19