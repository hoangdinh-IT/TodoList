# TodoList

Một ứng dụng quản lý công việc đơn giản, giúp bạn ghi chú, đánh dấu hoàn thành và tổ chức các nhiệm vụ hàng ngày.

## ✨ Tính năng chính

### **User Management**

- **Xác thực người dùng**: Đăng ký, đăng nhập, quên mật khẩu, đổi mật khẩu

### **Todo Features**

- **Quản lý danh mục**: Thêm, sửa, xoá, lưu trữ và quản lý danh sách các danh mục.
- **Quản lý công việc**: Thêm, sửa, xoá, lưu trữ và quản lý danh sách các công việc.
- Đánh dấu công việc đã hoàn thành.
- **Thống kê**: Thống kê tổng công việc, công việc đã hoàn thành và chưa hoàn thành bằng biểu đồ tròn.

### **UI/UX Features**

- **Responsive Design**: Tối ưu cho mobile, tablet, desktop
- **Modern UI**: Sử dụng TailwindCSS với thiết kế hiện đại
- **Loading States**: Spinner loading
- **Snackbar Notifications**: Thông báo real-time cho các hành động

## 🚀 Công nghệ sử dụng

### **Frontend**

- **React** 19.1.1 – UI Library
- **Vite** 7.1.7 – Build tool & dev server
- **TailwindCSS** 3.4.18 – CSS Framework
- **React Router DOM** 7.9.4 – Client-side routing
- **TanStack React Query** 5.90.5 – Data fetching & caching
- **Axios** 1.12.2 – HTTP client
- **React Toastify** 11.0.5 – Notifications
- **Framer Motion** 12.23.24 – Animation library
- **React Bootstrap** 2.10.10 – UI components
- **Material UI (MUI)** 7.3.4 – UI component library
- **React Icons** 5.5.0 – Icon library
- **Recharts** 3.3.0 – Chart library
- **Hello Pangea DnD** 18.0.1 – Drag & drop library

### **Backend**

- **Node.js** – Runtime environment
- **Express** 5.1.0 – Web framework
- **Mongoose** 8.19.3 – MongoDB ODM
- **JWT (jsonwebtoken 9.0.2)** – Authentication
bcrypt / bcryptjs – Password hashing
- **dotenv** 17.2.3 – Environment variables
- **CORS** 2.8.5 – Cross-origin resource sharing
- **Nodemailer** 7.0.10 – Email sending
- **@sendgrid/mail** 8.1.6 – Email service (SendGrid API)
- **Express-rate-limit** 8.2.1 – API rate limiting
- **Axios** 1.13.2 – HTTP client
- **Morgan** 1.10.1 – HTTP request logger

### **DevOps & Tools**

- **Nodemon** 3.1.10 – Development auto-restart tool
- **Git** - Version control

## ⚡ Cài đặt và chạy dự án

### **Yêu cầu hệ thống**
- Node.js >= 18.0.0
- MongoDB >= 6.0
- Git

### **1. Clone repository**

```bash
git clone https://github.com/hoangdinh-34/TodoList.git
cd TodoList
```

### **2. Cài đặt dependencies**

#### **Frontend**

```bash
cd todolist-frontend
npm install
```

#### **Backend**

```bash
cd todolist-backend
npm install
```

### **3. Cấu hình Environment Variables**

#### **Client (.env)**

```env
VITE_BACKEND_URL=http://localhost:5005
```

#### **Backend (.env)**
```env
MONGO_URI=mongodb://127.0.0.1:27017/todolist
JWT_SECRET=supersecret
PORT=5005
SENDGRID_API_KEY=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
SENDER_EMAIL=hoangdinh20040104@gmail.com
SENDER_NAME=TodoList
```

### **4. Chạy ứng dụng**

**Terminal 1 - Frontend**

```bash
cd todolist-frontend
npm run dev
# Server chạy tại: http://localhost:5173
```

**Terminal 2 - Backend**

```bash
cd todolist-backend
npm run dev
# Server chạy tại: http://localhost:5005
```

### **5. Truy cập ứng dụng**

#### Local

- **Frontend: http://localhost:5173**
- **Backend: http://localhost:5005**

#### Website
- https://todolist-rkait.vercel.app/

## API Documentation

### **Authentication Endpoints**

```http
POST /api/auth/register          # Đăng ký
POST /api/auth/login             # Đăng nhập
POST /api/auth/change-password   # Thay đổi mật khẩu
POST /api/auth/send-otp          # Gửi mã OTP
POST /api/auth/verify-otp        # Xác nhận mã OTP
POST /api/auth/reset-password    # Đặt lại mật khẩu
```

### **Category Endpoints**

```http
POST /api/categories                 # Thêm mới danh mục
GET /api/categories                  # Lấy danh sách danh mục
GET /api/categories/:categoryId      # Lấy chi tiết danh mục
PUT /api/categories/:categoryId      # Cập nhật danh mục
DELETE /api/categories/:categoryId   # Xoá danh mục
PUT /api/categories/update-order     # Cập nhật thứ tự danh mục
```

### **Task Endpoints**

```http
POST /api/tasks             # Thêm mới công việc
GET /api/tasks              # Lấy danh sách công việc
GET /api/tasks/:taskId      # Lấy chi tiết công việc
PUT /api/tasks/:taskId      # Cập nhật công việc
DELETE /api/tasks/:taskId   # Xoá công việc
```

## 🤝 Đóng góp

- Fork repository, tạo nhánh mới và gửi pull request khi bạn muốn đóng góp.
- Báo lỗi hoặc gợi ý tính năng [tại đây](https://github.com/hoangdinh-34/TodoList/issues).

---

## 👨‍💻 Tác giả

**hoangdinh-34**

- GitHub: [@hoangdinh-34](https://github.com/hoangdinh-34)
- Email: hoangdinh.040104@gmail.com

---
