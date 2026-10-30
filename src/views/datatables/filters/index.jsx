// Component Imports
import { Card } from '@/components/ui/card';
import DataTableFilters from '@/views/datatables/filters/filters-datatable';
const productData = [
    {
        id: '1',
        product: 'The Chronicle Q3 Print Digest',
        productImage: '/images/datatable/image-1.webp',
        fallback: 'BQD',
        price: 350,
        availability: 'In Stock',
        rating: 4.8
    },
    {
        id: '2',
        product: 'NRB Diaspora Anthology 2026',
        productImage: '/images/datatable/image-2.webp',
        fallback: 'NDA',
        price: 650,
        availability: 'Limited',
        rating: 4.9
    },
    {
        id: '3',
        product: 'Investigative Dossier: Garment Sector',
        productImage: '/images/datatable/image-1.webp',
        fallback: 'IDG',
        price: 450,
        availability: 'Out of Stock',
        rating: 4.7
    },
    {
        id: '4',
        product: 'Bangla Journalism Almanac 2025',
        productImage: '/images/datatable/image-2.webp',
        fallback: 'BJA',
        price: 500,
        availability: 'In Stock',
        rating: 4.6
    },
    {
        id: '5',
        product: 'Chittagong Port Deep Dive (Photo Book)',
        productImage: '/images/datatable/image-1.webp',
        fallback: 'CPD',
        price: 850,
        availability: 'Limited',
        rating: 4.5
    },
    {
        id: '6',
        product: 'Media Freedom in South Asia Report',
        productImage: '/images/datatable/image-2.webp',
        fallback: 'MFR',
        price: 400,
        availability: 'Limited',
        rating: 4.3
    },
    {
        id: '7',
        product: 'Sundarbans Conservation Dossier',
        productImage: '/images/datatable/image-1.webp',
        fallback: 'SCD',
        price: 480,
        availability: 'Out of Stock',
        rating: 4.4
    },
    {
        id: '8',
        product: 'Geneva Urban Mobility Special Report',
        productImage: '/images/datatable/image-2.webp',
        fallback: 'DUM',
        price: 320,
        availability: 'Out of Stock',
        rating: 4.2
    }
];
const DataTableWithFilters = ()=>{
    return <Card className='py-0'>
      <DataTableFilters data={productData}/>
    </Card>;
};
export default DataTableWithFilters;
