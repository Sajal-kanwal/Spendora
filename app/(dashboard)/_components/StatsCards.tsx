"use client";

import React, {useCallback, useMemo} from 'react'
import {UserSettings} from "@/lib/generated/prisma";
import {useQuery} from "@tanstack/react-query";
import {GetBalanceStatsResponseType} from "@/app/api/stats/balance/route";
import {DateToUTCDate, GetFormatterForCurrency} from "@/lib/helpers";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {TrendingDown, TrendingUp, Wallet} from "lucide-react";
import {Card} from "@/components/ui/card";
import CountUp from "react-countup";

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
        <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={income}
                    title={"Income"}
                    icon={
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10">
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                        </div>
                    }
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={expense}
                    title={"Expense"}
                    icon={
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-400/10">
                            <TrendingDown className="h-6 w-6 text-rose-500" />
                        </div>
                    }
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={balance}
                    title={"Balance"}
                    icon={
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                            <Wallet className="h-6 w-6 text-indigo-600" />
                        </div>
                    }
                />
            </SkeletonWrapper>
        </div>
    )
}

export default StatsCards

function StatCard({formatter, value, title, icon,} : {
    formatter: Intl.NumberFormat;
    icon: React.ReactNode;
    title: string;
    value: number;
})  {
    const formatFn = useCallback((value:number) => {
        return formatter.format(value);
    }, [formatter]);
    return (
        <Card className="flex h-36 w-full flex-col items-center justify-center gap-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                {icon}
            </div>
            <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">{title}</p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    decimals={2}
                    formattingFn={formatFn}
                    className="text-2xl font-semibold"
                />
            </div>
        </Card>

    )
}

