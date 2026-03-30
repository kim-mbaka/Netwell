import { toast } from 'sonner';

export function handleApiError(error, fallbackMessage = 'Something went wrong!') {
  let message = fallbackMessage;
  if (error?.response?.data?.detail) {
    message = error.response.data.detail;
  } else if (error?.response?.data?.error) {
    message = error.response.data.error;
  } else if (error?.message) {
    message = error.message;
  }
  toast.error(message);
}

export function handleSuccess(message) {
  toast.success(message);
}
