
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, MapPin, Star } from "lucide-react";

const destinations = [
  {
    category: 'Nature Escapes',
    name: 'Ziro Valley, Arunachal Pradesh',
    description: 'A lush green paradise famed for its paddy-cum-pisciculture cultivation and the tranquil home of the Apatani tribe. Perfect for music festivals and serene walks.',
    image: 'https://images.unsplash.com/photo-1621204123304-0e334a1a5b17?q=80&w=870',
    bestTime: 'Mar-May, Sep-Oct'
  },
  {
    category: 'Nature Escapes',
    name: 'Gurez Valley, Kashmir',
    description: 'An untouched, breathtaking valley with the turquoise Kishanganga River flowing through it. Offers pristine landscapes, log houses, and a glimpse into traditional village life.',
    image: 'https://images.unsplash.com/photo-1688560372304-4afe3373434b?q=80&w=870',
    bestTime: 'Jun-Sep'
  },
  {
    category: 'Historical Gems',
    name: 'Hampi, Karnataka',
    description: 'Explore the ruins of the Vijayanagara Empire in a surreal landscape of giant boulders. A UNESCO World Heritage site that feels like stepping onto another planet.',
    image: 'https://images.unsplash.com/photo-1599309228848-7a8e18378518?q=80&w=870',
    bestTime: 'Oct-Feb'
  },
  {
    category: 'Historical Gems',
    name: 'Dholavira, Gujarat',
    description: 'Walk through the excavated remains of a major Harappan city, one of the five largest in the subcontinent. Marvel at ancient urban planning and water conservation systems.',
    image: 'https://images.unsplash.com/photo-1624555138247-d159ff4b3a4a?q=80&w=870',
    bestTime: 'Oct-Mar'
  },
  {
    category: 'Cultural Immersion',
    name: 'Majuli, Assam',
    description: 'The world\'s largest river island, Majuli is a hub of Neo-Vaishnavite culture. Visit ancient Satras (monasteries), interact with mask-makers, and enjoy the tranquil riverine life.',
    image: 'https://images.unsplash.com/photo-1626632497645-3f5f3a9e3d2c?q=80&w=870',
    bestTime: 'Oct-Mar'
  },
   {
    category: 'Adventure Travel',
    name: 'Spiti Valley, Himachal Pradesh',
    description: 'A high-altitude desert mountain landscape dotted with ancient monasteries and quaint villages. Ideal for trekking, biking, and stargazing.',
    image: 'https://images.unsplash.com/photo-1604928141068-a2484e3e4917?q=80&w=870',
    bestTime: 'Jun-Sep'
  },
];

const categories = ['All', 'Nature Escapes', 'Historical Gems', 'Cultural Immersion', 'Adventure Travel'];

export function DiscoverSection() {
    const [filter, setFilter] = useState('All');

    const filteredDestinations = filter === 'All'
        ? destinations
        : destinations.filter(d => d.category === filter);

    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Discover the Unseen</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Journey beyond the usual. Explore our curated list of hidden gems and off-the-beaten-path destinations in India.
                    </p>
                </div>

                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={filter === category ? 'default' : 'outline'}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDestinations.map(dest => (
                        <Card key={dest.name} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="relative aspect-video">
                                <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="travel destination" />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{dest.category}</div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-bold mb-2">{dest.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 h-16">{dest.description}</p>
                                <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
                                     <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>Best time: {dest.bestTime}</span>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto">
                                        Explore <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

