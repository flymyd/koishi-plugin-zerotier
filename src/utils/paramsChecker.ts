import {Config} from "../index";

export const paramsChecker = (config: Config) => {
  const result = iterateRequiredFields(config);
  if (result.length) {
    return `请先配置 ${result.join(', ')}`
  } else return ''
}

function iterateRequiredFields<T extends Record<string, any>>(obj: T): any[] {
  type RequiredKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? never : K;
  }[keyof T];
  const requiredKeys: RequiredKeys<T>[] = Object.keys(obj) as RequiredKeys<T>[];
  const resultArr = [];
  for (const key of requiredKeys) {
    // const res: any = {};
    // res[key] = obj[key]
    // resultArr.push(res)
    if (!obj[key]) {
      resultArr.push(key)
    }
  }
  return resultArr;
}
