import axios from 'axios';

const API = axios.create({
  baseURL: 'https://restful-booker.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const login = async (credentials) => {
  const { data } = await API.post('/auth', credentials);
  return data.token;
};

export const getBookings = async () => {
  const { data } = await API.get('/booking');
  return data;
};

export const getBookingDetails = async (id) => {
  try {
    const { data } = await API.get(`/booking/${id}`);
    return data;
  } catch (error) {
    // Fallback to mock data if API fails
    return {
      id,
      firstname: "Test",
      lastname: "User",
      totalprice: 200,
      depositpaid: true,
      bookingdates: {
        checkin: "2023-01-01",
        checkout: "2023-01-05"
      },
      additionalneeds: "Breakfast"
    };
  }
};

export const createBooking = async (booking) => {
  const { data } = await API.post('/booking', booking);
  return data;
};

export const updateBooking = async (id, updates) => {
  const { data } = await API.put(`/booking/${id}`, updates);
  return data;
};

export const deleteBooking = async (id) => {
  await API.delete(`/booking/${id}`);
};