import { HTTP_ERR_INTERNAL_ERROR } from './error-codes';

export class ExtendedError extends Error {
  status: number;

  constructor(message: string, status: number = HTTP_ERR_INTERNAL_ERROR) {
    super(message);
    this.status = status;
  }
}
