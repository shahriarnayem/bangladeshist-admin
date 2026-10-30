// Component Imports
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
const BasicForm = ()=>{
    return <form>
      <FieldGroup className='gap-6'>
        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-name'>Contributor</FieldLabel>
          <Input id='horizontal-basic-name' className='sm:col-span-5' placeholder='Tanvir Ahmed'/>
        </Field>

        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-company'>Publication / Desk</FieldLabel>
          <Input id='horizontal-basic-company' className='sm:col-span-5' placeholder='The Chronicle Media Ltd'/>
        </Field>

        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-email'>Email</FieldLabel>
          <InputGroup className='sm:col-span-5'>
            <InputGroupInput id='horizontal-basic-email' placeholder='tanvir.ahmed'/>
            <InputGroupAddon align='inline-end' className='text-foreground font-normal'>
              @thechronicle.press
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-phone'>Phone No</FieldLabel>
          <Input id='horizontal-basic-phone' className='sm:col-span-5' type='tel' placeholder='+880 1712-345678'/>
        </Field>

        <Field className='grid grid-cols-1 items-start gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-message'>Story Pitch</FieldLabel>
          <Textarea id='horizontal-basic-message' className='sm:col-span-5' placeholder='Pitch outline: Investigative report on renewable energy transitions in Globali textile mills...' rows={4}/>
        </Field>

        <Field className='grid grid-cols-1 sm:grid-cols-6'>
          <div className='sm:col-start-2'>
            <Button type='submit'>Submit Pitch</Button>
          </div>
        </Field>
      </FieldGroup>
    </form>;
};
export default BasicForm;
