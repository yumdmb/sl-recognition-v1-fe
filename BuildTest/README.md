# BuildTest Folder

## Required Screenshots for PDF Submission

Please take the following screenshots and compile them into ONE PDF file named:
**U2102340_EISRAQ REJAB BIN HASSAN_Q1.pdf**

### Screenshot 1: Docker Build Success
- Run: `docker build -t u2102340-sl-recognition .`
- Capture the terminal showing successful build completion
- Make sure the final output shows "Successfully built" or "Successfully tagged"

### Screenshot 2: Docker Run Command
- Run: `docker run -p 3000:3000 u2102340-sl-recognition`
- Capture the terminal showing the container starting
- Should show the application is running on port 3000

### Screenshot 3: Application Running in Browser
- Open browser to: `http://localhost:3000`
- Capture the application homepage
- Ensure the URL is visible in the screenshot

### Screenshot 4 (Optional but recommended): Docker Verification
- Run: `curl http://localhost:3000` OR
- Show browser developer tools confirming successful connection

---

## Steps to Complete:

1. ✅ Docker build completed
2. ⏳ Run the container: `docker run -p 3000:3000 u2102340-sl-recognition`
3. ⏳ Open browser to http://localhost:3000
4. ⏳ Take screenshots
5. ⏳ Create PDF with all screenshots
6. ⏳ Save PDF in this BuildTest folder
