# NewsNet - Admin Panel Setup Guide

## Overview
This admin panel allows administrators to manage news articles with full CRUD (Create, Read, Update, Delete) operations and includes Cloudinary integration for image management.

## Features
- ✅ Admin Dashboard with Statistics
- ✅ Add/Edit/Delete News Articles
- ✅ Image Upload with Cloudinary
- ✅ Role-based Access Control
- ✅ Responsive Design with Material-UI
- ✅ Real-time Feedback with Toast Notifications

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install cloudinary multer multer-storage-cloudinary
```

### 2. Configure Environment Variables
Update your `.env` file with Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**To get Cloudinary credentials:**
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard to find your credentials
4. Replace the placeholder values in `.env`

### 3. Create Admin User
Run this command to create an admin user:
```bash
npm run create-admin
```

**Default Admin Credentials:**
- Email: `admin@newsnet.com`
- Password: `admin123`

**⚠️ Important:** Change the admin password after first login for security!

### 4. Start Backend Server
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install axios react-dropzone
```

### 2. Environment Variables
Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Frontend Server
```bash
npm run dev
```

## Admin Panel Usage

### Accessing Admin Panel
1. Login with admin credentials
2. Navigate to `/admin` or click "Admin Dashboard" in the navbar (only visible to admin users)

### Managing News Articles

#### Adding New Articles
1. Click "Add Article" button
2. Fill in required fields:
   - **Title** (required)
   - **Content** (required)
   - **Author** (required)
   - **Category** (required)
   - **Source** (optional)
   - **URL** (optional)
   - **Image** (optional)

#### Image Upload
- Drag & drop images or click to select
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum size: 5MB
- Images are automatically optimized and stored on Cloudinary

#### Editing Articles
1. Click the edit icon (pencil) next to any article
2. Modify fields as needed
3. Upload new image to replace existing one
4. Click "Update Article"

#### Deleting Articles
1. Click the delete icon (trash) next to any article
2. Confirm deletion in the dialog
3. Article and associated image will be permanently removed

### Dashboard Statistics
- **Total Articles**: Total number of published articles
- **This Week**: Articles published in the last 7 days
- **Categories**: Number of different categories
- **Top Category**: Highest article count in a category

## API Endpoints

### News Management (Admin Only)
- `POST /api/news` - Create article (with image upload)
- `PUT /api/news/:id` - Update article (with image upload)
- `DELETE /api/news/:id` - Delete article
- `GET /api/news/admin/stats` - Get dashboard statistics

### Public Endpoints
- `GET /api/news` - Get all articles (with pagination)
- `GET /api/news/:id` - Get single article
- `GET /api/news/category/:category` - Get articles by category
- `GET /api/news/latest` - Get latest articles

## Security Features

### Admin Authentication
- JWT token-based authentication
- Role-based access control
- Admin middleware protects all admin routes

### File Upload Security
- File type validation (images only)
- File size limits (5MB max)
- Cloudinary integration for secure storage

## Troubleshooting

### Common Issues

1. **Cloudinary Upload Fails**
   - Check your Cloudinary credentials in `.env`
   - Ensure file size is under 5MB
   - Verify file format is supported

2. **Admin Access Denied**
   - Ensure user has `role: "admin"` in database
   - Check JWT token is valid
   - Verify admin middleware is working

3. **Image Not Displaying**
   - Check Cloudinary URL in database
   - Verify image wasn't deleted from Cloudinary
   - Check network connectivity

### Development Tips

1. **Testing Admin Features**
   - Use the created admin account
   - Test with different image sizes and formats
   - Verify all CRUD operations work

2. **Database Management**
   - Check MongoDB for user roles
   - Verify news articles are saved correctly
   - Monitor Cloudinary usage in dashboard

## File Structure
```
backend/
├── controllers/new.js          # Updated with Cloudinary
├── middleware/adminAuth.js     # Admin authentication
├── routes/news.js             # Updated routes
├── utils/cloudinary.js        # Cloudinary configuration
├── scripts/createAdmin.js     # Admin user creation
└── .env                       # Environment variables

frontend/
├── components/
│   ├── AdminDashboard.jsx     # Main admin interface
│   ├── AddEditNewsDialog.jsx  # Add/Edit form
│   └── Navbar.jsx            # Updated with admin link
├── .env                       # Frontend environment
└── App.jsx                    # Updated routes
```

## Next Steps
1. Set up Cloudinary account and update credentials
2. Create admin user with secure password
3. Test all admin functionality
4. Configure production environment variables
5. Set up proper error logging and monitoring

## Support
For issues or questions, check the console logs and verify all environment variables are correctly configured.