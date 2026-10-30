// Third-party Imports
import { Building2Icon, MapIcon, MapPinIcon, PhoneIcon, SignpostIcon, UserIcon } from 'lucide-react';
// Component Imports
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
const BasicFormWithIcon = ()=>{
    return <form>
      <FieldGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-first-name'>First Name</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <UserIcon className='size-4'/>
              <span className='sr-only'>First Name</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-first-name' placeholder='Rafiqul'/>
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-last-name'>Last Name</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <UserIcon className='size-4'/>
              <span className='sr-only'>Last Name</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-last-name' placeholder='Islam'/>
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-mobile'>Mobile</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <PhoneIcon className='size-4'/>
              <span className='sr-only'>Mobile</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-mobile' type='tel' placeholder='+880 1711-200001'/>
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-pincode'>Postal Code</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <MapPinIcon className='size-4'/>
              <span className='sr-only'>Postal Code</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-pincode' placeholder='1205'/>
          </InputGroup>
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='basic-with-icons-address'>Address</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <MapPinIcon className='size-4'/>
              <span className='sr-only'>Address</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-address' placeholder='House 14, Road 27, Dhanmondi'/>
          </InputGroup>
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='basic-with-icons-landmark'>Landmark</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <SignpostIcon className='size-4'/>
              <span className='sr-only'>Landmark</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-landmark' placeholder='Near Geneva Press Club, Geneva'/>
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-city'>City</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Building2Icon className='size-4'/>
              <span className='sr-only'>City</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-city' placeholder='Geneva'/>
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-state'>Division</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <MapIcon className='size-4'/>
              <span className='sr-only'>Division</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-state' placeholder='Geneva Division'/>
          </InputGroup>
        </Field>
      </FieldGroup>

      <div className='mt-8'>
        <Button type='submit'>Save Information</Button>
      </div>
    </form>;
};
export default BasicFormWithIcon;
