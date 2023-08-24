import { Alert, Slide, Snackbar } from '@mui/material';
import { ApplicationAlert } from '../../models/alerts';
import React from 'react';

interface IProps {
  alert: ApplicationAlert;
  clear: () => void;
}

/**
 * Add SnackBar Support at the AppContextProvider level
 */
const MessagePopup = (props: IProps) => {
  if (!props.alert || !props.alert.message) {
    return null;
  }
  if (props.alert.timeout) {
    setTimeout(props.clear, props.alert.timeout);
  }
  return (
    <Snackbar
      open={props.alert.message?.length > 0}
      onClose={() => props.clear()}
      TransitionComponent={Slide}
      autoHideDuration={6000}
    >
      <Alert onClose={() => props.clear()} severity={props.alert.type}>
        {props.alert.message}
      </Alert>
    </Snackbar>
  );
}

export default MessagePopup;
