import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import React from 'react';
import { DataObject } from '@mui/icons-material';
import { AppBar, Container, MenuItem, Toolbar } from '@mui/material';
import { useAuthContext } from '../../Auth/contexts/authContext';
interface HeaderMenuProps {
  backgroundColor: string;
  color: string;
}

interface BannerProps extends HeaderMenuProps {
  alignTo: string;
}

const TitledBanner = styled.div<BannerProps>`
  width: 100%;
  margin: auto;
  text-align: ${(props) => props.alignTo};
  color: ${(props) => props.color ?? '#FFF'};
  background: ${(props) => props.backgroundColor ?? '#000'};
`;

const HeaderMenu = (props: HeaderMenuProps) => {
  const context = useAuthContext();
  return (
    <AppBar position='static' sx={{ width: '100vw', backgroundColor: props.backgroundColor }}>
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justification: 'space-between',
          }}
        >
          <MenuItem component='section'>
            <Link to='/index'>
              <DataObject sx={{ color: props.color, height: '100%', mr: 1 }} />
            </Link>
            <TitledBanner
              backgroundColor={props.backgroundColor}
              color={props.color}
              alignTo={'center'}
            >
              Data Things Application
            </TitledBanner>
          </MenuItem>

          <MenuItem sx={{ justification: 'right', width: '100%' }}>
            <TitledBanner
              backgroundColor={props.backgroundColor}
              color={props.color}
              alignTo={'right'}
            >
              {context.isLoggedIn ? (
                <small>
                  {context.user
                    ? context.user?.firstname + ' ' + context.user?.lastname
                    : 'Unknown Log In'}
                </small>
              ) : (
                'Please log In'
              )}
            </TitledBanner>
          </MenuItem>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderMenu;
