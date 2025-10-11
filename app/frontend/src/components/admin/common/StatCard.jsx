import React from "react";
import { Paper, Typography, Box, Avatar, useTheme } from "@mui/material";

/**
 * ✅ Reusable StatCard Component
 * - Displays a key metric with color coding
 * - Semantic & accessible
 * - Lightweight & responsive
 */
export default function StatCard({ icon: Icon, title, value, subtitle, color = "primary", sx = {} }) {
  const theme = useTheme();
  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderLeft: `5px solid ${palette.main}`,
        ...sx,
      }}
      aria-label={`${title}: ${value}`}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {value}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: `${palette.main}1A`, // subtle background
            color: palette.main,
            width: 48,
            height: 48,
          }}
        >
          {Icon && <Icon sx={{ fontSize: 26 }} />}
        </Avatar>
      </Box>

      {subtitle && (
        <Typography
          variant="caption"
          fontWeight={600}
          mt={1}
          sx={{
            color: palette.main,
            bgcolor: `${palette.main}14`,
            borderRadius: 1,
            px: 1,
            py: 0.5,
            display: "inline-block",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}
