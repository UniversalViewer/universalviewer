export function formatTime(input: number): string {
  let aNumber = Math.max(0, input);

  if (Number.isNaN(aNumber)) {
    aNumber = 0;
  }
  if (aNumber < 0.5) {
    aNumber = 0;
  }
  if (!Number.isFinite(aNumber)) {
    aNumber = 0;
  }

  let hours: number | string,
    minutes: number | string,
    seconds: number | string,
    hourValue: string;

  seconds = Math.ceil(aNumber);
  hours = Math.floor(seconds / (60 * 60));
  hours = hours >= 10 ? hours : "0" + hours;
  minutes = Math.floor((seconds % (60 * 60)) / 60);
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  seconds = Math.floor((seconds % (60 * 60)) % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  if (hours >= 1) {
    hourValue = hours + ":";
  } else {
    hourValue = "";
  }

  return hourValue + minutes + ":" + seconds;
}
