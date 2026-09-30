# Admin Dashboard Setup Guide

## Quick Start

### 1. Create a Supabase Account
- Go to [supabase.com](https://supabase.com)
- Sign up for free
- Create a new project (free tier included)

### 2. Get Your Credentials
In your Supabase project:
1. Click **Settings** → **API**
2. Copy:
   - `Project URL` (your SUPABASE_URL)
   - `anon public` key (your SUPABASE_ANON_KEY)

### 3. Set Up Environment Variables
Create `.env.local` in the project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables
In your Supabase project, go to **SQL Editor** and run:

```sql
-- Create site_content table
CREATE TABLE site_content (
  id INT PRIMARY KEY,
  hero_title TEXT,
  hero_subtitle TEXT,
  price INT,
  duration TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create galleries table
CREATE TABLE galleries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default content
INSERT INTO site_content (id, hero_title, hero_subtitle, price, duration) VALUES (
  1,
  'Sip, stitch & learn crochet in one handmade afternoon.',
  'A 2-hour beginner-friendly workshop with all materials included.',
  30,
  '2 hours'
) ON CONFLICT (id) DO NOTHING;
```

### 5. Set Up Storage for Images
1. Go to **Storage** in your Supabase dashboard
2. Click **Create bucket**
3. Name it: `gallery-images`
4. Make it **Public**

### 6. Enable Row-Level Security (RLS)
Go to **Authentication** → **Policies**:

For `site_content` table:
- Enable RLS
- Add policy: "Enable read access for all users"
  ```sql
  (true)  -- Everyone can read
  ```
- Add policy: "Enable write for authenticated users"
  ```sql
  (auth.role() = 'authenticated')  -- Only logged-in users can edit
  ```

For `galleries` table:
- Same policies as above

### 7. Create an Admin User
In Supabase:
1. Go to **Authentication** → **Users**
2. Click **Invite a user** or use **Sign up**
3. Use your email (this is your admin login)

### 8. Restart Your Dev Server
```bash
# Kill current server (Ctrl+C)
# Then restart:
npm run dev
```

### 9. Access Admin Panel
- Visit your site
- Click the 🔒 icon in the bottom-right corner
- Or go to `http://localhost:5174/#/admin`
- Log in with your Supabase user credentials

## Admin Features

### Text Content
- Edit hero title
- Edit hero subtitle  
- Change workshop price
- Change workshop duration

### Gallery Images
- Upload multiple images at once
- Delete images
- Images display in the "From the workshops" section

## Troubleshooting

**"Cannot find module '@supabase/supabase-js'"**
- Run: `npm install`

**"Environment variables not loading"**
- Make sure file is named `.env.local` (not `.env` or `.env.example`)
- Restart dev server after creating the file

**"Login fails"**
- Check your credentials are correct in `.env.local`
- Make sure user exists in Supabase Authentication

**"Images won't upload"**
- Check `gallery-images` bucket exists and is Public
- Check RLS policies are set correctly

## Security Notes
- Never commit `.env.local` to git
- `VITE_SUPABASE_ANON_KEY` is public (safe to share)
- Supabase RLS policies protect your data
- Only authenticated users can edit content
