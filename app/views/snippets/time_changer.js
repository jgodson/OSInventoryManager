// Keep dashboard page updated
let currentMinute = new Date().getMinutes();
let clockInterval = setInterval(()=> {
  let date = new Date();
  let minute = date.getMinutes();
  if (minute != currentMinute) {
    currentMinute = minute;
    updateTime(date);
  }

  function updateTime(newTime) {
    let container = document.getElementById('time');
    let hours = newTime.getHours();
    let AMPM = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours += 12;
    }
    let minutes = newTime.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    container.innerText = `${hours}:${minutes} ${AMPM}`;
  }
}, 5000);

// Clear interval when template is changed
document.addEventListener('unload', ()=> {
  clearInterval(clockInterval);
});