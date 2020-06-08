import React, { FC } from 'react';
import { Box, Typography } from '@material-ui/core'

interface AppTabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const AppTabPanel: FC<AppTabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="apptabpanel"
      hidden={ value !== index }
      id={ `full-width-apptabpanel-${index}` }
      aria-labelledby={ `full-width-tab-${index}` }
      { ...other }
    >
      { value === index && <Box p={ 3 }>{ children }</Box> }
    </Typography>
  )
}

const tabProps = (index: any) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-apptabpanel-${index}`,
  };
}

export default AppTabPanel
export {
  tabProps
}