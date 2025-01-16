
//interface definition

interface Leg {
  address : string;
  name : string
}
interface Call {
  state : number
}

enum Capabilities {
  REL1XX = "REL1XX",
  FORKING= "FORKING",
  PRECONDITION="PRECONDITION",
  PEM="PEM",
  UPDATE="UPDATE"
}

interface Message {
  method : [string];
  type : [string];
  body : [string]
}

interface SIP {
  capabilities : [Capabilities];
  message : Message
}

interface CallStart {
  contact : string;
  cause: string;
  leg : string
}

interface CallPoll {
  name: string;
  type: string;
  leg: string
}

interface Event {
  name : string;
  callStart? : CallStart;
  callPoll? : CallPoll
}


interface OCCPEvent {
  callid : string;
  call : Call;
  as : string;
  eventtime : number;
  SIP : SIP;
  event: Event
}

interface Events {
  SuccessResponsePollEvent? : string;
  RawContentPollEvent? : string;
  InfoPollEvent?: string
}
/**
  Define header variables used by application
*/
interface HeaderVars {
  disableSendDefaultReason? : string;
  disableSendNoAnswerReason? : string
}

enum Annotype {
  CONNECT = "CONNECT",
  RINGING = "RING"
}

interface RingingTone {
  anno_name : string;
  anno_type : Annotype
}

interface Session {
  log : any;
  inCapabilities : [Capabilities];
  outCapabilities? : string;
  events? : string;
  headerrulevar? : string;
  headerrulesselect? : string;
  ringingtones? : string;
  sendAction? : string ;
  SIPHelper : any;
  SIPInitialInvite? : any;
  SIPMessage? : any;
  SIPMessageType? : any
}


enum CallPollActionType {
 Accept = "accept",
 Forward = "forward",
 Reject = "reject",
}

enum CallStartActionType {
 Abort = 0,
 Forward = 1,
 RejectMrf = 2
}



/**
 Set action for CallStart event
*/
interface CallStartAction {
 type : CallStartActionType;
 errorcode : number;
 cause : string ;
 uri : string;
 earlymedia : number;
 legname : string 
}

/**
 Set action for CallPoll event
*/
interface CallPollAction {
 type : CallPollActionType
}


/**
 Application can set action for a specific leg, this is applicable for MRF contact
 */
interface LegAction {
 type : CallStartActionType ;
 legaction : string
}

enum MediaOperationActionType {
 PerformMediaOperation = "performMediaOperation"
}

enum MediaOperationContentType {
 MSML = "application/msml+xml"
}

interface PerformMediaOperation {
 ContentType : MediaOperationContentType;
 Content : string
}

interface MediaOperationAction {
 type : number;
 legaction : MediaOperationActionType;
 performMediaOperation : PerformMediaOperation
}

interface Action {
 action : any 
}


interface Header {
 header : string;
 value : string;
}

interface QHeader {
 Privacy : string;
 Reason : string ;
}

interface Parameter {
 transport : string;
 user : string ;
}

interface URI {
 scheme : string;
 authority : string ;
 gr : string ;
 host: string ;
 lr : string ;
 maddr : string ;
 port : number  ;
 user : string ;
 parameters : [Parameter];
 qheader : [QHeader];
}

interface Address {
 displayName : string;
 uri : URI 
}

interface HistoryInfo implements Header {
 address : Address;
 index : string
}

interface PAI implements Header  {
 address : Address
}

interface From implements Header {
 address : Address;
 tag : string ;
}

interface To implements Header {
 address : Address;
 tag : string;
}

interface PCV implements Header {
 icid_generated_at: string ;
 icid_value : string ;
 oaid : string;
 taid : string;
 osid : string;
 tsid : string;
}

interface ResultCode {
  resultCode : string ;
}
