import { Routes, Route } from "react-router-dom";

// Layout Wrapper
import DashboardLayout from "../layouts/DashboardLayout"; // Fixed: Added missing import
import CustomerLayout from "../layouts/CustomerLayout";
import BookCar from "../pages/customer/BookCar";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// Dashboard Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

// Auth & Utilities
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotFound from "../pages/NotFound";

// Admin Management
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCars from "../pages/admin/ManageCars";
import ManageBookings from "../pages/admin/ManageBookings";


// Manager Management
import SalesHistory from "../pages/manager/SalesHistory";
import ManageEmployees from "../pages/manager/ManageEmployees";
import ManageSuppliers from "../pages/manager/ManageSuppliers";
import Reports from "../pages/manager/Reports";
import Settings from "../pages/manager/Settings";
import PurchaseStock from "../pages/manager/PurchaseStock";
import StockManagement from "../pages/manager/StockManagement";

// Employee Management
import Sales from "../pages/employee/Sales";
// customer
import MyBookings from "../pages/customer/MyBookings";
import CustomerSettings from "../pages/customer/CustomerSettings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - No Sidebar */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes - use CustomerLayout (includes Sidebar) */}
      <Route element={<CustomerLayout />}> 
        <Route path="/customer/dashboard" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customer/book-car" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <BookCar />
          </ProtectedRoute>
        } />
        <Route path="/customer/my-bookings" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/customer/settings" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerSettings />
          </ProtectedRoute>
        } />
      </Route>

      {/* Protected Dashboard Routes - Wrapped in DashboardLayout */}
      <Route element={<DashboardLayout />}>

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/cars" element={<ManageCars />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />

        {/* Manager Section */}
        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager/stock" element={<ManageBookings />} />
        <Route path="/manager/SalesHistory" element={<SalesHistory />} />
        <Route path="/manager/employees" element={<ManageEmployees />} />
        <Route path="/manager/suppliers" element={<ManageSuppliers />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/settings" element={<Settings />} />
        <Route path="/manager/purchaseStock" element={<PurchaseStock />} />
        <Route path="/manager/StockManagement" element={<StockManagement />} />

        {/* Employee Section */}
        <Route path="/employee/dashboard" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee/sales" element={<Sales />} />
      </Route>

      {/* 404 Always Last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}