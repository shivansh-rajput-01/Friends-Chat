module.exports.displayTime = function(dateInput) {
    let date = new Date(dateInput);

    if (isNaN(date.getTime())) {
        date = new Date();
    }

    return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
    });
}

module.exports.displayDate = function(time){
    const dateObj = new Date(time);
    const options = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit' 
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const formattedDate = formatter.format(dateObj); 

    return formattedDate; 
}

module.exports.compareDate = function(time1, time2){;
    let date1 = this.displayDate(time1);
    let date2 = this.displayDate(time2);
    return date1 === date2;
}
