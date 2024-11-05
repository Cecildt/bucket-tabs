export function traceInfo(message: string, ...params: any[]) {
  if (params) {
    console.log(message, params);
  } else {
    console.log(message);
  }
}

export function traceError(message: string, ...params: any[]) {
  if (params) {
    console.error(message, params);
  } else {
    console.error(message);
  }
}

export function traceWarning(message: string, ...params: any[]) {
  if (params) {
    console.warn(message, params);
  } else {
    console.warn(message);
  }
}
