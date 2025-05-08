import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import throttle from 'lodash/throttle';
import { getBookings, getBookingDetails, deleteBooking } from '../services/api';
import { FiEye, FiEdit, FiTrash2, FiPlusCircle, FiCalendar, FiUser } from 'react-icons/fi';

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  const loadBookings = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const bookingIds = await getBookings();
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      const newBookingIds = bookingIds.slice(startIndex, endIndex);
      const newBookings = await Promise.all(
        newBookingIds.map(async ({ bookingid }) => {
            let bookingDetails = await getBookingDetails(bookingid);
            bookingDetails.id = bookingid;
            return bookingDetails;
        })
      );

      setBookings(prev => [...prev, ...newBookings]);
      setHasMore(endIndex < bookingIds.length);
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    loadBookings();

    const handleScroll = throttle(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        loadBookings();
      }
    }, 300); // Runs at most once every 300ms

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDelete = async (id) => {
    await deleteBooking(id);
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-500 mt-2">Manage all hotel bookings efficiently</p>
          </div>
          <Link
            to="/create"
            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlusCircle className="text-lg" />
            New Booking
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiCalendar className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Guest</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.firstname} {booking.lastname}</p>
                          <p className="text-sm text-gray-500">{booking.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.bookingdates.checkin}</span>
                        <span className="text-sm text-gray-500">to {booking.bookingdates.checkout}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${booking.totalprice}</span>
                        {booking.depositpaid && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Deposit Paid
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Confirmed
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/booking/${booking.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-indigo-600"
                        >
                          <FiEye className="text-lg" />
                        </Link>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loading and Pagination */}
          <div className="p-6 border-t border-gray-100">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : hasMore ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadBookings}
                className="w-full py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Load More Bookings
              </motion.button>
            ) : (
              <p className="text-center text-gray-500">No more bookings to load</p>
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {!bookings.length && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12"
          >
            <div className="mb-4 text-gray-400 mx-auto">
              <FiCalendar className="text-4xl inline-block" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-gray-500">Create your first booking to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}