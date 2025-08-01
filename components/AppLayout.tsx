
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Home, Heart, Settings2, UtensilsCrossed, Landmark, PartyPopper, MapPin, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from './ui/scroll-area';

const navItems = [
  { href: '/', label: 'Home', icon: Home, public: true },
  { href: '/food', label: 'Food', icon: UtensilsCrossed, public: true },
  { href: '/temples', label: 'Temples', icon: Landmark, public: true },
  { href: '/festival', label: 'Festivals', icon: PartyPopper, public: true },
     ];


export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { user, logout } = useAuth();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/create-profile' || pathname === '/forgot-password';

  const visibleNavItems = navItems.filter(item => item.public || (!item.public && user));

  return (
    <div className="min-h-screen w-full bg-background font-sans flex flex-col">
      {!isAuthPage && (
        <header
          className={cn(
            'sticky top-0 z-50 transition-colors duration-300',
            isHomePage ? 'text-white' : 'bg-background text-foreground border-b'
          )}
        >
          <div className={cn("absolute inset-0 bg-gradient-to-b from-black/60 to-transparent", !isHomePage && "hidden")}></div>
          <div className="container relative z-10 mx-auto flex h-16 items-center px-4 md:px-6">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo className={cn('h-8')} />
            </Link>
            <nav className="hidden md:flex flex-1 items-center gap-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                          'text-sm font-medium relative h-auto px-4 py-2',
                          isHomePage ? 'text-white/90 hover:bg-white/10 hover:text-white' : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                          isActive && (isHomePage ? 'text-white' : 'text-primary')
                      )}
                    >
                      {item.label}
                      {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2 ml-auto">
              <div className={cn("h-6 w-px", isHomePage ? 'bg-white/20' : 'bg-border')}></div>
                {!user && (
                  <>
                    <Link href="/login" passHref>
                      <Button variant="ghost" className={cn(isHomePage ? 'text-white/90 hover:bg-white/10 hover:text-white' : '')}>Log In</Button>
                    </Link>
                  </>
                )}
                 <Link href="/liked" passHref>
                    <Button variant="ghost" size="icon" className={cn(isHomePage ? 'text-white/90 hover:bg-white/10 hover:text-white' : '')}>
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Liked Items</span>
                    </Button>
                  </Link>
                 <Link href="/settings" passHref>
                  <Button variant="ghost" size="icon" className={cn(isHomePage ? 'text-white/90 hover:bg-white/10 hover:text-white' : '')}>
                      <Settings2 className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                  </Button>
                 </Link>
            </div>

            <div className="flex flex-1 justify-end md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] flex flex-col p-0">
                   <div className="p-6 pb-0">
                      <SheetClose asChild>
                          <Link
                          href="/"
                          className="flex items-center gap-2 font-headline text-xl font-semibold"
                          >
                          <Logo className="h-10 text-primary" />
                          </Link>
                      </SheetClose>
                   </div>
                   <ScrollArea className="flex-grow">
                      <nav className="flex flex-col gap-4 p-6 pt-4">
                      {visibleNavItems.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                          <SheetClose asChild key={item.href}>
                              <Link href={item.href}>
                              <Button
                                  variant={isActive ? 'secondary' : 'ghost'}
                                  className={cn(
                                      "w-full justify-start gap-3 text-base py-6",
                                      isActive && "font-bold"
                                  )}
                              >
                                  <item.icon className="h-5 w-5 text-muted-foreground" />
                                  {item.label}
                              </Button>
                              </Link>
                          </SheetClose>
                      )})}
                      </nav>
                   </ScrollArea>
                   <div className="border-t p-6 mt-auto space-y-2">
                       <SheetClose asChild>
                          <Link href="/liked">
                            <Button
                              variant={pathname === '/liked' ? 'secondary' : 'ghost'}
                              className="w-full justify-start gap-3 text-base py-6"
                            >
                              <Heart className="h-5 w-5 text-muted-foreground" />
                              Liked Items
                            </Button>
                          </Link>
                        </SheetClose>
                       <SheetClose asChild>
                          <Link href="/settings">
                            <Button
                              variant={pathname === '/settings' ? 'secondary' : 'ghost'}
                              className="w-full justify-start gap-3 text-base py-6"
                            >
                              <Settings2 className="h-5 w-5 text-muted-foreground" />
                              Settings
                            </Button>
                          </Link>
                        </SheetClose>
                         {!user && (
                           <>
                             <SheetClose asChild>
                              <Link href="/login" className='w-full'>
                                <Button variant="default" className="w-full justify-center">
                                    <LogIn className="h-5 w-5 mr-2" />
                                    Log In
                                </Button>
                              </Link>
                             </SheetClose>
                           </>
                         )}
                     </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}
      <main className="bg-background flex-grow">{children}</main>
      { !isAuthPage && <Footer /> }
    </div>
  );
}
