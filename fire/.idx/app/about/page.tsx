
import { Logo } from 'fire/src/components/Logo';
import { UtensilsCrossed, Landmark, PartyPopper, Bot } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Logo className="h-20 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">About KALA</h1>
            <p className="text-xl text-muted-foreground">
              Your personal guide to the rich tapestry of Indian culture.
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none mx-auto text-lg leading-relaxed">
            <p>
              Welcome to <strong>KALA</strong>, a sophisticated cultural discovery application designed to be your companion in exploring the vast and vibrant world of Indian heritage. Our mission is to connect you with the stories, flavors, and traditions that make India one of the most culturally rich places on earth. The name "Kala" (कला) itself means "art" or "skill" in Sanskrit, reflecting our commitment to the artistry of culture.
            </p>
            <p>
              We believe that culture is a living, breathing entity, and our app is designed to bring it to life for you. Whether you're a seasoned traveler, a a curious foodie, or someone looking to reconnect with their roots, KALA offers a personalized journey into the heart of India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 my-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold">Our Philosophy</h2>
              <p className="text-muted-foreground text-lg">
                At KALA, we are driven by a passion for authenticity and a fascination with the power of technology. We use cutting-edge AI, powered by Google's Gemini, not to replace human experience, but to enhance it. Our AI helps curate personalized recommendations, provides rich context, and unlocks deeper insights into the cultural items you discover. We partner with services like Qloo to ensure the information and visuals we provide are relevant and of the highest quality.
              </p>
            </div>
            <div className="space-y-4">
               <h2 className="text-3xl font-headline font-bold">What We Offer</h2>
                <ul className="space-y-4 text-lg">
                    <li className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">AI-Powered Discovery</h3>
                            <p className="text-muted-foreground text-base">Intelligent, context-aware search and recommendations for food, temples, and festivals.</p>
                        </div>
                    </li>
                     <li className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                            <UtensilsCrossed className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Culinary Exploration</h3>
                            <p className="text-muted-foreground text-base">Discover dishes, learn about their origins, and explore regional cuisines.</p>
                        </div>
                    </li>
                     <li className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                            <Landmark className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Sacred & Historic Sites</h3>
                            <p className="text-muted-foreground text-base">Uncover the history and architectural beauty of India's iconic temples.</p>
                        </div>
                    </li>
                     <li className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                            <PartyPopper className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Vibrant Festivals</h3>
                            <p className="text-muted-foreground text-base">Learn about the significance and celebrations of India's colorful festivals.</p>
                        </div>
                    </li>
                </ul>
            </div>
          </div>
          
           <div className="text-center">
             <h2 className="text-3xl font-headline font-bold">Join Us on This Journey</h2>
             <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                KALA is more than just an app; it's a celebration of heritage. We invite you to start exploring, get inspired, and create your own cultural journey with us.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
