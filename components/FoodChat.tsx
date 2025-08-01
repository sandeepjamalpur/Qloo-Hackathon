
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { answerFoodQuestion } from '@/app/actions';
import { allFoodItemsForContext } from '@/lib/food-data';

interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
}

interface FoodChatProps {
    placeholder: string;
}

export function FoodChat({ placeholder }: FoodChatProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const { toast } = useToast();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const foodContext = useMemo(() => allFoodItemsForContext.map(item => `${item.name}: ${item.description}`).join('\n\n'), []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, chatLoading]);

    const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;

        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: chatInput }];
        setChatHistory(newHistory);
        const currentInput = chatInput;
        setChatInput('');
        setChatLoading(true);

        try {
            const answer = await answerFoodQuestion({ question: currentInput, context: foodContext });
            setChatHistory(prev => [...prev, { role: 'bot', content: answer }]);
        } catch (error) {
            console.error('Error fetching chat answer:', error);
            toast({
                variant: 'destructive',
                title: 'Error getting answer',
                description: 'Something went wrong. Please try again.',
            });
            // Revert to previous history on error by removing the user's message
            setChatHistory(prev => prev.slice(0, prev.length -1));
        } finally {
            setChatLoading(false);
        }
    };
    
    const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatSubmit();
        }
    };

    return (
        <div className="w-full">
            <div ref={chatContainerRef} className="space-y-4 h-96 overflow-y-auto p-4 border rounded-lg bg-muted/50">
                {chatHistory.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-muted-foreground text-center">{placeholder}</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' && 'justify-end')}>
                        {msg.role === 'bot' && <Bot className="w-6 h-6 shrink-0 text-primary" />}
                        <div className={cn(
                            "p-3 rounded-lg max-w-sm", 
                            msg.role === 'bot' ? 'bg-background' : 'bg-primary text-primary-foreground'
                        )}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && <User className="w-6 h-6 shrink-0" />}
                    </div>
                ))}
                {chatLoading && (
                     <div className="flex items-start gap-3">
                        <Bot className="w-6 h-6 shrink-0 text-primary" />
                        <div className="p-3 rounded-lg bg-background">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleChatSubmit(); }} className="mt-4 relative">
                <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Ask a question..."
                    className="w-full border rounded-lg p-3 pr-20 min-h-[4rem] resize-none"
                    disabled={chatLoading}
                />
                <Button 
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground hover:bg-accent/90"
                  size="sm"
                >
                    <CornerDownLeft className="w-4 h-4 mr-2"/>
                    Send
                </Button>
            </form>
        </div>
    );
}
