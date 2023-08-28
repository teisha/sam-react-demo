import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';

// const FormButton = styled(Button)<ButtonProps>(({ theme }) => ({
//   color: 'primary.contrastText',
//   backgroundColor: 'primary.main',
//   '&:hover': {
//     backgroundColor: 'primary.dark',
//     color: 'secondary.contrastText',
//   },
// }));
const FormButton = styled(Button)<ButtonProps>`
    color: 'primary.contrastText',
    backgroundColor: 'primary.main',
    '&:hover': {
      color: 'primary.light',
      backgroundColor: 'primary.dark',
    },
`;

export default FormButton;
