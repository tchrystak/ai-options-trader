let tradeTriggered = false;

setInterval(() => {
  const now = new Date();
  console.log("Checking the market clock..."); // object representing the current date and time stored in a variable called now

  const centralTime = now.toLocaleString("en-US", {
    timeZone: "America/Chicago",
  }); // Display the date/time in America/Chicago timezone

  console.log(centralTime);

  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    hour12: false,
  }).format(now); //Create a date/time formatter using U.S. formatting, tell it to use Chicago's timezone and give me the numeric hour, then format the current moment and store the result in hour

  console.log(hour);

  const minute = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    minute: "numeric",
  }).format(now); // Create a date/time formatter using U.S. formatting,
  // tell it to use Chicago's timezone and give me the numeric minute,
  // then format the current moment and store the result in minute

  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);

  if (hourNumber === 17 && minuteNumber === 35 && tradeTriggered === false) {
    console.log("It's 8:45 AM!!");

    tradeTriggered = true;
  } else if (hourNumber === 17 && minuteNumber === 35 && tradeTriggered === true){
    console.log("8:45 already executed!")

  } else {
        console.log("Waiting for 8:45 AM...");
  }
}, 1000);