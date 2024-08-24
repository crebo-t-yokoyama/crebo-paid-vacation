export const exchangeJST = (strDatetimeUTC: string) => {
  const date = new Date(strDatetimeUTC);
  const jstDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );

  return jstDate;
};
