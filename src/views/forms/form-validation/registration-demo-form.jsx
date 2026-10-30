'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { CheckCheckIcon } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// Define the form schema
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    phone: z.string().min(1, 'Phone is required').regex(/^\+?[0-9()\-\s]{8,20}$/, 'Please enter a valid phone number.'),
    company: z.string().min(2, 'Company name must be at least 2 characters.'),
    email: z.string().min(1, 'Email is required').email({
        message: 'Please enter a valid email address.'
    }),
    orderId: z.string().min(3, 'Order ID is required.'),
    issue: z.string().min(1, {
        message: 'Kindly select an issue.'
    }),
    department: z.string().min(1, {
        message: 'Kindly select a department.'
    }),
    priority: z.string().min(1, {
        message: 'Kindly select a priority.'
    }),
    selectedOption: z.enum([
        'replace',
        'refund',
        'support'
    ], {
        required_error: 'Selection of an option is required.'
    }),
    message: z.string().min(50, 'Describe your issue using at least 50 characters.')
});
const ContactUSFormDemo = ()=>{
    const form1 = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            company: '',
            email: '',
            orderId: '',
            issue: '',
            department: '',
            priority: '',
            selectedOption: undefined,
            message: ''
        }
    });
    function onSubmit() {
        toast.custom(()=><Alert className='border-foreground text-foreground sm:w-122 *:[svg]:row-span-1'>
        <CheckCheckIcon/>
        <AlertTitle>Editorial query submitted successfully! The The Chronicle desk will review shortly.</AlertTitle>
      </Alert>);
    }
    return <Card className='w-full shadow-none'>
      <CardHeader>
        <CardTitle>Editorial Desk Inquiry</CardTitle>
        <CardDescription>Submit story inquiries, corrections, source queries, or editorial desk support requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form1.handleSubmit(onSubmit)} className='grid w-full grid-cols-1 gap-6 md:grid-cols-2'>
          <Controller name='name' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder='Your full name' autoComplete='name'/>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          <Controller name='phone' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input {...field} id={field.name} type='tel' aria-invalid={fieldState.invalid} placeholder='Phone number' autoComplete='tel'/>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          <Controller name='company' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder='Company name' autoComplete='organization'/>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          { /* Email Field */ }
          <Controller name='email' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input {...field} id={field.name} type='email' aria-invalid={fieldState.invalid} placeholder='Email address' autoComplete='email'/>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          <Controller name='orderId' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Story / Article Reference ID</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder='e.g. BD-1042'/>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          { /* Issue Select Field */ }
          <Controller name='issue' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='issue'>Query Type</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='issue' className='w-full' aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder='Select query category'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='damaged'>Correction or Fact-Check</SelectItem>
                    <SelectItem value='got-different'>Source Attribution Inquiry</SelectItem>
                    <SelectItem value='not-like'>Editorial Guideline Review</SelectItem>
                    <SelectItem value='other'>Other Desk Request</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          <Controller name='department' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='department'>Desk</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='department' className='w-full' aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder='Select editorial desk'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='sales'>National Affairs</SelectItem>
                    <SelectItem value='billing'>Business & Economy</SelectItem>
                    <SelectItem value='returns'>Investigative Unit</SelectItem>
                    <SelectItem value='technical'>Digital & Newsroom Ops</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          <Controller name='priority' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='priority'>Priority</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='priority' className='w-full' aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder='Select priority'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>Routine</SelectItem>
                    <SelectItem value='medium'>Standard</SelectItem>
                    <SelectItem value='high'>High Priority</SelectItem>
                    <SelectItem value='urgent'>Breaking / Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          { /* Radio Group Field */ }
          <Controller name='selectedOption' control={form1.control} render={({ field, fieldState })=><FieldSet className='md:col-span-2'>
                <FieldLegend variant='label'>Action Requested</FieldLegend>
                <RadioGroup name={field.name} value={field.value ?? ''} onValueChange={field.onChange}>
                  <Field orientation='horizontal' data-invalid={fieldState.invalid}>
                    <RadioGroupItem value='replace' id='want-replace' aria-invalid={fieldState.invalid}/>
                    <FieldLabel htmlFor='want-replace' className='font-normal'>
                      Story amendment / erratum
                    </FieldLabel>
                  </Field>
                  <Field orientation='horizontal' data-invalid={fieldState.invalid}>
                    <RadioGroupItem value='refund' id='want-refund' aria-invalid={fieldState.invalid}/>
                    <FieldLabel htmlFor='want-refund' className='font-normal'>
                      Retraction or unpublishing request
                    </FieldLabel>
                  </Field>
                  <Field orientation='horizontal' data-invalid={fieldState.invalid}>
                    <RadioGroupItem value='support' id='want-support' aria-invalid={fieldState.invalid}/>
                    <FieldLabel htmlFor='want-support' className='font-normal'>
                      Editorial guidance or clarification
                    </FieldLabel>
                  </Field>
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </FieldSet>}/>

          { /* Message Textarea Field */ }
          <Controller name='message' control={form1.control} render={({ field, fieldState })=><Field data-invalid={fieldState.invalid} className='md:col-span-2'>
                <FieldLabel htmlFor={field.name}>Please describe your issue</FieldLabel>
                <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder='Provide detailed information about your issue' className='min-h-30 resize-none'/>
                {fieldState.invalid && <FieldError errors={[
            fieldState.error
        ]}/>}
              </Field>}/>

          <Button type='submit' className='md:col-span-2 md:w-fit'>
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>;
};
export default ContactUSFormDemo;
