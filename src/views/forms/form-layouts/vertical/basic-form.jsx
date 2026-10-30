// Component Imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
const BasicForm = ()=>{
    return <form>
      <FieldGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-first-name'>First Name</FieldLabel>
          <Input id='multi-step-personal-info-first-name' placeholder='Rafiqul'/>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-last-name'>Last Name</FieldLabel>
          <Input id='multi-step-personal-info-last-name' placeholder='Islam'/>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-mobile'>Mobile</FieldLabel>
          <Input id='multi-step-personal-info-mobile' placeholder='+880 1711-200001'/>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-pincode'>Postal Code</FieldLabel>
          <Input id='multi-step-personal-info-pincode' placeholder='1205'/>
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='multi-step-personal-info-address'>Address</FieldLabel>
          <Input id='multi-step-personal-info-address' placeholder='House 14, Road 27, Dhanmondi'/>
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='multi-step-personal-info-landmark'>Landmark</FieldLabel>
          <Input id='multi-step-personal-info-landmark' placeholder='Near Geneva Press Club, Geneva'/>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-city'>City</FieldLabel>
          <Input id='multi-step-personal-info-city' placeholder='Geneva'/>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-state'>Division</FieldLabel>
          <Input id='multi-step-personal-info-state' placeholder='Geneva Division'/>
        </Field>
      </FieldGroup>

      <div className='mt-8'>
        <Button type='submit'>Save Information</Button>
      </div>
    </form>;
};
export default BasicForm;
