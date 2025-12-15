# Enhancement: Document Attachments in Forum

## Changes Made

- Updated storage bucket to allow additional file types:
  - PDF
  - Word documents (.doc, .docx)
  - Excel spreadsheets (.xls, .xlsx)
  - Text files (.txt)
  - Increased file size limit to 10MB

- Updated `ForumService`:
  - Added `validateFile()` for all file types
  - Added `isImageFile()` helper
  - Added `getFileTypeLabel()` helper
  - Updated `uploadAttachment()` to accept all file types

- Created `FileAttachment` component for displaying non-image files:
  - Shows file type icon (PDF=red, Word=blue, Excel=green)
  - Displays file name and type
  - Download button to open file

- Updated `ForumPostCard` to display both images and documents separately

- Updated Create Post dialog:
  - File input accepts all supported types
  - Shows image previews for images
  - Shows file type label for documents

## To Verify

1. Start dev server: `npm run dev`
2. Navigate to Forum: http://localhost:3000/interaction/forum
3. Click "Add New Post"
4. Click "Click to select files"
5. Select a PDF or Word document
6. See the file type label in the preview
7. Submit the post
8. See the document displayed with download button

## Supported File Types

- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Text (.txt)
- Max size: 10MB per file
