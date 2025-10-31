import React from 'react'
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modetoggle() {
      const theme="dark";

  return (
    

    <Button variant="ghost" size="icon" className=
    
    {cn( "-mt-1 mr-4 h-9 w-9", theme =="dark" ?" text-red-500" : "text-blue-500")}>
    {/* tailwing classes merge using CN */}
    <Sun className="h-5 w-10" />
    </Button>   

  )
}