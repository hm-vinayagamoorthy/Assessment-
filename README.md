
# 

This is the primary service used for fileupload and parse it to another microservice and return the secret child response:  
- Assessment service

Run (after installing deps):

```bash
npm install
create .env file and all below env variables 
ASSIGNMENTS_API_URL = http://localhost:3001/assignments (secret child logic from another microserive)
SANTA_APPLICATION_URL = http://localhost:3002 (UI)
npm run start


```

Run tests:

```bash
npm run test:e2e
```

POST /secret-santa/upload
Description:
This endpoint allows uploading Secret Santa employee files and optional previous year assignments. The server validates the files, generates Secret Santa assignments, and returns a downloadable CSV file along with the assignment data.

Request Type: POST

Content Type: multipart/form-data

Form-Data Inputs:

Field Name	Type	Required	Description
employeesFile	File	Yes	The main employee list file (.csv or .xlsx).
previousYearFile	File	No	Optional file containing previous year assignments (.csv or .xlsx).

Response Example (JSON):

json
Copy
Edit
{
  "message": "Assignments created",
  "downloadUrl": "/home/user/Parser-service/output/secret_santa_result.csv",
  "csvContent": [
    {
      "Employee_Name": "Hamish Murray",
      "Employee_EmailID": "hamish.murray@acme.com",
      "Secret_Child_Name": "Benjamin Collins",
      "Secret_Child_EmailID": "benjamin.collins@acme.com"
    }
  ]
}
Notes:

File Validation: Only .csv and .xlsx formats are accepted. Uploading other formats will return an error.

Optional File: previousYearFile is optional; if not provided, assignments are generated from scratch.

Download: downloadUrl provides a direct path to download the generated CSV with assignments.

Error Handling:

415 Unsupported Media Type → Invalid file type.

500 Internal Server Error → Failed processing the files.

Testing in Postman:

Open Postman → New Request → POST http://localhost:3000/secret-santa/upload.

Go to Body → form-data.

Add the following keys:

employeesFile → select a .csv or .xlsx file.

previousYearFile → select optional .csv or .xlsx file.

Send the request and check the response for message, csvContent, and downloadUrl.

If you want, I can also write a Postman Collection JSON that you can import directly and test this endpoint with ready-made sample files.

Do you want me to do that?

The API returns a download link on success.
