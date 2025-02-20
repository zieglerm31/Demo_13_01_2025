This is an md format help page. Click on "Edit readme" to make changes, then "Save readme" and switch back into the "View reame". Press "Push" to push the change to the central repository server. 
___
# this is the Demo rating application 
[TOC]

## Introduction
This is the demo serviceto for SIP calls. The serviec can be triggered on the SNF endpoint (10.20.110.19:5060 UDP). The SIP INVITE is routed to the TAS VM (10.20.110.18:5060 UDP) with the AEP RTE processes. The AEP invokes via the Http-Client the external HTTP-Server (), the MRF (10.20.110.16:5060 UDP) or connects the call to B-parties via the TAS instance.

## Demo Application
### Sequence diagram
The sequence diagram is only a high level visualization of the sample application/service. The Service interacts with MRF and External HTTP-Server based on the SIP-Invite content (RUIR, PANI) and finally Terminates or Connects the Call. The MRF interaction is either a Prompt&Collect or Announcement. 

```
sequenceDiagram
    uac->>tas: SIP-Invite
    tas->>rte: Invite-event
    Note right of rte: Validate if this is a new SIP call
    Note right of rte: Analyse RUIR and PANI
    alt RUIR starts with 3000
        Note right of rte: Normalize number
        Note right of rte: Create XML 
        rte->>httpserver: http-req(XML with source/A-number)
        httpserver->>rte: http-response (success w/ XML, failure/timeout)
        alt success
            Note right of rte: Evaluate respones and determine scenario
            Note right of rte: scenario 0 (Connect to MRF in Established A leg and wait for DTMF)
            Note right of rte: scenario 4 (Connect to MRF in Early Media A and play announcement)
        else
            Note right of rte: Terminate Call with 486 (BUSY)
        end
    else 
        Note right of rte: Set AnnouncementID based on PANI
        Note right of rte: Prepare MRF Announcement for Prompt&Colect (early-dialog)
        tas->>mrf: SIP-Invite
        uac ->>mrf: DTMF-digits
        mrf->>tas: SIP-Info (digits, nomatch, nodigits, error)
        tas->>mrf: SIP-BYE
        Note right of rte: DTMF=1 close call handling to A
        Note right of rte: DTMF=2 prompt announcement and close call handling to A
    end
```

### Flows and Libraries Explained
The service is a set of "flows" and "libraries" that are executed in a RTE process.\
The RTE process uses for every new call the *library Dispatcher* to find the *start flow*. In this setup the *Dispatcher* returns the *flow test_demo_130125* as the start flow.

1. initial **flow test_demo_130125** for general call handling
   1. invokes **library normalization** to normalize the number
   2. invokes **library ocshttp** for OCS Http server communication
   3. invokes **library call** for call specific details like arm events, set destination number, compute time

2. the main flow invokes **flow MRF-PlayAnn-PromptAndCollect** for MRF communication
   1. invokes **library mrf** for the details of MRF communication. Can be hidded from the user logic if not changes are required
   2. **library mrfinterfaces** is a **dependency** of the mrf library used for some definitions. Can be hidded from the user logic if not changes are required

### Visualize Calls in flows
The best way to understand the service and how it traverses through the flows is to make a call and look for the **trace**.\
The **trace** is the captured information of the call.\
To view the **trace** go to **runtime view**, select initial flow from the **Flows** dropdown box and click on **retrieve**. If nothing shows up no trace is abvilaable (they expire) or the tracedb is not selectd in your "workspace".\
The available traecs are listed in chronilogical order with the timestamp.\
- Click on the ladder/grid button to open the trace in table form. Each row is a step that got exectued.\
- Click on the FlowChart button to see the flow view\
- Click on the Sequence button to see the ingress/egress events from the RTE process.\

### Output (CDRs App CDRs MRF)
The App CDR is on TAS VM: /appl/aep/var/cdr/poc/
The MRF CDR is on TMP VM: on gui - cluster monitoring - base CDR

## Trigger Scenarios
### RUIR 
- if starts with 3000 -> http-server interaction\
- else -> no http-server interaction\
### PANI 
- if starts with 42501 -> maxspeechtimeout.wav\
- if starts with 42503 -> help.wav\
- else -> error.wav\
### Http-Server respones (currently the server does not provide a good result - hence the response is processed with following rules)
- if RURI ends with 4 -> scenario4\
- if RURI ends with 5 -> scenario5\
- if RURI ends with 0 -> scenario0\
- else unknown/timeout -> Terminate call with text "httpservererror"\

### Scenario: 0
The call is connected to sip:+4390123123@" + session.s_SIPInvite.SIP.Contact.address.uri.host + ":5098". This is currently hardcoded as the http-sever does not give a good result. \
The call is connected in a B2BUA mode and events are armed.\
The call is connected with a no-answer timer of 3 seconds and a maximum call-duration of 10s. \
The call connection time is recorded.\
In case any of the timers is fired the call duration is computed and the call is disconnected with a 486 (BUSY).\
In case the call is ended normally and call duration is computed.\

### Scenario: 4
The MRF MSML is prepared for Prompt&Collect with the A-leg in Early-Media and MSML.xml1 from below.\
The MRF either responds with a nomatch, nodigit(timeout), erorr or match with the DTMF.digit.\
- if DTMF.digit=1 -> terminate call with 402 (Payment required)\
- if DTMF.digit=2 -> invoke the 2nd MRF for announcement and Terminate the call with 486 (BUSY) and text "dtmfdigit2"\
- if nomatch (other digits) -> Terminate the call with 603 (DECLINE) and text "anytext"\
- else Terminate call iwth default TAS setting\
\
### Scenario: 5
The MRF MSML is prepared for Prompt&Collect with the A-leg in Connected-State (200-OK invite) and MSML.xml1 from below.\
Similar as scenario4.\
\
### MSML.xml1
  "collect": {
    "cleardb": "true",
    "edt": "1s",
    "fdt": "3s",
    "idt": "2s",
    "iterate": "1"
  },
  "play": {
    "barge": "true",
    "maxtime": "11s",
    "audiouri": "spel:#session[\"ann_name\"]"
  },
  "pattern": {
    "digits": "[1-2]",
    "format": "regex"
  }
\
### MSML.xml2
  "play": {
    "barge": "false",
    "maxtime": "5500ms",
    "audiouri": "file:///appl/wav/noservice.wav"
  }

## Deployment Setup
### Network Layout in Test-System

Short-Name | Usage | IP-Address | SIP-Port
--- | --- | --- | ---
TMP | the SIP MRF | 10.20.110.16 | 5060 UDP
Mgt | Management, GUI, Deployment, SIPP, Keycloak | 10.20.110.16 | 5060 UDP 
TAS | Service, TAS, HttpClieht | 10.20.110.18 | 5060 UDP
SNF | SIP Gateway | 10.20.110.19 | 5060 UDP

### Diagram

```
sequenceDiagram
    mgnt->>snf: Management Interface
    Note right of mngt: management, deployment, sipp
    sipgw-->>snf: External SIP Interface
    Note right of snf: SIP integration point
    snf->>tas: Internal SIP Interface
    Note right of tas: TAS, AEP RTE, AEP CDR, AEP HttpClient
    tas->>tmp: SIP MSML MRF Interface
    Note right of tmp: MRF
    tas-->>httpserver: External HTTP Interface
```

## Config Changes
The Announcements are on the TMP server at /appl/wav in wav format".\
For simplicity reason - every GUI user works on the same local (MGNT VM) git directory that is '/appl/data/gitdata/namespace/stoiber'\
This demo service is the git-project 'Demo_13_01_2025' within this directory. \
The remote central repository server is https://github.com/.\
The project is public and can be viewed by anyone! To push and pull use your own github.com credentials.\
User Authorization changes - use keycloak https://10.20.110.17:9001/admin/master/console/#/nexus-aep (masteradmin/admin)\
MRF CDRs use - https://10.20.110.16:6443/OCMPEM (ocroot/ocroot)\

## Call Simulations using sipp
Calls can be simulated using sipp from the management VM\
on the MGNT VM go to directory '/appl/data/gitdata/namespace/stoiber/Demo_13_01_2025/sipp'\
and run the UAC A sipp in one terminal\
for connected calls run the UAC B sipp on another terminal.\

```
sequenceDiagram
    participant sippA.10.20.110.17
    participant sippB.10.20.110.17
    participant snf.10.20.110.19
    participant tas.10.20.110.18
    participant tmp.10.20.110.16
    participant httpserver.45.60.46.233
        
    sippA.10.20.110.17-->>snf.10.20.110.19: SIP[Aleg]
    note over sippA.10.20.110.17,snf.10.20.110.19: 5060 to 5060
    snf.10.20.110.19->>tas.10.20.110.18: SIP[Aleg]
    note over snf.10.20.110.19,tas.10.20.110.18: 5060 to 5060
    tas.10.20.110.18->>httpserver.45.60.46.233: HttpReq
    note over tas.10.20.110.18,httpserver.45.60.46.233: to 443
    tas.10.20.110.18->>tmp.10.20.110.16: SIP[MRF]
    note over  tas.10.20.110.18,tmp.10.20.110.16: 5060 to 5060
    sippA.10.20.110.17->>tmp.10.20.110.16: SIP[MRF-Media/digits]
    note over   sippA.10.20.110.17,tmp.10.20.110.16: 5099 to ...
    tas.10.20.110.18->>sippB.10.20.110.17: SIP[Bleg]
    note over   tas.10.20.110.18,sippB.10.20.110.17: 5060 to 5098
```

### scenario - no DTMF detected
RUIR 4000 / Connect to MRF / no dtmf.digits received after announcement finishes (5-8s) seconds then relesae MRF leg and cancel to A with 603 declined\
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
```

### scenario - incorrect DTMF detected  
RUIR 4000 / Connect to MRF / dtmf.nomatch received after announcement finishes (5s) seconds then relesae MRF leg and cancel to A with 603 declined\
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf-pound.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
```

### scenario - incorrect DTMF detected  
RUIR 4000 / Connect to MRF / dtmf.nomatch received after announcement finishes (5s) seconds then relesae MRF leg and cancel to A with 603 declined\
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf0-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
```

### scenario - dtmf1 .. then just an announcement 
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-2sbreak-1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
```

### scenario start with 3000 uri 
does http query - ending uri with 0 is scenario 0 -> disconnect\
only ringing but for 2s no answer (200ok on invite) ... -> no-ansewr-timeout send CANCLE to B and BUSY-here to A\
requires the server: \
```shell
sipp -sf sipp_uas_basic.xml  -i 10.20.110.17 -p 5098
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-2sbreak-1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700 -mp 39000 -rtp_echo
```

### call is established and after 2s BYE from A
requires the server: \
```shell
sipp -sf sipp_uas_basic_b2bua.xml  -i 10.20.110.17 -p 5098
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_inviteACK.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700 -mp 39000 -rtp_echo
```

### long duration call disconnect 
call is established and after 10s BYE from TAS to both\
requires the server: \
```shell
sipp -sf sipp_uas_basic_b2bua.xml  -i 10.20.110.17 -p 5098
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_inviteACK-longcall.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700 -mp 39000 -rtp_echo
```

### scenario start with 3000 uri 
does http query - ending uri with 4 is scenario 4 -> DTMF 1 -> disconnect with BYE .. A in connected state\
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_scenario4_dtmf1.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999704 -mp 39000 -rtp_echo
```

### scenario start with 3000 uri 
does http query - ending uri with 4 is scenario 4 -> DTMF 2 -> disconnect with BYE .. A in connected state\
FAILS - this scenario shall trigger a 2nd INVITE to MRF in connected-state .. and TAS sends out an INVITE to other RURI but not to mrf\
TAS rather forwards the INVITE to the "contact" destination ????\
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_scenario4_dtmf2.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999704 -mp 39000 -rtp_echo
```

### scenario start with 3000 uri  - does http query - ending uri with 5 is scenario 5 -> play announcement in early media and -> disconnect with decline 
```shell
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-2sbreak-1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999705 -mp 39000 -rtp_echo
```

