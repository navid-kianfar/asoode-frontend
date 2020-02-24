export class ValidationService {
  public static readonly emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static readonly iranianMobileRegex = /(\b|\W)(((0?<=0|0)|\+98|0098|98)?([ ]|,|-|[()]){0,2}9[0|1|2|3|4|9]([ ]|,|-|[()]){0,2}(?:[0-9]([ ]|,|-|[()]){0,2}){8})\b/;
  public static readonly mobileInvalidCharsRegex = /(""[""]+""|[""\s-,]+)/g;
  public static readonly containsTextRegex = /[a-zA-Z]+/;
  public static readonly containsUnicodeRegex = /[^\u0000-\u007F]/;
  public static readonly numberRegex = /^[0-9]+$/;
  public static readonly standardDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
  public static readonly hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  public static readonly rgbColorRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

  public static isHexColor(input: string): boolean {
    return this.hexColorRegex.test(input);
  }

  public static isRgbColor(input: string): boolean {
    return this.rgbColorRegex.test(input);
  }

  public static isNumber(input: string): boolean {
    return this.numberRegex.test(input);
  }

  public static containsText(input: string): boolean {
    return (
      this.containsTextRegex.test(input) ||
      this.containsUnicodeRegex.test(input)
    );
  }

  public static isStandardDateString(date: string): boolean {
    return this.standardDateRegex.test(String(date).toLowerCase());
  }

  public static isEmail(email: string): boolean {
    return this.emailRegex.test(String(email).toLowerCase());
  }

  static cleanMobile(mobile: string): string {
    return mobile.replace(this.mobileInvalidCharsRegex, '');
  }

  static isMobile(mobile: string): boolean {
    return this.iranianMobileRegex.test(mobile);
  }

  static validateCaptcha(captcha: any): boolean {
    return captcha && captcha.code && captcha.code.length === 5;
  }

  static validatePassword(password: string): boolean | string {
    if (!password || password.length < 6) {
      return 'PasswordMinLengthError';
    }
    return true;
  }

  static validateAlias(alias: string): boolean | string {
    if (!alias || alias.length < 3) {
      return 'AliasMinLengthError';
    }
    return true;
  }

  static validateToken(token: string): boolean {
    return token && token.length === 6;
  }

  static isBankCard(bankCardNumber: string): boolean {
    return (
      bankCardNumber &&
      bankCardNumber.length === 16 &&
      this.isNumber(bankCardNumber)
    );
  }
}
