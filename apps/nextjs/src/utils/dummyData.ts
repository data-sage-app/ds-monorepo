// Sales Data

import {
  BanknotesIcon,
  ChatBubbleBottomCenterIcon,
  LifebuoyIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { faker } from "@faker-js/faker";

export type AreaChart3MetricsDataProps = {
  Month: string;
  Visitors: number;
  "Conversion Rate": number;
  "Average Order Value": number;
  Revenue: number;
};

export function AreaChart3GenerateFakerData() {
  const months = [
    "Jan 22",
    "Feb 22",
    "Mar 22",
    "Apr 22",
    "May 22",
    "Jun 22",
    "Jul 22",
    "Aug 22",
    "Sep 22",
    "Oct 22",
    "Nov 22",
    "Dec 22",
  ];

  return months.map((month) => ({
    Month: month,
    Visitors: faker.number.int({ min: 1000, max: 5000 }),
    "Conversion Rate": faker.number.float({ min: 0.01, max: 0.05 }),
    "Average Order Value": faker.number.float({ min: 100, max: 500 }),
    Revenue: faker.number.float({ min: 10000, max: 50000 }),
  }));
}

export const ncpaData = {
  title: "NCPA - Net Customer Profitability Analysis",
  metric: "8.2",
  value: 82,
};

export const ncpaValues = [10, 25, 45, 20];

export const breakEvenData = {
  title: "Profit",
  metric: "$ 45,564",
  value: 36.5,
  target: "$ 125,000",
};

export const comparisonData = [
  {
    title: "Sales",
    metric: "$ 34,567",
    value: 80,
    minMetric: "$ 27,996",
    minValue: 65,
    maxMetric: "€ 36,178",
    maxValue: 84,
    icon: BanknotesIcon,
  },
  {
    title: "Engagement",
    metric: "8.2",
    value: 70,
    minMetric: "5.3",
    minValue: 45,
    maxMetric: "7.5",
    maxValue: 64,
    icon: ChatBubbleBottomCenterIcon,
  },
  {
    title: "Support",
    metric: "567",
    value: 30,
    minMetric: "1,096",
    minValue: 58,
    maxMetric: "1,361",
    maxValue: 72,
    icon: LifebuoyIcon,
  },
  {
    title: "Customers",
    metric: "1,234",
    value: 40,
    minMetric: "926",
    minValue: 30,
    maxMetric: "2,098",
    maxValue: 68,
    icon: UsersIcon,
  },
];
