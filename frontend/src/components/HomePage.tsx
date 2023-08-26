import { Box, Paper, Typography } from '@mui/material';
import withAuth, { AuthProps } from '../Auth/hoc/withAuth';
import React from 'react';

const HomePage: React.FunctionComponent<AuthProps> = (props: AuthProps) => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      sx={{ width: '100%', height: '100%' }}
    >
      <Paper
        elevation={3}
        sx={{ padding: '1rem', backgroundColor: 'secondary.light', width: '100%', height: '100%' }}
      >
        <Typography color='primary.dark' variant='h3'>
          {props.isLoggedIn ? 'User Form' : 'Please log in'}
        </Typography>
        <img src='tree.webp' alt='tree' width='50%' height='50%' />
      </Paper>
    </Box>
  );
};

export default withAuth(HomePage);
