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
