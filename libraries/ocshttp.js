"use strict";
;
function createXML(session, event, localParams) {
    var x;
    try {
        session.s_xml1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sms><user><username>SendSMSwhileOff</username><password>Aa87!6179</password></user><source>019</source><destinations><phone>";
        session.s_xml2 = "</phone></destinations><message>test</message><response>0</response></sms>";
        session.s_xml = session.s_xml1 + session.s_normalizedNumber + session.s_xml2;
        return "success";
    }
    catch (e) {
        return "exception." + e;
    }
}
function checkHttpResponse(session, event, localParams) {
    var log = session.log;
    log.debug("Event received:{}", event);
    var bodyStr = event.body;
    session.restResponse = 0;
    session.callstate = "HTTPRESPONSE_INIT";
    session.CalledPartyOverwritten = "sip:+4390123123@" + session.s_SIPInvite.SIP.Contact.address.uri.host + ":5098";
    session["ocs"] = {};
    try {
        if (session.s_SIPInvite.SIP["R-URI"].address.uri.user.endsWith("0")) {
            session.ocs.scenario = "0";
            return "scenario.0";
        }
        else if (session.s_SIPInvite.SIP["R-URI"].address.uri.user.endsWith("4")) {
            session.ocs.earlymedia = false;
            session.ocs.scenario = "4";
            return "scenario.4";
        }
        else if (session.s_SIPInvite.SIP["R-URI"].address.uri.user.endsWith("5")) {
            session.ocs.earlymedia = true;
            session.ocs.scenario = "5";
            return "scenario.5";
        }
        else {
            log.debug("checkHttpResponse.uri:{}", session.s_SIPInvite.SIP["R-URI"].address.uri.user);
            return "scenario.undefined";
        }
        var body = event.body;
        session.restResponse = body.status;
        if (session.restResponse == "0") {
            session.callstate = "HTTPRESPONSE_CONNECT";
            if (body.paramX.match(session.Callingipv4)) {
                session.CalledPartyOverwritten = "sip:+4390123123@test.com";
                session.loginfo = session.loginfo + "ParamX.match.OverwriteDestination. connect to " + session.CalledPartyOverwritten + ";";
            }
            else if (body.paramY.match(session.Callingipv4)) {
                session.CalledPartyOverwritten = "sip:+4390123123@test.com";
                session.loginfo = session.loginfo + "ParamY.match.OverwriteDestination. connect to " + session.CalledPartyOverwritten + ";";
            }
            else {
                session.CalledPartyOverwritten = session.CalledParty;
                session.loginfo = session.loginfo + "Param.do not match.Connect to Initial CalledParty;";
            }
        }
        else if (session.restResponse == "4") {
            session.callstate = "HTTPRESPONSE_MRFPC";
        }
        else if (session.restResponse == "5") {
            session.callstate = "HTTPRESPONSE_MRFBYE";
        }
        else {
            session.callstate = "HTTPRESPONSE_UNKNOWN" + session.callstate;
        }
    }
    catch (e) {
        log.error("checkHttpResponse Exception {}", e);
        session.callstate = "HTTPRESPONSE_EXCEPTION";
        session.restResponse = "exception." + e;
    }
    ;
    var callstateold = session.callstate;
    log.error("Call_{}:State_{}->{}+", session["trace-skey"], callstateold, session.callstate);
    session.loginfo = session.loginfo + session.callstate + ";";
    return "scenario." + session.restResponse;
}
function failureHttpResponse(session, event, localParams) {
    var eventname = event["event-name"];
    if (event["event-name"].startsWith("sip")) {
        session.loginfo = session.loginfo + "SIP-event received while waiting for Http response (" + eventname + ");";
        return "sip.callended";
    }
    else if (event["event-name"].startsWith("http")) {
        session.loginfo = session.loginfo + "HttpFailure response received (" + event.body.status + ");";
    }
    else {
        session.loginfo = session.loginfo + "No SIP or HTTP event received while waiting for Http response (" + eventname + ");";
    }
    return "success";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsT0FBYSxFQUFFLEtBQVcsRUFBRSxXQUFnQjtJQUU1RCxJQUFJLENBQVUsQ0FBQztJQUNmLElBQUc7UUFDRixPQUFPLENBQUMsTUFBTSxHQUFHLHlLQUF5SyxDQUFDO1FBQzNMLE9BQU8sQ0FBQyxNQUFNLEdBQUcsNEVBQTRFLENBQUM7UUFDOUYsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdFLE9BQU8sU0FBUyxDQUFDO0tBQ2pCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDWCxPQUFPLFlBQVksR0FBRyxDQUFDLENBQUM7S0FDeEI7QUFFSixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxPQUFhLEVBQUUsS0FBVyxFQUFFLFdBQWdCO0lBQ25FLElBQUksR0FBRyxHQUFTLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDNUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxJQUFJLE9BQU8sR0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxZQUFZLEdBQUUsQ0FBQyxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7SUFDeEMsT0FBTyxDQUFDLHNCQUFzQixHQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFHL0csT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFDLEVBQUUsQ0FBQztJQUNsQixJQUFJO1FBT0EsSUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEdB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L01BSU5CTE9DS1xuO1xuXG5mdW5jdGlvbiBjcmVhdGVYTUwoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXtcblxuICAgbGV0IHggOiBzdHJpbmc7XG4gICB0cnl7XG4gICAgc2Vzc2lvbi5zX3htbDEgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+PHNtcz48dXNlcj48dXNlcm5hbWU+U2VuZFNNU3doaWxlT2ZmPC91c2VybmFtZT48cGFzc3dvcmQ+QWE4NyE2MTc5PC9wYXNzd29yZD48L3VzZXI+PHNvdXJjZT4wMTk8L3NvdXJjZT48ZGVzdGluYXRpb25zPjxwaG9uZT5cIjtcbiAgICBzZXNzaW9uLnNfeG1sMiA9IFwiPC9waG9uZT48L2Rlc3RpbmF0aW9ucz48bWVzc2FnZT50ZXN0PC9tZXNzYWdlPjxyZXNwb25zZT4wPC9yZXNwb25zZT48L3Ntcz5cIjtcbiAgICBzZXNzaW9uLnNfeG1sID0gc2Vzc2lvbi5zX3htbDEgKyBzZXNzaW9uLnNfbm9ybWFsaXplZE51bWJlciArIHNlc3Npb24uc194bWwyO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gXCJleGNlcHRpb24uXCIgKyBlO1xuICAgfVxuXG59XG5cbmZ1bmN0aW9uIGNoZWNrSHR0cFJlc3BvbnNlKHNlc3Npb24gOiBhbnksIGV2ZW50IDogYW55LCBsb2NhbFBhcmFtczogYW55ICl7XG4gICAgbGV0IGxvZyA6IGFueSA9IHNlc3Npb24ubG9nO1xuICAgIGxvZy5kZWJ1ZyhcIkV2ZW50IHJlY2VpdmVkOnt9XCIsZXZlbnQpO1xuICAgIGxldCBib2R5U3RyPWV2ZW50LmJvZHk7XG4gICAgc2Vzc2lvbi5yZXN0UmVzcG9uc2UgPTA7XG4gICAgc2Vzc2lvbi5jYWxsc3RhdGUgID1cIkhUVFBSRVNQT05TRV9JTklUXCI7XG4gICAgc2Vzc2lvbi5DYWxsZWRQYXJ0eU92ZXJ3cml0dGVuPVwic2lwOis0MzkwMTIzMTIzQFwiICsgc2Vzc2lvbi5zX1NJUEludml0ZS5TSVAuQ29udGFjdC5hZGRyZXNzLnVyaS5ob3N0ICsgXCI6NTA5OFwiO1xuICAgIFxuICAgIC8vaW5pdCBvY3Mgb2JqZWN0XG4gICAgc2Vzc2lvbltcIm9jc1wiXT17fTtcbiAgICB0cnkge1xuICAgICAgICAvL2xldCBib2R5ID0gSlNPTi5wYXJzZShib2R5U3RyKTtcblxuICAgICAgICAvL2ZvciB0aGUgcG9jIG9ubHlcbiAgICAgICAgLy9pZiBSVVJJIGVuZHMgd2l0aCA0IC0+IHNjZW5hcmlvNFxuICAgICAgICAvL2lmIFJVUkkgZW5kcyB3aXRoIDUgLT4gc2NlbmFyaW81XG4gICAgICAgIC8vaWYgUlVSSSBlbmRzIHdpdGggMCAtPiBzY2VuYXJpbzBcbiAgICAgICAgaWYgKCBzZXNzaW9uLnNfU0lQSW52aXRlLlNJUFtcIlItVVJJXCJdLmFkZHJlc3MudXJpLnVzZXIuZW5kc1dpdGgoXCIwXCIpICkge1xuICAgICAgICAgICAgc2Vzc2lvbi5vY3Muc2NlbmFyaW89XCIwXCI7XG4gICAgICAgICAgICByZXR1cm4gXCJzY2VuYXJpby4wXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoIHNlc3Npb24uc19TSVBJbnZpdGUuU0lQW1wiUi1VUklcIl0uYWRkcmVzcy51cmkudXNlci5lbmRzV2l0aChcIjRcIikgKSB7XG4gICAgICAgICAgICAvL3NldCBmb3IgTVJGIGNvbW11bmljYXRpb24gdGhlIGVhcmx5IG1lZGlhXG4gICAgICAgICAgICBzZXNzaW9uLm9jcy5lYXJseW1lZGlhPWZhbHNlO1xuICAgICAgICAgICAgc2Vzc2lvbi5vY3Muc2NlbmFyaW89XCI0XCI7XG4gICAgICAgICAgICByZXR1cm4gXCJzY2VuYXJpby40XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoIHNlc3Npb24uc19TSVBJbnZpdGUuU0lQW1wiUi1VUklcIl0uYWRkcmVzcy51cmkudXNlci5lbmRzV2l0aChcIjVcIikgKSB7XG4gICAgICAgICAgICAvL3NldCBmb3IgTVJGIGNvbW11bmljYXRpb24gdGhlIGVhcmx5IG1lZGlhXG4gICAgICAgICAgICBzZXNzaW9uLm9jcy5lYXJseW1lZGlhPXRydWU7XG4gICAgICAgICAgICBzZXNzaW9uLm9jcy5zY2VuYXJpbz1cIjVcIjtcbiAgICAgICAgICAgIHJldHVybiBcInNjZW5hcmlvLjVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhcImNoZWNrSHR0cFJlc3BvbnNlLnVyaTp7fVwiLHNlc3Npb24uc19TSVBJbnZpdGUuU0lQW1wiUi1VUklcIl0uYWRkcmVzcy51cmkudXNlcik7XG4gICAgICAgICAgICByZXR1cm4gXCJzY2VuYXJpby51bmRlZmluZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBsZXQgYm9keSA9IGV2ZW50LmJvZHk7XG4gICAgICAgIHNlc3Npb24ucmVzdFJlc3BvbnNlID0gYm9keS5zdGF0dXM7XG4gICAgICAgIGlmIChzZXNzaW9uLnJlc3RSZXNwb25zZT09XCIwXCIpIHtcbiAgICAgICAgICAgIHNlc3Npb24uY2FsbHN0YXRlICA9XCJIVFRQUkVTUE9OU0VfQ09OTkVDVFwiOyAgIFxuICAgICAgICAgICAgaWYgKGJvZHkucGFyYW1YLm1hdGNoKHNlc3Npb24uQ2FsbGluZ2lwdjQpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbi5DYWxsZWRQYXJ0eU92ZXJ3cml0dGVuPVwic2lwOis0MzkwMTIzMTIzQHRlc3QuY29tXCJcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmxvZ2luZm8gPSBzZXNzaW9uLmxvZ2luZm8rXCJQYXJhbVgubWF0Y2guT3ZlcndyaXRlRGVzdGluYXRpb24uIGNvbm5lY3QgdG8gXCIrc2Vzc2lvbi5DYWxsZWRQYXJ0eU92ZXJ3cml0dGVuK1wiO1wiOyBcbiAgICAgICAgICAgIH0gIGVsc2UgaWYgKGJvZHkucGFyYW1ZLm1hdGNoKHNlc3Npb24uQ2FsbGluZ2lwdjQpKSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbi5DYWxsZWRQYXJ0eU92ZXJ3cml0dGVuPVwic2lwOis0MzkwMTIzMTIzQHRlc3QuY29tXCJcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmxvZ2luZm8gPSBzZXNzaW9uLmxvZ2luZm8rXCJQYXJhbVkubWF0Y2guT3ZlcndyaXRlRGVzdGluYXRpb24uIGNvbm5lY3QgdG8gXCIrc2Vzc2lvbi5DYWxsZWRQYXJ0eU92ZXJ3cml0dGVuK1wiO1wiOyBcbiAgICAgICAgICAgIH0gIGVsc2UgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZXNzaW9uLkNhbGxlZFBhcnR5T3ZlcndyaXR0ZW49c2Vzc2lvbi5DYWxsZWRQYXJ0eTtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmxvZ2luZm8gPSBzZXNzaW9uLmxvZ2luZm8rXCJQYXJhbS5kbyBub3QgbWF0Y2guQ29ubmVjdCB0byBJbml0aWFsIENhbGxlZFBhcnR5O1wiOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzZXNzaW9uLnJlc3RSZXNwb25zZT09XCI0XCIpIHtcbiAgICAgICAgICAgIHNlc3Npb24uY2FsbHN0YXRlID1cIkhUVFBSRVNQT05TRV9NUkZQQ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHNlc3Npb24ucmVzdFJlc3BvbnNlPT1cIjVcIikge1xuICAgICAgICAgICAgc2Vzc2lvbi5jYWxsc3RhdGUgPVwiSFRUUFJFU1BPTlNFX01SRkJZRVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Vzc2lvbi5jYWxsc3RhdGUgPVwiSFRUUFJFU1BPTlNFX1VOS05PV05cIitzZXNzaW9uLmNhbGxzdGF0ZTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nLmVycm9yKFwiY2hlY2tIdHRwUmVzcG9uc2UgRXhjZXB0aW9uIHt9XCIsZSk7XG4gICAgICAgIHNlc3Npb24uY2FsbHN0YXRlICA9XCJIVFRQUkVTUE9OU0VfRVhDRVBUSU9OXCI7XG4gICAgICAgIHNlc3Npb24ucmVzdFJlc3BvbnNlID0gXCJleGNlcHRpb24uXCIgK2U7XG4gICAgfTtcblxuICAgIFxuICAgIGxldCBjYWxsc3RhdGVvbGQgOnN0cmluZyA9IHNlc3Npb24uY2FsbHN0YXRlOyAgICBcbiAgICBsb2cuZXJyb3IoXCJDYWxsX3t9OlN0YXRlX3t9LT57fStcIixzZXNzaW9uW1widHJhY2Utc2tleVwiXSxjYWxsc3RhdGVvbGQsc2Vzc2lvbi5jYWxsc3RhdGUpOyAgIFxuICAgIHNlc3Npb24ubG9naW5mbyA9IHNlc3Npb24ubG9naW5mbytzZXNzaW9uLmNhbGxzdGF0ZStcIjtcIjsgXG5cbiAgICAvL3Nlc3Npb24uQ2FsbGVkUGFydHlPdmVyd3JpdHRlbj1bXCJzaXA6KzQwOTAxMjMxMjNAdGVzdC5jb21cIixcInNpcDorNDA5MDEyMzEyNEB0ZXN0LmNvbVwiXTtcblxuICAgIHJldHVybiBcInNjZW5hcmlvLlwiK3Nlc3Npb24ucmVzdFJlc3BvbnNlO1xufVxuXG5cbmZ1bmN0aW9uIGZhaWx1cmVIdHRwUmVzcG9uc2Uoc2Vzc2lvbiA6IGFueSwgZXZlbnQgOiBhbnksIGxvY2FsUGFyYW1zOiBhbnkgKXsgICAgIFxuICAgIGxldCBldmVudG5hbWU6IHN0cmluZz0gICBldmVudFtcImV2ZW50LW5hbWVcIl07XG4gICAgaWYgKGV2ZW50W1wiZXZlbnQtbmFtZVwiXS5zdGFydHNXaXRoKFwic2lwXCIpKSB7XG4gICAgICAgIHNlc3Npb24ubG9naW5mbyA9IHNlc3Npb24ubG9naW5mbytcIlNJUC1ldmVudCByZWNlaXZlZCB3aGlsZSB3YWl0aW5nIGZvciBIdHRwIHJlc3BvbnNlIChcIitldmVudG5hbWUrXCIpO1wiOyBcbiAgICAgICAgLy9ieXBhc3MgdGhlIFRFUklNQVRFIGNhbGwgaGFuZGxlciBhcyB0aGUgY2FsbCBpcyBhbHJlYWR5IHRlcm1pbmF0ZWRcbiAgICAgICAgcmV0dXJuIFwic2lwLmNhbGxlbmRlZFwiXG4gICAgfSBlbHNlIGlmIChldmVudFtcImV2ZW50LW5hbWVcIl0uc3RhcnRzV2l0aChcImh0dHBcIikpIHtcbiAgICAgICAgc2Vzc2lvbi5sb2dpbmZvID0gc2Vzc2lvbi5sb2dpbmZvK1wiSHR0cEZhaWx1cmUgcmVzcG9uc2UgcmVjZWl2ZWQgKFwiK2V2ZW50LmJvZHkuc3RhdHVzK1wiKTtcIjsgXG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2Vzc2lvbi5sb2dpbmZvID0gc2Vzc2lvbi5sb2dpbmZvK1wiTm8gU0lQIG9yIEhUVFAgZXZlbnQgcmVjZWl2ZWQgd2hpbGUgd2FpdGluZyBmb3IgSHR0cCByZXNwb25zZSAoXCIrZXZlbnRuYW1lK1wiKTtcIjsgXG4gICAgfVxuICAgIC8vcmV0dXJuIGV2ZW50LmJvZHkuc3RhdHVzO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbn1cbiJdfQ==