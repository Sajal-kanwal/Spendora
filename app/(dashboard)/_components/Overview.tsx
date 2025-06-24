"use client";

import React from 'react'
import {UserSettings} from "@/lib/generated/prisma";
import {differenceInDays, startOfMonth} from "date-fns";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {MAX_DATE_RANGE_DAYS} from "@/lib/constants";
import {toast} from "sonner";
import StatsCards from "@/app/(dashboard)/_components/StatsCards";

function Overview({userSettings}: { userSettings: UserSettings }) {
    const [dateRange, setDateRange] = React.useState<{from: Date; to: Date;}> ({
        from: startOfMonth(new Date()),
        to: new Date(),
    });



    return (
        <><div className="container flex flex-wrap items-center justify-between gap-2 py-6">
            <h2 className="text-3xl font-bold">Overview</h2>
            <div className="flex items-center gap-3">
                <DateRangePicker
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                showCompare={false}
                onUpdate={values => {
                    const { from, to } = values.range

                    if (!from || !to) return;
                    if (differenceInDays(to, from)>MAX_DATE_RANGE_DAYS) {
                        toast.error(`Date range too big.Allowed range is ${MAX_DATE_RANGE_DAYS} days!`);
                        return;
                    }

                    setDateRange({from, to});
                }}/>
            </div>
        </div>
        <StatsCards
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
        />

        </>
    )
}

export default Overview
