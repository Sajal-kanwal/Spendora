"use client";
import React, { useState } from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CurrencyComboBox} from "@/components/CurrencyComboBox";
import {TransactionType} from "@/lib/types";
import {useQuery} from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {PlusSquare, TrashIcon, Settings, Coins, ArrowUpCircle, ArrowDownCircle, Menu, Info} from "lucide-react";
import CreateCategoryDialog from "@/app/(dashboard)/_components/CreateCategoryDialog";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {Category} from "@/lib/generated/prisma";
import DeleteCategoryDialog from "@/app/(dashboard)/_components/DeleteCategoryDialog";
import {Badge} from "@/components/ui/badge";
import {Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription} from "@/components/ui/sheet";

type ActiveSection = 'overview' | 'currency' | 'income' | 'expense';

function Page() {
    const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        {
            id: 'overview' as const,
            label: 'Overview',
            icon: Settings,
            description: 'Account overview and settings'
        },
        {
            id: 'currency' as const,
            label: 'Currency',
            icon: Coins,
            description: 'Default currency settings'
        },
        {
            id: 'income' as const,
            label: 'Income Categories',
            icon: ArrowUpCircle,
            description: 'Manage income categories'
        },
        {
            id: 'expense' as const,
            label: 'Expense Categories',
            icon: ArrowDownCircle,
            description: 'Manage expense categories'
        }
    ];

    const handleSectionChange = (section: ActiveSection) => {
        setActiveSection(section);
        setMobileMenuOpen(false);
    };

    const NavigationContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <nav className={cn("space-y-2", isMobile ? "p-0" : "p-2")}>
            {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;

                if (isMobile) {
                    return (
                        <div key={item.id} className="relative group">
                            <button
                                onClick={() => handleSectionChange(item.id)}
                                className={cn(
                                    "flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    "text-muted-foreground hover:text-foreground",
                                    "hover:bg-muted/50 hover:border-muted-foreground/20",
                                    isActive && "text-foreground bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className={cn(
                                    "p-2 rounded-lg transition-all duration-300",
                                    isActive
                                        ? "bg-primary/20 text-primary"
                                        : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                                )}>
                                    <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold text-base">{item.label}</span>
                                    <span className="text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors duration-300">
                                        {item.description}
                                    </span>
                                </div>
                            </button>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-primary/80 shadow-lg shadow-primary/50"></div>
                            )}
                        </div>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => handleSectionChange(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200",
                            "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                            isActive
                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            isActive ? "bg-primary/10" : "bg-muted/50"
                        )}>
                            <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                                {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                                {item.description}
                            </div>
                        </div>
                    </button>
                );
            })}
        </nav>
    );

    const currentMenuItem = menuItems.find(item => item.id === activeSection);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Modern Header */}
            <div className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                                    <Settings className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">Settings</h1>
                                    <p className="text-sm text-muted-foreground">Manage your preferences</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Menu className="h-4 w-4" />
                                        {currentMenuItem?.label || 'Menu'}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[320px] sm:w-[380px]"
                                >
                                    <SheetHeader className="text-left pb-6">
                                        <SheetTitle className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                                                <Settings className="h-5 w-5 text-primary" />
                                            </div>
                                            Settings Menu
                                        </SheetTitle>
                                        <SheetDescription>
                                            Navigate through different settings sections
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-3 pt-4">
                                        <NavigationContent isMobile={true} />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="lg:grid lg:grid-cols-5 lg:gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base">Navigation</CardTitle>
                                    <CardDescription className="text-xs">Configure your account</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 pb-4">
                                    <NavigationContent />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-4 space-y-6">
                        {activeSection === 'overview' && <OverviewSection />}
                        {activeSection === 'currency' && <CurrencySection />}
                        {activeSection === 'income' && <CategoryList type="income" />}
                        {activeSection === 'expense' && <CategoryList type="expense" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function OverviewSection() {
    const incomeCategoriesQuery = useQuery({
        queryKey: ["categories", "income"],
        queryFn: () => fetch(`/api/categories?type=income`).then(res => res.json()),
    });

    const expenseCategoriesQuery = useQuery({
        queryKey: ["categories", "expense"],
        queryFn: () => fetch(`/api/categories?type=expense`).then(res => res.json()),
    });

    const userSettingsQuery = useQuery({
        queryKey: ["userSettings"],
        queryFn: () => fetch(`/api/user-settings`).then(res => res.json()),
    });

    const incomeCount = incomeCategoriesQuery.data?.length || 0;
    const expenseCount = expenseCategoriesQuery.data?.length || 0;
    const isLoading = incomeCategoriesQuery.isLoading || expenseCategoriesQuery.isLoading || userSettingsQuery.isLoading;

    const getCurrencyDisplay = (currencyCode: string) => {
        const currencySymbols: { [key: string]: string } = {
            'INR': '₹ Indian Rupee (INR)',
            'USD': '$ US Dollar (USD)',
            'EUR': '€ Euro (EUR)',
            'GBP': '£ British Pound (GBP)',
            'JPY': '¥ Japanese Yen (JPY)',
        };
        return currencySymbols[currencyCode] || `${currencyCode}`;
    };

    return (
        <SkeletonWrapper isLoading={isLoading}>
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold mb-2">Account Overview</h2>
                    <p className="text-muted-foreground">Quick overview of your account settings and configuration</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <ArrowUpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Income Categories</p>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{incomeCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-rose-50/80 to-rose-100/50 dark:from-rose-950/50 dark:to-rose-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                    <ArrowDownCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300">Expense Categories</p>
                                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{expenseCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/20 sm:col-span-2 lg:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Default Currency</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
                                        {userSettingsQuery.data ?
                                            getCurrencyDisplay(userSettingsQuery.data.currency).split(' ')[0] :
                                            '...'
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Currency Card */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Coins className="h-5 w-5 text-primary" />
                            </div>
                            Currency Configuration
                        </CardTitle>
                        <CardDescription>Your default currency settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/20 rounded-xl border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-lg">
                                        {userSettingsQuery.data ?
                                            getCurrencyDisplay(userSettingsQuery.data.currency) :
                                            'Loading...'
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground">Active currency</div>
                                </div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    Default
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SkeletonWrapper>
    );
}

function CurrencySection() {
    const userSettingsQuery = useQuery({
        queryKey: ["userSettings"],
        queryFn: () => fetch(`/api/user-settings`).then(res => res.json()),
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold mb-2">Currency Settings</h2>
                <p className="text-muted-foreground">Configure your default currency for transactions</p>
            </div>

            {/* Main Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Coins className="h-5 w-5 text-primary" />
                        </div>
                        Default Currency
                    </CardTitle>
                    <CardDescription>
                        This currency will be used as the default for all new transactions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
                        <CurrencyComboBox />
                    </SkeletonWrapper>

                    {/* Info Card */}
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl">
                        <div className="flex gap-3">
                            <div className="p-1.5 rounded-lg bg-blue-500/10">
                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-blue-700 dark:text-blue-300 text-sm">Important Note</p>
                                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                                    Changing your default currency will not affect existing transactions. Only new transactions will use the updated currency.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CategoryList({type}: {type: TransactionType}) {
    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then(res => res.json()),
    });

    const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;
    const isIncome = type === "income";

    return (
        <div className="space-y-6">
            {/* Header with Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-3">
                        <div className={cn(
                            "p-2 rounded-lg",
                            isIncome ? "bg-emerald-500/10" : "bg-rose-500/10"
                        )}>
                            {isIncome ? (
                                <ArrowUpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            )}
                        </div>
                        {isIncome ? "Income" : "Expense"} Categories
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your {type} categories to organize your transactions
                    </p>
                </div>
                <CreateCategoryDialog
                    type={type}
                    successCallback={() => categoriesQuery.refetch()}
                    trigger={
                        <Button className="gap-2 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                            <PlusSquare className="h-4 w-4" />
                            Create Category
                        </Button>
                    }
                />
            </div>

            {/* Categories Card */}
            <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant={isIncome ? "default" : "destructive"}
                                    className={cn(
                                        "px-3 py-1",
                                        isIncome
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                                    )}
                                >
                                    {dataAvailable ? categoriesQuery.data.length : 0} categories
                                </Badge>
                                <span className="text-sm text-muted-foreground">Organized by name</span>
                            </div>
                        </div>
                    </CardHeader>

                    {!dataAvailable && (
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className={cn(
                                    "p-4 rounded-2xl",
                                    isIncome ? "bg-emerald-500/10" : "bg-rose-500/10"
                                )}>
                                    {isIncome ? (
                                        <ArrowUpCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <ArrowDownCircle className="h-12 w-12 text-rose-600 dark:text-rose-400" />
                                    )}
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-semibold text-lg">
                                        No {type} categories yet
                                    </p>
                                    <p className="text-muted-foreground max-w-md">
                                        Create your first category to start organizing your {type} transactions more effectively
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    )}

                    {dataAvailable && (
                        <CardContent className="p-6">
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categoriesQuery.data.map((category: Category) => (
                                    <CategoryCard
                                        key={category.name}
                                        category={category}
                                        type={type}
                                        onDelete={() => categoriesQuery.refetch()}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </SkeletonWrapper>
        </div>
    );
}

function CategoryCard({category, type, onDelete}: {category: Category, type: TransactionType, onDelete: () => void}) {
    const isIncome = type === "income";

    return (
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
                {/* Category Display */}
                <div className="p-6 text-center space-y-4">
                    <div className={cn(
                        "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg",
                        isIncome
                            ? "bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/20"
                            : "bg-gradient-to-br from-rose-400/20 to-rose-600/20 border border-rose-500/20"
                    )}>
                        <span>{category.icon}</span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold truncate">{category.name}</h3>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-xs",
                                isIncome
                                    ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/50"
                                    : "border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300 bg-rose-50/50 dark:bg-rose-950/50"
                            )}
                        >
                            {type}
                        </Badge>
                    </div>
                </div>

                {/* Action Area */}
                <div className="border-t bg-muted/20 p-3">
                    <DeleteCategoryDialog
                        trigger={
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full gap-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-200 transition-colors"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Remove
                            </Button>
                        }
                        category={category}
                        successCallback={onDelete}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export default Page