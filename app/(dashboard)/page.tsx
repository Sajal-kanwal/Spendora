import React, { Suspense } from 'react'
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import Overview from "@/app/(dashboard)/_components/Overview";
import History from "@/app/(dashboard)/_components/History";
import { OverviewSkeleton, HistorySkeleton } from "@/components/skeletons";

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
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="border-b bg-card">
                <div className="container flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 py-6 sm:py-8 px-4 sm:px-8">
                    <div className="space-y-1">
                        <p className="text-2xl sm:text-3xl font-bold">
                            Hello, {user.firstName}! 👋
                        </p>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Welcome back to your financial dashboard
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <CreateTransactionDialog trigger={
                            <Button
                                size="sm"
                                className="border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500 hover:border-emerald-400 transition-colors duration-200 shadow-md w-full sm:w-auto"
                            >
                                <span className="sm:hidden">💰 New Income</span>
                                <span className="hidden sm:inline">New Income 💰</span>
                            </Button>}
                                                 type="income"
                        />

                        <CreateTransactionDialog trigger={
                            <Button
                                size="sm"
                                className="border border-rose-500 bg-rose-600 text-white hover:bg-rose-500 hover:border-rose-400 transition-colors duration-200 shadow-md w-full sm:w-auto"
                            >
                                <span className="sm:hidden">💸 New Expense</span>
                                <span className="hidden sm:inline">New Expense 💸</span>
                            </Button>}
                                                 type="expense"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 sm:px-8 py-6 space-y-8">
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