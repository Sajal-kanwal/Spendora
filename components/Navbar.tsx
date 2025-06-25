"use client";
import React from 'react'
import Logo, {LogoMobile} from "@/components/logo";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";
import {ThemeSwitchBtn} from "@/components/ThemeSwitchBtn";
import {Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import {Menu, BarChart3, CreditCard, Settings, TrendingUp, Wallet} from "lucide-react";

function Navbar() {
    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />
        </>
    );
}

const items = [
    {
        label: "Dashboard",
        link: "/",
        icon: BarChart3,
        description: "Overview & Analytics"
    },
    {
        label: "Transactions",
        link: "/transactions",
        icon: CreditCard,
        description: "Track your money flow"
    },
    {
        label: "Manage",
        link: "/manage",
        icon: Settings,
        description: "Categories & Settings"
    },
];

function MobileNavbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="block border-separate bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl md:hidden sticky top-0 z-50">
            <nav className="container flex items-center justify-between px-4 py-3">
                <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                    <SheetTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="relative overflow-hidden bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Menu className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        className="w-[320px] sm:w-[400px] bg-slate-900/98 backdrop-blur-xl border-r border-slate-800/50"
                        side="left"
                    >
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            Navigate through different sections of the application
                        </SheetDescription>
                        <div className="pt-6">
                            <Logo />
                        </div>
                        <div className="flex flex-col gap-3 pt-8">
                            {items.map((item) => (
                                <NavbarItem
                                    key={item.label}
                                    link={item.link}
                                    label={item.label}
                                    icon={item.icon}
                                    description={item.description}
                                    clickCallback={() => setIsOpen(false)}
                                    isMobile={true}
                                />
                            ))}
                        </div>
                        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between pt-6 border-t border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <ThemeSwitchBtn />
                                <UserButton
                                    afterSignOutUrl="/sign-in"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 ring-2 ring-slate-700 hover:ring-blue-500 transition-all duration-300"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex h-[60px] items-center">
                    <LogoMobile />
                </div>

                <div className="flex items-center gap-3">
                    <ThemeSwitchBtn />
                    <UserButton
                        afterSignOutUrl="/sign-in"
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 ring-2 ring-slate-700 hover:ring-blue-500 transition-all duration-300"
                            }
                        }}
                    />
                </div>
            </nav>
        </div>
    )
}

function DesktopNavbar() {
    return (
        <div className="hidden md:block border-separate border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-8">
                    <Logo />
                    <div className="flex h-full items-center gap-2">
                        {items.map((item) => (
                            <NavbarItem
                                key={item.label}
                                link={item.link}
                                label={item.label}
                                icon={item.icon}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitchBtn />
                    <UserButton
                        afterSignOutUrl="/sign-in"
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10 ring-2 ring-slate-700 hover:ring-blue-500 transition-all duration-300"
                            }
                        }}
                    />
                </div>
            </nav>
        </div>
    )
}

function NavbarItem({link, label, icon: Icon, description, clickCallback, isMobile = false}: {
    link: string,
    label: string,
    icon?: React.ComponentType<any>,
    description?: string,
    clickCallback?: () => void,
    isMobile?: boolean
}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    if (isMobile) {
        return (
            <div className="relative group">
                <Link
                    href={link}
                    className={cn(
                        "flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                        "text-slate-400 hover:text-white",
                        "hover:bg-slate-800/50 hover:border-slate-700/50",
                        isActive && "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                    )}
                    onClick={() => {
                        if (clickCallback) clickCallback();
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {Icon && (
                        <div className={cn(
                            "p-2 rounded-lg transition-all duration-300",
                            isActive
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-slate-800/50 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-white"
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-semibold text-base">{label}</span>
                        {description && (
                            <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                                {description}
                            </span>
                        )}
                    </div>
                </Link>
                {isActive && (
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50"></div>
                )}
            </div>
        )
    }

    return (
        <div className="relative flex items-center group">
            <Link
                href={link}
                className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
                    "text-slate-400 hover:text-white font-medium",
                    "hover:bg-slate-800/50 hover:border-slate-700/50",
                    isActive && "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                )}
                onClick={() => {
                    if (clickCallback) clickCallback();
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {Icon && (
                    <Icon className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                    )} />
                )}
                <span className="relative z-10">{label}</span>
            </Link>
            {isActive && (
                <div className="absolute -bottom-[1px] left-1/2 h-[3px] w-[60%] -translate-x-1/2 rounded-t-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50 transition-all duration-300"></div>
            )}
        </div>
    )
}

export default Navbar