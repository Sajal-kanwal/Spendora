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
        <div className="block border-separate bg-background/95 backdrop-blur-sm border-b shadow-sm md:hidden sticky top-0 z-50">
            <nav className="container flex items-center justify-between px-4 py-2">
                <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                    <SheetTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="hover:bg-accent/50 border border-border/50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        className="w-[300px] sm:w-[400px] bg-background/98 backdrop-blur-md border-r"
                        side="left"
                    >
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            Navigate through different sections of the application
                        </SheetDescription>
                        <div className="pt-4">
                            <Logo />
                        </div>
                        <div className="flex flex-col gap-2 pt-6">
                            {items.map((item) => (
                                <NavbarItem
                                    key={item.label}
                                    link={item.link}
                                    label={item.label}
                                    clickCallback={() => setIsOpen(false)}
                                    isMobile={true}
                                />
                            ))}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pt-4 border-t border-border/20">
                            <ThemeSwitchBtn />
                            <UserButton afterSignOutUrl="/sign-in" />
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex h-[60px] items-center">
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
        <div className="hidden md:block border-separate border-b bg-background">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
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

function NavbarItem({link, label, clickCallback, isMobile = false}: {
    link: string,
    label: string,
    clickCallback?: () => void,
    isMobile?: boolean
}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link
                href={link}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200",
                    isMobile ? "text-base py-3 px-4 rounded-lg" : "text-lg",
                    isActive && "text-foreground bg-accent/30"
                )}
                onClick={() => {
                    if (clickCallback) clickCallback();
                }}
            >
                {label}
            </Link>
            {isActive && !isMobile && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground transition-all duration-200 md:block"></div>
            )}
            {isActive && isMobile && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"></div>
            )}
        </div>
    )
}

export default Navbar