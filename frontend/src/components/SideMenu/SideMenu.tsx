import { Box,   Button } from '@mui/material'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../Auth/contexts/authContext';



interface SideMenuProps {
    backgroundColor: string;
    color: string;
}
      

const SideMenu = (props: SideMenuProps) => {
    const authContext = useAuthContext() ;

    return (
      <>
        <Box
          component='ul'
          sx={{
            listStyle: 'none',
            pl: 0.5,
            mt: 0,
            bgcolor: props.backgroundColor,
            color: props.color,
            height: '100%',
          }}
        >
          <li>
            <small>Menu options</small>
          </li>
          { authContext.isLoggedIn 
            ? (<li>
            <Link style={{ textDecoration: 'none' }} to='/logout'>
              <Button variant='text' sx={{ color: props.color }}>
                Logout
              </Button>
            </Link>
          </li>)
          :  (<li>
            <Link style={{ textDecoration: 'none' }} to='/login'>
              <Button variant='text' sx={{ color: props.color }}>
                Login
              </Button>
            </Link>
          </li>)
          }
        </Box>
      </>
    );
}

export default SideMenu