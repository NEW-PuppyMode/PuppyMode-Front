import axios from 'axios';

export const handelError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 500) {
      console.log('500 error');
    } else {
      console.log('unknown error');
    }
  }

  console.error(error);
};
