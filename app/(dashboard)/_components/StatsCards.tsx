"use client";

import React, {useCallback, useMemo} from 'react'
import {UserSettings} from "@/lib/generated/prisma";
import {useQuery} from "@tanstack/react-query";
import {GetBalanceStatsResponseType} from "@/app/api/stats/balance/route";
import {DateToUTCDate, GetFormatterForCurrency} from "@/lib/helpers";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {TrendingDown, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface Props {
    from: Date;
    to: Date;
    userSettings: UserSettings;
}

function StatsCards({from, to, userSettings}: Props) {
    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json())
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency)
    }, [userSettings.currency]);

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;
    const balance = income - expense;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={income}
                    title="Total Income"
                    subtitle="Money received"
                    icon={<TrendingUp className="h-6 w-6" />}
                    trend={<ArrowUpRight className="h-4 w-4" />}
                    gradient="from-emerald-500 to-teal-600"
                    bgGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                    iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    trendColor="text-emerald-600 dark:text-emerald-400"
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={expense}
                    title="Total Expenses"
                    subtitle="Money spent"
                    icon={<TrendingDown className="h-6 w-6" />}
                    trend={<ArrowDownRight className="h-4 w-4" />}
                    gradient="from-rose-500 to-pink-600"
                    bgGradient="from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20"
                    iconBg="bg-rose-500/10 dark:bg-rose-500/20"
                    iconColor="text-rose-600 dark:text-rose-400"
                    trendColor="text-rose-600 dark:text-rose-400"
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={balance}
                    title="Net Balance"
                    subtitle="Current standing"
                    icon={<Wallet className="h-6 w-6" />}
                    trend={balance >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    gradient={balance >= 0 ? "from-blue-500 to-indigo-600" : "from-orange-500 to-red-600"}
                    bgGradient={balance >= 0 ? "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" : "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"}
                    iconBg={balance >= 0 ? "bg-blue-500/10 dark:bg-blue-500/20" : "bg-orange-500/10 dark:bg-orange-500/20"}
                    iconColor={balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}
                    trendColor={balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}
                />
            </SkeletonWrapper>
        </div>
    )
}

export default StatsCards

function StatCard({
                      formatter,
                      value,
                      title,
                      subtitle,
                      icon,
                      trend,
                      gradient,
                      bgGradient,
                      iconBg,
                      iconColor,
                      trendColor
                  } : {
    formatter: Intl.NumberFormat;
    icon: React.ReactNode;
    trend: React.ReactNode;
    title: string;
    subtitle: string;
    value: number;
    gradient: string;
    bgGradient: string;
    iconBg: string;
    iconColor: string;
    trendColor: string;
})  {
    const formatFn = useCallback((value:number) => {
        return formatter.format(value);
    }, [formatter]);

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 border-0",
            "bg-gradient-to-br", bgGradient
        )}>
            <CardContent className="p-6">
                {/* Top Row - Icon and Trend */}
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
                        <div className={iconColor}>
                            {icon}
                        </div>
                    </div>
                    <div className={cn("flex items-center gap-1", trendColor)}>
                        {trend}
                    </div>
                </div>

                {/* Title and Subtitle */}
                <div className="space-y-1 mb-4">
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        {subtitle}
                    </p>
                </div>

                {/* Value */}
                <div className="space-y-1">
                    <CountUp
                        preserveValue
                        redraw={false}
                        end={value}
                        decimals={2}
                        formattingFn={formatFn}
                        className="text-2xl font-bold text-slate-900 dark:text-white"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                    gradient
                )} />
            </CardContent>
        </Card>
    )
}