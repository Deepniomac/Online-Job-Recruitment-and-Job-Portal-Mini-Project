# Product Requirements Document (PRD)

## Online Job Recruitment and Job Portal

**Document type:** Mini Project PRD\
**Project scope:** Lightweight, non-AI recruitment portal MVP\
**Target build time:** Approximately 1 hour for a vibe-coded prototype\
**Status:** Initial scope finalized

------------------------------------------------------------------------

## 1. Project Overview

The Online Job Recruitment and Job Portal is a web application that
connects job seekers with recruiters through a centralized platform.
Candidates can discover job opportunities, submit applications, and
track their application status. Recruiters can publish job openings,
manage listings, review applications, and update candidate statuses.

The initial version is intentionally small and focused. It should
demonstrate the main recruitment workflow without AI features, complex
frameworks, or unnecessary infrastructure.

## 2. Problem Statement

Job seekers often face difficulties finding relevant job opportunities,
accessing centralized job information, and tracking their application
progress. Similarly, recruiters find it challenging to publish job
openings and manage applications efficiently.

The proposed Online Job Recruitment and Job Portal provides a
centralized platform that connects job seekers with recruiters.
Candidates can explore available jobs, search and filter opportunities,
submit applications, and track their application status. Recruiters can
publish job openings, manage job listings, view applications, and update
candidate statuses.

The system aims to simplify the recruitment process through a
user-friendly interface, role-based access, and centralized job and
application management.

## 3. Project Goals

-   Provide one place for candidates to discover job opportunities.
-   Allow candidates to apply for jobs through a simple application
    flow.
-   Allow recruiters to create and manage job postings.
-   Give recruiters a clear view of applications received for their
    jobs.
-   Allow candidates to track the status of submitted applications.
-   Deliver a clean, responsive interface that is straightforward to
    demonstrate.

## 4. Scope

### 4.1 In Scope

-   Landing page with a clear introduction and navigation.
-   Candidate and recruiter entry points.
-   Basic registration and login interface.
-   Candidate job browsing, searching, and filtering.
-   Job detail view.
-   Job application submission.
-   Candidate dashboard with application history and status.
-   Recruiter dashboard with job management.
-   Recruiter view of applications for their job postings.
-   Recruiter ability to update application status.
-   Responsive layout for desktop and mobile.
-   Sample/demo data for quick testing.

### 4.2 Out of Scope

The first version will not include:

-   AI or machine-learning functionality.
-   AI resume screening or job recommendations.
-   Chat or real-time messaging.
-   Payment processing or subscriptions.
-   Video interviews or interview scheduling.
-   Complex analytics.
-   External job-board integrations.
-   Production-grade identity verification.
-   Advanced file storage or resume parsing.

## 5. User Roles

### 5.1 Candidate / Job Seeker

A candidate can:

-   Register and log in.
-   Browse available job postings.
-   Search jobs by title, company, or keyword.
-   Filter jobs by location, job type, or category where available.
-   Open a job to view its full description and requirements.
-   Submit an application.
-   View submitted applications.
-   Track application status.

### 5.2 Recruiter

A recruiter can:

-   Register and log in.
-   Access a recruiter dashboard.
-   Create a job posting.
-   View jobs they have posted.
-   Edit or remove their own job postings.
-   View applications received for their jobs.
-   Update an application status to Applied, Shortlisted, or Rejected.

## 6. Functional Requirements

  -----------------------------------------------------------------------
  ID                      Requirement             Description
  ----------------------- ----------------------- -----------------------
  FR-01                   User entry              Users can choose the
                                                  candidate or recruiter
                                                  journey.

  FR-02                   Registration            A user can create an
                                                  account with basic
                                                  details and a role.

  FR-03                   Login                   A registered user can
                                                  enter the application.

  FR-04                   Job listing             Candidates can view
                                                  available job postings.

  FR-05                   Job search              Candidates can search
                                                  jobs using keywords.

  FR-06                   Job filtering           Candidates can filter
                                                  by available job
                                                  attributes such as
                                                  location and job type.

  FR-07                   Job details             A job detail view
                                                  displays the
                                                  description,
                                                  requirements, company,
                                                  location, and job type.

  FR-08                   Apply                   A candidate can submit
                                                  an application for a
                                                  job.

  FR-09                   Application history     A candidate can view
                                                  jobs they have applied
                                                  for.

  FR-10                   Status tracking         A candidate can see the
                                                  current status of each
                                                  application.

  FR-11                   Create job              A recruiter can publish
                                                  a job with required
                                                  details.

  FR-12                   Manage jobs             A recruiter can view,
                                                  edit, and delete their
                                                  own postings.

  FR-13                   Review applications     A recruiter can view
                                                  applications for their
                                                  posted jobs.

  FR-14                   Update status           A recruiter can mark an
                                                  application as
                                                  Shortlisted or
                                                  Rejected.
  -----------------------------------------------------------------------

## 7. Application Statuses

The initial application lifecycle is:

1.  **Applied** -- The candidate has submitted an application.
2.  **Shortlisted** -- The recruiter has selected the candidate for
    further consideration.
3.  **Rejected** -- The recruiter has declined the application.

The candidate dashboard must display the latest status clearly.

## 8. Main Pages and Interface Requirements

### 8.1 Landing Page

-   Project name and navigation.
-   Short explanation of the platform.
-   Prominent "Find Jobs" and "Post a Job" actions.
-   Featured or recently posted jobs using sample data.
-   Login and registration links.

### 8.2 Job Listings Page

-   List or grid of job cards.
-   Search input.
-   Filters for location and job type.
-   Job title, company, location, job type, and a short description.
-   Link or action to view job details.

### 8.3 Job Details Page / View

-   Job title and company.
-   Location and job type.
-   Full description.
-   Required skills or qualifications.
-   Apply action for candidates.

### 8.4 Candidate Dashboard

-   Welcome section and basic candidate details.
-   Applications submitted.
-   Job title and company for each application.
-   Current application status.
-   Link to browse more jobs.

### 8.5 Recruiter Dashboard

-   Summary of jobs posted and applications received.
-   List of the recruiter's job postings.
-   Action to create a job.
-   Actions to edit or delete a posting.
-   Link to view applications for each posting.

### 8.6 Post Job Form

The form should collect:

-   Job title.
-   Company name.
-   Location.
-   Job type (Full-time, Part-time, Internship, or Contract).
-   Job description.
-   Required skills or qualifications.
-   Optional application deadline.

### 8.7 Applications Management View

-   Candidate name and contact details.
-   Job applied for.
-   Application date.
-   Current status.
-   Actions to shortlist or reject the candidate.

### 8.8 Login and Registration

-   Basic form validation.
-   Registration role selection: Candidate or Recruiter.
-   Clear validation and error messages.
-   A simple route to the appropriate dashboard after login.

## 9. Recommended Technology Stack

The project should use a minimal web stack suitable for rapid vibe
coding.

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Structure               HTML5                   Page structure and
                                                  semantic content

  Styling                 CSS3 + Tailwind CSS     Responsive styling and
                                                  layout

  Client-side logic       Vanilla JavaScript      Search, filters, forms,
                                                  and interactions

  Icons                   Lucide Icons            Consistent interface
                                                  icons

  Initial data storage    Browser localStorage    Demo users, jobs, and
                                                  applications

  Optional hosted backend Supabase                Persistent database and
                                                  authentication if
                                                  required
  -----------------------------------------------------------------------

### Stack Decisions

-   Do not use React, Node.js, Express, or a separate backend for the
    initial prototype.
-   Use plain HTML, CSS, and JavaScript to keep the project easy to
    generate, understand, and modify.
-   Use Tailwind CSS for rapid styling; avoid adding a second UI
    framework.
-   Use localStorage only for a local demonstration with sample data.
-   Add Supabase only if persistent, shared multi-user data is required
    and time permits.

## 10. Data Model for the Prototype

The following logical records should be represented, whether stored in
localStorage or later moved to Supabase.

### User

-   `id`
-   `name`
-   `email`
-   `password` (demo-only if using localStorage; never store plaintext
    passwords in a real application)
-   `role` (`candidate` or `recruiter`)

### Job

-   `id`
-   `recruiterId`
-   `title`
-   `company`
-   `location`
-   `jobType`
-   `description`
-   `requirements`
-   `createdAt`
-   `deadline` (optional)
-   `isActive`

### Application

-   `id`
-   `jobId`
-   `candidateId`
-   `appliedAt`
-   `status` (`Applied`, `Shortlisted`, or `Rejected`)

A candidate should not be able to submit multiple applications for the
same job in the prototype.

## 11. Core User Workflows

### Candidate Workflow

1.  Open the portal.
2.  Register or log in as a candidate.
3.  Browse, search, or filter jobs.
4.  Open a job's details.
5.  Submit an application.
6.  Open the candidate dashboard.
7.  Track the application's current status.

### Recruiter Workflow

1.  Open the portal.
2.  Register or log in as a recruiter.
3.  Open the recruiter dashboard.
4.  Create and publish a job.
5.  View jobs posted by the recruiter.
6.  Open applications received for a job.
7.  Update candidate application statuses.

## 12. UI and Design Direction

-   Use a clean, modern recruitment-platform appearance.
-   Prefer a light background, clear typography, and one consistent
    primary accent color.
-   Use readable job cards with clear titles, company names, locations,
    and job types.
-   Use consistent spacing, buttons, form fields, and status labels.
-   Make navigation and primary actions obvious.
-   Ensure pages adapt to mobile and desktop screen sizes.
-   Use Lucide icons sparingly and consistently.
-   Avoid excessive animations, decorative elements, and crowded
    dashboards.

## 13. Validation and Basic Rules

-   Required form fields must not be empty.
-   Email fields should have basic format validation.
-   A candidate cannot apply to the same job more than once.
-   Only recruiters should see job-posting and application-management
    controls.
-   Recruiters should manage only their own job postings.
-   Only the recruiter who owns a job should update applications for
    that job.
-   Inactive or deleted jobs should not accept new applications.
-   Display clear success, empty, and error states.

**Prototype security note:** Client-side role checks and localStorage
are not secure access control. They are acceptable only for a classroom
demonstration. A real deployment requires server-side authorization,
secure authentication, and protected data storage.

## 14. One-Hour MVP Build Priority

The one-hour target is an aggressive prototype target, not a guarantee
of a fully tested production application.

  -----------------------------------------------------------------------
  Time                    Priority                Expected result
  ----------------------- ----------------------- -----------------------
  0--10 minutes           Generate project shell  Landing page and basic
                          and shared navigation   layout

  10--20 minutes          Create sample jobs and  Browse and search jobs
                          job listing UI          

  20--30 minutes          Add candidate           Candidate can apply
                          application flow        

  30--40 minutes          Add recruiter job       Recruiter can create a
                          posting flow            job

  40--50 minutes          Add dashboards and      Candidate and recruiter
                          status updates          workflows

  50--60 minutes          Test key flows and fix  Demonstrable MVP
                          visible issues          
  -----------------------------------------------------------------------

If time is limited, prioritize a working job listing, job posting,
application submission, and status update over decorative features.

## 15. MVP Acceptance Criteria

The prototype is considered complete when:

-   The landing page loads and navigation works.
-   Sample jobs are visible on the job listing page.
-   Search and available filters work.
-   A candidate can submit an application.
-   The candidate can see the submitted application and its status.
-   A recruiter can create a job posting.
-   A recruiter can see applications for their jobs.
-   A recruiter can update an application's status.
-   The interface is usable on desktop and mobile.
-   The main workflows can be demonstrated without broken buttons or
    dead-end pages.

## 16. Future Enhancements (Not Part of the Initial Build)

These may be considered after the mini project MVP is working:

-   Resume upload and download.
-   Email notifications.
-   Recruiter company profiles.
-   Saved jobs and bookmarks.
-   Interview scheduling.
-   Admin moderation and job verification.
-   Supabase-backed authentication and persistent shared data.
-   AI-based features may be evaluated in a later version, but are
    explicitly excluded from this project scope.

------------------------------------------------------------------------

## Final Project Direction

Build a simple, responsive, non-AI Online Job Recruitment and Job Portal
using **HTML5, CSS3, Tailwind CSS, and Vanilla JavaScript**. Start with
**localStorage** for a quick demonstration. Keep **Supabase optional**
for a later step if persistent multi-user functionality is needed.

The first deliverable is a working end-to-end demonstration of the
candidate and recruiter workflows---not a production-scale recruitment
platform.
