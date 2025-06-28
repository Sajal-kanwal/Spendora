"use client";

import React from 'react'
import {Category} from "@/lib/generated/prisma";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {DeleteCategory} from "@/app/(dashboard)/_actions/categories";
import {toast} from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {AlertTriangle, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface Props {
    trigger: React.ReactNode;
    category: Category;
    successCallback?: () => void;
}

function DeleteCategoryDialog({category, trigger, successCallback}: Props) {
    const categoryIdentifier = `${category.name}-${category.type}`;
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Category deleted successfully!", {
                id: categoryIdentifier,
                description: "The category has been permanently removed from your records.",
            });
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            successCallback?.();
        },
        onError: (e) => {
            toast.error("Failed to delete category", {
                id: categoryIdentifier,
                description: e.message || "An unexpected error occurred. Please try again.",
            });
        },
    });

    const handleDelete = () => {
        toast.loading("Deleting category...", {
            id: categoryIdentifier,
        });
        deleteMutation.mutate({
            id: category.id,
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md bg-slate-900 border-slate-700 text-white p-0 overflow-hidden">
                {/* Header with Icon */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <AlertDialogTitle className="text-xl font-semibold text-white">
                            Delete Category?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-sm">
                            This action cannot be undone. The category will be permanently removed from your records.
                        </AlertDialogDescription>
                    </div>
                </div>

                {/* Category Details */}
                <div className="px-6 pb-6">
                    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Category</span>
                            <div className="flex items-center gap-2">
                                <span className="text-base">{category.icon}</span>
                                <span className="text-sm font-medium text-white">{category.name}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Type</span>
                            <Badge
                                className={`text-xs px-2 py-1 rounded-md font-medium ${
                                    category.type === "income"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                            >
                                {category.type}
                            </Badge>
                        </div>

                        {category.userId && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Created by</span>
                                <span className="text-sm font-medium text-white">You</span>
                            </div>
                        )}
                    </div>

                    {/* Warning Message */}
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-amber-300">
                                <p className="font-medium mb-1">Warning</p>
                                <p>Deleting this category may affect existing transactions that use it. Consider reviewing your transactions first.</p>
                            </div>
                        </div>
                    </div>
                </div>

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
                                    <span>Delete Category</span>
                                </div>
                            )}
                        </AlertDialogAction>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCategoryDialog