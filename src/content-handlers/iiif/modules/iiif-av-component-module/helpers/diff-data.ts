function compare(a: any, b: any): string[] {
  const changed: string[] = [];
  Object.keys(a).forEach((p) => {
    if (!Object.is(b[p], a[p])) {
      changed.push(p);
    }
  });
  return changed;
}

export function diffData(a: any, b: any) {
  return Array.from(new Set(compare(a, b).concat(compare(b, a))));
}
