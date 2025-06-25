"use client";

import React from 'react'
import {UserSettings} from "@/lib/generated/prisma";
import {differenceInDays, startOfMonth} from "date-fns";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {MAX_DATE_RANGE_DAYS} from "@/lib/constants";
import {toast} from "sonner";
import StatsCards from "@/app/(dashboard)/_components/StatsCards";
import CategoriesStats from "@/app/(dashboard)/_components/CategoriesStats";
import { CalendarDays, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

function Overview({userSettings}: { userSettings: UserSettings }) {
    const [dateRange, setDateRange] = React.useState<{from: Date; to: Date;}> ({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <div className="space-y-8">
            {/* Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50">
                        <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Financial Overview
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Track your income, expenses, and spending patterns
                        </p>
                    </div>
                </div>

                <Card className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Date Range
                        </span>
                    </div>
                    <DateRangePicker
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={values => {
                            const { from, to } = values.range

                            if (!from || !to) return;
                            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                                toast.error(`Date range too big. Allowed range is ${MAX_DATE_RANGE_DAYS} days!`);
                                return;
                            }

                            setDateRange({from, to});
                        }}
                    />
                </Card>
            </div>

            {/* Stats Cards */}
            <StatsCards
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
            />

            {/* Categories Stats */}
            <CategoriesStats
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
            />
        </div>
    )
}

export default Overview