# CampusERP College - Student Management System

A complete full-stack Student Management System for a college ERP workflow. The project includes a modern React admin dashboard, Spring Boot REST API, JWT authentication, MySQL database integration, student/staff/course management, attendance, marks, fees, PDF receipts, Excel export, and an offline AI-style college guide.
Repository
     https://github.com/Bhuvana9345/student_management_system

Live Demo Link
     https://student-management-system-pi-swart.vercel.app/

## Tech Stack

### Frontend

- React.js
- Bootstrap 5
- Axios
- React Router DOM
- Chart.js
- Vite

### Backend

- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- REST API
- Swagger/OpenAPI
- iText PDF
- Apache POI Excel Export

### Database

- MySQL / MariaDB
- XAMPP supported

## Main Features

- Admin, Student, and Staff login
- JWT authentication and protected routes
- Role-based access-ready structure
- Dashboard cards and analytics charts
- Student CRUD with profile photo upload and preview
- Staff management with Staff ID login support
- Course/group management
- Attendance marking
- Marks management with grade and GPA calculation
- Fees management with Cash / Online Payment option
- Professional PDF fee receipt with signature image support
- Excel export for full student details
- AI Guide page for route, facilities, admission, fees, attendance, and marks doubts
- Swagger API documentation
- Responsive admin panel UI

## Project Structure

```text
Student Management System/
├── backend/
│   ├── src/main/java/com/college/sms/
│   └── src/main/resources/application.properties
├── frontend/
│   ├── src/
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## Default Ports

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
MySQL:    localhost:3306
Swagger:  http://localhost:8080/swagger-ui.html
```

## Default Admin Login

```text
Email: admin@college.edu
Password: password
```

## Database Setup Using XAMPP

1. Open XAMPP Control Panel.
2. Start MySQL.
3. Open phpMyAdmin or XAMPP Shell.
4. Create the database:

```sql
CREATE DATABASE IF NOT EXISTS student_management_system;
USE student_management_system;
```

5. Run the SQL from:

```text
database/schema.sql
```

The backend also uses `spring.jpa.hibernate.ddl-auto=update`, so missing columns can be created automatically during development.

## Backend Setup

Open the backend in Eclipse:

```text
File -> Import -> Maven -> Existing Maven Projects
Root Directory: backend
Finish
```

Check MySQL settings in:

```text
backend/src/main/resources/application.properties
```

For XAMPP default MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management_system?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

Run:

```text
StudentManagementSystemApplication.java
Right click -> Run As -> Java Application
```

Backend is running correctly when the console shows:

```text
Tomcat started on port 8080
Started StudentManagementSystemApplication
```

## Frontend Setup

Open Command Prompt:

```bash
cd "C:\Users\acer\OneDrive\Desktop\Student Management System\frontend"
npm install
npm run dev
```

Open:

```text
http://localhost:5173/login/admin
```

## Signature Image for Fee Receipt

To show a signature in fee receipts, place a PNG file here:

```text
backend/src/main/resources/signature.png
```

Restart the backend after replacing the image.

## Important Workflow

Start the project in this order:

```text
1. Start XAMPP MySQL
2. Run Spring Boot backend in Eclipse
3. Run React frontend with npm run dev
4. Open http://localhost:5173/login/admin
```

## API Documentation

After backend starts, open:

```text
http://localhost:8080/swagger-ui.html
```

## Common Problems

### MySQL Connection Error

If backend shows:

```text
Communications link failure
```

Check:

- XAMPP MySQL is running
- MySQL port is `3306`
- `application.properties` has the same port
- Database name is exactly `student_management_system`

### Wrong Database Name

Correct:

```text
student_management_system
```

Wrong examples:

```text
stduent_management_system
student_management
```

### Expired Login Token

If API shows expired JWT errors, clear browser storage or open:

```text
http://localhost:5173/login/admin
```

Then login again.

## GitHub Upload

Recommended repository name:

```text
student-management-system
```

Before uploading, do not commit these folders:

```text
frontend/node_modules/
backend/target/
backend/uploads/
```

## License

This project is for academic and learning purposes.
