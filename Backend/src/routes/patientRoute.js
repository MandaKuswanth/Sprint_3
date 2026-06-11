const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    togglePatientStatus
} = require("../controllers/patientController");


router.post(
    "/",
    authMiddleware,
    allowRoles("ADMIN", "RECEPTIONIST"),
    createPatient
);


router.get(
    "/",
    authMiddleware,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
    getPatients
);


router.get(
    "/:uhid",
    authMiddleware,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
    getPatientById
);


router.put(
    "/:uhid",
    authMiddleware,
    allowRoles("ADMIN", "RECEPTIONIST"),
    updatePatient
);


router.delete(
    "/:uhid",
    authMiddleware,
    allowRoles("ADMIN", "RECEPTIONIST"),
    deletePatient
);


router.patch(
    "/:uhid/status",
    authMiddleware,
    allowRoles("ADMIN", "RECEPTIONIST"),
    togglePatientStatus
);



//react-native
router.put(
    "/patient-profile/:uhid",
    authMiddleware,
    updatePatient
);
router.get(
    "/patient-profile/:uhid",
    authMiddleware,
    getPatientById
);


module.exports = router;