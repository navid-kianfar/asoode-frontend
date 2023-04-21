export class StringDictionary<T> {
  items: { [index: string]: T } = {};

  count = 0;

  public ContainsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  public Count(): number {
    return this.count;
  }

  public Add(key: string, value: T) {
    if (!this.items.hasOwnProperty(key)) {
      this.count++;
    }

    this.items[key] = value;
  }

  public Remove(key: string): T {
    const val = this.items[key];
    delete this.items[key];
    this.count--;
    return val;
  }

  public Item(key: string): T {
    return this.items[key];
  }

  public Keys(): string[] {
    const keySet: string[] = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        keySet.push(prop);
      }
    }

    return keySet;
  }

  public Values(): T[] {
    const values: T[] = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop]);
      }
    }

    return values;
  }
}

export class NumberDictionary<T> {
  items: { [index: number]: T } = {};

  count = 0;

  public ContainsKey(key: number): boolean {
    return this.items.hasOwnProperty(key);
  }

  public Count(): number {
    return this.count;
  }

  public Add(key: number, value: T) {
    if (!this.items.hasOwnProperty(key)) {
      this.count++;
    }

    this.items[key] = value;
  }

  public Remove(key: number): T {
    const val = this.items[key];
    delete this.items[key];
    this.count--;
    return val;
  }

  public Item(key: number): T {
    return this.items[key];
  }

  public Keys(): number[] {
    const keySet: number[] = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        keySet.push(+prop);
      }
    }

    return keySet;
  }

  public Values(): T[] {
    const values: T[] = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop]);
      }
    }

    return values;
  }
}
