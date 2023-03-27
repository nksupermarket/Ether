import { StringKeyObj } from "../../types/interfaces";

export function isObject(objValue: any): objValue is StringKeyObj {
  return (
    objValue && typeof objValue === "object" && objValue.constructor === Object
  );
}

export function isArrayofObjects(data: any): data is StringKeyObj[] {
  return Array.isArray(data) && data.every((item) => isObject(item));
}

export function trimKeyValues(obj: StringKeyObj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") obj[key] = obj[key].trim();
    else if (isObject(obj[key])) trimKeyValues(obj[key]);
    else if (isArrayofObjects(obj[key])) {
      obj[key].forEach((o: StringKeyObj) => trimKeyValues(o));
    }
  }
}
