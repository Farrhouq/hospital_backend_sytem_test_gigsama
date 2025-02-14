# 📜 Project Documentation & Justification

## 1️⃣ Authentication & Security

### 🔒 **Authentication Strategy**

- **JWT (JSON Web Tokens)**: Used for user authentication and session management.
- **Implementation**:
  - Users authenticate with email & password.
  - A JWT is generated and sent to the client upon successful login.
  - Protected routes validate JWT tokens before processing requests.

### 🔐 **Encryption & Security Measures**

- **Password Hashing**: User passwords are hashed using **bcrypt** before storage.
- **Environment Variables**: Sensitive data (JWT secret, database credentials) are stored in `.env` and not committed to version control.
- **HTTPS**: Enforced in production to prevent data interception.

## 2️⃣ Scheduling Strategy

### 📆 **Reminder Scheduling & Check-Ins**

- **Cron Jobs** handle reminder scheduling efficiently.
- The **LLM outputs a cron expression** for flexible scheduling.
- **Tracking Missed Check-Ins**:
  - If a patient misses a check-in, the system automatically adds an extra day.
  - If reminders are indefinite, they continue until manually stopped.

## 3️⃣ Data Storage & Models

### 🗄️ **Database Choice**

- **MongoDB** was chosen for its flexibility in handling unstructured patient data.
- **Collections**:
  - `Users` → Stores doctor & patient information.
  - `Notes` → Stores doctor-submitted notes.
  - `CheckList` → Tracks immediate actionable steps.
  - `Reminders` → Stores scheduled tasks & check-ins.
  - `Schedules` → Stores cron jobs & check-in tracking.

### 📂 **Data Persistence & Integrity**

- **Mongoose** enforces schema validation.
- **Indexes** optimize search queries for large datasets.

## 4️⃣ Logging & Monitoring

### 📜 **Logging Implementation**

- **Winston** is used for logging errors & info-level messages.
- **Morgan** logs HTTP requests for monitoring traffic.
- **Stored Logs**:
  - Console logs for debugging.
  - File-based logs (`logs/app.log`) for long-term tracking.

## 5️⃣ System Behavior & Edge Cases

### 🚀 **Ensuring System Resilience**

- If a patient fails to check in, reminders continue until completed.
- A doctor submitting new notes **cancels all previous reminders** for a patient.
- Indefinite reminders run until manually stopped by a doctor.

## 6️⃣ Justification for Technology Stack

| Component      | Choice                   | Reasoning                                                        |
| -------------- | ------------------------ | ---------------------------------------------------------------- |
| Backend        | **Node.js (Express.js)** | Fast, scalable, and well-supported for REST APIs.                |
| Database       | **MongoDB**              | Flexible document structure, good for unstructured medical data. |
| Authentication | **JWT**                  | Stateless authentication, widely supported.                      |
| Scheduling     | **Cron Jobs**            | Precise, reliable task scheduling.                               |
| Logging        | **Winston & Morgan**     | Comprehensive logging for debugging & monitoring.                |

---

**Final Thought** 💡
This system ensures **secure authentication, automated scheduling, robust data handling, and detailed monitoring**. The modular architecture makes it scalable and adaptable for future improvements.

🚀 _Built for reliability, efficiency, and real-world usability!_
