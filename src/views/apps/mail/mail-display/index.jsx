'use client';
// Component Imports
import { MailDisplayContent } from './mail-display-content';
export const MailDisplay = ({ email })=>{
    if (!email) {
        return <div className='text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-10 text-center'>
        <p className='text-foreground text-sm font-medium'>No message selected</p>
        <p className='text-xs'>Choose an email from the list to read it here.</p>
      </div>;
    }
    return <MailDisplayContent key={email.id} email={email}/>;
};
export default MailDisplay;
