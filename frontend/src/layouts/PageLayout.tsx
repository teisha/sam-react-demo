import { Box, Grid, useTheme } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import SideMenu from '../components/SideMenu/SideMenu';

interface PageLayoutProps {}
const PageLayout: React.FC<PageLayoutProps> = () => {
  const theme = useTheme();

  return (
    <>
      <HeaderMenu
        backgroundColor={theme.palette.primary.dark}
        color={theme.palette.secondary.light}
      />
      <Grid container sx={{ height: '100vh', width: '100vw' }} direction='row' display='flex'>
        <Grid item xs={2} height={'100%'}>
          <SideMenu
            backgroundColor={theme.palette.primary.light}
            color={theme.palette.secondary.dark}
          />
        </Grid>
        <Grid item xs={10} sx={{ p: 0.01, backgroundColor: 'secondary.light' }}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(PageLayout);
