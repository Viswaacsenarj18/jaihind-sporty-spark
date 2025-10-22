-- This is a helpful SQL script to make a user an admin
-- Replace 'your-email@example.com' with the actual email address of the user you want to make admin

-- First, get the user's ID
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert the admin role using that ID
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('user-id-from-above', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Quick one-liner (replace the email):
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'your-email@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
