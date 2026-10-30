// Component Imports
import { Card } from '@/components/ui/card';
import DataTablePinnableColumns from '@/views/datatables/pinnable-columns/pinnable-columns-datatable';
const productData = [
    {
        productId: 1,
        productName: 'The Chronicle Q3 Print Digest',
        category: 'Quarterly Print',
        stockQuantity: 4500,
        price: 350,
        supplier: 'Geneva Press Print Hub',
        discontinued: 'no'
    },
    {
        productId: 2,
        productName: 'NRB Diaspora Anthology 2026',
        category: 'Special Edition',
        stockQuantity: 1200,
        price: 650,
        supplier: 'The Chronicle Media Ltd',
        discontinued: 'no'
    },
    {
        productId: 3,
        productName: 'Investigative Dossier: Garment Sector',
        category: 'Monograph',
        stockQuantity: 800,
        price: 450,
        supplier: 'Newsroom Press Geneva',
        discontinued: 'no'
    },
    {
        productId: 4,
        productName: 'Bangla Journalism Almanac 2025',
        category: 'Annual Archive',
        stockQuantity: 2500,
        price: 500,
        supplier: 'Geneva Press Club Archives',
        discontinued: 'yes'
    },
    {
        productId: 5,
        productName: 'Chittagong Port Deep Dive (Photo Book)',
        category: 'Photojournalism',
        stockQuantity: 650,
        price: 850,
        supplier: 'Chittagong Media Hub',
        discontinued: 'no'
    },
    {
        productId: 6,
        productName: 'Media Freedom in South Asia Report',
        category: 'Policy Report',
        stockQuantity: 300,
        price: 400,
        supplier: 'The Chronicle Research Unit',
        discontinued: 'yes'
    }
];
const DataTablePinnableColumn = ()=>{
    return <Card className='py-0'>
      <DataTablePinnableColumns data={productData}/>
    </Card>;
};
export default DataTablePinnableColumn;
