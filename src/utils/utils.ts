import { Response } from 'express';

interface ConstantProperties {
  enumerable?: boolean;
  configurable?: boolean;
}

export function defineConstant(
  parent: object = {},
  name: string,
  value: any,
  props: ConstantProperties = {}) {

  let { enumerable, configurable } = props;
  enumerable = enumerable || false;
  configurable = configurable || false;

  return Object.defineProperty(parent, name, {
    value,
    enumerable,
    configurable,
    writable: false,
  });
}

export const WRAP = (fn: any) =>
  (...args: any[]) =>
    fn(...args).catch(args[2]);

interface ResponseBody {
  body: object;
  statusCode: number;
}

export const RESPONSE_HELPER = (res: Response) =>
  ({ statusCode, response = {} }: { statusCode: number, response?: object }) => new Promise(() => {
    res.set({ 'content-type': 'application/json' })
      .status(statusCode)
      .send(response);
  }
);
