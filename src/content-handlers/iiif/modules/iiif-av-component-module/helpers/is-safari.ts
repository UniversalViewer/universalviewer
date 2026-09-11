export function isSafari(): boolean {
  // https://stackoverflow.com/questions/7944460/detect-safari-browser?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
