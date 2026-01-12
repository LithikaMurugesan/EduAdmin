import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Universities from "./pages/Universities";
import Colleges from "./pages/CollegePage"; // ✅ ADD THIS
import Departments from "./pages/Departments";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import ActivityLogs from "./pages/ActivityLogs";
import RecycleBin from "./pages/RecycleBin";
import ManageAdmins from "./pages/ManageAdmins";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/universities"
              element={
                <ProtectedRoute>
                  <Universities />
                </ProtectedRoute>
              }
            />

            <Route
              path="/colleges"
              element={
                <ProtectedRoute>
                  <Colleges />
                </ProtectedRoute>
              }
            />

            <Route
              path="/departments"
              element={
                <ProtectedRoute>
                  <Departments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />

            <Route
              path="/faculty"
              element={
                <ProtectedRoute>
                  <Faculty />
                </ProtectedRoute>
              }
            />

            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <ActivityLogs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recycle-bin"
              element={
                <ProtectedRoute>
                  <RecycleBin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-admins"
              element={
                <ProtectedRoute requireSuperadmin>
                  <ManageAdmins />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
