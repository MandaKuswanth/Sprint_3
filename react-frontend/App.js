// App.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import DashboardScreen from "./src/screens/patient/DashboardScreen";
import ProfileScreen from "./src/screens/patient/ProfileScreen";
import EditProfileScreen from "./src/screens/patient/EditProfileScreen";
import BookAppointmentScreen from "./src/screens/patient/BookAppointmentScreen";
import MyAppointmentsScreen from "./src/screens/patient/MyAppointmentsScreen";
import EditAppointmentScreen from "./src/screens/patient/EditAppointmentScreen";
import {saveToken,removeToken, getToken }from "./src/storage/authStorage";

import { getDoctors } from "./src/services/appointmentService";

// Screens that show the bottom tab bar
const TAB_SCREENS = [
  "home",
  "profile",
  "myAppointments",
  "bookAppointment"
];

export default function App() {
  const [screen, setScreen] = useState("login");

  const [patient, setPatient] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const isLoggedIn = !!token;

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();

      if (storedToken) {
        setToken(storedToken);
        setScreen("home");
      }
    };

    loadToken();
  }, []);

  // ── Auth ──────────────────────────────────────────
  const goToHome = async (loginData) => {
    await saveToken(loginData.token);

    setPatient(loginData.patient);
    setToken(loginData.token);
    setScreen("home");
  };

  const logout = async () => {
    await removeToken();

    setPatient(null);
    setToken(null);
    setScreen("login");
  };

  // ── Navigation helpers ────────────────────────────
  const handlePatientUpdate = (updatedPatient) => {
    setPatient(updatedPatient);
  };

  const goToEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setScreen("editAppointment");
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token) return;

      try {
        const response = await getDoctors(token);

        console.log("API doctors response:", response);

        setDoctors(response.data);
        console.log("Doctors stored:", response.data);
      } catch (err) {
        console.log(
          "Doctor fetch error:",
          err.response?.data || err.message
        );
      }
    };

    fetchDoctors();
  }, [token]);

  // ── Render current screen ─────────────────────────
  const renderScreen = () => {
    switch (screen) {

      case "login":
        return (
          <LoginScreen
            goToRegister={() => setScreen("register")}
            goToHome={goToHome}
          />
        );

      case "register":
        return (
          <RegisterScreen
            goToLogin={() => setScreen("login")}
          />
        );

      case "home":
        return (
          <DashboardScreen
            patient={patient}
            token={token}
            doctors={doctors}
            logout={logout}
            goToProfile={() => setScreen("profile")}
            goToBookAppointment={(doctor = null) => {
              setSelectedDoctor(doctor);
              setScreen("bookAppointment");
            }}
            goToMyAppointments={() => setScreen("myAppointments")}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            patient={patient}
            goBack={() => setScreen("home")}
            goToEditProfile={() => setScreen("editProfile")}
            logout={logout}
          />
        );

      case "editProfile":
        return (
          <EditProfileScreen
            patient={patient}
            token={token}
            goBack={() => setScreen("profile")}
            onUpdate={handlePatientUpdate}
          />
        );

      case "bookAppointment":
        return (
          <BookAppointmentScreen
            token={token}
            selectedDoctor={selectedDoctor}
            goBack={() => {
              setSelectedDoctor(null);
              setScreen("myAppointments");
            }}
            goToMyAppointments={() => {
              setSelectedDoctor(null);
              setScreen("myAppointments");
            }}
          />
        );

      case "myAppointments":
        return (
          <MyAppointmentsScreen
            token={token}
            goBack={() => setScreen("home")}
            goToBookAppointment={() => {
              setSelectedDoctor(null);
              setScreen("bookAppointment");
            }}
            goToEditAppointment={goToEditAppointment}
          />
        );

      case "editAppointment":
        return (
          <EditAppointmentScreen
            appointment={selectedAppointment}
            token={token}
            goBack={() => setScreen("myAppointments")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>

        {/* ── Main content ── */}
        <View style={styles.content}>
          {renderScreen()}
        </View>

        {/* ── Bottom tab bar (only when logged in and on a tab screen) ── */}
        {isLoggedIn && TAB_SCREENS.includes(screen) && (
          <SafeAreaView
            edges={["bottom"]}
            style={styles.tabBarWrapper}
          >
            <View style={styles.tabBar}>

              <TabItem
                label="Home"
                icon="🏠"
                active={screen === "home"}
                onPress={() => setScreen("home")}
              />

              <TabItem
                label="Profile"
                icon="👤"
                active={screen === "profile"}
                onPress={() => setScreen("profile")}
              />

              <TabItem
                label="Appointments"
                icon="📅"
                active={screen === "myAppointments"}
                onPress={() => setScreen("myAppointments")}
              />

            </View>
          </SafeAreaView>
        )}

      </View>
    </SafeAreaProvider>
  );
}

// ── Tab item component ──────────────────────────────
function TabItem({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EDEAE4",
  },
  content: {
    flex: 1,
  },

  // tab bar
  tabBarWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  tabBar: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  tabLabelActive: {
    color: "#1B3F7A",
  },
});