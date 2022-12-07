export class Mode {
  static image = new Mode("image");
  static page = new Mode("page");

  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}
