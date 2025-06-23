// app/wizard/page.tsx

import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/logo";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // 🔥 Prefetch user settings here
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["userSettings"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/api/user-settings");
            if (!res.ok) throw new Error("Failed to fetch user settings");
            return res.json();
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
                <div>
                    <h1 className="text-center text-3xl">
                        Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋🏼</span>
                    </h1>
                    <h2 className="mt-4 text-center text-base text-muted-foreground">
                        Let&apos;s get you set up — choose your preferred currency to begin.💳
                    </h2>
                    <h3 className="mt-2 text-center text-sm text-muted-foreground">
                        You can always change this later if needed.
                    </h3>
                </div>

                <Separator />
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Currency</CardTitle>
                        <CardDescription>
                            Set your default currency for managing finances.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CurrencyComboBox />
                    </CardContent>
                </Card>
                <Separator />
                <Button className="w-full" asChild>
                    <Link href="/">All set! You&apos;re ready to manage your finances.</Link>
                </Button>
                <div className="mt-8">
                    <Logo />
                </div>
            </div>
        </HydrationBoundary>
    );
}
