export class Log {
  default(...data: any) {
    if (
      import.meta.env.MODE === "development" ||
      import.meta.env.MODE === "test"
    ) {
      console.log(...data);
    }
  }

  info(...data: any) {
    if (
      import.meta.env.MODE === "development" ||
      import.meta.env.MODE === "test"
    ) {
      console.info(...data);
    }
  }

  warn(...data: any) {
    if (
      import.meta.env.MODE === "development" ||
      import.meta.env.MODE === "test"
    ) {
      console.warn(...data);
    }
  }

  error(...data: any) {
    if (
      import.meta.env.MODE === "development" ||
      import.meta.env.MODE === "test"
    ) {
      console.error(...data);
    }
  }
}

export const log = new Log();
