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
  static prefix(parsed: TimeViewModel): string {
    const dd = this.pad(parsed.day, 2);
    const hh = this.pad(parsed.hour, 2);
    const mm = this.pad(parsed.minute, 2);
    return `${dd}:${hh}:${mm}`;
  }
  static humanFileSize(source: number): string {
    const si = true;
    const thresh = 1024;
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
    return Math.round(source) + ' ' + units[u];
  }
  static ticksToDurationString(model: number): string {
    const parsed = NumberHelpers.ticksToTimeSpan(model);
    return this.prefix(parsed);
  }

  static ticksToDuration(model: number): TimeViewModel {
    return {
      day: Math.floor(model / dayTicks),
      hour: Math.floor((model / hourTicks) % 24),
      minute: Math.round((model / minuteTicks) % 60),
    };
  }
  static durationToTicks(duration: TimeViewModel): number {
    return (
      duration.day * dayTicks +
      duration.hour * hourTicks +
      duration.minute * minuteTicks
    );
  }

  static ticksToTimeSpan(model: number): TimeViewModel {
    const duration = this.ticksToDuration(model);
    const total = duration.day * 24 + duration.hour;
    return {
      day: Math.floor(total / 8),
      hour: total % 8,
      minute: duration.minute,
    };
  }
  static timespanToTicks(model: TimeViewModel): number {
    const total = model.day * 8 + model.hour;
    return this.durationToTicks({
      day: 0,
      hour: total,
      minute: model.minute,
    });
  }

  static clearNumbers(input: string): string {
    // @ts-ignore
    return input.replace(/[\u0660-\u0669]/g, c => {
        return c.charCodeAt(0) - 0x0660;
      })// @ts-ignore
      .replace(/[\u06f0-\u06f9]/g, c => {
        return c.charCodeAt(0) - 0x06f0;
      });
  }
}
