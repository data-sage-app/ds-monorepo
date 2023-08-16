type MonthData = {
  Month: string;
  "Total Revenue": number;
  "Total New Customer Revenue": number;
  Profit: number;
  "New Customer Revenue %": number;
  "Industry Average %": number;
};

type NumericKeys =
  | "Total Revenue"
  | "Total New Customer Revenue"
  | "Profit"
  | "New Customer Revenue %"
  | "Industry Average %";

export const numberFormatter = (value: number) =>
  Intl.NumberFormat("us").format(value).toString();

export const percentageFormatter = (value: number) =>
  `${Intl.NumberFormat("us")
    .format(value * 100)
    .toString()}%`;

export const currencyFormatter = (value: number) =>
  Intl.NumberFormat("us", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function sumArray(array: MonthData[], metric: NumericKeys): number {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue[metric],
    0,
  );
}

export function averageArray(array: MonthData[], metric: NumericKeys): number {
  return (
    array.reduce(
      (accumulator, currentValue) => accumulator + currentValue[metric],
      0,
    ) / array.length
  );
}

export function getPercentageOfRevenue(value: number, total: number) {
  return (value / total) * 100;
}
