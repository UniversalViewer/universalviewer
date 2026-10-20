export function getHls() {
  try {
    return (window as any).Hls;
  } catch (e) {
    return null;
  }
}
