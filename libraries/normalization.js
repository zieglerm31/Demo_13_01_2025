"use strict";
;
function normalization_1(session, event, localParams) {
    var log = session.log;
    try {
        var fromURI = void 0;
        session.s_initialSIP_lib = event;
        fromURI = event.SIP.From.address.uri.user;
        session.normalizedNumber = fromURI.substring(3, 11);
        return "success";
    }
    catch (e) {
        log.debug("Log: {}", e);
        return "error";
    }
}
function createXML(session, event, localParams) {
    var x;
    session.xml1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sms><user><username>SendSMSwhileOff</username><password>Aa87!6179</password></user><source>019</source><destinations><phone>";
    session.xml2 = "</phone></destinations><message>test</message><response>0</response></sms>";
    session.xml = session.xml1 + session.normalizedNumber + session.xml2;
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBQUEsU0FBUyxlQUFlLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUV0RSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRXRCLElBQUk7UUFFRCxJQUFJLE9BQU8sU0FBUyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDakMsT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUdwRCxPQUFPLFNBQVMsQ0FBQztLQUVuQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBRVQsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxPQUFPLENBQUM7S0FDakI7QUFHRCxDQUFDO0FBR0QsU0FBUyxTQUFTLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUM1RCxJQUFJLENBQVUsQ0FBQztJQUNmLE9BQU8sQ0FBQyxJQUFJLEdBQUUseUtBQXlLLENBQUM7SUFFeEwsT0FBTyxDQUFDLElBQUksR0FBRSw0RUFBNEUsQ0FBQztJQUUzRixPQUFPLENBQUMsR0FBRyxHQUFFLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkUsT0FBTyxJQUFJLENBQUM7QUFDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy9NQUlOQkxPQ0tcbjtmdW5jdGlvbiBub3JtYWxpemF0aW9uXzEoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcblxubGV0IGxvZyA9IHNlc3Npb24ubG9nO1xuXG50cnkge1xuXG4gICBsZXQgZnJvbVVSSSA6IHN0cmluZztcbiAgIHNlc3Npb24uc19pbml0aWFsU0lQX2xpYiA9IGV2ZW50O1xuICAgZnJvbVVSSSA9IGV2ZW50LlNJUC5Gcm9tLmFkZHJlc3MudXJpLnVzZXI7ICAvLzk3MjUwNzAwMDExOFxuICAgc2Vzc2lvbi5ub3JtYWxpemVkTnVtYmVyID0gZnJvbVVSSS5zdWJzdHJpbmcoMywgMTEpO1xuICAgLy9zZXNzaW9uLm5vcm1hbGl6ZWROdW1iZXIgPSBmcm9tVVJJO1xuXG4gICByZXR1cm4gXCJzdWNjZXNzXCI7XG5cbn0gY2F0Y2ggKGUpIHtcblxuICAgbG9nLmRlYnVnKFwiTG9nOiB7fVwiLCBlKTtcbiAgIHJldHVybiBcImVycm9yXCI7XG59XG5cblxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZVhNTChzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xuICAgbGV0IHggOiBzdHJpbmc7XG4gICBzZXNzaW9uLnhtbDE9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz48c21zPjx1c2VyPjx1c2VybmFtZT5TZW5kU01Td2hpbGVPZmY8L3VzZXJuYW1lPjxwYXNzd29yZD5BYTg3ITYxNzk8L3Bhc3N3b3JkPjwvdXNlcj48c291cmNlPjAxOTwvc291cmNlPjxkZXN0aW5hdGlvbnM+PHBob25lPlwiO1xuXG4gICBzZXNzaW9uLnhtbDI9IFwiPC9waG9uZT48L2Rlc3RpbmF0aW9ucz48bWVzc2FnZT50ZXN0PC9tZXNzYWdlPjxyZXNwb25zZT4wPC9yZXNwb25zZT48L3Ntcz5cIjtcblxuICAgc2Vzc2lvbi54bWw9IHNlc3Npb24ueG1sMSArIHNlc3Npb24ubm9ybWFsaXplZE51bWJlciArIHNlc3Npb24ueG1sMjtcbnJldHVybiB0cnVlO1xufVxuIl19