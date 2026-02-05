import React, { useEffect } from "react";
import CustomBox from "../generic/Box";
import CustomCard from "../generic/Card";
import CustomCardContent from "../generic/CustomCardContent";
import CustomGrid from "../generic/CustomGrid";
import CustomTypography from "../generic/Typography";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { fetchStaff } from "../redux/slices/staffSlice";
import { fetchStudents } from "../redux/slices/studentSlice";

import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as CourseIcon,
  PersonAdd,
  Add,
  Category as DomainIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const staff = useSelector((state) => state.staff.staff || []);
  const staffLoading = useSelector((state) => state.staff.loading);
  const students = useSelector((state) => state.students.students || []);
  const studentsLoading = useSelector((state) => state.students.loading);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // if (!user) {
    //   navigate("/login");
    //   return;
    // }

    if (!staff.length && !staffLoading) {
      dispatch(fetchStaff());
    }

    if (!students.length && !studentsLoading) {
      dispatch(fetchStudents());
    }
  }, [
    user,
    navigate,
    dispatch,
    staff.length,
    students.length,
    staffLoading,
    studentsLoading,
  ]);

  const metrics = [
    ...(user?.role === "Admin"
      ? [
          {
            title: "Total Staff",
            value: staff.length,
            icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
            color: "#1976d2",
          },
        ]
      : []),

    {
      title: "Total Students",
      value: students.length,
      icon: <SchoolIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "#2e7d32",
    },
    {
      title: "Active Courses",
      value: 12,
      icon: <CourseIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "#ed6c02",
    },
    ...(user?.role === "Admin"
      ? [
          {
            title: "Internship Domains",
            value: 8,
            icon: <DomainIcon sx={{ fontSize: 40, color: "info.main" }} />,
            color: "#0288d1",
          },
        ]
      : []),
  ];

  const quickActions = [
    ...(user?.role === "Admin"
      ? [
          {
            title: "Add New Staff",
            description: "Register a new staff member",
            action: () => navigate("/staff/add"),
            icon: <PersonAdd />,
          },
        ]
      : []),
    {
      title: "Register New Student",
      description: "Add a new student to the system",
      action: () => navigate("/students/add"),
      icon: <Add />,
    },
  ];

  return (
    <CustomBox>
      <CustomTypography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Welcome to the {user?.role ?? "User"} Dashboard
      </CustomTypography>

      <CustomBox
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        {metrics.map((metric, index) => (
          <CustomBox
            key={index}
            sx={{ flex: "1 1 calc(25% - 24px)", minWidth: 240 }}
          >
            <CustomCard
              sx={{
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CustomCardContent>
                <CustomBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <CustomBox>
                    <CustomTypography
                      color="textSecondary"
                      gutterBottom
                      variant="h5"
                    >
                      {metric.title}
                    </CustomTypography>
                    <CustomTypography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", color: metric.color }}
                    >
                      {metric.value}
                    </CustomTypography>
                  </CustomBox>
                  {metric.icon}
                </CustomBox>
              </CustomCardContent>
            </CustomCard>
          </CustomBox>
        ))}
      </CustomBox>

      {/* Quick Actions */}

      <CustomGrid container spacing={3}>
        <CustomGrid item xs={12} md={6}>
          <CustomCard>
            <CustomCardContent>
              <CustomTypography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: 600 }}
              >
                Quick Actions
              </CustomTypography>
              <CustomGrid container spacing={2}>
                {quickActions.map((action, index) => (
                  <CustomGrid item xs={12} key={index}>
                    <CustomCard
                      variant="outlined"
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 2,
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={action.action}
                    >
                      <CustomCardContent sx={{ py: 2 }}>
                        <CustomBox display="flex" alignItems="center" gap={2}>
                          {action.icon}
                          <CustomBox>
                            <CustomTypography
                              variant="subtitle1"
                              fontWeight={500}
                            >
                              {action.title}
                            </CustomTypography>
                            <CustomTypography
                              variant="body2"
                              color="textSecondary"
                            >
                              {action.description}
                            </CustomTypography>
                          </CustomBox>
                        </CustomBox>
                      </CustomCardContent>
                    </CustomCard>
                  </CustomGrid>
                ))}
              </CustomGrid>
            </CustomCardContent>
          </CustomCard>
        </CustomGrid>
      </CustomGrid>
    </CustomBox>
  );
};

export default Dashboard;
