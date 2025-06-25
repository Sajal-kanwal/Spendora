"use client";

import React, { ReactNode, useCallback } from "react";
import { TransactionType } from "@/lib/types";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "@/app/(dashboard)/_components/CategoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2, DollarSign, FileText, Calendar as CalendarLucide, Tag } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "@/app/(dashboard)/_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

function CreateTransactionDialog({ trigger, type }: Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            description: "",
            amount: 0,
            date: new Date(),
            category: "",
        },
    });

    const [open, setOpen] = React.useState(false);

    const handleCategoryChange = useCallback((value: string) => {
        form.setValue("category", value);
    }, [form]);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction successfully created 🥳", {
                id: "create-transaction",
            });

            form.reset({
                type,
                description: "",
                amount: 0,
                date: new Date(),
                category: "",
            });

            // After creating a transaction we need to invalidate the overview query which will refetch data in the homepage
            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });
            setOpen(false);
        },
        onError: (error) => {
            toast.error("Failed to create transaction. Please try again.", {
                id: "create-transaction",
            });
        }
    });

    const onSubmit = useCallback((values: CreateTransactionSchemaType) => {
        toast.loading("Creating transaction...", { id: "create-transaction" });
        mutate({
            ...values,
            date: DateToUTCDate(values.date),
        });
    }, [mutate]);

    const handleCancel = useCallback(() => {
        form.reset({
            type,
            description: "",
            amount: 0,
            date: new Date(),
            category: "",
        });
        setOpen(false);
    }, [form, type]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
                <DialogHeader className="space-y-3 pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <div className={cn(
                            "p-2 rounded-full",
                            type === "income"
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-rose-100 dark:bg-rose-900/30"
                        )}>
                            <DollarSign className={cn(
                                "h-4 w-4",
                                type === "income" ? "text-emerald-600" : "text-rose-600"
                            )} />
                        </div>
                        Create a new{" "}
                        <span className={cn(
                            "font-bold",
                            type === "income" ? "text-emerald-600" : "text-rose-600"
                        )}>
                            {type}
                        </span>
                        transaction
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4" />
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter transaction description..."
                                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-500">
                                        Optional: Brief description of the transaction
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <DollarSign className="h-4 w-4" />
                                        Amount
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...field}
                                            placeholder="0.00"
                                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-500">
                                        Required: Enter the transaction amount
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Tag className="h-4 w-4" />
                                            Category
                                        </FormLabel>
                                        <FormControl>
                                            <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600">
                                                <CategoryPicker
                                                    type={type}
                                                    onChange={handleCategoryChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">
                                            Select a category for this transaction
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <CalendarLucide className="h-4 w-4" />
                                            Transaction Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(value) => {
                                                        if (!value) return;
                                                        field.onChange(value);
                                                    }}
                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs text-gray-500">
                                            Select the date for this transaction
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                <DollarSign className="mr-2 h-4 w-4" />
                                Create {type}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTransactionDialog;