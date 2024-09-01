export const logger = {
  info: (...data: any) => {
    for (const item of data) {
      console.log(item);
    }
  },
  error: (...data: any) => {
    console.error("Error:");
    for (const item of data) {
      console.error(item);
    }
  },
};
