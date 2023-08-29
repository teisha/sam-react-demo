

import { Button, styled } from '@mui/material';


const FormButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default FormButton;
