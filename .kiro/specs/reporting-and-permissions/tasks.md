# Implementation Plan: Reporting and Permissions Feature

## Overview

This implementation plan breaks down the Reporting and Permissions feature into four phases: Foundation (Roles & Permissions), Reporting System, Analytics Dashboard, and Polish & Optimization. The feature adds comprehensive RBAC, student/teacher reporting, and analytics to the SMKN 2 Kuningan LMS using Laravel (PHP) backend and React (JavaScript) frontend.

## Tasks

### Phase 1: Foundation - Roles and Permissions System

- [ ] 1. Set up database schema and models for RBAC
  - [ ] 1.1 Create database migrations for roles, permissions, and role_permissions tables
    - Create migration for `roles` table with columns: id, name, description, is_default, timestamps
    - Create migration for `permissions` table with columns: id, resource, action, description, timestamps
    - Create migration for `role_permissions` pivot table with role_id and permission_id
    - Add role_id column to users table with foreign key constraint
    - Add indexes: idx_name on roles, idx_resource on permissions, idx_role_id on users
    - _Requirements: 1.1, 25.1, 25.2, 25.3, 25.4, 25.5_

  - [ ] 1.2 Create Eloquent models for Role and Permission
    - Create `app/Models/Role.php` with fillable fields, relationships (users, permissions), scopes (custom, default), and getUserCountAttribute accessor
    - Create `app/Models/Permission.php` with fillable fields, relationships (roles), and scopes (forResource, forAction)
    - Update `app/Models/User.php` to add role relationship and helper methods (hasPermission, isAdmin, isGuru, isSiswa)
    - _Requirements: 1.1, 1.2, 2.1, 2.2_

  - [ ] 1.3 Create database seeders for default roles and permissions
    - Create seeder for default roles: Admin, Guru, Siswa with is_default=true
    - Create seeder for standard permissions covering all resources (users, kelas, mata_pelajaran, jadwal, materi, tugas, nilai, absensi, roles, reports, analytics) and actions (create, read, update, delete)
    - Create seeder to assign permissions to default roles according to design specifications
    - _Requirements: 25.6, 25.7_

- [ ] 2. Implement Permission Service and Middleware
  - [ ] 2.1 Create PermissionService class
    - Create `app/Services/PermissionService.php` with methods: hasPermission, getUserPermissions, assignRole, createRole, updateRolePermissions, deleteRole, getGroupedPermissions
    - Implement caching for getUserPermissions using Laravel Cache (cache key: "user:{user_id}:permissions")
    - Implement cache invalidation on role/permission changes
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 3.5_

  - [ ] 2.2 Create CheckPermission middleware
    - Create `app/Http/Middleware/CheckPermission.php` that accepts resource and action parameters
    - Implement handle method to verify user has required permission using PermissionService
    - Return 403 Forbidden response if permission check fails
    - _Requirements: 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [ ] 2.3 Create EnsureRole middleware
    - Create `app/Http/Middleware/EnsureRole.php` that accepts role names as parameters
    - Implement handle method to verify user has one of the required roles
    - Return 403 Forbidden response if role check fails
    - _Requirements: 2.3, 2.4_

  - [ ] 2.4 Register middleware in Laravel application
    - Register CheckPermission and EnsureRole middleware in `bootstrap/app.php` or `app/Http/Kernel.php`
    - _Requirements: 2.3, 2.4_

- [ ] 3. Create API endpoints for role and permission management
  - [ ] 3.1 Create RoleController with CRUD operations
    - Create `app/Http/Controllers/RoleController.php` with methods: index, store, update, destroy
    - Implement index() to return all roles with permissions and user counts
    - Implement store() to create custom roles with validation (unique name, permission_ids array)
    - Implement update() to update role permissions
    - Implement destroy() to delete custom roles (prevent deletion of default roles, reassign users)
    - Apply EnsureRole:Admin middleware to all methods
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 21.1, 21.2, 21.3, 21.4, 21.8_

  - [ ] 3.2 Create PermissionController to list permissions
    - Create `app/Http/Controllers/PermissionController.php` with index() method
    - Implement index() to return all permissions grouped by resource
    - Apply EnsureRole:Admin middleware
    - _Requirements: 1.8, 21.5, 21.8_

  - [ ] 3.3 Add role assignment endpoint to UserController or RoleController
    - Create assignRole() method to assign role to user by user ID
    - Validate role_id exists and user exists
    - Apply EnsureRole:Admin middleware
    - _Requirements: 2.1, 2.5, 21.6, 21.8_

  - [ ] 3.4 Define API routes for role and permission endpoints
    - Add routes in `routes/api.php`: GET /api/roles, POST /api/roles, PUT /api/roles/{id}, DELETE /api/roles/{id}, GET /api/permissions, POST /api/users/{id}/assign-role
    - Apply auth:sanctum middleware to all routes
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7_

- [ ] 4. Build frontend role management UI
  - [ ] 4.1 Create RoleListPage component
    - Create `lms-frontend/src/pages/RoleListPage.jsx` to display roles in a table
    - Fetch roles from GET /api/roles endpoint
    - Display role name, description, user count, and action buttons (Edit, Delete)
    - Add "Create Role" button that opens RoleFormModal
    - Implement delete confirmation dialog
    - Handle loading and error states
    - _Requirements: 18.1, 18.2, 18.6, 18.7, 18.8_

  - [ ] 4.2 Create RoleFormModal component
    - Create `lms-frontend/src/components/RoleFormModal.jsx` for creating/editing roles
    - Add form fields: role name (text input), description (textarea)
    - Fetch permissions from GET /api/permissions and display as checkboxes grouped by resource
    - Implement form validation (required name, at least one permission)
    - Submit to POST /api/roles (create) or PUT /api/roles/{id} (update)
    - Display success/error messages
    - _Requirements: 18.3, 18.4, 18.5_

  - [ ] 4.3 Create PermissionGate component for conditional rendering
    - Create `lms-frontend/src/components/PermissionGate.jsx` that accepts resource, action, children, and fallback props
    - Use useAuth hook to get current user
    - Check if user has required permission by matching resource and action in user.role.permissions
    - Render children if permission exists, otherwise render fallback
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

  - [ ] 4.4 Add role management route and navigation
    - Add route in React Router for /roles pointing to RoleListPage
    - Add "Roles" menu item in navigation (visible only to Admin using PermissionGate)
    - _Requirements: 18.1_

- [ ] 5. Checkpoint - Verify RBAC system functionality
  - Ensure all tests pass, verify role creation/editing/deletion works, verify permission checks work correctly, ask the user if questions arise.


### Phase 2: Reporting System

- [ ] 6. Install and configure report export packages
  - [ ] 6.1 Install barryvdh/laravel-dompdf and maatwebsite/excel packages
    - Run `composer require barryvdh/laravel-dompdf` in lms-backend directory
    - Run `composer require maatwebsite/excel` in lms-backend directory
    - Publish configuration files if needed
    - _Requirements: 5.1, 5.2, 8.1, 8.2_

- [ ] 7. Implement ReportGeneratorService
  - [ ] 7.1 Create ReportGeneratorService class with student report generation
    - Create `app/Services/ReportGeneratorService.php`
    - Implement generateStudentReport() method that accepts studentId, startDate, endDate
    - Query student data, grades (with subject and teacher), attendance records, assignment submissions
    - Calculate statistics: average grade, attendance percentage, assignment completion rate
    - Use eager loading to optimize queries
    - Return structured array with student, period, grades, attendance, assignments, statistics sections
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 26.2, 26.3_

  - [ ] 7.2 Add teacher authorization verification methods
    - Implement verifyTeacherOwnsClass() method to check if teacher_id matches class.teacher_id
    - Implement verifyTeacherTeachesStudent() method to check if teacher teaches any class the student is in
    - _Requirements: 4.8, 22.7, 22.8, 23.7, 23.8_

  - [ ] 7.3 Implement class report generation
    - Implement generateClassReport() method that accepts classId, startDate, endDate
    - Query all students in class with their grades, attendance, and assignment submissions
    - Calculate class statistics: average grade, pass rate, grade distribution, top/bottom performers
    - Calculate assignment completion rates for the class
    - Use database aggregation functions for performance
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 26.7_

  - [ ] 7.4 Implement assignment statistics generation
    - Implement generateAssignmentStatistics() method that accepts teacherId, classId, subjectId
    - Query assignments created by teacher with submission counts
    - Calculate total assignments, submission rate, late submissions, pending submissions
    - Identify students with missing assignments
    - Filter by classId and subjectId if provided
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ] 7.5 Add caching to report generation
    - Implement cache for report data with 5-minute TTL
    - Use cache keys: "report:student:{id}:{start}:{end}", "report:class:{id}:{start}:{end}"
    - _Requirements: 26.1, 26.4_

- [ ] 8. Implement ExportService for PDF and Excel generation
  - [ ] 8.1 Create Blade templates for PDF reports
    - Create `resources/views/reports/student-report.blade.php` for student report layout
    - Create `resources/views/reports/class-report.blade.php` for class report layout
    - Include student/class info, grades table, attendance summary, statistics
    - Add proper styling for PDF rendering
    - _Requirements: 5.5, 8.5_

  - [ ] 8.2 Create ExportService class
    - Create `app/Services/ExportService.php`
    - Implement exportStudentReportToPdf() using Dompdf to render Blade template
    - Implement exportStudentReportToExcel() using Maatwebsite Excel to create spreadsheet
    - Implement exportClassReportToPdf() and exportClassReportToExcel()
    - Set proper headers for file download (Content-Type, Content-Disposition)
    - Include generation date and time in exports
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7, 8.1, 8.2, 8.3, 8.4, 8.7_

- [ ] 9. Create API endpoints for student reports
  - [ ] 9.1 Create StudentReportController
    - Create `app/Http/Controllers/StudentReportController.php`
    - Implement show() method to return student report data (GET /api/reports/student/{id})
    - Accept query parameters: start_date, end_date
    - Verify user is Admin or Guru who teaches the student
    - Apply auth:sanctum middleware
    - _Requirements: 22.1, 22.2, 22.6, 22.7, 22.8_

  - [ ] 9.2 Add student report export endpoint
    - Implement export() method in StudentReportController (GET /api/reports/student/{id}/export)
    - Accept query parameter: format (pdf or excel)
    - Call ExportService to generate file
    - Return file download response
    - _Requirements: 22.3, 22.4, 22.5_

  - [ ] 9.3 Define student report routes
    - Add routes in `routes/api.php`: GET /api/reports/student/{id}, GET /api/reports/student/{id}/export
    - Apply auth:sanctum and CheckPermission:reports,read middleware
    - _Requirements: 22.1, 22.3, 22.6_

- [ ] 10. Create API endpoints for teacher reports
  - [ ] 10.1 Create TeacherReportController
    - Create `app/Http/Controllers/TeacherReportController.php`
    - Implement showClassReport() method (GET /api/reports/class/{id})
    - Accept query parameters: start_date, end_date
    - Verify user is Admin or Guru who teaches the class
    - Apply auth:sanctum middleware
    - _Requirements: 23.1, 23.2, 23.6, 23.7, 23.8_

  - [ ] 10.2 Add assignment statistics endpoint
    - Implement showAssignmentStatistics() method (GET /api/reports/teacher/assignments)
    - Accept query parameters: class_id, subject_id
    - Filter to current user's assignments if user is Guru
    - _Requirements: 23.3_

  - [ ] 10.3 Add teacher report export endpoint
    - Implement export() method (GET /api/reports/class/{id}/export)
    - Accept query parameter: format (pdf or excel)
    - Call ExportService to generate file
    - _Requirements: 23.4, 23.5_

  - [ ] 10.4 Define teacher report routes
    - Add routes in `routes/api.php`: GET /api/reports/class/{id}, GET /api/reports/teacher/assignments, GET /api/reports/class/{id}/export
    - Apply auth:sanctum and CheckPermission:reports,read middleware
    - _Requirements: 23.1, 23.3, 23.4, 23.6_

- [ ] 11. Build frontend student report UI
  - [ ] 11.1 Create StudentReportPage component
    - Create `lms-frontend/src/pages/StudentReportPage.jsx`
    - Add student search/selection input (search by name or NIS)
    - Add DateRangeFilter component for selecting report period
    - Add "Generate Report" button
    - Display report sections: student info, grades table, attendance summary, assignment submissions, statistics
    - Add export buttons (PDF, Excel) that call export endpoint
    - Handle loading and error states
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

  - [ ] 11.2 Create DateRangeFilter component
    - Create `lms-frontend/src/components/DateRangeFilter.jsx`
    - Add start date and end date input fields
    - Add preset buttons: Last 7 days, Last 30 days, This month, Last month, This semester
    - Validate start date <= end date
    - Display error message if validation fails
    - Emit onChange event when dates are selected
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

  - [ ] 11.3 Add student report route
    - Add route in React Router for /reports/student pointing to StudentReportPage
    - Add "Student Reports" menu item (visible to Admin and Guru using PermissionGate)
    - _Requirements: 19.1_

- [ ] 12. Build frontend teacher report UI
  - [ ] 12.1 Create ClassReportPage component
    - Create `lms-frontend/src/pages/ClassReportPage.jsx`
    - Add class selection dropdown (fetch classes from API)
    - Add DateRangeFilter component
    - Display report sections: class info, performance statistics, grade distribution chart, top/bottom performers, assignment completion rates
    - Add export buttons (PDF, Excel)
    - Handle loading and error states
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ] 12.2 Create AssignmentStatisticsPage component
    - Create `lms-frontend/src/pages/AssignmentStatisticsPage.jsx`
    - Add filter dropdowns for class and subject
    - Display statistics cards: total assignments, submission rate, late submissions, pending submissions
    - Display assignment list with submission details
    - Display students with missing assignments
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ] 12.3 Add teacher report routes
    - Add routes for /reports/class and /reports/assignments
    - Add menu items (visible to Admin and Guru using PermissionGate)
    - _Requirements: 6.1, 7.1_

- [ ] 13. Checkpoint - Verify reporting system functionality
  - Ensure all tests pass, verify student and teacher reports generate correctly, verify exports work, ask the user if questions arise.


### Phase 3: Analytics Dashboard

- [ ] 14. Install Recharts library for data visualization
  - [ ] 14.1 Install Recharts in React frontend
    - Run `npm install recharts` in lms-frontend directory
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 15. Implement AnalyticsService
  - [ ] 15.1 Create AnalyticsService class with system statistics
    - Create `app/Services/AnalyticsService.php`
    - Implement getSystemStatistics() method to count total users (by role), classes, subjects, assignments, learning materials
    - Use database aggregation for performance
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.8_

  - [ ] 15.2 Implement performance analytics
    - Implement getPerformanceAnalytics() method that accepts classId, subjectId, startDate, endDate, teacherId
    - Calculate average grade, pass rate, fail rate, total students
    - Generate grade distribution (ranges: 90-100, 80-89, 70-79, 60-69, 0-59)
    - Generate performance trends over time (monthly averages)
    - Identify subjects with lowest average grades
    - Filter by teacherId if user is Guru (only include their classes)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ] 15.3 Implement attendance analytics
    - Implement getAttendanceAnalytics() method that accepts classId, startDate, endDate, teacherId
    - Calculate overall attendance rate
    - Generate attendance trends over time
    - Generate distribution of attendance statuses (Hadir, Sakit, Izin, Alpha)
    - Identify classes with lowest attendance rates
    - Identify students with attendance below threshold (e.g., 75%)
    - Filter by teacherId if user is Guru
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [ ] 15.4 Implement assignment completion analytics
    - Implement getAssignmentAnalytics() method that accepts classId, subjectId, startDate, endDate, teacherId
    - Calculate overall assignment completion rate
    - Generate completion rates by class and by subject
    - Identify assignments with lowest completion rates
    - Calculate late submission percentage
    - Generate completion rate trends over time
    - Filter by teacherId if user is Guru
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [ ] 15.5 Implement teacher workload statistics
    - Implement getTeacherWorkloadStatistics() method (Admin only)
    - Count classes, assignments, students, and learning materials per teacher
    - Calculate average workload across all teachers
    - Identify teachers with workload significantly above/below average
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ] 15.6 Add caching to analytics queries
    - Implement cache for analytics data with 10-minute TTL
    - Use cache keys based on filters hash: "analytics:performance:{hash}", "analytics:attendance:{hash}"
    - _Requirements: 27.1, 27.3, 27.4_

  - [ ] 15.7 Optimize analytics queries with database indexes
    - Add indexes on date columns for time-series queries
    - Use database views or materialized views for complex aggregations if needed
    - Limit chart data points to maximum 100 per chart
    - _Requirements: 27.2, 27.5, 27.6_

- [ ] 16. Create API endpoints for analytics
  - [ ] 16.1 Create AnalyticsController
    - Create `app/Http/Controllers/AnalyticsController.php`
    - Implement systemStats() method (GET /api/analytics/system-stats)
    - Implement performance() method (GET /api/analytics/performance)
    - Implement attendance() method (GET /api/analytics/attendance)
    - Implement assignments() method (GET /api/analytics/assignments)
    - Implement teacherWorkload() method (GET /api/analytics/teacher-workload) - Admin only
    - Accept query parameters: start_date, end_date, class_id, subject_id
    - Filter data by teacherId if user is Guru
    - Apply auth:sanctum middleware
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8_

  - [ ] 16.2 Add analytics export endpoint
    - Implement export() method (GET /api/analytics/export)
    - Accept query parameter: format (pdf or excel)
    - Generate PDF with charts as images or Excel with raw data
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [ ] 16.3 Define analytics routes
    - Add routes in `routes/api.php`: GET /api/analytics/system-stats, GET /api/analytics/performance, GET /api/analytics/attendance, GET /api/analytics/assignments, GET /api/analytics/teacher-workload, GET /api/analytics/export
    - Apply auth:sanctum and CheckPermission:analytics,read middleware
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.7_

- [ ] 17. Build frontend analytics dashboard UI
  - [ ] 17.1 Create StatCard component
    - Create `lms-frontend/src/components/StatCard.jsx`
    - Accept props: title, value, icon, color, trend (optional)
    - Display numeric value with icon and optional trend indicator (up/down arrow)
    - Use Tailwind CSS for styling
    - _Requirements: 9.8_

  - [ ] 17.2 Create ChartCard component
    - Create `lms-frontend/src/components/ChartCard.jsx`
    - Accept props: title, chartType (line, bar, pie), data, config, loading, error
    - Integrate Recharts components (LineChart, BarChart, PieChart)
    - Display axis labels and legends
    - Show data point values on hover
    - Display loading spinner while fetching data
    - Display error message if data fetch fails
    - Make charts responsive
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

  - [ ] 17.3 Create AnalyticsDashboard component
    - Create `lms-frontend/src/pages/AnalyticsDashboard.jsx`
    - Add grid layout for statistics cards at the top
    - Fetch and display system statistics using StatCard components
    - Add filter controls: DateRangeFilter, class dropdown, subject dropdown
    - Add chart sections: performance trends (line chart), grade distribution (bar chart), attendance trends (line chart), attendance status distribution (pie chart), assignment completion (bar chart)
    - Add teacher workload chart (visible only to Admin using PermissionGate)
    - Add export button in header
    - Fetch data from analytics endpoints
    - Refresh data when filters change
    - Handle loading and error states
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8_

  - [ ] 17.4 Add analytics dashboard route
    - Add route in React Router for /analytics pointing to AnalyticsDashboard
    - Add "Analytics" menu item (visible to Admin and Guru using PermissionGate)
    - _Requirements: 20.1_

- [ ] 18. Checkpoint - Verify analytics dashboard functionality
  - Ensure all tests pass, verify charts render correctly, verify filters work, verify data accuracy, ask the user if questions arise.


### Phase 4: Polish and Optimization

- [ ] 19. Implement comprehensive error handling
  - [ ] 19.1 Create global exception handler for API
    - Update `app/Exceptions/Handler.php` to handle API exceptions
    - Return JSON responses for AuthenticationException (401), AuthorizationException (403), ValidationException (422), ModelNotFoundException (404)
    - Log unexpected errors with error_id and return 500 response
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7_

  - [ ] 19.2 Add error handling to frontend
    - Create Axios interceptor in `lms-frontend/src/api/axios.js` to handle error responses
    - Handle 401 (redirect to login), 403 (show permission error), 422 (validation errors), 429 (rate limit), 500 (server error)
    - Display user-friendly error messages using toast notifications
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.7_

  - [ ] 19.3 Create ErrorBoundary component
    - Create `lms-frontend/src/components/ErrorBoundary.jsx` to catch React errors
    - Display error message with refresh button
    - Log errors to console
    - _Requirements: 28.7_

  - [ ] 19.4 Add LoadingSpinner and ErrorMessage components
    - Create `lms-frontend/src/components/LoadingSpinner.jsx` for consistent loading states
    - Create `lms-frontend/src/components/ErrorMessage.jsx` for displaying errors
    - Use these components throughout the application
    - _Requirements: 28.7_

- [ ] 20. Implement security logging and audit trails
  - [ ] 20.1 Add security logging for permission denials
    - Log all permission denials with user_id, resource, action, IP address, timestamp
    - Use Laravel's logging channels (create 'security' channel)
    - _Requirements: 3.6, 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7_

  - [ ] 20.2 Add logging for report generation and exports
    - Log report generation requests with user_id, report type, parameters
    - Log export operations with format and file size
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7_

  - [ ] 20.3 Add performance logging for slow queries
    - Log queries that exceed 5 seconds with query details, duration, user_id, endpoint
    - Use Laravel's query logging or database query listener
    - _Requirements: 26.5, 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7_

- [ ] 21. Optimize database performance
  - [ ] 21.1 Add database indexes for performance
    - Create indexes on users.role_id, role_permissions.role_id, role_permissions.permission_id
    - Create indexes on grades (student_id, date), grades.subject_id
    - Create indexes on attendance (student_id, date), attendance.class_id
    - Create indexes on assignments.teacher_id, assignment_submissions.assignment_id
    - _Requirements: 26.2, 27.2_

  - [ ] 21.2 Implement eager loading in queries
    - Use eager loading (with()) in ReportGeneratorService to load relationships
    - Use eager loading in AnalyticsService to minimize N+1 queries
    - _Requirements: 26.3_

  - [ ] 21.3 Implement Redis caching
    - Configure Redis as cache driver in Laravel
    - Implement caching for permissions (session duration), reports (5 minutes), analytics (10 minutes)
    - Implement cache invalidation on data changes
    - _Requirements: 26.4, 27.3_

- [ ] 22. Add rate limiting to prevent abuse
  - [ ] 22.1 Configure rate limiting for API endpoints
    - Add rate limiting middleware to API routes (e.g., 60 requests per minute)
    - Return 429 response with retry_after header when limit exceeded
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7_

- [ ] 23. Enhance UI/UX with loading states and feedback
  - [ ] 23.1 Add loading indicators to all data fetching operations
    - Use LoadingSpinner component in all pages during data fetch
    - Disable buttons during form submission
    - _Requirements: 20.7, 27.7_

  - [ ] 23.2 Add success/error toast notifications
    - Install and configure toast notification library (e.g., react-toastify)
    - Display success messages after create/update/delete operations
    - Display error messages from API responses
    - _Requirements: 28.7_

  - [ ] 23.3 Improve form validation and error display
    - Display field-specific validation errors in forms
    - Highlight invalid fields with red borders
    - Show validation errors below input fields
    - _Requirements: 28.3_

- [ ] 24. Write comprehensive tests
  - [ ]* 24.1 Write unit tests for PermissionService
    - Test hasPermission returns true/false correctly
    - Test createRole assigns permissions correctly
    - Test deleteRole reassigns users to default role
    - Test getUserPermissions with caching
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 3.5_

  - [ ]* 24.2 Write unit tests for ReportGeneratorService
    - Test generateStudentReport includes all required sections
    - Test generateStudentReport calculates average grade correctly
    - Test verifyTeacherOwnsClass returns true/false correctly
    - Test generateClassReport calculates statistics correctly
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 24.3 Write unit tests for AnalyticsService
    - Test getSystemStatistics returns correct counts
    - Test getPerformanceAnalytics calculates pass rate correctly
    - Test getAttendanceAnalytics filters by date range
    - Test getAssignmentAnalytics calculates completion rate correctly
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 11.1, 11.2, 12.1, 12.2_

  - [ ]* 24.4 Write integration tests for role API endpoints
    - Test admin can create custom role
    - Test non-admin cannot create role (403)
    - Test cannot delete default role
    - Test role assignment works correctly
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.6, 21.8_

  - [ ]* 24.5 Write integration tests for report API endpoints
    - Test guru can access own student report
    - Test guru cannot access other teacher's student report (403)
    - Test student report export returns PDF file
    - Test class report includes correct data
    - _Requirements: 22.1, 22.2, 22.3, 22.7, 22.8, 23.1, 23.2, 23.7, 23.8_

  - [ ]* 24.6 Write integration tests for analytics API endpoints
    - Test admin can access system statistics
    - Test guru analytics filtered to own classes
    - Test performance analytics returns correct structure
    - Test attendance analytics filters by date range
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.8_

  - [ ]* 24.7 Write frontend component tests
    - Test PermissionGate renders children when user has permission
    - Test PermissionGate hides children when user lacks permission
    - Test RoleFormModal validates required fields
    - Test ChartCard renders loading state and chart
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 18.4, 18.5, 14.7, 14.8_

- [ ] 25. Final integration and deployment preparation
  - [ ] 25.1 Run all tests and fix any failures
    - Run PHPUnit tests: `php artisan test`
    - Run frontend tests: `npm test`
    - Fix any failing tests
    - _Requirements: All_

  - [ ] 25.2 Verify all features work end-to-end
    - Test role creation, editing, deletion
    - Test role assignment to users
    - Test student report generation and export
    - Test teacher report generation and export
    - Test analytics dashboard with all charts
    - Test permission-based UI rendering
    - _Requirements: All_

  - [ ] 25.3 Create deployment documentation
    - Document environment variables needed
    - Document database migrations to run
    - Document seeders to run for initial setup
    - Document package installation steps
    - Document Redis configuration
    - _Requirements: All_

  - [ ] 25.4 Optimize production configuration
    - Enable Laravel caching (config, routes, views)
    - Set appropriate cache TTLs
    - Configure Redis for production
    - Set up queue workers if needed
    - _Requirements: 26.1, 26.4, 27.1, 27.3_

- [ ] 26. Final checkpoint - Feature complete
  - Ensure all tests pass, verify all requirements are met, verify performance is acceptable, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at the end of each phase
- The implementation follows a 4-phase approach: Foundation (RBAC), Reporting, Analytics, Polish
- Backend uses Laravel (PHP) with Sanctum authentication
- Frontend uses React (JavaScript) with Recharts for visualization
- Database indexes and caching are critical for performance with large datasets
- Security is enforced through middleware, permission checks, and scope filtering (Guru can only access own classes/students)


## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "6.1", "14.1"]
    },
    {
      "id": 1,
      "tasks": ["1.2", "1.3"]
    },
    {
      "id": 2,
      "tasks": ["2.1", "2.2", "2.3"]
    },
    {
      "id": 3,
      "tasks": ["2.4", "3.1", "3.2", "3.3"]
    },
    {
      "id": 4,
      "tasks": ["3.4", "4.1", "4.3"]
    },
    {
      "id": 5,
      "tasks": ["4.2", "4.4", "7.1", "7.2"]
    },
    {
      "id": 6,
      "tasks": ["7.3", "7.4", "8.1"]
    },
    {
      "id": 7,
      "tasks": ["7.5", "8.2", "9.1"]
    },
    {
      "id": 8,
      "tasks": ["9.2", "9.3", "10.1", "10.2"]
    },
    {
      "id": 9,
      "tasks": ["10.3", "10.4", "11.2"]
    },
    {
      "id": 10,
      "tasks": ["11.1", "11.3", "12.1", "12.2"]
    },
    {
      "id": 11,
      "tasks": ["12.3", "15.1"]
    },
    {
      "id": 12,
      "tasks": ["15.2", "15.3", "15.4", "15.5"]
    },
    {
      "id": 13,
      "tasks": ["15.6", "15.7", "16.1"]
    },
    {
      "id": 14,
      "tasks": ["16.2", "16.3", "17.1", "17.2"]
    },
    {
      "id": 15,
      "tasks": ["17.3", "17.4"]
    },
    {
      "id": 16,
      "tasks": ["19.1", "19.2", "19.3", "19.4", "20.1", "20.2", "20.3"]
    },
    {
      "id": 17,
      "tasks": ["21.1", "21.2", "21.3", "22.1"]
    },
    {
      "id": 18,
      "tasks": ["23.1", "23.2", "23.3"]
    },
    {
      "id": 19,
      "tasks": ["24.1", "24.2", "24.3", "24.4", "24.5", "24.6", "24.7"]
    },
    {
      "id": 20,
      "tasks": ["25.1"]
    },
    {
      "id": 21,
      "tasks": ["25.2", "25.3", "25.4"]
    }
  ]
}
```
