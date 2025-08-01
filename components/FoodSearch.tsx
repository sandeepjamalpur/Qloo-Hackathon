
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FoodSearchProps {
  onSearch: (params: { query: string; place?: string }) => void;
  loading: boolean;
}

const allIndianStates = [
    { value: 'all', label: 'All Places' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Puducherry', label: 'Puducherry' },
];

export function FoodSearch({ onSearch, loading }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState('all');
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim() && place === 'all') {
      toast({
        variant: "destructive",
        title: "Search is empty",
        description: "Please enter a query or select a place to search.",
      });
      return;
    }
    const searchQuery = query.trim() || 'famous food';
    onSearch({ query: searchQuery, place: place === 'all' ? undefined : place });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-4 shadow-lg">
       <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
        <Input
          placeholder="e.g., 'biryani' or leave blank"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:col-span-3 h-10"
          disabled={loading}
          onKeyDown={handleKeyDown}
        />
        <Select value={place} onValueChange={setPlace} disabled={loading}>
            <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a place" />
            </SelectTrigger>
            <SelectContent>
                {allIndianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                        {state.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Button onClick={handleSearch} disabled={loading} className="h-10 bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? <Loader2 className="animate-spin" /> : 'Search'}
        </Button>
      </div>
    </Card>
  );
}
