import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Section Skeleton */}
            <div className="border-b bg-card">
                <div className="container flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 py-6 sm:py-8 px-4 sm:px-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 hidden sm:block" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <Skeleton className="h-9 w-full sm:w-32" />
                        <Skeleton className="h-9 w-full sm:w-32" />
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="container px-4 sm:px-8 py-6 space-y-8">
                {/* Overview Section Skeleton */}
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

                {/* History Section Skeleton */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-32" />
                    </div>

                    {/* Transaction List */}
                    <div className="rounded-lg border bg-card">
                        <div className="p-6 space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
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
            </div>
        </div>
    )
}