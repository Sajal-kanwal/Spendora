"use client";
import React from 'react'
import Logo, {LogoMobile} from "@/components/logo";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";
import {ThemeSwitchBtn} from "@/components/ThemeSwitchBtn";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";

function Navbar() {
    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />
        </>
    );
}

const items = [
    {label: "Dashboard", link: "/"},
    {label: "Transactions", link: "/transactions"},
    {label: "Manage", link: "/manage"},
];

function MobileNavbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="block border-separate bg-background md:hidden">
            <nav className="container flex items-center justify-between px-8">
                <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]"
                                  side="left">
                        <Logo />
                        <div className="flex flex-col gap-1 pt-4">
                            {items.map((item) => (
                                <NavbarItem key={item.label} link={item.link} label={item.label} clickCallback={() => setIsOpen(prev => !prev)} />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <LogoMobile />
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitchBtn />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    )
}

function DesktopNavbar() {
    return (
        <div className="hidden md:block sticky top-0 z-50 bg-background border-b shadow-sm">
            <nav className="mx-auto max-w-screen-xl flex items-center justify-between px-4 md:px-8 h-[64px]">
                <div className="h-[64px] flex items-center gap-x-6">
                    <Logo />
                    <div className="flex h-full">
                        {items.map((item) => (
                            <NavbarItem key={item.label} link={item.link} label={item.label} />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitchBtn />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    )
}

function NavbarItem({link, label, clickCallback}: {link: string, label: string, clickCallback?: () => void}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link
                href={link}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors",
                    isActive && "text-foreground"
                )}
                onClick={() => {
                    if (clickCallback) clickCallback();
                }}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground transition-all duration-200 md:block"></div>
            )}
        </div>
    )
}

export default Navbar
