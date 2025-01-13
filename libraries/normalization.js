"use strict";
;
function normalization_1(session, event, localParams) {
    try {
        var fromURI = void 0;
        session.s_initialSIP_lib = event;
        fromURI = event.SIP.From.address.uri.user;
        session.normalizedNumber = fromURI.substring(3, 11);
        return true;
    }
    catch (e) {
        return false;
    }
}
function createXML(session, event, localParams) {
    var x;
    session.xml1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sms><user><username>SendSMSwhileOff</username><password>Aa87!6179</password></user><source>019</source><destinations><phone>";
    session.xml2 = "</phone></destinations><message>test</message><response>0</response></sms>";
    session.xml = session.xml1 + session.normalizedNumber + session.xml2;
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBQUEsU0FBUyxlQUFlLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUV0RSxJQUFJO1FBRUQsSUFBSSxPQUFPLFNBQVMsQ0FBQztRQUNyQixPQUFPLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUMxQyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHcEQsT0FBTyxJQUFJLENBQUM7S0FFZDtJQUNELE9BQU8sQ0FBQyxFQUFFO1FBRVAsT0FBTyxLQUFLLENBQUM7S0FDZjtBQUdELENBQUM7QUFHRCxTQUFTLFNBQVMsQ0FBQyxPQUFhLEVBQUUsS0FBVyxFQUFFLFdBQWdCO0lBQzVELElBQUksQ0FBVSxDQUFDO0lBQ2YsT0FBTyxDQUFDLElBQUksR0FBRSx5S0FBeUssQ0FBQztJQUV4TCxPQUFPLENBQUMsSUFBSSxHQUFFLDRFQUE0RSxDQUFDO0lBRTNGLE9BQU8sQ0FBQyxHQUFHLEdBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN2RSxPQUFPLElBQUksQ0FBQztBQUNaLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL01BSU5CTE9DS1xuO2Z1bmN0aW9uIG5vcm1hbGl6YXRpb25fMShzZXNzaW9uIDogYW55LCBldmVudCA6IGFueSwgbG9jYWxQYXJhbXM6IGFueSApe1xuXG50cnkge1xuXG4gICBsZXQgZnJvbVVSSSA6IHN0cmluZztcbiAgIHNlc3Npb24uc19pbml0aWFsU0lQX2xpYiA9IGV2ZW50O1xuICAgZnJvbVVSSSA9IGV2ZW50LlNJUC5Gcm9tLmFkZHJlc3MudXJpLnVzZXI7ICAvLzk3MjUwNzAwMDExOFxuICAgc2Vzc2lvbi5ub3JtYWxpemVkTnVtYmVyID0gZnJvbVVSSS5zdWJzdHJpbmcoMywgMTEpO1xuICAgLy9zZXNzaW9uLm5vcm1hbGl6ZWROdW1iZXIgPSBmcm9tVVJJO1xuXG4gICByZXR1cm4gdHJ1ZTtcblxufVxuY2F0Y2ggKGUpIHtcblxuICAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVYTUwoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcbiAgIGxldCB4IDogc3RyaW5nO1xuICAgc2Vzc2lvbi54bWwxPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+PHNtcz48dXNlcj48dXNlcm5hbWU+U2VuZFNNU3doaWxlT2ZmPC91c2VybmFtZT48cGFzc3dvcmQ+QWE4NyE2MTc5PC9wYXNzd29yZD48L3VzZXI+PHNvdXJjZT4wMTk8L3NvdXJjZT48ZGVzdGluYXRpb25zPjxwaG9uZT5cIjtcblxuICAgc2Vzc2lvbi54bWwyPSBcIjwvcGhvbmU+PC9kZXN0aW5hdGlvbnM+PG1lc3NhZ2U+dGVzdDwvbWVzc2FnZT48cmVzcG9uc2U+MDwvcmVzcG9uc2U+PC9zbXM+XCI7XG5cbiAgIHNlc3Npb24ueG1sPSBzZXNzaW9uLnhtbDEgKyBzZXNzaW9uLm5vcm1hbGl6ZWROdW1iZXIgKyBzZXNzaW9uLnhtbDI7XG5yZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==