"use strict";
;
function inputvalidation(session, event, localParams) {
    var log = session.log;
    try {
        if (event["earlydialog"] != null) {
            log.debug("earlydialog: {}", event["earlydialog"]);
        }
        else {
            return "error.input.earlydialog";
        }
        if ((event["action"] != null) && ((event["action"] === "promptandcollect") || (event["action"] === "playannouncement"))) {
            log.debug("action: {}", event["action"]);
        }
        else {
            return "error.input.action";
        }
        return "success";
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUNqRSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRXRCLElBQUk7UUFDQSxJQUFLLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLEVBQUc7WUFDaEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztTQUN0RDthQUFNO1lBQ0gsT0FBTyx5QkFBeUIsQ0FBQztTQUNwQztRQUVELElBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFHLGtCQUFrQixDQUFDLENBQUMsRUFBRztZQUNuSCxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUM1QzthQUFNO1lBQ0gsT0FBTyxvQkFBb0IsQ0FBQztTQUMvQjtRQUNELE9BQU8sU0FBUyxDQUFDO0tBQ3BCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLE9BQU8sQ0FBQztLQUNsQjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL01BSU5CTE9DS1xuO1xyXG5mdW5jdGlvbiBpbnB1dHZhbGlkYXRpb24oc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcclxuICAgIGxldCBsb2cgPSBzZXNzaW9uLmxvZztcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGlmICggZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSAhPSBudWxsICkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoXCJlYXJseWRpYWxvZzoge31cIiwgZXZlbnRbXCJlYXJseWRpYWxvZ1wiXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZXJyb3IuaW5wdXQuZWFybHlkaWFsb2dcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9wcm9tcHRhbmRjb2xsZWN0LCBwbGF5YW5ub3VuY2VtZW50XHJcbiAgICAgICAgaWYgKCAoZXZlbnRbXCJhY3Rpb25cIl0gIT0gbnVsbCkgJiYgKChldmVudFtcImFjdGlvblwiXT09PVwicHJvbXB0YW5kY29sbGVjdFwiKSB8fCAoZXZlbnRbXCJhY3Rpb25cIl09PT1cInBsYXlhbm5vdW5jZW1lbnRcIikpICkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoXCJhY3Rpb246IHt9XCIsIGV2ZW50W1wiYWN0aW9uXCJdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJlcnJvci5pbnB1dC5hY3Rpb25cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZyhcIkxvZzoge31cIiwgZSk7XHJcbiAgICAgICAgcmV0dXJuIFwiZXJyb3JcIjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiJdfQ==