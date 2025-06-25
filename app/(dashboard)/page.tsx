import React, { Suspense } from 'react'
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import Overview from "@/app/(dashboard)/_components/Overview";
import History from "@/app/(dashboard)/_components/History";
import { OverviewSkeleton, HistorySkeleton } from "@/components/skeletons";
import {Plus, TrendingUp, TrendingDown, ChevronsUp, ChevronsDown} from "lucide-react";

async function Page() {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        redirect("/wizard");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Hero Header Section */}
            <div className="relative overflow-hidden border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Welcome Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                        Welcome back, {user.firstName}!
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                                        Track your finances and achieve your goals
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <CreateTransactionDialog
                                trigger={
                                    <Button
                                        size="lg"
                                        className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                        <ChevronsUp className="w-4 h-4 mr-2" />
                                        Add Income
                                    </Button>
                                }
                                type="income"
                            />

                            <CreateTransactionDialog
                                trigger={
                                    <Button
                                        size="lg"
                                        className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                        <ChevronsDown className="w-4 h-4 mr-2" />
                                        Add Expense
                                    </Button>
                                }
                                type="expense"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <Suspense fallback={<OverviewSkeleton />}>
                    <Overview userSettings={userSettings} />
                </Suspense>

                <Suspense fallback={<HistorySkeleton />}>
                    <History userSettings={userSettings} />
                </Suspense>
            </div>
        </div>
    )
}

export default Page