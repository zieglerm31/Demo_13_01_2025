"use strict";
;
function inputvalidation(session, event, localParams) {
    var log = session.log;
    try {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUNqRSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRXRCLElBQUk7UUFFQSxJQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBRyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUc7WUFDbkgsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUcsa0JBQWtCO2dCQUNyQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7aUJBQzdDLElBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFHLGtCQUFrQjtnQkFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGtCQUFrQixDQUFDOztnQkFFOUMsT0FBTyw2QkFBNkIsQ0FBQztTQUM1QzthQUFNO1lBQ0gsT0FBTywyQkFBMkIsQ0FBQztTQUN0QztRQUdELElBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksRUFBRztZQUNoQyxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckMsT0FBTyxNQUFNLENBQUM7YUFDakI7aUJBQU0sSUFBSyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssS0FBSyxFQUFFO2dCQUN4QyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUN0QyxPQUFPLE9BQU8sQ0FBQzthQUNsQjtpQkFBTTtnQkFDSCxPQUFPLGtDQUFrQyxDQUFDO2FBQzdDO1NBQ0o7YUFBTTtZQUNILE9BQU8seUJBQXlCLENBQUM7U0FDcEM7S0FDSjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxpQkFBaUIsQ0FBQztLQUM1QjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL01BSU5CTE9DS1xuO1xyXG5mdW5jdGlvbiBpbnB1dHZhbGlkYXRpb24oc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcclxuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vcHJvbXB0YW5kY29sbGVjdCwgcGxheWFubm91bmNlbWVudFxyXG4gICAgICAgIGlmICggKGV2ZW50W1wiYWN0aW9uXCJdICE9IG51bGwpICYmICgoZXZlbnRbXCJhY3Rpb25cIl09PT1cInByb21wdGFuZGNvbGxlY3RcIikgfHwgKGV2ZW50W1wiYWN0aW9uXCJdPT09XCJwbGF5YW5ub3VuY2VtZW50XCIpKSApIHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKFwiYWN0aW9uOiB7fVwiLCBldmVudFtcImFjdGlvblwiXSk7XHJcbiAgICAgICAgICAgIGlmICggZXZlbnRbXCJhY3Rpb25cIl09PT1cInByb21wdGFuZGNvbGxlY3RcIiApIFxyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImFjdGlvblwiXSA9IFwicHJvbXB0YW5kY29sbGVjdFwiO1xyXG4gICAgICAgICAgICBlbHNlIGlmICggZXZlbnRbXCJhY3Rpb25cIl09PT1cInBsYXlhbm5vdW5jZW1lbnRcIiApIFxyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbltcIm1yZlwiXVtcImFjdGlvblwiXSA9IFwicGxheWFubm91bmNlbWVudFwiO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5hY3Rpb25pbmNvcnJlY3RcIjsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5hY3Rpb25taXNzaW5nXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2Vhcmx5IGRpYWxvZyBpcyBib29sZWFuIHRydWUvZmFsc2VcclxuICAgICAgICBpZiAoIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0gIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKFwiZWFybHlkaWFsb2c6IHt9XCIsIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0pO1xyXG4gICAgICAgICAgICBpZiAoIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHNlc3Npb25bXCJtcmZcIl1bXCJlYXJseWRpYWxvZ1wiXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cnVlXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGV2ZW50W1wiZWFybHlkaWFsb2dcIl0gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uW1wibXJmXCJdW1wiZWFybHlkaWFsb2dcIl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImZhbHNlXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5lYXJseWRpYWxvZ2luY29ycmVjdFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuZWFybHlkaWFsb2dcIjtcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nLmRlYnVnKFwiTG9nOiB7fVwiLCBlKTtcclxuICAgICAgICByZXR1cm4gXCJlcnJvci5leGNlcHRpb25cIjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiJdfQ==