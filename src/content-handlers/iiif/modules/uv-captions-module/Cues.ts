// A cue read from a WebVTT or SRT caption file. Times are seconds from the
// start of the caption file, which is the start of the caption annotation's
// target on the canvas.
export interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

// hh:mm:ss.mmm or mm:ss.mmm; SRT uses a comma before the milliseconds.
const TIMESTAMP = /(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})/;

const ENTITIES: { [entity: string]: string } = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
  "&lrm;": "‎",
  "&rlm;": "‏",
};

function parseTimestamp(value: string): number | null {
  const match = TIMESTAMP.exec(value);
  if (!match) {
    return null;
  }
  const [, hours, minutes, seconds, fraction] = match;
  return (
    Number(hours || 0) * 3600 +
    Number(minutes) * 60 +
    Number(seconds) +
    Number(fraction.padEnd(3, "0")) / 1000
  );
}

// Cue text may carry WebVTT markup (<v Speaker>, <i>, <c.class>, inline
// timestamps) or SRT formatting tags; the overlay shows plain text.
function cleanCueText(lines: string[]): string {
  return lines
    .join("\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(amp|lt|gt|nbsp|lrm|rlm);/g, (entity) => ENTITIES[entity])
    .trim();
}

// Reads the cues from a WebVTT or SRT caption file. Blocks without a timing
// line (the WEBVTT header, NOTE, STYLE and REGION blocks, SRT cue numbers on
// their own) are skipped, as are cues whose timings can't be read.
export function parseCaptionCues(text: string): CaptionCue[] {
  const cues: CaptionCue[] = [];
  const blocks = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/);

  for (const block of blocks) {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex === -1) {
      continue;
    }

    const [startValue, endValue] = lines[timingIndex].split("-->");
    const start = parseTimestamp(startValue);
    const end = parseTimestamp(endValue);
    if (start === null || end === null || end <= start) {
      continue;
    }

    const cueText = cleanCueText(lines.slice(timingIndex + 1));
    if (cueText) {
      cues.push({ start, end, text: cueText });
    }
  }

  return cues;
}

// The text of every cue showing at the given time (seconds from the start of
// the caption file), one cue per line, or null when none is showing. A cue
// shows from its start time up to, but not including, its end time.
export function getActiveCueText(
  cues: CaptionCue[],
  time: number
): string | null {
  const active = cues.filter((cue) => cue.start <= time && time < cue.end);
  return active.length ? active.map((cue) => cue.text).join("\n") : null;
}
