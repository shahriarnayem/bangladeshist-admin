// Next Imports
import Link from 'next/link';
// Component Imports
import { Button } from '@/components/ui/button';
const DownloadButton = ()=>{
    return <Button render={<Link href='https://thechronicle.press' target='_blank'/>} className='fixed right-15 bottom-8 z-50' nativeButton={false}>
      The Chronicle Portal
    </Button>;
};
export default DownloadButton;
