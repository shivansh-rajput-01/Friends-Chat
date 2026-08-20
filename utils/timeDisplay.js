// module.exports.displayTime = function(time){
//     if(Number(time.slice(0, 2)) >= 1 && Number(time.slice(0, 2)) <= 11){
//         return time + " AM";
//     }
//     if(Number(time.slice(0, 2)) >= 13 && Number(time.slice(0, 2)) <= 23){
//         return String(Number(time.slice(0, 2)) - 12) + time.slice(2, 5) + " PM";
//     }
//     if(Number(time.slice(0, 2)) == 12){
//         return time + " PM";
//     }
//     if(Number(time.slice(0, 2)) == 0){
//         return "12" + time.slice(2, 5) + " AM";
//     }
//     return time;
// }

module.exports.displayTime = function(dateInput) {
    let date = new Date(dateInput);

    // Agar date invalid hai, toh current time le lo
    if (isNaN(date.getTime())) {
        date = new Date();
    }

    // Seedha JavaScript ko bolo ki IST timezone mein 12-hour format (AM/PM ke sath) return kare
    return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // True karte hi yeh automatic AM/PM de dega!
    });
}