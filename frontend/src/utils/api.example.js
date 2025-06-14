// HTTP status: 200
// {
//   "data": [...],
//   "message": "success getting data",
//   "timestamp": "2025-01-01"
// }

// HTTP status: 400
// {
//   "data": null,
//   "message": "error: invalid params",
//   "timestamp": "2025-01-01"
// }

// HTTP status: 500
// {
//   "data": null,
//   "message": "internal server error",
//   "timestamp": "2025-01-01"
// }

import api from './api';

async function fetchContentExample() {
  try {
    const response = await api.get('/api/content');
    const { data, message, timestamp } = response.data;
    console.log('Success:', message);
    console.log('Data:', data);
    console.log('Timestamp:', timestamp);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message;
      const timestamp =
        error.response.data?.timestamp || new Date().toISOString();
      console.error(`Error ${status}: ${msg} at ${timestamp}`);

      if (status === 400) {
        alert(`Bad request: ${msg}`);
      } else if (status === 500) {
        alert('Internal server error');
      } else if (status === 401) {
        // logout
        alert('Unauthorized: Please log in again.');
        window.location.href = '/auth/login';
      }
    } else if (error.request) {
      console.error('Network error or no response from server.');
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}
