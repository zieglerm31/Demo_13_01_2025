
/** lib code */

function formatDate(date : Date) : string {
    let ret : string  = date.getFullYear().toString() + ("00" + (date.getMonth()+1).toString()).slice(-2) + ("00"+(date.getDate()).toString()).slice(-2);
    return ret;
}

function formatTime(date : Date) : string {
    let ret : string  = ("00"+date.getHours().toString()).slice(-2) + ("00"+date.getMinutes().toString()).slice(-2) + ("00"+date.getSeconds().toString()).slice(-2);
    return ret;
}


function sleepfunction(date : Date) : string {
    java.lang.Thread.sleep(999);

    return "success";
}
