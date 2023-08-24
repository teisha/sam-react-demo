import { Box, Button} from '@mui/material';
import React from 'react';
import {Link} from "react-router-dom"

const Logout = () => {
    return (
      <Box sx={{ml:1}}>
        <p>Nothing to see here yet</p>
        <Link style={{ textDecoration: 'none' }} to='/home'>
          <Button variant='contained'>Home</Button>
        </Link>
      </Box>
    );
}


export default Logout;