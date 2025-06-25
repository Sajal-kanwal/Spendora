"use client";
import React, {useCallback, useMemo} from 'react'
import {UserSettings} from "@/lib/generated/prisma";
import {Period, Timeframe} from "@/lib/types";
import {GetFormatterForCurrency} from "@/lib/helpers";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import HistoryPeriodSelector from "@/app/(dashboard)/_components/HistoryPeriodSelector";
import {useQuery} from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {cn} from "@/lib/utils";
import CountUp from "react-countup";
import { BarChart3, Calendar, TrendingUp, TrendingDown } from "lucide-react";

function History({userSettings}: {userSettings: UserSettings}) {
    const [timeframe, setTimeframe] = React.useState<Timeframe>("month")
    const [period, setPeriod] = React.useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const formatter = useMemo(()=>{
        return GetFormatterForCurrency(userSettings.currency)
    },[userSettings.currency]);

    const historyDataQuery = useQuery({
        queryKey: ["overview", "history", timeframe, period],
        queryFn: () => fetch(`/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`).then(res => res.json())
    });

    const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-200/50 dark:border-indigo-800/50">
                    <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Transaction History
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Visualize your financial trends over time
                    </p>
                </div>
            </div>

            {/* History Chart Card */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                <CardHeader className="space-y-4">
                    <CardTitle className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <HistoryPeriodSelector
                            period={period}
                            setPeriod={setPeriod}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                        />

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                <TrendingUp className="h-3 w-3" />
                                <span className="text-sm font-medium">Income</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
                                <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                                <TrendingDown className="h-3 w-3" />
                                <span className="text-sm font-medium">Expense</span>
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
                        {dataAvailable ? (
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        height={400}
                                        data={historyDataQuery.data}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        barCategoryGap="20%"
                                    >
                                        <defs>
                                            <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
                                            </linearGradient>
                                            <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            strokeOpacity={0.2}
                                            vertical={false}
                                            className="opacity-30"
                                        />
                                        <XAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            padding={{left: 10, right: 10}}
                                            dataKey={(data) => {
                                                const {year, month, day} = data;
                                                const date = new Date(year, month, day || 1);
                                                if(timeframe === "year") {
                                                    return date.toLocaleDateString("default", {
                                                        month: "short",
                                                    });
                                                }
                                                return date.toLocaleDateString("default", {
                                                    day: "numeric",
                                                });
                                            }}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => formatter.format(value)}
                                        />
                                        <Bar
                                            dataKey="income"
                                            fill="url(#incomeBar)"
                                            radius={[4, 4, 0, 0]}
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                        <Bar
                                            dataKey="expense"
                                            fill="url(#expenseBar)"
                                            radius={[4, 4, 0, 0]}
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                        <Tooltip
                                            cursor={{fill: 'rgba(0, 0, 0, 0.05)', radius: 4}}
                                            content={<CustomTooltip formatter={formatter} />}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                                    <Calendar className="h-8 w-8 text-slate-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    No Transaction Data
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                    No transaction data available for the selected period. Try selecting a different date range or adding new transactions.
                                </p>
                            </div>
                        )}
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div>
    )
}

export default History

function CustomTooltip({active, payload, formatter}: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const {expense, income} = data;
    const balance = income - expense;

    return (
        <Card className="min-w-[250px] p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="space-y-3">
                <TooltipRow
                    formatter={formatter}
                    label="Income"
                    value={income}
                    bgColor="bg-emerald-500"
                    textColor="text-emerald-600 dark:text-emerald-400"
                    icon={<TrendingUp className="h-3 w-3" />}
                />
                <TooltipRow
                    formatter={formatter}
                    label="Expense"
                    value={expense}
                    bgColor="bg-rose-500"
                    textColor="text-rose-600 dark:text-rose-400"
                    icon={<TrendingDown className="h-3 w-3" />}
                />
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                    <TooltipRow
                        formatter={formatter}
                        label="Net Balance"
                        value={balance}
                        bgColor={balance >= 0 ? "bg-blue-500" : "bg-orange-500"}
                        textColor={balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}
                        icon={balance >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        isBalance={true}
                    />
                </div>
            </div>
        </Card>
    )
}

function TooltipRow({
                        label,
                        value,
                        bgColor,
                        textColor,
                        formatter,
                        icon,
                        isBalance = false
                    }: {
    label: string;
    textColor: string;
    bgColor: string;
    value: number;
    formatter: Intl.NumberFormat;
    icon: React.ReactNode;
    isBalance?: boolean;
}) {
    const formattingFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full", bgColor)} />
                {icon}
                <span className={cn("text-sm", isBalance ? "font-semibold" : "font-medium", "text-slate-600 dark:text-slate-400")}>
                    {label}
                </span>
            </div>
            <div className={cn("text-sm font-bold", textColor)}>
                <CountUp
                    duration={0.5}
                    preserveValue
                    end={value}
                    decimals={0}
                    formattingFn={formattingFn}
                />
            </div>
        </div>
    )
}