# Requirements Document

## Introduction

This document specifies the requirements for the Reporting and Permissions feature of the SMKN 2 Kuningan Learning Management System (LMS). This feature extends the existing LMS with advanced role-based access control, comprehensive student and teacher reporting capabilities, and a statistics and analytics dashboard. The system will integrate with the existing Laravel Sanctum authentication system and support three primary user roles: Admin, Guru (Teacher), and Siswa (Student).

## Glossary

- **LMS**: Learning Management System - the web application for SMKN 2 Kuningan
- **Permission_System**: The role-based access control subsystem that manages permissions and role assignments
- **Report_Generator**: The subsystem responsible for generating student and teacher reports
- **Analytics_Dashboard**: The subsystem that displays statistics, charts, and system-wide metrics
- **Admin**: A user with the administrator role who manages the system
- **Guru**: A user with the teacher role who manages classes and student data
- **Siswa**: A user with the student role who views their own academic data
- **Role**: A named collection of permissions that can be assigned to users
- **Permission**: A specific authorization to perform an action (create, read, update, delete) on a resource
- **Custom_Role**: A role created by an Admin beyond the default Admin, Guru, and Siswa roles
- **Report_Exporter**: The component that converts reports to PDF or Excel format
- **Date_Range_Filter**: A UI component that allows filtering data by start and end dates
- **Chart_Renderer**: The component that displays visual charts (line, bar, pie) in the Analytics Dashboard
- **Academic_Progress**: A student's performance metrics including grades, attendance, and assignment completion
- **Attendance_Record**: A record of a student's presence status for a specific class session
- **Assignment_Submission**: A record of a student submitting work for a tugas (assignment)
- **Grade_Report**: A report showing a student's grades across subjects
- **Performance_Analytics**: Statistical analysis of student performance including averages and pass/fail rates
- **Workload_Statistics**: Metrics showing teacher activity including classes taught and assignments created

## Requirements

### Requirement 1: Role Management System

**User Story:** As an Admin, I want to manage roles and permissions, so that I can control access to different parts of the system.

#### Acceptance Criteria

1. THE Permission_System SHALL store roles with unique names and descriptions
2. THE Permission_System SHALL store permissions with resource names and action types (create, read, update, delete)
3. WHEN an Admin creates a Custom_Role, THE Permission_System SHALL validate that the role name is unique
4. WHEN an Admin assigns permissions to a role, THE Permission_System SHALL associate the selected permissions with that role
5. WHEN an Admin updates a role's permissions, THE Permission_System SHALL update all users with that role to reflect the new permissions
6. THE Permission_System SHALL maintain the default roles (Admin, Guru, Siswa) and prevent their deletion
7. WHEN an Admin deletes a Custom_Role, THE Permission_System SHALL reassign affected users to a default role
8. THE Permission_System SHALL provide a list of all available permissions grouped by resource type

### Requirement 2: Permission Assignment

**User Story:** As an Admin, I want to assign roles to users, so that users have appropriate access levels.

#### Acceptance Criteria

1. WHEN an Admin assigns a role to a user, THE Permission_System SHALL update the user's role_id in the database
2. WHEN a user logs in, THE Permission_System SHALL load the user's role and associated permissions
3. WHEN a user attempts to access a protected resource, THE Permission_System SHALL verify the user has the required permission
4. IF a user lacks the required permission, THEN THE Permission_System SHALL return an HTTP 403 Forbidden response in all cases
5. THE Permission_System SHALL allow an Admin to view all users and their assigned roles
6. THE Permission_System SHALL allow an Admin to bulk-assign roles to multiple users simultaneously

### Requirement 3: Granular Permission Checking

**User Story:** As a developer, I want granular permission checks, so that the system enforces access control at the action level.

#### Acceptance Criteria

1. WHEN a user attempts a create action AND the user lacks create permission for that resource, THEN THE Permission_System SHALL fail the verification
2. WHEN a user attempts a read action AND the user lacks read permission for that resource, THEN THE Permission_System SHALL fail the verification
3. WHEN a user attempts an update action AND the user lacks update permission for that resource, THEN THE Permission_System SHALL fail the verification
4. WHEN a user attempts a delete action AND the user lacks delete permission for that resource, THEN THE Permission_System SHALL fail the verification
5. THE Permission_System SHALL cache permission checks for the duration of the user's session to improve performance
6. THE Permission_System SHALL log all permission denial events for security auditing

### Requirement 4: Student Individual Reports

**User Story:** As a Guru or Admin, I want to generate individual student reports, so that I can review a student's complete academic record.

#### Acceptance Criteria

1. WHEN a Guru or Admin requests a student report, THE Report_Generator SHALL retrieve the student's Academic_Progress data
2. THE Report_Generator SHALL include the student's grades for all subjects in the report
3. THE Report_Generator SHALL include the student's Attendance_Record for the selected date range
4. THE Report_Generator SHALL include the student's Assignment_Submission history with submission dates and statuses
5. THE Report_Generator SHALL calculate and display the student's average grade across all subjects
6. THE Report_Generator SHALL calculate and display the student's attendance percentage
7. THE Report_Generator SHALL display the report in a formatted HTML view
8. WHEN a Guru requests a student report, THE Report_Generator SHALL only include data for students in classes taught by that Guru regardless of whether an Admin is also requesting the report

### Requirement 5: Student Report Export

**User Story:** As a Guru or Admin, I want to export student reports to PDF or Excel, so that I can share or archive the reports.

#### Acceptance Criteria

1. WHEN a user requests a PDF export, THE Report_Exporter SHALL generate a PDF document containing the complete student report
2. WHEN a user requests an Excel export, THE Report_Exporter SHALL generate an Excel spreadsheet with the student report data in tabular format
3. THE Report_Exporter SHALL include the student's name, NIS (student ID), and class information in the exported file
4. THE Report_Exporter SHALL include the generation date and time in the exported file
5. THE Report_Exporter SHALL format the PDF with proper page breaks and readable fonts
6. THE Report_Exporter SHALL format the Excel file with column headers and appropriate cell formatting
7. WHEN the export is complete, THE Report_Exporter SHALL trigger a file download in the user's browser

### Requirement 6: Teacher Class Reports

**User Story:** As a Guru, I want to view class performance reports, so that I can assess how my classes are performing overall.

#### Acceptance Criteria

1. WHEN a Guru requests a class report, THE Report_Generator SHALL retrieve performance data for all students in the selected class
2. THE Report_Generator SHALL calculate the class average grade for each subject
3. THE Report_Generator SHALL calculate the class attendance rate
4. THE Report_Generator SHALL display the distribution of grades (number of students in each grade range)
5. THE Report_Generator SHALL identify the highest and lowest performing students in the class
6. THE Report_Generator SHALL display assignment completion rates for the class
7. THE Report_Generator SHALL allow filtering by date range using the Date_Range_Filter
8. WHEN a Guru requests a class report, THE Report_Generator SHALL only include classes taught by that Guru

### Requirement 7: Teacher Assignment Statistics

**User Story:** As a Guru, I want to view assignment submission statistics, so that I can track student engagement with assignments.

#### Acceptance Criteria

1. WHEN a Guru views assignment statistics, THE Report_Generator SHALL display the total number of assignments created
2. THE Report_Generator SHALL display the number of submitted assignments per assignment
3. THE Report_Generator SHALL display the number of pending submissions per assignment
4. THE Report_Generator SHALL display the number of late submissions per assignment
5. WHEN no assignments have been created, THE Report_Generator SHALL display 0% as the average submission rate across all assignments
6. THE Report_Generator SHALL display a list of students who have not submitted assignments
7. THE Report_Generator SHALL allow filtering by class and subject

### Requirement 8: Teacher Report Export

**User Story:** As a Guru or Admin, I want to export teacher reports to PDF or Excel, so that I can share class performance data with stakeholders.

#### Acceptance Criteria

1. WHEN a user requests a PDF export of a class report, THE Report_Exporter SHALL generate a PDF document with class performance data
2. WHEN a user requests an Excel export of a class report, THE Report_Exporter SHALL generate an Excel spreadsheet with student performance data in rows
3. THE Report_Exporter SHALL generate exports without summary statistics when summary statistics are unavailable
4. THE Report_Exporter SHALL include individual student data in the exported file
5. THE Report_Exporter SHALL include charts and graphs in the PDF export
6. THE Report_Exporter SHALL format the Excel export with sortable columns and filter options
7. WHEN the export is complete, THE Report_Exporter SHALL trigger a file download in the user's browser

### Requirement 9: System Statistics Dashboard

**User Story:** As an Admin, I want to view overall system statistics, so that I can monitor the LMS usage and health.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL display the total number of users in the system
2. THE Analytics_Dashboard SHALL display the total number of users by role (Admin, Guru, Siswa)
3. THE Analytics_Dashboard SHALL display the total number of classes (kelas)
4. THE Analytics_Dashboard SHALL display the total number of subjects (mata_pelajaran)
5. THE Analytics_Dashboard SHALL display the total number of assignments (tugas)
6. THE Analytics_Dashboard SHALL display the total number of learning materials (materi)
7. WHEN data changes, THE Analytics_Dashboard SHALL update statistics in real-time, AND IF real-time updates fail, THEN THE Analytics_Dashboard SHALL become non-functional
8. THE Analytics_Dashboard SHALL display statistics using StatCard components with appropriate icons and colors

### Requirement 10: Student Performance Analytics

**User Story:** As an Admin or Guru, I want to view student performance analytics, so that I can identify trends and areas for improvement.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL calculate and display the average grade across all students including zero averages as valid results
2. THE Analytics_Dashboard SHALL calculate and display the pass rate (percentage of students with grades above passing threshold)
3. THE Analytics_Dashboard SHALL calculate and display the fail rate (percentage of students with grades below passing threshold) constrained to the range 0-100%
4. THE Analytics_Dashboard SHALL display grade distribution using a bar chart via the Chart_Renderer
5. THE Analytics_Dashboard SHALL display performance trends over time using a line chart via the Chart_Renderer
6. THE Analytics_Dashboard SHALL allow filtering by class, subject, and date range using the Date_Range_Filter
7. WHEN a Guru views performance analytics, THE Analytics_Dashboard SHALL only include data for classes taught by that Guru
8. THE Analytics_Dashboard SHALL identify subjects with the lowest average grades

### Requirement 11: Attendance Analytics

**User Story:** As an Admin or Guru, I want to view attendance trends, so that I can identify attendance patterns and issues.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL calculate and display the overall attendance rate across all classes
2. THE Analytics_Dashboard SHALL display attendance trends over time using a line chart via the Chart_Renderer
3. THE Analytics_Dashboard SHALL display the distribution of attendance statuses (Hadir, Sakit, Izin, Alpha) using a pie chart via the Chart_Renderer
4. THE Analytics_Dashboard SHALL identify classes with the lowest attendance rates
5. THE Analytics_Dashboard SHALL identify students with attendance rates below a configurable threshold
6. THE Analytics_Dashboard SHALL allow filtering by class, date range, and day of week using the Date_Range_Filter
7. WHEN a Guru views attendance analytics AND the filtering fails, THEN THE Analytics_Dashboard SHALL prevent the Guru from accessing any attendance data

### Requirement 12: Assignment Completion Analytics

**User Story:** As an Admin or Guru, I want to view assignment completion rates, so that I can assess student engagement.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL calculate and display the overall assignment completion rate
2. THE Analytics_Dashboard SHALL display completion rates by class using a bar chart via the Chart_Renderer
3. THE Analytics_Dashboard SHALL display completion rates by subject using a bar chart via the Chart_Renderer
4. THE Analytics_Dashboard SHALL identify assignments with the lowest completion rates
5. THE Analytics_Dashboard SHALL calculate the late submission percentage using the formula (late_submissions / total_submissions * 100) and display it
6. THE Analytics_Dashboard SHALL display trends in completion rates over time using a line chart via the Chart_Renderer
7. WHEN a Guru views assignment analytics, THE Analytics_Dashboard SHALL only include data for assignments created by that Guru

### Requirement 13: Teacher Workload Statistics

**User Story:** As an Admin, I want to view teacher workload statistics, so that I can ensure balanced workload distribution.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL display the number of classes assigned to each Guru
2. THE Analytics_Dashboard SHALL display the number of assignments created by each Guru
3. THE Analytics_Dashboard SHALL display the number of students taught by each Guru
4. THE Analytics_Dashboard SHALL display the number of learning materials uploaded by each Guru
5. THE Analytics_Dashboard SHALL calculate and display the average workload across all Guru users
6. THE Analytics_Dashboard SHALL identify Guru users with workload significantly above the average OR below the average
7. THE Analytics_Dashboard SHALL display workload distribution using a bar chart via the Chart_Renderer

### Requirement 14: Visual Chart Rendering

**User Story:** As a user viewing analytics, I want to see visual charts and graphs, so that I can quickly understand trends and patterns.

#### Acceptance Criteria

1. THE Chart_Renderer SHALL display line charts for time-series data (trends over time)
2. THE Chart_Renderer SHALL display bar charts for comparative data (comparisons between categories)
3. THE Chart_Renderer SHALL display pie charts for proportional data (distribution of categories)
4. THE Chart_Renderer SHALL use distinct colors for different data series in charts
5. THE Chart_Renderer SHALL display axis labels and legends for all charts
6. THE Chart_Renderer SHALL display data point values when a user hovers over chart elements
7. THE Chart_Renderer SHALL render charts responsively to fit different screen sizes
8. THE Chart_Renderer SHALL display a loading indicator while chart data is being fetched

### Requirement 15: Date Range Filtering

**User Story:** As a user viewing reports or analytics, I want to filter data by date range, so that I can focus on specific time periods.

#### Acceptance Criteria

1. THE Date_Range_Filter SHALL provide input fields for start date and end date
2. WHEN a user selects a date range, THE Date_Range_Filter SHALL validate that the start date is before or equal to the end date
3. IF the start date is after the end date, THEN THE Date_Range_Filter SHALL display an error message
4. WHEN a user applies a date range filter AND the refresh fails, THEN THE Analytics_Dashboard SHALL display an error message and allow the user to retry manually
5. THE Date_Range_Filter SHALL provide preset options (Last 7 days, Last 30 days, This month, Last month, This semester)
6. THE Date_Range_Filter SHALL persist all selected date ranges in the user's session including invalid date ranges
7. THE Date_Range_Filter SHALL display the currently active date range clearly to the user

### Requirement 16: Report and Analytics Export

**User Story:** As a user viewing analytics, I want to export dashboard data, so that I can use the data in external tools or presentations.

#### Acceptance Criteria

1. WHEN a user requests a dashboard export, THE Report_Exporter SHALL generate a PDF document containing all visible charts and statistics
2. WHEN a user requests a data export, THE Report_Exporter SHALL generate an Excel spreadsheet with the raw data underlying the analytics
3. THE Report_Exporter SHALL include the selected date range and filters in the exported file
4. THE Report_Exporter SHALL include the export date and time in the exported file
5. THE Report_Exporter SHALL render charts as images in the PDF export
6. THE Report_Exporter SHALL format the Excel export with multiple sheets for different data categories
7. WHEN a user requests multiple export types simultaneously, THE Report_Exporter SHALL trigger separate file downloads for each export type as they complete

### Requirement 17: Permission-Based UI Rendering

**User Story:** As a user, I want to see only the features I have permission to access, so that the interface is not cluttered with unavailable options.

#### Acceptance Criteria

1. WHEN the LMS renders a page AND the permission system is available, THEN THE Permission_System SHALL check the user's permissions for each UI element
2. WHEN the LMS renders a page AND the permission system fails, THEN THE LMS SHALL display all UI elements
3. IF a user lacks permission for a feature, THEN THE LMS SHALL hide the corresponding UI element
4. THE LMS SHALL hide the "Edit" button if the user lacks update permission for that resource
5. THE LMS SHALL hide the "Delete" button if the user lacks delete permission for that resource
6. THE LMS SHALL hide entire menu items if the user lacks read permission for that section
7. THE LMS SHALL display a consistent interface regardless of which permissions are hidden

### Requirement 18: Role Management UI

**User Story:** As an Admin, I want a user interface to manage roles and permissions, so that I can configure access control without technical knowledge.

#### Acceptance Criteria

1. THE LMS SHALL provide a page listing all roles with their names and descriptions
2. THE LMS SHALL provide a button to create a new Custom_Role
3. WHEN an Admin clicks the create role button, THE LMS SHALL display a form with fields for role name and description
4. THE LMS SHALL provide a permissions selection interface with checkboxes grouped by resource type
5. WHEN an Admin saves a role, THE LMS SHALL validate the input and display success or error messages
6. THE LMS SHALL provide an edit button for each Custom_Role
7. THE LMS SHALL provide a delete button for each Custom_Role with a confirmation dialog
8. THE LMS SHALL display the number of users assigned to each role

### Requirement 19: Student Report UI

**User Story:** As a Guru or Admin, I want a user interface to generate and view student reports, so that I can easily access student performance data.

#### Acceptance Criteria

1. THE LMS SHALL provide a page for selecting a student to generate a report
2. THE LMS SHALL provide a search field to find students by name or NIS
3. THE LMS SHALL provide a Date_Range_Filter for selecting the report period
4. WHEN a user selects a student and date range, THE LMS SHALL display the student report
5. THE LMS SHALL display export buttons for PDF and Excel formats
6. THE LMS SHALL display a loading indicator while the report is being generated
7. WHEN the report generation fails, THE LMS SHALL display an error message with details regardless of the generation state

### Requirement 20: Analytics Dashboard UI

**User Story:** As a user with analytics access, I want a dashboard interface, so that I can view statistics and charts in an organized layout.

#### Acceptance Criteria

1. THE LMS SHALL provide an analytics dashboard page with a grid layout for statistics cards
2. THE LMS SHALL display statistics cards in the top section of the dashboard
3. THE LMS SHALL display charts in the main content area below the statistics cards
4. THE LMS SHALL provide a Date_Range_Filter in the dashboard header
5. THE LMS SHALL provide filter dropdowns for class and subject where applicable
6. THE LMS SHALL provide an export button in the dashboard header
7. WHILE dashboard data is being fetched, THE LMS SHALL display a loading indicator AND allow users to interact with filters and buttons
8. THE LMS SHALL refresh dashboard data automatically when filters are changed

### Requirement 21: API Endpoints for Roles and Permissions

**User Story:** As a frontend developer, I want RESTful API endpoints for roles and permissions, so that I can integrate the permission system with the React frontend.

#### Acceptance Criteria

1. THE LMS SHALL provide a GET /api/roles endpoint that returns all roles with their permissions
2. THE LMS SHALL provide a POST /api/roles endpoint that creates only Custom_Role types
3. THE LMS SHALL provide a PUT /api/roles/{id} endpoint that updates an existing role
4. WHEN the DELETE /api/roles/{id} endpoint is called on a non-custom role, THEN THE LMS SHALL reject the deletion request
5. THE LMS SHALL provide a GET /api/permissions endpoint that returns all available permissions
6. THE LMS SHALL provide a POST /api/users/{id}/assign-role endpoint that assigns a role to a user
7. THE LMS SHALL require authentication via Laravel Sanctum for all role and permission endpoints
8. THE LMS SHALL require Admin role for all role and permission endpoints

### Requirement 22: API Endpoints for Student Reports

**User Story:** As a frontend developer, I want RESTful API endpoints for student reports, so that I can display report data in the React frontend.

#### Acceptance Criteria

1. THE LMS SHALL provide a GET /api/reports/student/{id} endpoint that returns a student's complete report
2. THE LMS SHALL accept query parameters for start_date and end_date in the student report endpoint
3. THE LMS SHALL provide a GET /api/reports/student/{id}/export endpoint that returns a PDF or Excel file
4. THE LMS SHALL accept a format query parameter (pdf or excel) in the export endpoint
5. WHEN an unauthenticated user requests a report endpoint, THEN THE LMS SHALL return an HTTP 403 Forbidden response
6. THE LMS SHALL require Guru or Admin role for student report endpoints
7. WHEN a Guru requests a student report, THE LMS SHALL verify the student is in a class taught by that Guru, AND WHEN an Admin requests a student report, THE LMS SHALL allow access without teaching verification
8. IF a Guru requests a report for a student they do not teach, THEN THE LMS SHALL return an HTTP 403 Forbidden response

### Requirement 23: API Endpoints for Teacher Reports

**User Story:** As a frontend developer, I want RESTful API endpoints for teacher reports, so that I can display class performance data in the React frontend.

#### Acceptance Criteria

1. THE LMS SHALL provide a GET /api/reports/class/{id} endpoint that returns class performance data
2. THE LMS SHALL accept query parameters for start_date and end_date in the class report endpoint
3. THE LMS SHALL provide a GET /api/reports/teacher/assignments endpoint that returns assignment statistics
4. THE LMS SHALL provide a GET /api/reports/class/{id}/export endpoint that returns a PDF or Excel file
5. THE LMS SHALL require authentication via Laravel Sanctum for all teacher report endpoints
6. THE LMS SHALL require Guru or Admin role for teacher report endpoints
7. WHEN a Guru requests a class report, THE LMS SHALL verify the Guru teaches that class
8. IF a Guru requests a report for a class they do not teach, THEN THE LMS SHALL return an HTTP 403 Forbidden response

### Requirement 24: API Endpoints for Analytics Dashboard

**User Story:** As a frontend developer, I want RESTful API endpoints for analytics data, so that I can populate the dashboard with statistics and charts.

#### Acceptance Criteria

1. THE LMS SHALL provide a GET /api/analytics/system-stats endpoint that returns overall system statistics
2. THE LMS SHALL provide a GET /api/analytics/performance endpoint that returns student performance analytics
3. THE LMS SHALL provide a GET /api/analytics/attendance endpoint that returns attendance analytics
4. THE LMS SHALL provide a GET /api/analytics/assignments endpoint that returns assignment completion analytics
5. THE LMS SHALL provide a GET /api/analytics/teacher-workload endpoint that returns teacher workload statistics
6. THE LMS SHALL accept query parameters for start_date, end_date, class_id, and subject_id in analytics endpoints
7. THE LMS SHALL require authentication via Laravel Sanctum for all analytics endpoints
8. WHEN a Guru requests analytics data, THE LMS SHALL filter data to only include classes taught by that Guru

### Requirement 25: Database Schema for Roles and Permissions

**User Story:** As a backend developer, I want a database schema for roles and permissions, so that I can store and query access control data efficiently.

#### Acceptance Criteria

1. THE LMS SHALL create a roles table with columns: id, name, description, is_default, timestamps
2. THE LMS SHALL create a permissions table with columns: id, resource, action, description, timestamps
3. THE LMS SHALL create a role_permissions table with columns: role_id, permission_id
4. THE LMS SHALL add a role_id foreign key column to the users table
5. THE LMS SHALL create indexes on role_id in the users table and role_permissions table
6. THE LMS SHALL seed the database with default roles (Admin, Guru, Siswa) with is_default set to true
7. THE LMS SHALL seed the database with standard permissions for all resources (users, kelas, mata_pelajaran, jadwal, materi, tugas, nilai, absensi)
8. THE LMS SHALL establish foreign key constraints with appropriate cascade rules

### Requirement 26: Performance Optimization for Reports

**User Story:** As a user generating reports, I want reports to load quickly, so that I can access data without long wait times.

#### Acceptance Criteria

1. WHEN a user requests a report, THE Report_Generator SHALL complete the query within 3 seconds for datasets up to 1000 records
2. THE Report_Generator SHALL use database indexes on frequently queried columns (user_id, class_id, date)
3. THE Report_Generator SHALL use eager loading to minimize database queries
4. THE Report_Generator SHALL cache report data for 5 minutes to serve repeated requests quickly
5. IF a report query exceeds 5 seconds, THEN THE Report_Generator SHALL log a performance warning
6. THE Report_Generator SHALL paginate large result sets to avoid memory issues
7. THE Report_Generator SHALL use database aggregation functions for calculating statistics rather than application-level computation

### Requirement 27: Performance Optimization for Analytics

**User Story:** As a user viewing the analytics dashboard, I want the dashboard to load quickly, so that I can access insights without delay.

#### Acceptance Criteria

1. WHEN a user loads the analytics dashboard, THE Analytics_Dashboard SHALL complete initial data loading within 2 seconds
2. THE Analytics_Dashboard SHALL use database indexes on date columns for time-series queries
3. THE Analytics_Dashboard SHALL cache aggregated statistics for 10 minutes
4. THE Analytics_Dashboard SHALL load chart data asynchronously to avoid blocking the initial page render
5. THE Analytics_Dashboard SHALL use database views or materialized views for complex aggregations
6. THE Analytics_Dashboard SHALL limit chart data points to a maximum of 100 points per chart AND display charts with zero data points as empty visualizations
7. IF the dashboard data loading exceeds 3 seconds, THEN THE Analytics_Dashboard SHALL display a progress indicator

### Requirement 28: Error Handling for Reports and Analytics

**User Story:** As a user, I want clear error messages when reports or analytics fail, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. IF a report generation fails due to missing data, THEN THE Report_Generator SHALL return an error message indicating which data is missing
2. IF a report generation fails due to invalid date range, THEN THE Report_Generator SHALL return an error message with the valid date range format
3. IF an export fails due to file generation error, THEN THE Report_Exporter SHALL return an error message with details
4. WHEN an analytics query fails, THE Analytics_Dashboard SHALL display an error message to users AND log the error details, AND IF either error display or logging fails, THEN THE system SHALL treat it as a system failure
5. THE LMS SHALL return appropriate HTTP status codes (400 for client errors, 500 for server errors)
6. THE LMS SHALL log all errors with sufficient context for debugging (user_id, endpoint, parameters)
7. THE LMS SHALL display user-friendly error messages in the frontend while logging technical details in the backend

### Requirement 29: Security for Reports and Analytics

**User Story:** As a system administrator, I want reports and analytics to be secure, so that users cannot access data they are not authorized to view.

#### Acceptance Criteria

1. THE LMS SHALL verify user authentication before processing any report or analytics request
2. THE LMS SHALL verify user authorization based on role and permissions before returning data
3. WHEN a Guru requests data, THE LMS SHALL filter results to only include data for classes taught by that Guru
4. WHEN a Siswa requests data, THE LMS SHALL filter results to only include the Siswa's own data
5. THE LMS SHALL sanitize all user inputs to prevent SQL injection attacks
6. THE LMS SHALL validate all query parameters to prevent unauthorized data access
7. THE LMS SHALL log all access to sensitive reports and analytics for audit purposes
8. THE LMS SHALL enforce rate limiting on report and analytics endpoints with a maximum of 60 requests per minute per user

### Requirement 30: Integration with Existing Authentication

**User Story:** As a developer, I want the reporting and permissions feature to integrate seamlessly with Laravel Sanctum, so that authentication is consistent across the application.

#### Acceptance Criteria

1. THE Permission_System SHALL use Laravel Sanctum tokens for API authentication
2. THE Permission_System SHALL retrieve the authenticated user from the Sanctum token
3. THE Permission_System SHALL work with the existing user session management
4. THE LMS SHALL include role and permission data in the GET /api/me endpoint response
5. THE LMS SHALL verify Sanctum tokens before processing any permission checks
6. THE LMS SHALL return HTTP 401 Unauthorized if a token is invalid or expired
7. THE LMS SHALL support the existing CORS configuration for the React frontend
8. THE LMS SHALL maintain compatibility with the existing AuthContext in the React frontend
