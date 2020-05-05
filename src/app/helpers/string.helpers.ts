export class StringHelpers {
  static readonly dot = '...';
  static convertNumbers2English(str) {
    return str.replace(/([٠١٢٣٤٥٦٧٨٩])|([۰۱۲۳۴۵۶۷۸۹])/g,
      (m, $1, $2) => m.charCodeAt(0) - ($1 ? 1632 : 1776));
  }
  static format(input: string, args: any[]) {
    return input.replace(/{(\d+)}/g, (match, num) => {
      return typeof args[num] !== 'undefined' ? String(args[num]) : match;
    });
  }
  static truncate(input: string, limit, middle) {
    input = input || '';
    if (input.length < limit) {
      return input;
    }
    if (!middle) {
      return input.substring(0, limit - 3) + this.dot;
    }
    const mid = Math.round(limit / 2);
    return (
      input.substring(0, mid) + this.dot + input.substring(limit - mid - 3)
    );
  }
  static toKebabCase(input: string) {
    return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  static initialExtractor(input: string) {
    let parts = (input || '')
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split('@')[0]
      .split(' ');
    if (parts.length === 1) {
      parts = parts[0].split('.');
    }
    if (parts.length === 1) {
      parts = parts[0].split('_');
    }
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    if (parts[0].length > 1) {
      return parts[0].substring(0, 2);
    }
    return parts[0];
  }
}
