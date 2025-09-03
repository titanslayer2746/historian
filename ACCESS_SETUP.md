# Access Key Setup for Historian Application

## Overview

The Historian application is now protected by a secret access key system. Users must enter the correct access key to access any part of the application.

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```bash
# Required: Secret access key for the application
NEXT_PUBLIC_ACCESS_KEY=your_secret_access_key_here

# Optional: Gemini AI API key (if using AI features)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. How It Works

#### Access Flow:

1. **First Visit**: User is redirected to `/access` page
2. **Key Entry**: User enters the secret access key
3. **Verification**: Key is checked against `NEXT_PUBLIC_ACCESS_KEY`
4. **Storage**: Valid key is stored in localStorage and cookies
5. **Access**: User can now access the entire application
6. **Persistence**: Key is remembered across browser sessions

#### Security Features:

- **Client-side Protection**: ProtectedRoute component checks authentication
- **Server-side Protection**: Middleware validates access on each request
- **Dual Storage**: Key stored in both localStorage and cookies
- **Automatic Redirects**: Unauthorized users redirected to access page
- **Logout Functionality**: Users can logout and clear stored keys

### 3. Access Control

#### Protected Routes:

- `/` - Main timeline page
- `/history-learning` - History learning page
- `/history-learning/[id]` - Individual history class pages

#### Public Routes:

- `/access` - Access key entry page
- `/_next/*` - Next.js static assets
- `/api/*` - API routes (if any)

### 4. User Experience

#### For Users:

- Clean, professional access page
- Clear error messages for invalid keys
- Persistent login (no need to re-enter key)
- Easy logout option in navigation

#### For Administrators:

- Centralized access control via environment variable
- Easy key rotation by updating `.env.local`
- No database required for authentication
- Simple deployment and configuration

### 5. Customization

#### Changing the Access Key:

1. Update `NEXT_PUBLIC_ACCESS_KEY` in `.env.local`
2. Restart the development server
3. All existing users will need to re-authenticate

#### Styling the Access Page:

- Modify `app/access/page.tsx` for visual changes
- Update colors, fonts, and layout as needed
- Add your logo or branding elements

### 6. Troubleshooting

#### Common Issues:

- **Build Errors**: Ensure environment variable is set
- **Access Denied**: Check if key matches exactly
- **Redirect Loops**: Clear browser storage and cookies
- **Middleware Issues**: Verify cookie settings

#### Debug Steps:

1. Check browser console for errors
2. Verify environment variable is loaded
3. Clear localStorage and cookies
4. Check middleware configuration

## Security Notes

- The access key is stored in localStorage and cookies
- This provides basic access control but is not enterprise-grade security
- For production use, consider implementing proper authentication systems
- The current system is suitable for personal or small team applications

## Deployment

When deploying to production:

1. Set the `NEXT_PUBLIC_ACCESS_KEY` environment variable
2. Ensure the middleware is properly configured
3. Test the access flow in the production environment
4. Consider using a more secure key management system for enterprise use
