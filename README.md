# this is the Demo rating application 

## sipp tests on nfems
UAS - b2bua test
/appl/sipp/testing
sipp -sf sipp_uas_basic_b2bua.xml  -i 10.20.110.17 -p 5098

UAC
/appl/sipp/testing
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700

########### here more tests


# sipp on nfems
# scenario - no DTMF detected
#	"RUIR 4000 / Connect to MRF / no dtmf.digits received after announcement finishes (5-8s) seconds then relesae MRF leg and cancel to A with 603 declined
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
# scenario - incorrect DTMF detected  
#	"RUIR 4000 / Connect to MRF / dtmf.nomatch received after announcement finishes (5s) seconds then relesae MRF leg and cancel to A with 603 declined
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf-pound.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo

# scenario - incorrect DTMF detected  
#	"RUIR 4000 / Connect to MRF / dtmf.nomatch received after announcement finishes (5s) seconds then relesae MRF leg and cancel to A with 603 declined
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo

sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf0-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo

# scenario - dtmf1 .. then just an announcement 
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-2sbreak-1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 400079999700 -mp 39000 -rtp_echo


### scenario start with 3000 uri  - does http query - ending uri with 0 is scenario 0 -> disconnect
# requires the server: sipp -sf sipp_uas_basic.xml  -i 10.20.110.17 -p 5098
# only ringing but for 2s no answer (200ok on invite) ... -> no-ansewr-timeout send CANCLE to B and BUSY-here to A
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-2sbreak-1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700 -mp 39000 -rtp_echo

# call is established and after 2s BYE from A
# requires the server: sipp -sf sipp_uas_basic_b2bua.xml  -i 10.20.110.17 -p 5098
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_inviteACK.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700 -mp 39000 -rtp_echo

# long duration call disconnect ... call is established and after 10s BYE from TAS to both
# requires the server: sipp -sf sipp_uas_basic_b2bua.xml  -i 10.20.110.17 -p 5098
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_inviteACK-longcall.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999700 -mp 39000 -rtp_echo






### scenario start with 3000 uri  - does http query - ending uri with 4 is scenario 4 -> DTMF 1 -> disconnect with BYE .. A in connected state
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_scenario4_dtmf1.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999704 -mp 39000 -rtp_echo

### scenario start with 3000 uri  - does http query - ending uri with 4 is scenario 4 -> DTMF 2 -> disconnect with BYE .. A in connected state
### FAILS - this scenario shall trigger a 2nd INVITE to MRF in connected-state .. and TAS sends out an INVITE to other RURI but not to mrf
### TAS rather forwards the INVITE to the "contact" destination ????
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_b2bua_scenario4_dtmf2.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999704 -mp 39000 -rtp_echo

### scenario start with 3000 uri  - does http query - ending uri with 5 is scenario 5 -> play announcement in early media and -> disconnect with decline 
sipp 10.20.110.19:5060 -i 10.20.110.17 -p 5099 -sf telzar_scenario_dtmf2-2sbreak-1-busyhere.xml -m 1 -r 1 -nr -default_behaviors abortunexp -key urinamevar 300079999705 -mp 39000 -rtp_echo

## wav file not found is covered - with BYE

