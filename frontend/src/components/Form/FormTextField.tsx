import { TextField, styled } from "@mui/material";

const FormTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
    "& .MuiInputBase-root": {
        marginLeft: '25%',
        width: '75%'
    },
    "& .MuiOutlinedInput-notchedOutline legend": {
        display: "none"
    },
    "& .MuiInputLabel-shrink": {
        transform: "none"
    },
    "& .MuiFormLabel-root": {
        color: theme.palette.primary.dark,
        fontWeight: 700,
        transformOrigin: "left",
        left: "0" ,
        textAlign: "right",
        paddingRight: "2px",
        lineHeight: '3.5em'
    }
  }));

export default FormTextField;

/*
    root: {
        "& label": {
            transformOrigin: "top right",
            right: '0',
            left: "auto"
        }
    }
})(TextField)
*/

// export type FormTextFieldProps {
//     name: string,
//     value: string,

// }
// export default function FormTextField( ) {
//     return (
//         <StyledTextField>

//         </StyledTextField>
//     );
// }