// import React, { useState } from "react";
// import {
//   Box,

//   Card,
//   CardContent,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import CustomTypograpy from "../generic/Typography";
// import CustomButton from "../generic/Button";
// import CustomInput from '../generic/Input';
// import { useNavigate } from "react-router-dom";

// import { useDispatch, useSelector } from 'react-redux';
// import { addStaff } from '../redux/slices/staffSlice';

// const AddStaff = () => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.staff);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     yearsOfExperience: "",
//     skills: "",
//     dateOfJoining: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: false,
//       }));
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.fullName.trim()) newErrors.fullName = true;
//     if (!formData.email.trim()) newErrors.email = true;
//     if (!formData.phoneNumber.trim()) newErrors.phoneNumber = true;
//     if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = true;
//     if (!formData.dateOfJoining.trim()) newErrors.dateOfJoining = true;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         await dispatch(addStaff(formData)).unwrap();

//         setShowSuccess(true);

//         setTimeout(() => {
//           navigate("/staff/list");
//         }, 1500);
//       } catch (err) {
//         console.error("Failed to add staff:", err);

//       }
//     }
//   }

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Conditionally render success alert (local state)

//   if (showSuccess) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="300px"
//       >
//         <Alert severity="success" sx={{ width: "100%", maxWidth: 400 }}>
//           Staff member added successfully! Redirecting to staff list...
//         </Alert>
//       </Box>
//     );
//   }

//   // ADDED: Conditional rendering for Error state (Redux state)

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
//         <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
//           Failed to add staff: {error}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <CustomTypograpy >
//         Add Staff
//       </CustomTypograpy>

//       <Card elevation={1}>
//         <CardContent sx={{ p: 4 }}>
//           <form onSubmit={handleSubmit}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 3,
//                 justifyContent: "space-between",
//               }}
//             >
//               <CustomInput
//                 label="Full Name"
//                 name="fullName"
//                 placeholder="Enter full name"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 error={errors.fullName}
//               />

//               <CustomInput
//                 label="Email"
//                 name="email"
//                 type="email"
//                 placeholder="Email@xyz.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={errors.email}
//               />

//               <CustomInput
//                 label="Phone Number"
//                 name="phoneNumber"
//                 placeholder="+91-9999999999"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 error={errors.phoneNumber}
//               />

//               <CustomInput
//                 label="Years of Experience"
//                 name="yearsOfExperience"
//                 type="number"
//                 placeholder="e.g. 5"
//                 value={formData.yearsOfExperience}
//                 onChange={handleChange}
//                 error={errors.yearsOfExperience}
//               />

//               <CustomInput
//                 label="Skills"
//                 name="skills"
//                 placeholder="React, Node.js"
//                 value={formData.skills}
//                 onChange={handleChange}
//               />

//               <CustomInput
//                 label="Date of Joining"
//                 name="dateOfJoining"
//                 type="date"
//                 value={formData.dateOfJoining}
//                 onChange={handleChange}
//                 error={errors.dateOfJoining}
//                 InputLabelProps={{ shrink: true }}
//               />

//               <Box
//                 sx={{
//                   width: "100%",
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   gap: 2,
//                   mt: 2,
//                 }}
//               >
//                 <CustomButton
//                   label="Cancel"
//                   color="error"
//                   variant="outlined"
//                   onClick={() => navigate("/staff/list")}
//                 />
//                 <CustomButton type="submit" label="Submit" />
//               </Box>
//             </Box>
//           </form>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default AddStaff;

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import CustomInput from "../generic/Input";
import CustomButton from "../generic/Button";
import CustomTypography from "../generic/Typography";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    staffName: "",
    emailId: "",
    phoneNumber: "",
    city: "",
    degree: "",
    aadharCard: "",
    panCard: "",
    role: "",
    skills: "",
    joiningDate: "",
    salary: "",
    originalCertificate: "",
  });

  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const roleRes = await axios.get("http://localhost:8080/roles");
        const skillRes = await axios.get("http://localhost:8080/courses");
        setRoles(roleRes.data);
        setSkills(skillRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // Validation
  const validateForm = () => {
    const required = [
      "staffName",
      "emailId",
      "phoneNumber",
      "city",
      "degree",
      "aadharCard",
      "panCard",
      "role",
      "skills",
      "joiningDate",
      "salary",
      "originalCertificate",
    ];

    const newErrors = {};
    required.forEach((key) => {
      if (!formData[key].trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/staff",
        formData
      );
      console.log("Response:", response.data);
      setShowSuccess(true);

      setTimeout(() => navigate("/staff/list"), 1500);
    } catch (error) {
      console.error("Error submitting staff:", error);
      alert("Failed to add staff. Please try again.");
    }
  };

  if (showSuccess)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Alert severity="success" sx={{ width: "100%", maxWidth: 400 }}>
          Staff Added Successfully! Redirecting...
        </Alert>
      </Box>
    );

  return (
    <Box>
      <CustomTypography>Add Staff</CustomTypography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "space-between",
              }}
            >
              <CustomInput
                label="Staff Name"
                name="staffName"
                value={formData.staffName}
                onChange={handleChange}
                error={errors.staffName}
              />
              <CustomInput
                label="Email ID"
                name="emailId"
                type="email"
                value={formData.emailId}
                onChange={handleChange}
                error={errors.emailId}
              />
              <CustomInput
                label="Phone Number"
                name="phoneNumber"
                type="number"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
              />
              <CustomInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />
              <CustomInput
                label="Degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                error={errors.degree}
              />
              <CustomInput
                label="Aadhar Card"
                name="aadharCard"
                value={formData.aadharCard}
                onChange={handleChange}
                error={errors.aadharCard}
              />
              <CustomInput
                label="Pan Card"
                name="panCard"
                value={formData.panCard}
                onChange={handleChange}
                error={errors.panCard}
              />

              <CustomInput
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
              >
                {roles.map((opt) => (
                  <MenuItem key={opt.id} value={opt.name}>
                    {opt.name}
                  </MenuItem>
                ))}
              </CustomInput>

              <CustomInput
                select
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                error={errors.skills}
              >
                {skills.map((opt) => (
                  <MenuItem key={opt.id} value={opt.name}>
                    {opt.name}
                  </MenuItem>
                ))}
              </CustomInput>

              <CustomInput
                type="date"
                label="Joining Date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                error={errors.joiningDate}
                InputLabelProps={{ shrink: true }}
              />
              <CustomInput
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                error={errors.salary}
              />
              <CustomInput
                label="Original Certificate"
                name="originalCertificate"
                value={formData.originalCertificate}
                onChange={handleChange}
                error={errors.originalCertificate}
              />

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <CustomButton
                  label="Cancel"
                  color="error"
                  variant="outlined"
                  onClick={() => navigate("/staff/list")}
                />
                <CustomButton type="submit" label="Submit" />
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddStaff;
