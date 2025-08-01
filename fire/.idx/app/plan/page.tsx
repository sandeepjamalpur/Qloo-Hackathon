
'use client';

import { useState } from 'react';
import { Button } from 'fire/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'fire/src/components/ui/card';
import { Input } from 'fire/src/components/ui/input';
import { Label } from 'fire/src/components/ui/label';
import { DatePicker } from 'fire/src/components/DatePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'fire/src/components/ui/tabs';
import { getTransportOptions } from 'fire/src/app/actions';
import type { TransportOptions } from 'fire/src/ai/flows/get-transport-options';
import { Loader2, ArrowRight, Bus, Train, Plane, MapPin, Users, Calendar, ShipWheel } from 'lucide-react';
import { DiscoverSection } from 'fire/src/components/DiscoverSection';
import Image from 'next/image';

const TransportCard = ({ option, type }: { option: any; type: 'train' | 'bus' | 'flight' }) => {
    const getIcon = () => {
        if (type === 'train') return <Train className="w-5 h-5 text-primary" />;
        if (type === 'bus') return <Bus className="w-5 h-5 text-primary" />;
        if (type === 'flight') return <Plane className="w-5 h-5 text-primary" />;
        return null;
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 grid grid-cols-4 gap-4 items-center">
                <div className="col-span-1 flex items-center gap-3">
                    {getIcon()}
                    <div>
                        <p className="font-bold">{option.operator}</p>
                        <p className="text-sm text-muted-foreground">{option.vehicleNumber}</p>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-4 text-center">
                    <div>
                        <p className="font-mono text-lg">{option.departureTime}</p>
                        <p className="text-sm text-muted-foreground">{option.from}</p>
                    </div>
                    <div className="flex flex-col items-center text-muted-foreground">
                        <p className="text-xs">{option.duration}</p>
                        <ArrowRight className="w-4 h-4" />
                         {option.stops > 0 && <p className="text-xs">{option.stops} stop(s)</p>}
                    </div>
                    <div>
                        <p className="font-mono text-lg">{option.arrivalTime}</p>
                        <p className="text-sm text-muted-foreground">{option.to}</p>
                    </div>
                </div>
                <div className="col-span-1 text-right">
                    <p className="font-bold text-xl text-primary">{option.fare}</p>
                     {option.status !== 'On Time' && <p className="text-xs text-destructive">{option.status}</p>}
                    <Button size="sm" className="mt-2 w-full" asChild>
                        <a href={option.bookingLink} target="_blank" rel="noopener noreferrer">Book Now</a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function PlanTripPage() {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [travelers, setTravelers] = useState(1);
    const [loading, setLoading] = useState(false);
    const [transportOptions, setTransportOptions] = useState<TransportOptions | null>(null);

    const handleSearch = async () => {
        if (!destination || !startDate) {
            alert('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setTransportOptions(null);
        try {
            const options = await getTransportOptions({
                destination,
                startDate: startDate.toISOString(),
                endDate: endDate?.toISOString(),
                travelers,
            });
            setTransportOptions(options);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch transport options.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-muted/20">
            <section className="relative w-full h-[50vh] bg-background flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070"
                    alt="Lush landscape with mountains and a lake"
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="travel landscape"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/70" />
                <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center text-white p-4">
                     <div className="space-y-2 drop-shadow-md">
                        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl xl:text-7xl/none">
                            Plan Your Perfect Escape
                        </h1>
                        <p className="max-w-[700px] text-lg md:text-xl mx-auto">
                            Beyond booking. Discover, plan, and embark on unforgettable journeys.
                        </p>
                    </div>
                </div>
            </section>
            
            <div className="container mx-auto px-4 md:px-6">
                <section className="-mt-16 relative z-20">
                    <Card className="w-full max-w-5xl mx-auto p-4 md:p-6 shadow-2xl animate-slide-up-fade">
                        <CardContent className="p-2">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label htmlFor="destination" className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Destination</Label>
                                    <Input id="destination" placeholder="e.g., Manali" value={destination} onChange={(e) => setDestination(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="start-date" className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Travel Dates</Label>
                                    <DatePicker date={startDate} setDate={setStartDate} placeholder="Start Date" />
                                </div>
                                <div className="space-y-2">
                                     <Label htmlFor="travelers" className="flex items-center gap-2"><Users className="w-4 h-4" /> Travelers</Label>
                                    <Input id="travelers" type="number" min="1" value={travelers} onChange={(e) => setTravelers(parseInt(e.target.value, 10) || 0)} />
                                </div>
                                <Button onClick={handleSearch} disabled={loading} size="lg" className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Find Options'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
                
                {loading && (
                    <div className="text-center py-16 flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-primary h-8 w-8" />
                        <p className="text-muted-foreground">Gathering real-time travel data...</p>
                    </div>
                )}

                {transportOptions && (
                    <section className="py-12 md:py-16">
                        <Tabs defaultValue="trains" className="w-full">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                                <TabsTrigger value="trains"> <Train className="mr-2"/> Trains ({transportOptions.trains.length})</TabsTrigger>
                                <TabsTrigger value="buses"><Bus className="mr-2"/> Buses ({transportOptions.buses.length})</TabsTrigger>
                                <TabsTrigger value="flights"><Plane className="mr-2"/> Flights ({transportOptions.flights.length})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="trains" className="mt-6 space-y-4">
                                {transportOptions.trains.map((train, i) => <TransportCard key={i} option={train} type="train" />)}
                            </TabsContent>
                            <TabsContent value="buses" className="mt-6 space-y-4">
                                {transportOptions.buses.map((bus, i) => <TransportCard key={i} option={bus} type="bus" />)}
                            </TabsContent>
                            <TabsContent value="flights" className="mt-6 space-y-4">
                                {transportOptions.flights.map((flight, i) => <TransportCard key={i} option={flight} type="flight" />)}
                            </TabsContent>
                        </Tabs>
                    </section>
                )}
            </div>

            <DiscoverSection />

        </div>
    );
}
