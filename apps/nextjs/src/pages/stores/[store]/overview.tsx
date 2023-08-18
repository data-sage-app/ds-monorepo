import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { ChartPieIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { mutate, tidy } from "@tidyjs/tidy";
import {
  AreaChart,
  BadgeDelta,
  Bold,
  Card,
  CategoryBar,
  Col,
  Divider,
  Flex,
  Grid,
  List,
  ListItem,
  Metric,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";

import { useAllTimeSummary } from "~/hooks/analytics/useAllTimeSummary";
import { useDailySummary } from "~/hooks/analytics/useDailySummary";
import { useMonthlySummary } from "~/hooks/analytics/useMonthlySummary";
import DashboardLayout from "../../../components/layouts/dashboard";
import { api } from "../../../utils/api";
import { industryAverageNewCustomerRevenuePct } from "../../../utils/constants";
import {
  averageArray,
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
  sumArray,
} from "../../../utils/formatters";

type MonthData = {
  Month: string;
  "Total Revenue": number;
  "Total New Customer Revenue": number;
  Profit: number;
  "New Customer Revenue %": number;
  "Industry Average %": number;
};

export default function Overview() {
  const {
    allTimeSummary,
    isLoadingAllTimeSummary,
    errorAllTimeSummary,
    refetchAllTimeSummary,
  } = useAllTimeSummary({ storePrefix: "hickory-apparel-au" });

  const {
    monthlySummary,
    isLoadingMonthlySummary,
    errorMonthlySummary,
    refetchMonthlySummary,
  } = useMonthlySummary({ storePrefix: "hickory-apparel-au" });

  const {
    dailySummary,
    isLoadingDailySummary,
    errorDailySummary,
    refetchDailySummary,
  } = useDailySummary({ storePrefix: "hickory-apparel-au" });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [fromDate, setFromDate] = useState(new Date());

  const loading =
    isLoadingDailySummary || isLoadingMonthlySummary || isLoadingAllTimeSummary;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <main>
        <Title>Overview</Title>
        <Text>
          An overview of the health of your business, including sales, orders,
          and traffic.
        </Text>

        <Grid numItemsLg={6} className="mt-6 gap-6">
          {/* Revenue Area Chart */}
          <Col numColSpanLg={4}>
            <Card className="h-full">
              <TabGroup>
                <TabList>
                  <Tab className="p-4 text-left sm:p-6">
                    <p className="text-sm sm:text-base">New Customer Revenue</p>
                    <Metric className="mt-2 text-inherit">
                      {allTimeSummary[
                        "Total New Customer Revenue"
                      ].toLocaleString("en-AU", {
                        style: "currency",
                        currency: "AUD",
                      })}
                    </Metric>
                  </Tab>
                  <Tab className="p-4 text-left sm:p-6">
                    <p className="text-sm sm:text-base">
                      NCR vs Total Revenue (%)
                    </p>
                    <Metric className="mt-2 text-inherit">
                      {(
                        (allTimeSummary["Total New Customer Revenue"] /
                          allTimeSummary["Total Revenue"]) *
                        100
                      ).toFixed(2)}
                      %
                    </Metric>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel className="p-6">
                    <Title>
                      Total Revenue vs New Customer Revenue for 12 Months (USD)
                    </Title>
                    <AreaChart
                      className="mt-10 h-[30rem]"
                      data={monthlySummary.filter(
                        (d) =>
                          d.monthStartDate >=
                          new Date(
                            new Date().setMonth(new Date().getMonth() - 12),
                          ),
                      )}
                      index="Month Name"
                      categories={[
                        "Total Revenue",
                        "Total New Customer Revenue",
                      ]}
                      colors={["lime", "green"]}
                      valueFormatter={currencyFormatter}
                      showLegend={true}
                      yAxisWidth={70}
                      allowDecimals={false}
                    />
                  </TabPanel>
                  <TabPanel className="p-6">
                    <Title>New Customer Revenue (%) vs Industry Average</Title>
                    <AreaChart
                      className="mt-10 h-[30rem]"
                      data={monthlySummary.filter(
                        (d) =>
                          d.monthStartDate >=
                          new Date(
                            new Date().setMonth(new Date().getMonth() - 12),
                          ),
                      )}
                      index="Month"
                      categories={[
                        "New Customer Revenue %",
                        "Industry Average NCR %",
                      ]}
                      colors={["lime", "blue"]}
                      valueFormatter={percentageFormatter}
                      showLegend={true}
                      yAxisWidth={70}
                      maxValue={1}
                    />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </Card>
          </Col>

          {/* KPI sidebar */}
          <Col numColSpanLg={2}>
            <div className="space-y-6">
              <Card className="h-full min-h-[28rem] w-full">
                <Flex alignItems="center" justifyContent="center">
                  <TabGroup
                    index={selectedIndex}
                    onIndexChange={setSelectedIndex}
                  >
                    <TabList variant="solid">
                      <Tab icon={ChartPieIcon}>Chart</Tab>
                      <Tab icon={ListBulletIcon}>List</Tab>
                    </TabList>
                  </TabGroup>
                </Flex>
                <Flex justifyContent="start" className="mt-6 gap-x-2">
                  <Flex
                    justifyContent="start"
                    alignItems="baseline"
                    className="space-x-3 truncate"
                  >
                    <Metric>$41,276</Metric>
                    <Text>from the last 30 days.</Text>
                  </Flex>
                  <BadgeDelta deltaType="increase" size="sm">
                    5.4%
                  </BadgeDelta>
                </Flex>

                <Divider />
                {selectedIndex === 0 ? (
                  <>
                    {/* 
                    <AreaChart
                      className="mt-8 h-60"
                      data={totalRevenueVsNewCustomerData}
                      index="Month"
                      categories={["Total Revenue", "Profit"]}
                      colors={["neutral", "lime"]}
                      showYAxis={false}
                      showLegend={false}
                      startEndOnly={true}
                      valueFormatter={currencyFormatter}
                    />
                  */}
                  </>
                ) : (
                  <>
                    <Flex className="mt-6" justifyContent="between">
                      <Text className="truncate">
                        <Bold>Costs</Bold>
                      </Text>
                      <Text>Since Previous Period</Text>
                    </Flex>
                    <List className="mt-2">
                      {ProfitabilityData.map((stock) => (
                        <ListItem key={stock.name}>
                          <Text>{stock.name}</Text>
                          <Flex justifyContent="end" className="space-x-2">
                            <Text>
                              ${" "}
                              {Intl.NumberFormat("us")
                                .format(stock.value)
                                .toString()}
                            </Text>
                            <BadgeDelta deltaType={stock.deltaType} size="xs">
                              {stock.performance}
                            </BadgeDelta>
                          </Flex>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Card>
              <Card key={NCPAData.key}>
                <Text>NCPA - New Customer Cost Per Action</Text>
                <Flex
                  justifyContent="start"
                  alignItems="baseline"
                  className="space-x-1"
                >
                  <Metric className="mt-2">
                    {currencyFormatter(NCPAData.metric)}
                  </Metric>
                </Flex>
                <CategoryBar
                  values={[60, 20, 10, 10]}
                  colors={["emerald", "yellow", "orange", "rose"]}
                  markerValue={(NCPAData.metric / NCPAData.ceiling) * 100}
                  tooltip={`NCPA is the cost of acquiring a new customer. Your NCPA Ceiling is ${currencyFormatter(
                    NCPAData.ceiling,
                  )}`}
                  showLabels={false}
                  className="mt-5"
                />
              </Card>
              <Card key={NCPAData.key}>
                <Text>MER - Marketing Efficiency Ratio</Text>
                <Flex
                  justifyContent="start"
                  alignItems="baseline"
                  className="space-x-1"
                >
                  <Metric className="mt-2">
                    {numberFormatter(MERData.revenue / MERData.adSpend)}
                  </Metric>
                </Flex>
                <CategoryBar
                  values={[40, 60]}
                  colors={["rose", "emerald"]}
                  markerValue={(MERData.revenue / MERData.adSpend) * 10}
                  tooltip={`MER is the efficiency of your marketing spend.
                  `}
                  showLabels={false}
                  className="mt-5"
                />
              </Card>
            </div>
          </Col>
        </Grid>
      </main>
    </DashboardLayout>
  );
}

function TotalRevenueVsNewCustomerData() {
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
    "Total Revenue": faker.number.int({ min: 4000, max: 5000 }),
    "Total New Customer Revenue": faker.number.int({ min: 2000, max: 3800 }),
    Profit: faker.number.int({ min: 1000, max: 2000 }),
    "New Customer Revenue %": faker.number.float({ min: 0.4, max: 0.6 }),
    "Industry Average %": faker.number.float({ min: 0.4, max: 0.6 }),
  }));
}

interface ProfitabilityDataProps {
  name: string;
  value: number;
  performance: string;
  deltaType:
    | "moderateDecrease"
    | "increase"
    | "unchanged"
    | "moderateIncrease"
    | "decrease"
    | undefined;
}

const ProfitabilityData: ProfitabilityDataProps[] = [
  {
    name: "Cost Of Delivery",
    value: 7963,
    performance: "1.2%",
    deltaType: "moderateDecrease",
  },
  {
    name: "Ad Spend",
    value: 5244,
    performance: "8.2%",
    deltaType: "increase",
  },
  {
    name: "Marketing Management",
    value: 4000,
    performance: "0%",
    deltaType: "unchanged",
  },
  {
    name: "Operational Expenses",
    value: 18737,
    performance: "0.5%",
    deltaType: "moderateDecrease",
  },
  {
    name: "Profit",
    value: 5266,
    performance: "6.1%",
    deltaType: "increase",
  },
];

const NCPAData = {
  key: "NCPA",
  metric: 54.1 as number,
  ceiling: 86.2 as number,
};

const MERData = {
  key: "MER",
  revenue: 19427 as number,
  adSpend: 5244 as number,
  ceiling: 20 as number,
};
