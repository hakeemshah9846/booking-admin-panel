# 🚀 Booking Management Admin Panel

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-06B6D4?logo=tailwind-css)
![Axios](https://img.shields.io/badge/Axios-1.5.0-671ddf)
![React Router](https://img.shields.io/badge/React_Router-6.15.0-CA4245?logo=react-router)

A modern admin panel for managing hotel bookings with beautiful UI and full CRUD functionality, built with React and Tailwind CSS.


## 🌟 Features

- 🔐 JWT Authentication & Authorization
- 📋 Paginated Booking List with Sorting
- 👁️ Detailed Booking View Modal
- ✏️ Inline Editing for Bookings
- 🗑️ Delete Bookings with Confirmation
- 📱 Fully Responsive Design
- 🎨 Professional UI with Tailwind CSS
- 📊 Interactive Charts (Coming Soon!)

## 🛠️ Technologies Used

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Heroicons
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router 6
- **Form Handling**: Formik + Yup
- **Animation**: Framer Motion

## 🚨 Important Development Note

### CORS Extension Required 🔧
When running the development server, you **MUST** install a CORS browser extension:
- **[Moesif CORS](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc)**
- **[Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)**

**Why?**  
The RESTful Booker API doesn't allow direct browser access due to CORS (Cross-Origin Resource Sharing) restrictions. These extensions:
- Add proper CORS headers to API responses
- Allow localhost development without CORS errors
- **Only enable for development** - disable in production!

## ⚡ Quick Start

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/booking-admin-panel.git
cd booking-admin-panel
npm install
npm run dev