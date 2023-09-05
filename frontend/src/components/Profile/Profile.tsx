import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';
import { useAuthContext } from '../../Auth/contexts/authContext';
import withAuth, { AuthProps } from '../../Auth/hoc/withAuth';

import ProfileForm from './ProfileForm';
import { useAppContext } from '../../contexts/appContext';

const Profile = (props: AuthProps) => {
  const authContext = useAuthContext();
  const appContext = useAppContext();
  const username = authContext.token?.cognito_username;

  return (
    <Card
      sx={{
        backgroundColor: 'secondary.light',
        color: 'primary.dark',
        width: '100%',
        height: '100%',
        padding: '2em',
      }}
    >
      <Typography
        gutterBottom
        color='primary.dark'
        variant='h5'
        component='div'
        sx={{ fontWeight: 'bold' }}
      >
        User Profile For {username}
      </Typography>
      <CardContent>
        <ProfileForm />
      </CardContent>
    </Card>
  );
};
export default withAuth(Profile);
