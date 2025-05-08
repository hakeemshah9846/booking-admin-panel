import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiSave, FiX, FiCalendar, FiUser, FiDollarSign, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getBookingDetails, updateBooking } from '../services/api';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingDetails(id);
        setBooking(data);
        setEditData({
          firstname: data.firstname,
          lastname: data.lastname,
          totalprice: data.totalprice,
          depositpaid: data.depositpaid,
          bookingdates: { ...data.bookingdates },
          additionalneeds: data.additionalneeds || ''
        });
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('bookingdates.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        bookingdates: {
          ...prev.bookingdates,
          [field]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedBooking = await updateBooking(id, editData);
      setBooking(updatedBooking);
      setIsEditing(false);
      toast.success('Booking updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Update failed: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Bookings
          </Link>
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiEdit /> Edit Booking
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiSave /> Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiCalendar className="text-white" />
              Booking Details {isEditing && '(Editing)'}
            </h2>
            <p className="text-indigo-100 mt-1">ID: {id}</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiUser className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Guest Information</h3>
              </div>
              
              <EditableField
                label="First Name"
                name="firstname"
                value={isEditing ? editData.firstname : booking.firstname}
                editing={isEditing}
                onChange={handleInputChange}
              />
              
              <EditableField
                label="Last Name"
                name="lastname"
                value={isEditing ? editData.lastname : booking.lastname}
                editing={isEditing}
                onChange={handleInputChange}
              />
            </div>

            {/* Booking Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-2xl text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Booking Timeline</h3>
              </div>
              
              <EditableField
                label="Check-in Date"
                name="bookingdates.checkin"
                value={isEditing ? editData.bookingdates.checkin : booking.bookingdates.checkin}
                editing={isEditing}
                onChange={handleInputChange}
                type="date"
              />
              
              <EditableField
                label="Check-out Date"
                name="bookingdates.checkout"
                value={isEditing ? editData.bookingdates.checkout : booking.bookingdates.checkout}
                editing={isEditing}
                onChange={handleInputChange}
                type="date"
              />
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiDollarSign className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Payment Details</h3>
              </div>
              
              <EditableField
                label="Total Price"
                name="totalprice"
                value={isEditing ? editData.totalprice : booking.totalprice}
                editing={isEditing}
                onChange={handleInputChange}
                type="number"
              />
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Deposit Paid</span>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="depositpaid"
                      checked={editData.depositpaid}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {editData.depositpaid ? 'Yes' : 'No'}
                    </span>
                  </label>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    booking.depositpaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.depositpaid ? 'Yes' : 'No'}
                  </span>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiInfo className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Additional Needs</h3>
              </div>
              
              {isEditing ? (
                <textarea
                  name="additionalneeds"
                  value={editData.additionalneeds}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              ) : (
                <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {booking.additionalneeds || 'No special requirements'}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Reusable EditableField Component
const EditableField = ({ label, name, value, editing, onChange, type = 'text' }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-500 font-medium">{label}</span>
    {editing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500"
      />
    ) : (
      <span className="text-gray-900">
        {type === 'date' ? new Date(value).toLocaleDateString() : value}
      </span>
    )}
  </div>
);

// Helper Components
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md">
      <h3 className="text-lg font-semibold text-red-800">Error</h3>
      <p className="mt-2 text-red-700">{message}</p>
      <Link
        to="/dashboard"
        className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <FiArrowLeft className="mr-2" />
        Back to Bookings
      </Link>
    </div>
  </div>
);