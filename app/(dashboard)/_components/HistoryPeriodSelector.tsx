"use client";

import React from 'react'
import {Period, Timeframe} from "@/lib/types";
import {useQuery} from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {GetHistoryPeriodsResponseType} from "@/app/api/history-periods/route";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({period, setPeriod, timeframe, setTimeframe}: Props){
    const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ["overview", "history", "periods"],
        queryFn: () => fetch(`/api/history-periods`).then(res => res.json()),
    });

    return (
        <Card className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Timeframe Selector */}
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        View by:
                    </span>
                    <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                        <Tabs
                            value={timeframe}
                            onValueChange={(value) => setTimeframe(value as Timeframe)}
                            className="w-auto"
                        >
                            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-700">
                                <TabsTrigger
                                    value="year"
                                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                >
                                    Year
                                </TabsTrigger>
                                <TabsTrigger
                                    value="month"
                                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                >
                                    Month
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </SkeletonWrapper>
                </div>

                {/* Period Selectors */}
                <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <div className="flex items-center gap-2">
                        <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                            <YearSelector
                                period={period}
                                setPeriod={setPeriod}
                                years={historyPeriods.data || []}
                            />
                        </SkeletonWrapper>

                        {timeframe === "month" && (
                            <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                                <MonthSelector period={period} setPeriod={setPeriod} />
                            </SkeletonWrapper>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default HistoryPeriodSelector

function YearSelector({period, setPeriod, years}: {
    period: Period;
    setPeriod: (period: Period) => void;
    years: GetHistoryPeriodsResponseType;
}) {
    return (
        <Select
            value={period.year.toString()}
            onValueChange={value => {
                setPeriod({
                    month: period.month,
                    year: parseInt(value)
                })
            }}
        >
            <SelectTrigger className="w-[140px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800">
                {years.map(year => (
                    <SelectItem
                        key={year}
                        value={year.toString()}
                        className="hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function MonthSelector({period, setPeriod}: {
    period: Period;
    setPeriod: (period: Period) => void;
}) {
    return (
        <Select
            value={period.month.toString()}
            onValueChange={value => {
                setPeriod({
                    year: period.year,
                    month: parseInt(value)
                })
            }}
        >
            <SelectTrigger className="w-[140px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800">
                {[0,1,2,3,4,5,6,7,8,9,10,11].map((month) => {
                    const monthStr = new Date(period.year, month, 1).toLocaleString(
                        "default",
                        {month: "long"}
                    );
                    return (
                        <SelectItem
                            key={month}
                            value={month.toString()}
                            className="hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            {monthStr}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    )
}