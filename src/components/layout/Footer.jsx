const Footer = ()=>{
    return <footer className='border-t border-border'>
      <div className='text-muted-foreground mx-auto flex size-full max-w-360 items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6'>
        <p className='text-sm text-balance max-sm:text-center'>
          {`© ${new Date().getFullYear()} The Chronicle (thechronicle.press) — Editorial Operations`}
        </p>
        <div className='flex items-center gap-4 text-xs max-sm:hidden'>
          <span>New York & London</span>
          <span>•</span>
          <span>Timezone: UTC (GMT)</span>
        </div>
      </div>
    </footer>;
};
export default Footer;
