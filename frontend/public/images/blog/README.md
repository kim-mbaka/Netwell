# Blog Images Folder

## How to Add Blog Post Images

1. **Place image files here:** `/frontend/public/images/blog/`
   - Example: `blog-post-1.jpg`, `networking-guide.png`, etc.

2. **In Django Admin:**
   - Go to: `/admin` → BlogPost
   - Create or edit a blog post
   - In the "image_filename" field, enter just the filename
   - Example: `networking-guide.jpg`

3. **Result:**
   - Frontend will display from: `/images/blog/networking-guide.jpg`
   - Images are bundled with your code
   - They survive redeploys ✅
   - No cloud storage needed ✅

## Benefits of This Approach

✅ Images never get lost
✅ No storage costs (S3, cloud)
✅ Simple management
✅ Works on any hosting platform
✅ Images load locally (fast)

## Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`
- `.avif`

## Example

**Folder structure:**
```
/frontend/public/images/blog/
├── fiber-internet-guide.jpg
├── network-setup.png
└── speed-test.webp
```

**Django Admin:**
- Image Filename: `fiber-internet-guide.jpg`
- (Just the filename, no path)

**Display:**
- Automatically shows at: `/images/blog/fiber-internet-guide.jpg`
- Works everywhere - development, production, any server ✅
