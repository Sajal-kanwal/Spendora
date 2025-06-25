"use client";
import React from 'react'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {DeleteTransaction} from "@/app/(dashboard)/transactions/_actions/deleteTransaction";
import {AlertTriangle, Trash2, X} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
    transaction?: {
        description: string;
        amount: number;
        type: "income" | "expense";
        category: string;
        categoryIcon: string;
        formattedAmount: string;
        date: string;
    };
    successCallback?: () => void;
}

function DeleteTransactionDialog({
                                     open,
                                     setOpen,
                                     transactionId,
                                     transaction,
                                     successCallback
                                 }: Props) {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {
            toast.success("Transaction deleted successfully!", {
                id: transactionId,
                description: "The transaction has been permanently removed from your records.",
            });
            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            successCallback?.();
            setOpen(false);
        },
        onError: (error) => {
            toast.error("Failed to delete transaction", {
                id: transactionId,
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        },
    });

    const handleDelete = () => {
        toast.loading("Deleting transaction...", {
            id: transactionId,
        });
        deleteMutation.mutate(transactionId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-md bg-slate-900 border-slate-700 text-white p-0 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-slate-800 transition-colors"
                    disabled={deleteMutation.isPending}
                >
                    <X className="h-4 w-4 text-slate-400 hover:text-white" />
                </button>

                {/* Header with Icon */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <AlertDialogTitle className="text-xl font-semibold text-white">
                            Delete Transaction?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-sm">
                            This action cannot be undone. The transaction will be permanently removed from your records.
                        </AlertDialogDescription>
                    </div>
                </div>

                {/* Transaction Details */}
                {transaction && (
                    <div className="px-6 pb-6">
                        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Transaction</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{transaction.categoryIcon}</span>
                                    <span className="text-sm font-medium text-white">{transaction.category}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Description</span>
                                <span className="text-sm font-medium text-white max-w-[180px] text-right truncate">
                                    {transaction.description}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Amount</span>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                                            transaction.type === "income"
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                        }`}
                                    >
                                        {transaction.type}
                                    </Badge>
                                    <span className="text-sm font-bold text-white">{transaction.formattedAmount}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Date</span>
                                <span className="text-sm font-medium text-white">{formatDate(transaction.date)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="px-6 pb-6">
                    <div className="flex gap-3">
                        <AlertDialogCancel
                            disabled={deleteMutation.isPending}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600 font-medium py-2.5"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 transition-colors"
                        >
                            {deleteMutation.isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete Transaction</span>
                                </div>
                            )}
                        </AlertDialogAction>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteTransactionDialog