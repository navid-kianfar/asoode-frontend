import { TimeViewModel } from '../view-models/core/general-types';

const secondTicks = 10000000;
const minuteTicks = 600000000;
const hourTicks = 36000000000;
const dayTicks = 864000000000;

export class NumberHelpers {
  static pad(source: number, size): string {
    let s = String(source);
    while (s.length < (size || 2)) {
      s = '0' + s;
    }
    return s;
  }
  static humanFileSize(source: number, si): string {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(source) < thresh) {
      return source + ' B';
    }
    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
      source /= thresh;
      u += 1;
    } while (Math.abs(source) >= thresh && u < units.length - 1);
    return source.toFixed(1) + ' ' + units[u];
  }
  static prefix(parsed: TimeViewModel, showDays: boolean = false): string {
    const hh = this.pad(parsed.hour, 2);
    const mm = this.pad(parsed.minute, 2);
    const ss = this.pad(parsed.second, 2);
    return `${hh}:${mm}:${ss}`;
  }
  static ticksToDurationString(
    model: number,
    showDays: boolean = false,
  ): string {
    const parsed = NumberHelpers.ticksToDuration(model);
    return this.prefix(parsed, showDays);
  }
  static ticksToDuration(model: number): TimeViewModel {
    const days = Math.floor(model / dayTicks);
    return {
      hour: days + Math.round((model / hourTicks) % 24),
      minute: Math.round((model / minuteTicks) % 60),
      second: Math.round((model / secondTicks) % 60),
    };
  }
  static durationToTicks(duration: TimeViewModel): number {
    return (
      duration.hour * hourTicks +
      duration.minute * minuteTicks +
      duration.second * secondTicks
    );
  }
  static msToDurationString(model: number, showDays: boolean = false): string {
    const parsed = NumberHelpers.msToDuration(model);
    return this.prefix(parsed, showDays);
  }
  static msToDuration(milliseconds: number): TimeViewModel {
    const hh = Math.floor(milliseconds / (1000 * 60 * 60));
    const mm = Math.floor((milliseconds - hh * 1000 * 60 * 60) / (1000 * 60));
    const ss = Math.floor(
      (milliseconds - hh * 1000 * 60 * 60 - mm * 1000 * 60) / 1000,
    );
    return {
      hour: hh,
      minute: mm,
      second: ss,
    };
  }
  static durationToMs(duration: TimeViewModel): number {
    return -1;
  }
}
