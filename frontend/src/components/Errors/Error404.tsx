import {Box, Button, Typography} from '@mui/material';
import {grey} from '@mui/material/colors';

import {useNavigate} from 'react-router-dom';


import {defaultUrl} from '../../Auth/models/IAuth';



const Error404: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const onGoBackToHome = () => {
    navigate(defaultUrl);
  };

  return (
    <Box
      py={{ xl: 8 }}
      flex={1}
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'
    >
      <Box mb={{ xs: 4, xl: 8 }} width='100%' maxWidth={{ xs: 200, sm: 300, xl: 706 }}>
        <img style={{width: '100%'}} src={'/images/404.png'} alt='404' />
      </Box>
      <Box mb={{ xs: 4, xl: 5 }}>
        <Box mb={{ xs: 3, xl: 10 }} fontSize={{ xs: 20, md: 24 }} fontWeight={'bold'}>
          404 Error.
        </Box>
        <Box mb={{ xs: 4, xl: 10 }} color={grey[600]} fontSize={16}>
          <Typography>We can't find the page that</Typography>
          <Typography>you are looking for.</Typography>
        </Box>
        <Button
          variant='contained'
          color='primary'
          sx={{ fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' }}
          onClick={onGoBackToHome}
        >
          Go Back Home
        </Button>
      </Box>
    </Box>
  );
};

export default Error404;
