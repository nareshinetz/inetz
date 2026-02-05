import React from "react";
import { Breadcrumbs, Typography, Link, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Leads",
    path: "/leads",
    children: [
      { name: "List Leads", path: "/leads/list" },
      { name: "Add Leads", path: "/leads/add" },
    ],
  },
  {
    name: "Students",
    path: "/students",
    children: [
      {
        name: "Course",
        path: "/students/course",
        children: [
          { name: "List Students", path: "/students/course/list" },
          { name: "Add Student", path: "/students/course/add" },
        ],
      },
      {
        name: "Internship",
        path: "/students/internship",
        children: [
          { name: "List Students", path: "/students/internship/list" },
          { name: "Add Student", path: "/students/internship/add" },
        ],
      },
      { name: "List", path: "/students/list" },
      { name: "Add", path: "/students/add" },
    ],
  },
  {
    name: "Staff",
    path: "/staff",
    children: [
      { name: "List Staff", path: "/staff/list" },
      { name: "Add Staff", path: "/staff/add" },
    ],
  },
];

const findBreadcrumbTrail = (items, currentPath) => {
  for (const item of items) {
    if (item.path === currentPath) {
      return [item];
    }
    if (item.children) {
      const childTrail = findBreadcrumbTrail(item.children, currentPath);
      if (childTrail.length) return [item, ...childTrail];
    }
  }
  return [];
};

const BreadcrumbsNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const trail = findBreadcrumbTrail(menuItems, path);

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return isLast ? (
            <Typography
              key={item.path}
              color="#1976d2"
              sx={{ fontWeight: 600 }}
            >
              {item.name}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={item.path}
              key={item.path}
              underline="hover"
              color="inherit"
              sx={{
                fontWeight: 500,
                "&:hover": { color: "#1976d2" },
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsNav;
