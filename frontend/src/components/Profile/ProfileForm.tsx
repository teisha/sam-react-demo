import { MailOutline } from '@mui/icons-material';
import { FormLabel, Select, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useAuthContext } from '../../Auth/contexts/authContext';
import { UserType, UserSchema } from '../../shared/schema/user.schema';
import FormButton from '../Form/FormButton';
import FormSection from '../Form/FormSection';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const ProfileForm = (props: {}) => {
  const authContext = useAuthContext();
  const username = authContext.token?.cognito_username;

  const {
    register,
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
    },
  });

  const onSubmit: SubmitHandler<UserType> = (data) => {
    console.log({ data });
    const profile = { ...data, dateCreated: authContext.user?.dateCreated ?? new Date() };
    console.log(profile);
    // save data to db
    // authContext.setUserContext(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection>
        <label>
          Status&nbsp;
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <Select {...field} sx={{ width: '80%' }} aria-description='Status'>
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
      </FormSection>
      <FormSection>
        <label>
          First Name&nbsp;
          <Controller
            name='firstname'
            control={control}
            render={({ field }) => (
              <TextField {...field} placeholder='First Name' aria-description='First Name' />
            )}
          />
        </label>
        <p>{errors.firstname?.message}</p>
      </FormSection>
      <FormSection>
        <label>
          Last Name&nbsp;
          <Controller
            name='lastname'
            control={control}
            render={({ field }) => (
              <TextField {...field} placeholder='Last Name' aria-description='Last Name' />
            )}
          />
        </label>
        <p>{errors.lastname?.message}</p>
      </FormSection>
      <FormSection>
        <label>
          <MailOutline sx={{ color: 'secondary.dark', mt: 1 }} />
          Email&nbsp;
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField {...field} placeholder='Email' aria-description='Email' />
            )}
          />
        </label>
        <p>{errors.email?.message}</p>
      </FormSection>

      {/* <p>
        <input type='submit' disabled={isSubmitting} />
      </p> */}
      <FormButton disabled={isSubmitting} variant='contained'>
        Submit
      </FormButton>
    </form>
  );
};

export default ProfileForm;
