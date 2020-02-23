import { OperationResultStatus } from './enums';

export class OperationResult<T> {
  data: T;
  status: OperationResultStatus;
  errors: { [id: string]: string[] };
  exception: Error;

  static Success<T>(data?: T): OperationResult<T> {
    const result = new OperationResult<T>();
    result.data = data;
    result.status = OperationResultStatus.Success;
    return result;
  }

  static Failed<T>(err?: Error): OperationResult<T> {
    const result = new OperationResult<T>();
    result.exception = err;
    result.status = OperationResultStatus.Failed;
    return result;
  }

  static NotFound<T>(err?: Error): OperationResult<T> {
    const result = new OperationResult<T>();
    result.exception = err;
    result.status = OperationResultStatus.NotFound;
    return result;
  }

  static Duplicate<T>(err?: Error): OperationResult<T> {
    const result = new OperationResult<T>();
    result.exception = err;
    result.status = OperationResultStatus.Duplicate;
    return result;
  }

  static Rejected<T>(err?: Error): OperationResult<T> {
    const result = new OperationResult<T>();
    result.exception = err;
    result.status = OperationResultStatus.Rejected;
    return result;
  }

  static Validation<T>(err?: Error): OperationResult<T> {
    const result = new OperationResult<T>();
    result.exception = err;
    result.status = OperationResultStatus.Validation;
    return result;
  }
}
