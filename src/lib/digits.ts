export class Digits {
  private constructor(private value: string) {}

  static fromString(value: string): Digits {
    // make new Digits with only the numeric characters
    return new Digits(value.replace(/\D/g, ""));
  }

  // create an iterator over chunks of size n of the digits
  *chunks(n: number): Generator<string> {
    if (n <= 0 || !Number.isInteger(n)) {
      throw new Error("Chunk size should be a positive integer");
    }

    for (let i = 0; i < this.value.length; i += n) {
      yield this.value.slice(i, i + n);
    }
  }

  toString(): string {
    return this.value;
  }
}
