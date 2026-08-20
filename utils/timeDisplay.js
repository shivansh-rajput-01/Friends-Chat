module.exports.displayTime = function(time){
    if(Number(time.slice(0, 2)) >= 1 && Number(time.slice(0, 2)) <= 11){
        return time + " AM";
    }
    if(Number(time.slice(0, 2)) >= 13 && Number(time.slice(0, 2)) <= 23){
        return String(Number(time.slice(0, 2)) - 12) + time.slice(2, 5) + " PM";
    }
    if(Number(time.slice(0, 2)) == 12){
        return time + " PM";
    }
    if(Number(time.slice(0, 2)) == 0){
        return "12" + time.slice(2, 5) + " AM";
    }
    return time;
}