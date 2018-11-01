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

export const requestWrapper = (fn: any) =>
  (...args: any[]) => {
    const p = fn(...args);
    if (`${p}` === '[object Promise]') {
      return p.then().catch(args[2]);
    }
    return p;
  };

export const responsePromise = (res: Response) =>
  ({ statusCode, response = {} }: { statusCode: number, response?: object }) =>
    new Promise((resolve) => {
      resolve(
        res.set({ 'content-type': 'application/json' })
          .status(statusCode)
          .send(response)
      );
    });
