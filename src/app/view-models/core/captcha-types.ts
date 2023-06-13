export interface CaptchaObject {
  token: string;
  code: string;
  expire: string;
}
export interface CaptchaResult {
  image: string;
  token: string;
  expire: string;
}
