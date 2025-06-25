"use client";

import React, {useMemo} from 'react'
import {UserSettings} from "@/lib/generated/prisma";
import {useQuery} from "@tanstack/react-query";
import {DateToUTCDate, GetFormatterForCurrency} from "@/lib/helpers";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {TransactionType} from "@/lib/types";
import {GetCategoriesStatsResponseType} from "@/app/api/stats/categories/route";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Progress} from "@/components/ui/progress";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}

function CategoriesStats({userSettings, from, to} : Props) {
    const statsQuery = useQuery<GetCategoriesStatsResponseType>({
        queryKey: ["overview", "stats", "categories", from, to],
        queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json()),
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-800/50">
                    <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Category Breakdown
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        See where your money goes
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonWrapper isLoading={statsQuery.isFetching}>
                    <CategoriesCard
                        formatter={formatter}
                        type="income"
                        data={statsQuery.data || []}
                    />
                </SkeletonWrapper>

                <SkeletonWrapper isLoading={statsQuery.isFetching}>
                    <CategoriesCard
                        formatter={formatter}
                        type="expense"
                        data={statsQuery.data || []}
                    />
                </SkeletonWrapper>
            </div>
        </div>
    )
}

export default CategoriesStats

function CategoriesCard({data, type, formatter}:{
    type: TransactionType;
    formatter: Intl.NumberFormat;
    data: GetCategoriesStatsResponseType;
}) {
    const filteredData = data.filter((el)=>el.type === type);
    const total = filteredData.reduce((acc, el)=>acc + (el._sum?.amount || 0),0);

    const isIncome = type === "income";

    return (
        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg",
                            isIncome
                                ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                                : "bg-rose-500/10 dark:bg-rose-500/20"
                        )}>
                            {isIncome ? (
                                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                {isIncome ? "Income Categories" : "Expense Categories"}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Total: <span className="font-medium">{formatter.format(total)}</span>
                            </p>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
                {filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className={cn(
                            "p-3 rounded-full mb-4",
                            isIncome
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-rose-100 dark:bg-rose-900/30"
                        )}>
                            {isIncome ? (
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                            )}
                        </div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                            No {isIncome ? "income" : "expenses"} found
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                            Try adjusting the date range or adding new {isIncome ? "income" : "expense"} transactions
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-80">
                        <div className="space-y-4 pr-4">
                            {filteredData.map(item => {
                                const amount = item._sum.amount || 0;
                                const percentage = (amount * 100) / (total || amount);
                                return (
                                    <div key={item.category} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{item.categoryIcon}</span>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {item.category}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                                        {percentage.toFixed(1)}% of total
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {formatter.format(amount)}
                                                </p>
                                            </div>
                                        </div>

                                        <Progress
                                            value={percentage}
                                            className="h-2"
                                            indicatorClassName={cn(
                                                "transition-all duration-500",
                                                isIncome
                                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                                    : "bg-gradient-to-r from-rose-500 to-pink-500"
                                            )}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>

            {/* Gradient Border */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                isIncome
                    ? "from-emerald-500 to-teal-500"
                    : "from-rose-500 to-pink-500"
            )} />
        </Card>
    )
}