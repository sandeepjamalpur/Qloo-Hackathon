
import { Logo } from '@/components/Logo';
import { UtensilsCrossed, Landmark, PartyPopper, Bot, BrainCircuit } from 'lucide-react';

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

          <div className="grid grid-cols-1 gap-10 my-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold">Our Philosophy</h2>
              <p className="text-muted-foreground text-lg">
                At KALA, we are driven by a passion for authenticity and a fascination with the power of technology. We use cutting-edge AI, powered by Google's Gemini, not to replace human experience, but to enhance it. Our AI helps curate personalized recommendations, provides rich context, and unlocks deeper insights into the cultural items you discover. We partner with services like Hugging Face to ensure the information and visuals we provide are relevant and of the highest quality.
              </p>
            </div>
            <div className="space-y-4">
               <h2 className="text-3xl font-headline font-bold">What We Offer</h2>
                <ul className="space-y-4 text-lg">
                    <li className="space-y-1">
                        <h3 className="font-semibold">AI-Powered Discovery</h3>
                        <p className="text-muted-foreground text-base">Intelligent, context-aware search and recommendations for food, temples, and festivals.</p>
                    </li>
                     <li className="space-y-1">
                        <h3 className="font-semibold">Culinary Exploration</h3>
                        <p className="text-muted-foreground text-base">Discover dishes, learn about their origins, and explore regional cuisines.</p>
                    </li>
                     <li className="space-y-1">
                        <h3 className="font-semibold">Sacred & Historic Sites</h3>
                        <p className="text-muted-foreground text-base">Uncover the history and architectural beauty of India's iconic temples.</p>
                    </li>
                     <li className="space-y-1">
                        <h3 className="font-semibold">Vibrant Festivals</h3>
                        <p className="text-muted-foreground text-base">Learn about the significance and celebrations of India's colorful festivals.</p>
                    </li>
                </ul>
            </div>
          </div>
          
          <div className="my-16">
            <div className="text-center mb-12">
                <BrainCircuit className="h-12 w-12 mx-auto text-primary mb-4" />
                <h2 className="text-3xl font-headline font-bold">Our Technology Stack</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-lg">
                    We leverage a modern, powerful stack to bring KALA to life, with a focus on AI-driven experiences.
                </p>
            </div>
            <div className="prose dark:prose-invert max-w-none mx-auto text-lg leading-relaxed space-y-6">
                <p>
                    <strong>Genkit:</strong> The backbone of our AI functionality is Google's Genkit, an open-source framework designed for building production-ready AI-powered applications. Genkit allows us to define, manage, and deploy complex AI flows that can call multiple models and external services in a structured and observable way. It simplifies everything from prompt engineering to tool definition, helping us create robust and scalable AI features.
                </p>
                <p>
                    <strong>Google Gemini API:</strong> For our core content generation, recommendations, and image creation, we rely on the powerful Gemini family of models from Google. This state-of-the-art multimodal AI helps us generate descriptive text, understand user prompts, and even create the beautiful, photorealistic images you see for many cultural items in the app.
                </p>
                <p>
                    <strong>Supabase:</strong> User authentication, profiles, and data storage are managed using Supabase, a powerful open-source Firebase alternative. It provides us with a scalable PostgreSQL database and easy-to-use APIs for managing user data securely.
                </p>
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
