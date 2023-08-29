
import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';


const FormButton = styled(Button)<ButtonProps>`
  color: 'secondary.dark',
  backgroundColor: 'primary.main',
  '&:hover': {
    color: 'white',
    backgroundColor: 'primary.dark',
  },
`;

export default FormButton;
