import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardApprenant from "./pages/apprenant/DashboardApprenant";
import DashboardFormateur from "./pages/formateur/DashboardFormateur";
import DashboardAdmin from "./pages/admin/DashboardAdmin";

import PresenceScan from "./pages/PresenceScan";
import FormateurQR from "./pages/formateur/FormateurQR";

import PrivateRoute from "./components/PrivateRoute";
import { DashboardProvider } from "./context/DashboardContext";

const theme = createTheme({
  palette: { primary: { main: "#1a237e" }, secondary: { main: "#fbc02d" } },
});

function App() {
  return (
    <Router>
      <DashboardProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route element={<PrivateRoute allowedRoles={["apprenant"]} />}>
            <Route path="/apprenant/dashboard" element={<DashboardApprenant />} />
            <Route path="/presence/scan" element={<PresenceScan />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["formateur"]} />}>
            <Route path="/formateur/dashboard" element={<DashboardFormateur />} />
            <Route path="/formateur/qrcode/:idseance" element={<FormateurQR />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["administrateur"]} />}>
            <Route
              path="/admin/dashboard"
              element={
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <DashboardAdmin />
                </ThemeProvider>
              }
            />
          </Route>

          <Route path="*" element={<Login />} />
        </Routes>
      </DashboardProvider>
    </Router>
  );
}

export default App;






/*
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardApprenant from "./pages/apprenant/DashboardApprenant";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardFormateur from "./pages/formateur/DashboardFormateur";

import PresenceScan from "./pages/PresenceScan"; // page indépendante pour QR
import FormateurQR from "./pages/formateur/FormateurQR"; // QR pour formateur

import PrivateRoute from "./components/PrivateRoute";



const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" }, // bleu foncé
    secondary: { main: "#fbc02d" }, // jaune
  },
});

function App() {
  return (
    
    <Router>

      <Routes>
        {/* Pages publiques }
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards }
        <Route
          path="/apprenant/dashboard"
          element={
            <PrivateRoute allowedRoles={["apprenant"]}>
              <DashboardApprenant />
            </PrivateRoute>
          }
        />

        <Route
          path="/formateur/dashboard"
          element={
            <PrivateRoute allowedRoles={["formateur"]}>
              <DashboardFormateur />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["administrateur"]}>
              <ThemeProvider theme={theme}>
              <CssBaseline />
              <DashboardAdmin />
              </ThemeProvider>
            </PrivateRoute>
          }
        />

        {/* QR code / présence }
        <Route
          path="/presence/scan"
          element={
            <PrivateRoute allowedRoles={["apprenant"]}>
              <PresenceScan />
            </PrivateRoute>
          }
        />

        <Route
          path="/formateur/qrcode/:idseance"
          element={
            <PrivateRoute allowedRoles={["formateur"]}>
              <FormateurQR />
            </PrivateRoute>
          }
        />


        {/* Redirection par défaut }
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

*/
