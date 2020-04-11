import React from 'react';
import { Box, Typography } from '@material-ui/core'

interface AppTabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export default function AppTabPanel(props: AppTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="apptabpanel"
      hidden={value !== index}
      id={`full-width-apptabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

export function tabProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-apptabpanel-${index}`,
  };
}