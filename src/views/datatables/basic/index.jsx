// Component Imports
import { Card } from '@/components/ui/card';
import DataTableDemo from '@/views/datatables/basic/basic-datatable';
const transactionData = [
    {
        id: '1',
        name: 'Rafiqul Islam',
        amount: 35000.0,
        status: 'paid',
        email: 'rafiqul.islam@thechronicle.press'
    },
    {
        id: '2',
        name: 'Tahmina Begum',
        amount: 28500.0,
        status: 'pending',
        email: 'tahmina.begum@thechronicle.press'
    },
    {
        id: '3',
        name: 'Karim Uddin',
        amount: 22000.0,
        status: 'paid',
        email: 'karim.uddin@thechronicle.press'
    },
    {
        id: '4',
        name: 'Nusrat Jahan',
        amount: 31000.0,
        status: 'pending',
        email: 'nusrat.jahan@thechronicle.press'
    },
    {
        id: '5',
        name: 'Shabnam Akter',
        amount: 45000.0,
        status: 'paid',
        email: 'shabnam.akter@thechronicle.press'
    },
    {
        id: '6',
        name: 'Farhana Islam',
        amount: 18500.0,
        status: 'failed',
        email: 'farhana.islam@thechronicle.press'
    },
    {
        id: '7',
        name: 'Mahmudul Hasan',
        amount: 52000.0,
        status: 'paid',
        email: 'mahmudul.hasan@thechronicle.press'
    },
    {
        id: '8',
        name: 'Tanvir Ahmed',
        amount: 15000.0,
        status: 'processing',
        email: 'tanvir.ahmed@thechronicle.press'
    },
    {
        id: '9',
        name: 'Anika Tabassum',
        amount: 27500.0,
        status: 'paid',
        email: 'anika.tabassum@thechronicle.press'
    },
    {
        id: '10',
        name: 'Siddiqur Rahman',
        amount: 19800.0,
        status: 'pending',
        email: 'siddiqur.rahman@thechronicle.press'
    },
    {
        id: '11',
        name: 'Ziaur Rahman',
        amount: 64000.0,
        status: 'paid',
        email: 'ziaur.rahman@thechronicle.press'
    },
    {
        id: '12',
        name: 'Fariha Yasmin',
        amount: 21500.0,
        status: 'failed',
        email: 'fariha.yasmin@thechronicle.press'
    },
    {
        id: '13',
        name: 'Mustafizur Rahman',
        amount: 38000.0,
        status: 'processing',
        email: 'mustafizur.rahman@thechronicle.press'
    },
    {
        id: '14',
        name: 'Rokeya Sultana',
        amount: 42000.0,
        status: 'paid',
        email: 'rokeya.sultana@thechronicle.press'
    },
    {
        id: '15',
        name: 'Imtiaz Ahmed',
        amount: 17500.0,
        status: 'pending',
        email: 'imtiaz.ahmed@thechronicle.press'
    },
    {
        id: '16',
        name: 'Nayeem Chowdhury',
        amount: 33500.0,
        status: 'paid',
        email: 'nayeem.chowdhury@thechronicle.press'
    },
    {
        id: '17',
        name: 'Samia Haque',
        amount: 24000.0,
        status: 'failed',
        email: 'samia.haque@thechronicle.press'
    },
    {
        id: '18',
        name: 'Ashraful Alam',
        amount: 29500.0,
        status: 'processing',
        email: 'ashraful.alam@thechronicle.press'
    },
    {
        id: '19',
        name: 'Tasnim Hossain',
        amount: 26000.0,
        status: 'paid',
        email: 'tasnim.hossain@thechronicle.press'
    },
    {
        id: '20',
        name: 'Mizanur Rahman',
        amount: 58000.0,
        status: 'pending',
        email: 'mizanur.rahman@thechronicle.press'
    },
    {
        id: '21',
        name: 'Jannatul Ferdous',
        amount: 31500.0,
        status: 'paid',
        email: 'jannatul.ferdous@thechronicle.press'
    },
    {
        id: '22',
        name: 'Shahriar Kabir',
        amount: 41000.0,
        status: 'processing',
        email: 'shahriar.kabir@thechronicle.press'
    },
    {
        id: '23',
        name: 'Mehedi Hasan',
        amount: 23500.0,
        status: 'failed',
        email: 'mehedi.hasan@thechronicle.press'
    },
    {
        id: '24',
        name: 'Shakil Mahmud',
        amount: 72000.0,
        status: 'paid',
        email: 'shakil.mahmud@thechronicle.press'
    },
    {
        id: '25',
        name: 'Rumana Rashid',
        amount: 28000.0,
        status: 'pending',
        email: 'rumana.rashid@thechronicle.press'
    }
];
const DataTableBasic = ()=>{
    return <Card className='py-0'>
      <DataTableDemo data={transactionData}/>
    </Card>;
};
export default DataTableBasic;
