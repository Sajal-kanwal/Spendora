"use client";

import React, {useMemo, useState} from 'react'
import {useQuery} from "@tanstack/react-query";
import {DateToUTCDate} from "@/lib/helpers";
import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {GetTransactionsHistoryResponseType} from "@/app/api/transactions-history/route";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {DataTableColumnHeader} from "@/components/datatable/ColumnHeader";
import {cn} from "@/lib/utils";
import {DataTableFacetedFilter} from "@/components/datatable/FacetedFilters";
import {DataTableViewOptions} from "@/components/datatable/ColumnToggle";
import {Button} from "@/components/ui/button";
import {download, generateCsv, mkConfig} from "export-to-csv";
import {CircleEllipsis, CloudDownload, TrashIcon, Search, Filter, X, ChevronLeft, ChevronRight} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import DeleteTransactionDialog from "@/app/(dashboard)/transactions/_components/DeleteTransactionDialog";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";

interface Props {
    from: Date;
    to: Date;
}

const emptyData: any[] = [];

type TransactionHistoryRow = GetTransactionsHistoryResponseType[0];

// Currency symbols mapping
const getCurrencySymbol = (currencyCode: string): string => {
    const currencySymbols: { [key: string]: string } = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'C$',
        'AUD': 'A$',
        'CHF': 'CHF',
        'CNY': '¥',
        'SEK': 'kr',
        'NZD': 'NZ$'
    };
    return currencySymbols[currencyCode] || currencyCode;
};

// Function to format amount with user's currency
const formatAmountWithCurrency = (amount: number, currencyCode: string): string => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${Math.abs(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

function TransactionTable({ from, to }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Fetch user settings to get currency
    const userSettingsQuery = useQuery({
        queryKey: ["userSettings"],
        queryFn: () => fetch(`/api/user-settings`).then(res => res.json()),
    });

    const history = useQuery<GetTransactionsHistoryResponseType>({
        queryKey: ["transactions", "history", from, to],
        queryFn: () => fetch(`/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json()),
    });

    // Get user's currency, default to 'USD' if not available
    const userCurrency = userSettingsQuery.data?.currency || 'USD';

    // Create columns with dynamic currency
    const columns: ColumnDef<TransactionHistoryRow>[] = useMemo(() => [
        {
            accessorKey: "category",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={"Category"} />
            ),
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
            cell: ({row}) => (
                <div className="flex gap-3 items-center min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
                        <span className="text-base">{row.original.categoryIcon}</span>
                    </div>
                    <div className="font-semibold capitalize text-gray-900 dark:text-white truncate">
                        {row.original.category}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "description",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={"Description"} />
            ),
            cell: ({row}) => (
                <div className="max-w-[250px] lg:max-w-[300px] truncate font-medium text-gray-700 dark:text-gray-300" title={row.original.description}>
                    {row.original.description}
                </div>
            )
        },
        {
            accessorKey: "date",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={"Date"} />
            ),
            cell: ({row}) => {
                const date = new Date(row.original.date);
                const formattedDate = date.toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });
                return (
                    <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                        {formattedDate}
                    </div>
                )
            },
        },
        {
            accessorKey: "type",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={"Type"} />
            ),
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
            cell: ({row}) => (
                <Badge
                    variant={row.original.type === "income" ? "default" : "destructive"}
                    className={cn(
                        "font-semibold text-xs px-3 py-1.5 rounded-full border-0 shadow-sm",
                        row.original.type === "income" && "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600",
                        row.original.type === "expense" && "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600"
                    )}
                >
                    {row.original.type}
                </Badge>
            )
        },
        {
            accessorKey: "amount",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={"Amount"} />
            ),
            cell: ({row}) => (
                <div className={cn(
                    "text-right font-bold text-sm px-4 py-2 rounded-xl border shadow-sm",
                    row.original.type === "income"
                        ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:text-green-400 dark:from-green-950/50 dark:to-emerald-950/50 dark:border-green-800"
                        : "text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 dark:text-red-400 dark:from-red-950/50 dark:to-rose-950/50 dark:border-red-800"
                )}>
                    {formatAmountWithCurrency(row.original.amount, userCurrency)}
                </div>
            )
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({row}) => (
                <RowActions transaction={row.original} />
            )
        }
    ], [userCurrency]);

    const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
    });

    const handleExportCSV = (data: any[]) => {
        // Format data for CSV export with dynamic currency
        const formattedData = data.map(row => ({
            category: row.category,
            categoryIcon: row.categoryIcon,
            description: row.description,
            type: row.type,
            amount: row.amount,
            formattedAmount: formatAmountWithCurrency(row.amount, userCurrency),
            date: row.date,
        }));

        const csv = generateCsv(csvConfig)(formattedData);
        download(csvConfig)(csv);
    }

    const table = useReactTable({
        data: history.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 8
            },
        },
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            const searchableFields = [
                row.original.description,
                row.original.category,
                row.original.type,
                formatAmountWithCurrency(row.original.amount, userCurrency)
            ];

            return searchableFields.some(field =>
                field?.toString().toLowerCase().includes(searchValue)
            );
        },
    });

    const categoriesOptions = useMemo(() => {
        const categoriesMap = new Map();
        history.data?.forEach((transaction) => {
            categoriesMap.set(transaction.category, {
                value: transaction.category,
                label: `${transaction.categoryIcon} ${transaction.category}`,
            });
        });
        const uniqueCategories = new Set(categoriesMap.values());
        return Array.from(uniqueCategories);
    }, [history.data]);

    const hasActiveFilters = columnFilters.length > 0 || globalFilter.length > 0;

    const clearAllFilters = () => {
        setColumnFilters([]);
        setGlobalFilter("");
    };

    // Show loading state while fetching user settings or transaction history
    const isLoading = history.isFetching || userSettingsQuery.isLoading;

    return (
        <div className="w-full space-y-6 p-4 sm:p-6">
            {/* Search and Filters Section */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Search transactions by description, category, or amount..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-12 h-12 text-base bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-wrap gap-3">
                        {table.getColumn("category") && (
                            <DataTableFacetedFilter
                                title={"Category"}
                                column={table.getColumn("category")}
                                options={categoriesOptions}
                            />
                        )}
                        {table.getColumn("type") && (
                            <DataTableFacetedFilter
                                title={"Type"}
                                column={table.getColumn("type")}
                                options={[
                                    {label: "Income", value: "income"},
                                    {label: "Expense", value: "expense"},
                                ]}
                            />
                        )}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearAllFilters}
                                className="h-10 px-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Clear filters
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const data = table.getFilteredRowModel().rows.map(row => ({
                                    category: row.original.category,
                                    categoryIcon: row.original.categoryIcon,
                                    description: row.original.description,
                                    type: row.original.type,
                                    amount: row.original.amount,
                                    formattedAmount: formatAmountWithCurrency(row.original.amount, userCurrency),
                                    date: row.original.date,
                                }));
                                handleExportCSV(data);
                            }}
                            className="h-10 px-4 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/70"
                        >
                            <CloudDownload className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                        <DataTableViewOptions table={table} />
                    </div>
                </div>

                {/* Results Counter */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
                    <Filter className="h-4 w-4" />
                    <span>
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{table.getFilteredRowModel().rows.length}</span> of{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">{table.getCoreRowModel().rows.length}</span> transactions
                    </span>
                </div>
            </div>

            {/* Table */}
            <SkeletonWrapper isLoading={isLoading}>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className="font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 py-4">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">No transactions found</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {hasActiveFilters ? "Try adjusting your filters" : "No transactions available for the selected date range"}
                                                    </div>
                                                </div>
                                                {hasActiveFilters && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={clearAllFilters}
                                                        className="text-xs"
                                                    >
                                                        Clear all filters
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Enhanced Pagination */}
                {table.getPageCount() > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">
                                Page <span className="text-gray-900 dark:text-white">{table.getState().pagination.pageIndex + 1}</span> of{" "}
                                <span className="text-gray-900 dark:text-white">{table.getPageCount()}</span>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>
                                <span className="text-gray-900 dark:text-white font-medium">{table.getRowModel().rows.length}</span> of{" "}
                                <span className="text-gray-900 dark:text-white font-medium">{table.getFilteredRowModel().rows.length}</span> results
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="h-9 px-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="h-9 px-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </SkeletonWrapper>
        </div>
    );
}

export default TransactionTable

function RowActions({ transaction }: { transaction: TransactionHistoryRow }) {
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

    return (
        <>
            <DeleteTransactionDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                transactionId={transaction.id}
                transaction={{
                    ...transaction,
                    type: transaction.type as "income" | "expense",
                    date: transaction.date.toString(),
                }}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <span className="sr-only">Open Menu</span>
                        <CircleEllipsis className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg"
                >
                    <DropdownMenuLabel className="text-gray-900 dark:text-white font-semibold">
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem
                        className="flex items-center gap-3 text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer rounded-md mx-1"
                        onSelect={() => {
                            setShowDeleteDialog(true)
                        }}
                    >
                        <TrashIcon className="h-4 w-4" />
                        Delete transaction
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}