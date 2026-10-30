// Third-party Imports
import { Building2Icon, MailIcon, MessageSquareIcon, PhoneIcon, UserIcon } from 'lucide-react';
// Component Imports
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
const BasicFormWithIcon = ()=>{
    return <form>
      <FieldGroup className='gap-6'>
        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-icons-name'>Contributor</FieldLabel>
          <InputGroup className='sm:col-span-5'>
            <InputGroupAddon>
              <UserIcon className='size-4'/>
              <span className='sr-only'>Contributor</span>
            </InputGroupAddon>
            <InputGroupInput id='horizontal-basic-icons-name' type='text' placeholder='Tanvir Ahmed'/>
          </InputGroup>
        </Field>

        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-icons-company'>Publication / Desk</FieldLabel>
          <InputGroup className='sm:col-span-5'>
            <InputGroupAddon>
              <Building2Icon className='size-4'/>
              <span className='sr-only'>Desk</span>
            </InputGroupAddon>
            <InputGroupInput id='horizontal-basic-icons-company' placeholder='The Chronicle Media Ltd'/>
          </InputGroup>
        </Field>

        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-icons-email'>Email</FieldLabel>
          <InputGroup className='sm:col-span-5'>
            <InputGroupAddon>
              <MailIcon className='size-4'/>
              <span className='sr-only'>Email</span>
            </InputGroupAddon>
            <InputGroupInput id='horizontal-basic-icons-email' placeholder='tanvir.ahmed'/>
            <InputGroupAddon align='inline-end' className='text-foreground font-normal'>
              @thechronicle.press
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field className='grid grid-cols-1 gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-icons-phone'>Phone No</FieldLabel>
          <InputGroup className='sm:col-span-5'>
            <InputGroupAddon>
              <PhoneIcon className='size-4'/>
              <span className='sr-only'>Phone</span>
            </InputGroupAddon>
            <InputGroupInput id='horizontal-basic-icons-phone' type='tel' placeholder='+880 1712-345678'/>
          </InputGroup>
        </Field>

        <Field className='grid grid-cols-1 items-start gap-2 sm:grid-cols-6'>
          <FieldLabel htmlFor='horizontal-basic-icons-message'>Story Pitch</FieldLabel>
          <div className='relative sm:col-span-5'>
            <div className='text-muted-foreground pointer-events-none absolute top-2.5 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
              <MessageSquareIcon className='size-4'/>
              <span className='sr-only'>Story Pitch</span>
            </div>
            <Textarea id='horizontal-basic-icons-message' placeholder='Pitch outline: Investigative report on renewable energy transitions in Globali textile mills...' className='peer pl-9' rows={4}/>
          </div>
        </Field>

        <Field className='grid grid-cols-1 sm:grid-cols-6'>
          <div className='sm:col-start-2'>
            <Button type='submit'>Submit Pitch</Button>
          </div>
        </Field>
      </FieldGroup>
    </form>;
};
export default BasicFormWithIcon;
