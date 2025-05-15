import React, { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { AnaliticsCardHeader } from "src/components/modules/AnaliticsCardHeader";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { data2 } from "src/core/data";
import {
  graphicLocation,
  graphicRevenue,
  graphicRevenueSource,
  graphicSalesCarrier,
  graphicSalesCustomer,
  graphicSurvey,
} from "src/core/services/allGraphics";
import { Skeleton } from "ui/skeleton.tsx";

interface renderCustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const AdminAnalytics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dataGraphicRevenue, setGraphicRevenue] = useState([
    {
      name: "test",
      amount: 1,
    },
  ]);
  const [periodRevenue, setPeriodRevenue] = useState("month");
  const [dataGraphicSurvey, setGraphicSurvey] = useState([
    {
      name: "test",
      amount: 1,
    },
  ]);
  const [periodSurvey, setPeriodSurvey] = useState("month");
  const [dataGraphicRevenueSource, setGraphicRevenueSource] = useState([
    {
      name: "test",
      amount: 1,
    },
  ]);
  const [periodRevenueSource, setPeriodRevenueSource] = useState("month");
  const [dataGraphicLocation, setGraphicLocation] = useState([
    {
      name: "test",
      amount: 1,
    },
  ]);
  const [periodLocation, setPeriodLocation] = useState("month");
  const [dataGraphicSalesCarrier, setGraphicSalesCarrier] = useState([
    {
      name: "test",
      amount: 1,
    },
  ]);
  const [periodSalesCarrier, setPeriodSalesCarrier] = useState("month");
  const [dataGraphicSalesCustomer, setGraphicSalesCustomer] = useState([
    {
      name: "test",
      amount: 1,
    },
  ]);
  const [periodSalesCustomer, setPeriodSalesCustomer] = useState("month");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const revenueData = await graphicRevenue(token, periodRevenue);
        setGraphicRevenue(revenueData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchData();
  }, [periodRevenue]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const surveyData = await graphicSurvey(token, periodSurvey);
        setGraphicSurvey(surveyData);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchData();
  }, [periodSurvey]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const revenueSourceData = await graphicRevenueSource(
          token,
          periodRevenueSource,
        );
        setGraphicRevenueSource(revenueSourceData);
      } catch (error) {
        console.error("Error fetching revenue source data:", error);
      }
    };

    fetchData();
  }, [periodRevenueSource]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const locationData = await graphicLocation(token, periodLocation);
        setGraphicLocation(locationData);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchData();
  }, [periodLocation]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const salesCarrierData = await graphicSalesCarrier(
          token,
          periodSalesCarrier,
        );
        setGraphicSalesCarrier(salesCarrierData);
      } catch (error) {
        console.error("Error fetching sales carrier data:", error);
      }
    };

    fetchData();
  }, [periodSalesCarrier]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const salesCustomerData = await graphicSalesCustomer(
          token,
          periodSalesCustomer,
        );
        setGraphicSalesCustomer(salesCustomerData);
      } catch (error) {
        console.error("Error fetching sales customer data:", error);
      }
    };

    fetchData();
  }, [periodSalesCustomer]);

  useEffect(() => {
    setTotalRevenue(
      dataGraphicRevenue.reduce((total, item) => total + item.amount, 0),
    );
    setIsLoading(false);
  }, [dataGraphicRevenue]);

  const getColorByName = (name: string): string => {
    if (name === "Google") return "#6520c1";
    if (name === "MP Social") return "#74255d";
    if (name === "BlackHatWorld") return "#184acb";
    if (name === "YouTube") return "#68a8cd";
    if (name === "Instagram") return "#3191a7";
    if (name === "Email") return "#992aaa";
    if (name === "Facebook") return "#265c8e";
    if (name === "Other") return "#4d61c7";
    return "#6520c1";
  };

  const tailwindColors = [
    { bgColor: "bg-red-500", colorCode: "#ef4444" },
    { bgColor: "bg-orange-500", colorCode: "#f97316" },
    { bgColor: "bg-yellow-500", colorCode: "#eab308" },
    { bgColor: "bg-lime-500", colorCode: "#84cc16" },
    { bgColor: "bg-green-500", colorCode: "#22c55e" },
    { bgColor: "bg-teal-500", colorCode: "#14b8a6" },
    { bgColor: "bg-cyan-500", colorCode: "#06b6d4" },
    { bgColor: "bg-blue-500", colorCode: "#3b82f6" },
    { bgColor: "bg-indigo-500", colorCode: "#6366f1" },
    { bgColor: "bg-purple-500", colorCode: "#8b5cf6" },
    { bgColor: "bg-pink-500", colorCode: "#ec4899" },
    { bgColor: "bg-rose-500", colorCode: "#f43f5e" },
    { bgColor: "bg-fuchsia-500", colorCode: "#d946ef" },
    { bgColor: "bg-violet-500", colorCode: "#8b5cf6" },
    { bgColor: "bg-amber-500", colorCode: "#f59e0b" },
    { bgColor: "bg-emerald-500", colorCode: "#10b981" },
    { bgColor: "bg-sky-500", colorCode: "#0ea5e9" },
    { bgColor: "bg-blue-700", colorCode: "#1d4ed8" },
    { bgColor: "bg-indigo-700", colorCode: "#4338ca" },
    { bgColor: "bg-purple-700", colorCode: "#6d28d9" },
  ];

  const getColorByIndex = (index: number, type: "bgColor" | "colorCode") => {
    const color = tailwindColors[index % tailwindColors.length];
    return color[type];
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: renderCustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-[12px]"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={6} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="An'alytics" admin={true} />
        <div className="max-w-[1416px] w-full grid grid-cols-3 gap-6 max-1200:grid-cols-2 max-mobile-1:grid-cols-1">
          {isLoading ? (
            <>
              <Skeleton className="w-full h-[80vh] col-span-3 rounded-xl" />
            </>
          ) : (
            <>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <div className="w-full flex flex-col gap-1">
                  <AnaliticsCardHeader
                    selectId="month"
                    title="total revenue"
                    period={periodRevenue}
                    onPeriodChange={setPeriodRevenue}
                  />
                  <div className="w-full justify-between items-end flex">
                    <div className="text-[#C2C6D1] text-[32px] font-semibold leading-9">
                      ${totalRevenue.toLocaleString("de-DE")}
                    </div>
                    <div className="hidden justify-start items-center gap-1.5">
                      <div className="justify-center items-center gap-2.5 w-4 h-4 flex rounded-full bg-[#0F211A]">
                        <MoveUpRight className="text-[#31AA7A] w-2.5 h-2.5" />
                      </div>
                      <div className="text-[#31AA7A] text-sm font-medium">
                        +15%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={400}
                      height={200}
                      data={dataGraphicRevenue}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="6 6"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <XAxis fontSize={12} dataKey="name" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4 col-span-2 -order-1 max-mobile-1:col-span-1">
                <div className="w-full flex flex-col gap-1">
                  <AnaliticsCardHeader
                    selectId="month"
                    title="website Traffic"
                    subtitle="Real-time customers"
                  />
                  <div className="hidden w-full justify-between items-end">
                    <div className="text-[#C2C6D1] text-[32px] font-semibold leading-9">
                      2.579<span className="text-sm font-medium">Visitors</span>
                    </div>
                    <div className="justify-start items-center gap-1.5 flex">
                      <div className="justify-center items-center gap-2.5 w-4 h-4 flex rounded-full bg-[#271519]">
                        <MoveDownLeft className="text-[#D45858] w-2.5 h-2.5" />
                      </div>
                      <div className="text-[#D45858] text-sm font-medium">
                        -3.5%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[176px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      width={880}
                      height={175}
                      data={data2}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="6 6"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#4677C1"
                        fill="#4677C1"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <AnaliticsCardHeader
                  selectId="month"
                  title="Survey Results"
                  period={periodSurvey}
                  onPeriodChange={setPeriodSurvey}
                />
                <div className="w-full flex gap-5 items-center max-mobile-2:flex-col">
                  <PieChart width={210} height={210}>
                    <Pie
                      data={dataGraphicSurvey}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="amount"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {dataGraphicSurvey.map((_entry, index) => (
                        <Cell
                          className="rounded-[5px]"
                          key={`cell-${index}`}
                          strokeWidth={0}
                          fill={getColorByName(_entry.name)}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="grid grid-cols-2 justify-start items-start gap-4">
                    {dataGraphicSurvey.map((_entry, index) => (
                      <div
                        key={`cell-${index}`}
                        className="justify-start items-center gap-5 flex"
                      >
                        <div className="justify-start items-center gap-2 flex">
                          <div
                            className={`w-2.5 h-2.5 rounded-full bg-[${getColorByName(_entry.name)}]`}
                          />
                          <div className="text-[#9B9A9D] text-xs leading-none">
                            {_entry.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <AnaliticsCardHeader
                  selectId="month"
                  title="total revenue"
                  subtitle="Yearly report overview"
                  period={periodRevenue}
                  onPeriodChange={setPeriodRevenue}
                />
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={400}
                      height={200}
                      data={dataGraphicRevenue}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                      barSize={10}
                    >
                      <XAxis
                        dataKey="name"
                        scale="point"
                        fontSize={12}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <CartesianGrid
                        strokeDasharray="6 6"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#2458DC"
                        background={{ fill: "#43609740" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <AnaliticsCardHeader
                  selectId="month"
                  title="Revenue by source"
                  subtitle="Weekly report overview"
                  period={periodRevenueSource}
                  onPeriodChange={setPeriodRevenueSource}
                />
                <div className="w-full justify-end items-start gap-6 flex">
                  <div className="justify-start items-center gap-2 flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#009EF6]" />
                    <div className="text-[#9B9A9D] text-xs leading-none">
                      Credit Card
                    </div>
                  </div>
                  <div className="justify-start items-center gap-2 flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#043A6C]" />
                    <div className="text-[#9B9A9D] text-xs leading-none">
                      Crypto
                    </div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={400}
                      height={200}
                      data={dataGraphicRevenueSource}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="6 6"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <XAxis fontSize={12} dataKey="name" />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar
                        barSize={22}
                        dataKey="creditCard"
                        stackId="a"
                        fill="#009EF6"
                      />
                      <Bar
                        barSize={22}
                        dataKey="crypto"
                        stackId="a"
                        fill="#043A6C"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <AnaliticsCardHeader
                  selectId="month"
                  title="sales"
                  subtitle="Views by Location"
                  period={periodLocation}
                  onPeriodChange={setPeriodLocation}
                />
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        data={dataGraphicLocation.slice(0, 19)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {dataGraphicLocation
                          .slice(0, 19)
                          .map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              strokeWidth={0}
                              fill={getColorByIndex(index, "colorCode")}
                            />
                          ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 justify-start items-start gap-4">
                  {dataGraphicLocation.slice(0, 19).map((_entry, index) => (
                    <div
                      key={`cell-${index}`}
                      className="justify-start items-center gap-5 flex"
                    >
                      <div className="justify-start items-center gap-2 flex">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${getColorByIndex(index, "bgColor")}`}
                        />
                        <div className="text-[#9B9A9D] text-sm leading-none">
                          {_entry.name}
                          {` `}
                          <span className="text-[#D8DADF] font-bold leading-tight">
                            {_entry.amount}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <AnaliticsCardHeader
                  selectId="month"
                  title="sales"
                  subtitle="Views by Carrier"
                  period={periodSalesCarrier}
                  onPeriodChange={setPeriodSalesCarrier}
                />
                <div className="w-full justify-end items-start gap-6 flex">
                  <div className="justify-start items-center gap-2 flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7B23EA]" />
                    <div className="text-[#9B9A9D] text-xs leading-none">
                      ATT
                    </div>
                  </div>
                  <div className="justify-start items-center gap-2 flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#009EF6]" />
                    <div className="text-[#9B9A9D] text-xs leading-none">
                      T Mobile
                    </div>
                  </div>
                  <div className="justify-start items-center gap-2 flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#043A6C]" />
                    <div className="text-[#9B9A9D] text-xs leading-none">
                      Verizon
                    </div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={400}
                      height={200}
                      data={dataGraphicSalesCarrier}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="6 6"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <XAxis fontSize={12} dataKey="name" />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar
                        barSize={10}
                        dataKey="att"
                        stackId="a"
                        fill="#7B23EA"
                      />
                      <Bar
                        barSize={10}
                        dataKey="tMobile"
                        stackId="b"
                        fill="#009EF6"
                      />
                      <Bar
                        barSize={10}
                        dataKey="verizon"
                        stackId="c"
                        fill="#043A6C"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-custom-gradient-3 py-6 px-7 gap-6 flex flex-col max-mobile-2:p-4">
                <AnaliticsCardHeader
                  selectId="month"
                  title="sales"
                  subtitle="Views by Customer"
                  period={periodSalesCustomer}
                  onPeriodChange={setPeriodSalesCustomer}
                />
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={400}
                      height={200}
                      data={dataGraphicSalesCustomer.slice(0, 6)}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                      barSize={12}
                    >
                      <XAxis
                        dataKey="name"
                        scale="point"
                        hide={true}
                        fontSize={12}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <CartesianGrid
                        strokeDasharray="6 6"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <Bar dataKey="amount" fill="#009EF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="max-w-[345px] w-full ml-auto flex justify-between items-start">
                  {dataGraphicSalesCustomer.slice(0, 6).map((_entry, index) => (
                    <div
                      key={`cell-${index}`}
                      className={`w-6 h-6 flex justify-center items-center rounded-full ${getColorByIndex(index, "bgColor")}`}
                    >
                      <div className="text-center text-[#F7F7F7] text-xs font-bold uppercase">
                        {_entry.name.slice(0, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
