'use client';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const LanguageDropdown = ({ defaultOpen, align, trigger })=>{
    const [language, setLanguage] = useState('bangla');
    return <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger render={trigger}/>
      <DropdownMenuContent className='w-50' align={align || 'end'}>
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          <DropdownMenuRadioItem value='bangla'>বাংলা (Bangla)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='english'>English (BD)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>;
};
export default LanguageDropdown;
