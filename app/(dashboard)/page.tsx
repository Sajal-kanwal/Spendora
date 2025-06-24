import React from 'react'
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import Overview from "@/app/(dashboard)/_components/Overview";

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
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-3xl font-bold">
                        Hello, {user.firstName}! 👋
                    </p>
                    <div className="flex items-center gap-3">
                        <CreateTransactionDialog trigger={
                            <Button className="border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500 hover:border-emerald-400 transition-colors duration-200 shadow-md">
                                New Income 💰
                            </Button>} type="income"
                        />

                        <CreateTransactionDialog trigger={
                            <Button className="border border-rose-500 bg-rose-600 text-white hover:bg-rose-500 hover:border-rose-400 transition-colors duration-200 shadow-md">
                                New Expense 💸
                            </Button>} type="expense"
                        />

                    </div>
                </div>
            </div>
            <Overview userSettings={userSettings} />
        </div>
    )
}

export default Page
