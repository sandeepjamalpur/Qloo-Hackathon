
import Link from 'next/link';
import { Logo } from './Logo';
import { Github, Twitter, Instagram } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-muted/40 text-foreground border-t">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* About Section */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-2">
              <Logo className="h-10" />
            </Link>
            <p className="text-sm text-muted-foreground">
              KALA is your personal guide to the rich tapestry of Indian culture,<br />
              from ancient temples to vibrant festivals,
              and from sacred rituals to culinary delights.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Explore Links */}
              <div>
                <h4 className="font-semibold mb-3">Explore</h4>
                <nav className="flex flex-col gap-2">
                  <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
                  <Link href="/food" className="text-sm hover:text-primary transition-colors">Food</Link>
                  <Link href="/temples" className="text-sm hover:text-primary transition-colors">Temples</Link>
                  <Link href="/festival" className="text-sm hover:text-primary transition-colors">Festivals</Link>
                </nav>
              </div>
              
              {/* About Links */}
              <div>
                <h4 className="font-semibold mb-3">About</h4>
                <nav className="flex flex-col gap-2">
                  <Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link>
                  <Link href="/privacy-policy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="/terms-of-service" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
                </nav>
              </div>
              
              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-3">Connect</h4>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Github className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Twitter className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Instagram className="h-5 w-5" /></Link>
                    </Button>
                </div>
              </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KALA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
