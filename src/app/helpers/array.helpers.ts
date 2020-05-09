import 'array-flat-polyfill';

export class ArrayHelpers {
  static clear<T>(source: T[]) {
    source.length = 0;
  }
  static add<T>(source: T[], itemS: T | T[], prevent?: boolean) {
    if (prevent !== false) {
      prevent = true;
    }
    const safe = Array.isArray(itemS) ? itemS : [itemS];
    safe.forEach(i => {
      if (prevent && source.indexOf(i) !== -1) {
        return;
      }
      source.push(i);
    });
  }
  static remove<T>(source: T[], itemS: T | T[]) {
    const safe = Array.isArray(itemS) ? itemS : [itemS];
    safe.forEach(i => {
      const idx = source.indexOf(i);
      if (idx === -1) {
        return;
      }
      source.splice(idx, 1);
    });
  }
  static groupBy<T>(objectArray, property): T[] {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  static reposition(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  static flat(source: any): [] {
    return source.flat(2);
  }
}
