import { Skeleton } from "@/components/ui/skeleton"

export function OverviewSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-40" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-8 w-32" />
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-6 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1">
                                    <Skeleton className="h-2 w-2 rounded-full" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-2 flex-1 mx-4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1">
                                    <Skeleton className="h-2 w-2 rounded-full" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-2 flex-1 mx-4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function HistorySkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-32" />
            </div>

            <div className="rounded-lg border bg-card">
                <div className="p-6 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded border">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function TransactionCardSkeleton() {
    return (
        <div className="flex items-center justify-between p-3 rounded border">
            <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
            </div>
        </div>
    )
}

export function StatsCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-3">
            <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-32" />
        </div>
    )
}