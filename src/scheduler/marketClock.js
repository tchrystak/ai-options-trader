const now = new Date(); // object representing the current date and time stored in a variable called now

const centralTime = now.toLocaleString("en-US", {timeZone: "America/Chicago"}); // Display the date/time in America/Chicago timezone

console.log(centralTime)

const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric"
}).format(now); //Create a date/time formatter using U.S. formatting, tell it to use Chicago's timezone and give me the numeric hour, then format the current moment and store the result in hour

console.log(hour);

const minute = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    minute: "numeric"
}).format(now); // Create a date/time formatter using U.S. formatting,
// tell it to use Chicago's timezone and give me the numeric minute,
// then format the current moment and store the result in minute

console.log(minute);