// React Imports
// Component Imports
import { ThemeProvider } from './ThemeProvider';
import { SidebarProvider } from './ui/sidebar';
import { TooltipProvider } from './ui/tooltip';
const Providers = ({ children, sidebarDefaultOpen })=>{
    return <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
      <TooltipProvider>
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>{children}</SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>;
};
export default Providers;
