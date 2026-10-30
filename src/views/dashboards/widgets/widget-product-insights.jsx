'use client';
// Third-party Imports
import { Bar, BarChart } from 'recharts';
// Component Imports
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
// Product reached data
const productReachChartData = [
    {
        month: 'January',
        reached: 168
    },
    {
        month: 'February',
        reached: 305
    },
    {
        month: 'March',
        reached: 213
    },
    {
        month: 'April',
        reached: 330
    },
    {
        month: 'May',
        reached: 305
    }
];
const productReachChartConfig = {
    reached: {
        label: 'Reached',
        color: 'var(--foreground)'
    }
};
// Order placed data
const orderPlacedChartData = [
    {
        month: 'January',
        orders: 168
    },
    {
        month: 'February',
        orders: 305
    },
    {
        month: 'March',
        orders: 213
    },
    {
        month: 'April',
        orders: 330
    },
    {
        month: 'May',
        orders: 305
    }
];
const orderPlacedChartConfig = {
    orders: {
        label: 'Orders',
        color: 'color-mix(in oklab, var(--foreground) 30%, transparent)'
    }
};
const ProductInsightsCard = ({ className })=>{
    return <Card className={className}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>Story Engagement</span>
          <span className='text-muted-foreground text-sm'>Feature Dispatch • 28 OCT 2026 (BST)</span>
        </div>
        <img src='/images/widgets/image-7.webp' alt='Story cover' className='w-20.5 rounded-md grayscale'/>
      </CardHeader>
      <CardContent>
        <Separator/>
      </CardContent>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs'>Story impressions</span>
            <span className='text-2xl font-semibold'>248,600</span>
          </div>
          <ChartContainer config={productReachChartConfig} className='min-h-13 max-w-18'>
            <BarChart accessibilityLayer data={productReachChartData} barSize={8}>
              <Bar dataKey='reached' fill='var(--color-reached)' radius={2}/>
            </BarChart>
          </ChartContainer>
        </div>

        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs'>Social shares &amp; quotes</span>
            <span className='text-2xl font-semibold'>18,450</span>
          </div>
          <ChartContainer config={orderPlacedChartConfig} className='min-h-13 max-w-18'>
            <BarChart accessibilityLayer data={orderPlacedChartData} barSize={8}>
              <Bar dataKey='orders' fill='var(--color-orders)' radius={2}/>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>;
};
export default ProductInsightsCard;
