import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiDollarSign, FiCalendar, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { createBooking } from '../services/api';

const validationSchema = Yup.object({
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  totalprice: Yup.number().required('Required').min(1, 'Must be at least $1'),
  depositpaid: Yup.boolean().required('Required'),
  bookingdates: Yup.object({
    checkin: Yup.date().required('Check-in date required').min(new Date(), 'Check-in date cannot be in past'),
    checkout: Yup.date().required('Check-out date required').min(Yup.ref('checkin'), 'Check-out must be after check-in'),
  }),
  additionalneeds: Yup.string(),
});

export default function CreateBooking() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-indigo-600 mr-4"
          >
            <FiCalendar className="mr-2" /> Back to Bookings
          </button>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiCheckCircle className="text-indigo-600" />
              Create New Booking
            </h2>
            <p className="text-gray-500 mt-2">Fill in the details to create a new reservation</p>
          </div>

          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              totalprice: '',
              depositpaid: false,
              bookingdates: { checkin: '', checkout: '' },
              additionalneeds: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                await createBooking(values);
                resetForm();
                navigate('/dashboard');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
                        name="firstname"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="John"
                      />
                    </div>
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Last Name */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
                        name="lastname"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Doe"
                      />
                    </div>
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Total Price */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Price
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
                        name="totalprice"
                        type="number"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                    <ErrorMessage
                      name="totalprice"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Deposit Paid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deposit Paid
                    </label>
                    <div className="relative flex items-center gap-3 mt-2">
                      <Field
                        name="depositpaid"
                        type="checkbox"
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">
                        {values.depositpaid ? 'Deposit has been paid' : 'Deposit not paid yet'}
                      </span>
                    </div>
                    <ErrorMessage
                      name="depositpaid"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Check-in Date */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
                        name="bookingdates.checkin"
                        type="date"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <ErrorMessage
                      name="bookingdates.checkin"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Check-out Date */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
                        name="bookingdates.checkout"
                        type="date"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <ErrorMessage
                      name="bookingdates.checkout"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Additional Needs */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative md:col-span-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Needs
                      <span className="text-gray-400 ml-1">(optional)</span>
                    </label>
                    <div className="relative">
                      <FiInfo className="absolute left-3 top-4 text-gray-400" />
                      <Field
                        name="additionalneeds"
                        as="textarea"
                        rows="3"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Special requests or requirements"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Booking...
                    </div>
                  ) : (
                    'Create Booking'
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </motion.div>
  );
}