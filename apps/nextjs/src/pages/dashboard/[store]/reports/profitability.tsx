import {
  AreaChart,
  BarChart,
  Card,
  CategoryBar,
  Col,
  Flex,
  Grid,
  Legend,
  List,
  ListItem,
  Metric,
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";

import { currencyFormatter, numberFormatter } from "~/utils/formatters";
import DashboardLayout from "~/components/layouts/dashboard";

export default function Profitability() {
  return (
    <DashboardLayout>
      <main>
        <Title>Profitability</Title>
        <Text> View your real profitability, cash in hand. </Text>

        <Grid numItemsLg={6} className="mt-6 gap-6">
          {/* Main section */}
          <Col numColSpanLg={4} className="space-y-6">
            <Card className="">
              <Title>Profit compared to Total Revenue</Title>
              <Text>Comparison between Total Revenue and Profit</Text>
              <AreaChart
                className="mt-4 h-80"
                data={profitabilityAreaChartData}
                categories={["Revenue", "Profit"]}
                index="Month"
                colors={["indigo", "fuchsia"]}
                yAxisWidth={60}
                valueFormatter={currencyFormatter}
              />
            </Card>
            <Card>
              <Title>Distribution of Revenue</Title>
              <Text>This is how your revenue is being distributed. </Text>
              <BarChart
                className="mt-4 h-80"
                data={profitabilityBarChartData}
                index="Month"
                categories={[
                  "Ad Spend",
                  "Operating Expenses",
                  "Cost Of Delivery",
                  "Profit",
                ]}
                colors={["sky", "violet", "fuchsia", "lime"]}
                valueFormatter={currencyFormatter}
                stack={true}
                relative={true}
              />
            </Card>
          </Col>

          {/* KPI sidebar */}
          <Col numColSpanLg={2}>
            <div className="space-y-6">
              <Card className="mx-auto max-w-md">
                <Text>This Months Profit</Text>
                <Metric className="mt-1">$27,424</Metric>
                <TabGroup>
                  <TabList className="mt-6">
                    <Tab>Profit This Year</Tab>
                    <Tab>Profit / Session</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <AreaChart
                        className="mt-4 h-56"
                        data={profitabilityAreaChartData}
                        index="month"
                        categories={["Profit", "Revenue"]}
                        colors={["emerald", "orange"]}
                        showYAxis={false}
                        showLegend={true}
                        valueFormatter={currencyFormatter}
                        showAnimation={true}
                      />
                      <Flex justifyContent="end">
                        <Legend
                          categories={["Profit", "Revenue"]}
                          colors={["emerald", "orange"]}
                          className="mt-3"
                        />
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <AreaChart
                        className="mt-4 h-56"
                        data={profitabilityAreaChartData}
                        index="month"
                        categories={["Profit Per Session"]}
                        colors={["blue"]}
                        showYAxis={false}
                        showLegend={false}
                        valueFormatter={currencyFormatter}
                        showAnimation={true}
                      />
                      <Flex justifyContent="end">
                        <Legend
                          categories={["Profit / Session"]}
                          colors={["blue"]}
                          className="mt-3"
                        />
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </Card>
              <Card key={MERData.key}>
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
              <Card key="Profitable Products">
                <Title>Most Profitable Products</Title>
                <List className="mt-4">
                  {ProfitableProductsData.map((product) => (
                    <ListItem key={product.name}>
                      <div className="w-full">
                        <Text>{product.name}</Text>
                        <ProgressBar
                          value={product.share}
                          label={`${product.share}%`}
                          tooltip={product.amount}
                        />
                      </div>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </div>
          </Col>
        </Grid>
      </main>
    </DashboardLayout>
  );
}

const profitabilityAreaChartData = [
  {
    Month: "Jan 21",
    Revenue: 2890,
    Profit: 578,
    "Profit Per Session": 1.21,

    // 20% of 2890
  },
  {
    Month: "Feb 21",
    Revenue: 1890,
    Profit: 664.5, // 35% of 1890
    "Profit Per Session": 1.02,
  },
  {
    Month: "Mar 21",
    Revenue: 2390,
    Profit: 478, // 20% of 2390
    "Profit Per Session": 1.08,
  },
  {
    Month: "Apr 21",
    Revenue: 2500,
    Profit: 500, // 20% of 2500
    "Profit Per Session": 1.12,
  },
  {
    Month: "May 21",
    Revenue: 2780,
    Profit: 834, // 30% of 2780
    "Profit Per Session": 1.09,
  },
  {
    Month: "Jun 21",
    Revenue: 2990,
    Profit: 747.5, // 25% of 2990
    "Profit Per Session": 1.15,
  },
  {
    Month: "Jul 21",
    Revenue: 3200,
    Profit: 960, // 30% of 3200
    "Profit Per Session": 1.18,
  },
  {
    Month: "Aug 21",
    Revenue: 3100,
    Profit: 620, // 20% of 3100
    "Profit Per Session": 1.2,
  },
  {
    Month: "Sep 21",
    Revenue: 3050,
    Profit: 915, // 30% of 3050
    "Profit Per Session": 1.21,
  },
  {
    Month: "Oct 21",
    Revenue: 3300,
    Profit: 990, // 30% of 3300
    "Profit Per Session": 1.05,
  },
  {
    Month: "Nov 21",
    Revenue: 3490,
    Profit: 698, // 20% of 3490
    "Profit Per Session": 1.07,
  },
  {
    Month: "Dec 21",
    Revenue: 3600,
    Profit: 1260, // 35% of 3600
    "Profit Per Session": 1.1,
  },
];

const profitabilityBarChartData = [
  {
    Month: "Jan 21",
    "Ad Spend": 2890,
    "Operating Expenses": 3031,
    "Cost Of Delivery": 2520,
    Profit: 2601,
  },
  {
    Month: "Feb 21",
    "Ad Spend": 2750,
    "Operating Expenses": 2820,
    "Cost Of Delivery": 2789,
    Profit: 2675,
  },
  {
    Month: "Mar 21",
    "Ad Spend": 2785,
    "Operating Expenses": 2790,
    "Cost Of Delivery": 2730,
    Profit: 2729,
  },
  {
    Month: "Apr 21",
    "Ad Spend": 2825,
    "Operating Expenses": 2775,
    "Cost Of Delivery": 2750,
    Profit: 2684,
  },
  {
    Month: "May 21",
    "Ad Spend": 2765,
    "Operating Expenses": 2805,
    "Cost Of Delivery": 2740,
    Profit: 2724,
  },
  {
    Month: "Jun 21",
    "Ad Spend": 2800,
    "Operating Expenses": 2750,
    "Cost Of Delivery": 2790,
    Profit: 2694,
  },
  {
    Month: "Jul 21",
    "Ad Spend": 2795,
    "Operating Expenses": 2780,
    "Cost Of Delivery": 2765,
    Profit: 2694,
  },
  {
    Month: "Aug 21",
    "Ad Spend": 2780,
    "Operating Expenses": 2800,
    "Cost Of Delivery": 2770,
    Profit: 2684,
  },
  {
    Month: "Sep 21",
    "Ad Spend": 2760,
    "Operating Expenses": 2815,
    "Cost Of Delivery": 2755,
    Profit: 2704,
  },
  {
    Month: "Oct 21",
    "Ad Spend": 2790,
    "Operating Expenses": 2765,
    "Cost Of Delivery": 2785,
    Profit: 2694,
  },
  {
    Month: "Nov 21",
    "Ad Spend": 2775,
    "Operating Expenses": 2800,
    "Cost Of Delivery": 2760,
    Profit: 2699,
  },
  {
    Month: "Dec 21",
    "Ad Spend": 2785,
    "Operating Expenses": 2785,
    "Cost Of Delivery": 2755,
    Profit: 2709,
  },
];

const MERData = {
  key: "MER",
  revenue: 19427 as number,
  adSpend: 5244 as number,
  ceiling: 20 as number,
};

const ProfitableProductsData = [
  {
    name: "Product A",
    share: 45,
    amount: "$ 27,955",
  },
  {
    name: "Product D",
    share: 35,
    amount: "$ 21,743",
  },
  {
    name: "Product C",
    share: 75,
    amount: "$ 46,592",
  },
  {
    name: "Product B",
    share: 68,
    amount: "$ 42,243",
  },
  {
    name: "Product E",
    share: 56,
    amount: "$ 34,788",
  },
];
