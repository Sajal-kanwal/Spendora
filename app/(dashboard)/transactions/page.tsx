"use client";
import React from 'react'
import {differenceInDays, startOfMonth, subDays} from "date-fns";
import {MAX_DATE_RANGE_DAYS} from "@/lib/constants";
import {toast} from "sonner";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import TransactionTable from "@/app/(dashboard)/transactions/_components/TransactionTable";
import {Receipt, TrendingUp, TrendingDown, Calendar, DollarSign} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useQuery} from "@tanstack/react-query";
import {DateToUTCDate} from "@/lib/helpers";
import SkeletonWrapper from "@/components/SkeletonWrapper";

function TransactionsPage() {
    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
        from: subDays(new Date(), MAX_DATE_RANGE_DAYS),
        to: new Date(),
    });

    // Fetch user settings to get the default currency
    const userSettingsQuery = useQuery({
        queryKey: ["userSettings"],
        queryFn: () => fetch(`/api/user-settings`).then(res => res.json()),
    });

    // Fetch transaction stats for the selected date range
    const stats = useQuery({
        queryKey: ["transactions", "stats", dateRange.from, dateRange.to],
        queryFn: async () => {
            const response = await fetch(
                `/api/transactions-history?from=${DateToUTCDate(dateRange.from)}&to=${DateToUTCDate(dateRange.to)}`
            );
            const data = await response.json();

            const totalIncome = data
                .filter((t: any) => t.type === "income")
                .reduce((sum: number, t: any) => sum + t.amount, 0);

            const totalExpense = data
                .filter((t: any) => t.type === "expense")
                .reduce((sum: number, t: any) => sum + t.amount, 0);

            return {
                totalTransactions: data.length,
                totalIncome,
                totalExpense,
                netAmount: totalIncome - totalExpense,
                transactions: data
            };
        },
    });

    // Dynamic currency formatting function
    const formatCurrency = (amount: number) => {
        const userCurrency = userSettingsQuery.data?.currency || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: userCurrency
        }).format(amount);
    };

    // Helper function to get currency symbol
    const getCurrencySymbol = () => {
        const userCurrency = userSettingsQuery.data?.currency || 'USD';
        const currencySymbols: { [key: string]: string } = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
        };
        return currencySymbols[userCurrency] || userCurrency;
    };

    // Check if user settings are loading
    const isUserSettingsLoading = userSettingsQuery.isLoading;
    const isStatsLoading = stats.isLoading;
    const isLoading = isUserSettingsLoading || isStatsLoading;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30">
            {/* Header Section */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>

                <div className="relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
                            {/* Title Section */}
                            <div className="space-y-4 lg:space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
                                        <Receipt className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                                            Transaction History
                                        </h1>
                                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                                            Track, analyze, and manage all your financial transactions in one place
                                        </p>
                                        {/* Currency Indicator */}
                                        <SkeletonWrapper isLoading={isUserSettingsLoading}>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Currency:</span>
                                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950/50 rounded-md">
                                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                        {getCurrencySymbol()} {userSettingsQuery.data?.currency || 'USD'}
                                                    </span>
                                                </div>
                                            </div>
                                        </SkeletonWrapper>
                                    </div>
                                </div>
                            </div>

                            {/* Date Range Picker */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Date Range</span>
                                </div>
                                <div className="w-full sm:w-auto">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="relative -mt-8 sm:-mt-12 lg:-mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                    <SkeletonWrapper isLoading={isLoading}>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-12">
                            {/* Total Transactions Card */}
                            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-800/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10"></div>
                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Total Transactions
                                    </CardTitle>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50 group-hover:scale-110 transition-transform duration-200">
                                        <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {stats.data?.totalTransactions || 0}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        in selected period
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Income Card */}
                            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-800/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10"></div>
                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Total Income
                                    </CardTitle>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/50 group-hover:scale-110 transition-transform duration-200">
                                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(stats.data?.totalIncome || 0)}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        total earnings
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Expenses Card */}
                            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-800/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10"></div>
                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Total Expenses
                                    </CardTitle>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/50 group-hover:scale-110 transition-transform duration-200">
                                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(stats.data?.totalExpense || 0)}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        total spending
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Net Amount Card */}
                            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-800/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/30 dark:from-purple-950/20 dark:to-violet-950/10"></div>
                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Net Amount
                                    </CardTitle>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50 group-hover:scale-110 transition-transform duration-200">
                                        <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className={`text-2xl sm:text-3xl font-bold ${
                                        (stats.data?.netAmount || 0) >= 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {formatCurrency(stats.data?.netAmount || 0)}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        income - expenses
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </SkeletonWrapper>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
                <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-800/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-slate-50/20 dark:from-gray-950/30 dark:to-slate-950/20"></div>
                    <CardHeader className="relative border-b border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
                                <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            Transaction Details
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            View, filter, and manage your financial transactions with advanced search and export options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative p-0">
                        <TransactionTable from={dateRange.from} to={dateRange.to} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TransactionsPage;