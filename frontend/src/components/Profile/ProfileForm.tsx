import { zodResolver } from '@hookform/resolvers/zod';
import { MailOutline } from '@mui/icons-material';
import { MenuItem, Select } from '@mui/material';
import React from 'react';
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useAuthContext } from '../../Auth/contexts/authContext';
import { UserSchema, UserType } from '../../shared/schema/user.schema';
import FormButton from '../Form/FormButton';
import FormSection from '../Form/FormSection';
import FormTextField from '../Form/FormTextField';

const INPUT_FIELD_WIDTH = '75%'
const ProfileForm = (props: {}) => {
  const authContext = useAuthContext();
  const username = authContext.token?.cognito_username;
  console.log("Load profile for " + username, {user: authContext.user })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username,
      status: authContext.user?.status,
      email: authContext.user?.email,
      firstname: authContext.user?.firstname,
      lastname: authContext.user?.lastname,
      dateCreated: authContext.user?.dateCreated ?? new Date()
    },
  });

  const onSubmit: SubmitHandler<UserType> = (data) => {
    console.log("BUTTON SUBMIT!")
    console.log({ data });

    // save data to db
    // authContext.setUserContext(data);
    reset();
  };

  const onError: SubmitErrorHandler<UserType> = (data, e) => {
    console.log("Something went wrong")
    console.log({data})
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormSection>
        <label>
          Status&nbsp;
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <Select {...field} sx={{ width: INPUT_FIELD_WIDTH, textAlign: "left", marginLeft: '13%' }} aria-description='Status'>
                <MenuItem value={'ACTIVE'} aria-description='Active'>
                  Active
                </MenuItem>
                <MenuItem value={'DEACTIVATED'} aria-description='Deactivated'>
                  Deactivated
                </MenuItem>
              </Select>
            )}
          />
        </label>
        <p>{errors.status?.message}</p>
      </FormSection>
      <FormSection>

          <Controller
            name='firstname'
            control={control}
            render={({ field }) => (
              <FormTextField {...field} 
                label='First Name'
                placeholder='First Name' 
                aria-description='First Name' />
            )}
          />

        <p>{errors.firstname?.message}</p>
      </FormSection>
      <FormSection>
          <Controller
            name='lastname'
            control={control}
            render={({ field }) => (
              <FormTextField {...field} 
                label='Last Name'
                placeholder='Last Name' 
                aria-description='Last Name' />
            )}
          />
        <p>{errors.lastname?.message}</p>
      </FormSection>
      <FormSection>
          
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <FormTextField {...field} 
              label={<p style={{lineHeight: '1em'}}><MailOutline sx={{ color: 'secondary.dark', mt: 0 }} />&nbsp;Email</p>} 
              placeholder='Email' 
              aria-description='Email' />
            )}
          />
        <p>{errors.email?.message}</p>
      </FormSection>

      <FormSection>
          <Controller
            name='dateCreated'
            control={control}
            render={({ field }) => (
              <FormTextField {...field} 
                variant="standard"
                value={field.value.toISOString() } 
                label='Date Created'
                sx={{ border: 0 , 
                    input: {textAlign: "center"},
                    fontSize : "small"}} 
                InputProps={{readOnly: true, disableUnderline: true }} />
            )}
          />
        <p>{errors.dateCreated?.message}</p>
      </FormSection>

      <FormButton type="submit" disabled={isSubmitting} variant='contained'>
        Submit
      </FormButton>
    </form>
  );
};

export default ProfileForm;
