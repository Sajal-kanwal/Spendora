"use client";

import React, { useCallback } from 'react';
import { TransactionType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    CircleOff,
    Loader2,
    PlusSquare,
    Tag,
    Type,
    Smile,
    Sparkles,
    FolderPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "@/app/(dashboard)/_actions/categories";
import { Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
    type: TransactionType;
    successCallback: (category: Category) => void;
    trigger?: React.ReactNode;
}

function CreateCategoryDialog({ type, successCallback, trigger }: Props) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
            name: "",
            icon: "",
        },
    });

    const queryClient = useQueryClient();
    const theme = useTheme();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            form.reset({
                name: "",
                icon: "",
                type,
            });
            toast.success(`Category "${data.name}" created successfully! 🎉`, {
                id: "create-category",
            });

            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            setOpen(false);
        },
        onError: (error) => {
            toast.error("Failed to create category. Please try again.", {
                id: "create-category",
            });
            console.error("Category creation error:", error);
        },
    });

    const onSubmit = useCallback((values: CreateCategorySchemaType) => {
        toast.loading("Creating category...", {
            id: "create-category",
        });
        mutate(values);
    }, [mutate]);

    const handleCancel = useCallback(() => {
        form.reset({
            name: "",
            icon: "",
            type,
        });
        setOpen(false);
    }, [form, type]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="ghost"
                        className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <PlusSquare className="mr-2 h-4 w-4" />
                        Create new
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
                <DialogHeader className="space-y-3 pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <div className={cn(
                            "p-2 rounded-full",
                            type === "income"
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-rose-100 dark:bg-rose-900/30"
                        )}>
                            <FolderPlus className={cn(
                                "h-4 w-4",
                                type === "income" ? "text-emerald-600" : "text-rose-600"
                            )} />
                        </div>
                        Create{" "}
                        <span className={cn(
                            "font-bold",
                            type === "income" ? "text-emerald-600" : "text-rose-600"
                        )}>
                            {type}
                        </span>
                        category
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Organize your finances with custom categories
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <Type className="h-4 w-4" />
                                        Category Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter category name (e.g., Groceries, Salary, etc.)"
                                            {...field}
                                            value={field.value || ""}
                                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-500">
                                        This name will appear throughout the app to identify this category
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <Smile className="h-4 w-4" />
                                        Category Icon
                                    </FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    className="h-[120px] w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    {form.watch("icon") ? (
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                                                <span className="text-4xl" role="img" aria-label="Selected emoji">
                                                                    {field.value}
                                                                </span>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-medium">Selected Icon</p>
                                                                <p className="text-xs text-gray-500">Click to change</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                                                                <CircleOff className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-medium">Choose an Icon</p>
                                                                <p className="text-xs text-gray-500">Click to select emoji</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-full p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                                                align="center"
                                            >
                                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-center">Choose an Emoji</p>
                                                </div>
                                                <Picker
                                                    data={data}
                                                    theme={theme.resolvedTheme}
                                                    onEmojiSelect={(emoji: { native: string }) => {
                                                        field.onChange(emoji.native);
                                                    }}
                                                    previewPosition="none"
                                                    skinTonePosition="none"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-500">
                                        Select an emoji that represents this category visually
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Preview Section */}
                        {(form.watch("name") || form.watch("icon")) && (
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                                    <span className="text-2xl" role="img">
                                        {form.watch("icon") || "📁"}
                                    </span>
                                    <span className="font-medium">
                                        {form.watch("name") || "Category Name"}
                                    </span>
                                    <span className={cn(
                                        "ml-auto px-2 py-1 rounded-full text-xs font-medium",
                                        type === "income"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                    )}>
                                        {type}
                                    </span>
                                </div>
                            </div>
                        )}
                    </form>
                </Form>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                        className={cn(
                            "w-full sm:w-auto font-medium",
                            type === "income"
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-rose-600 hover:bg-rose-700 text-white"
                        )}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FolderPlus className="mr-2 h-4 w-4" />
                                Create Category
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCategoryDialog;