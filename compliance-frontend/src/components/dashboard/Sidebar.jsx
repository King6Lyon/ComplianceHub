import { NavLink } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as FrameworkIcon,
  Checklist as ControlIcon,
  Security as RiskIcon,
  Task as TaskIcon,
  Description as ReportIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper', height: '100vh' }}>
      <List>
        <ListItem button component={NavLink} to="/" exact>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
        <ListItem button component={NavLink} to="/frameworks">
          <ListItemIcon>
            <FrameworkIcon />
          </ListItemIcon>
          <ListItemText primary="Cadres de conformité" />
        </ListItem>
        <ListItem button component={NavLink} to="/controls">
          <ListItemIcon>
            <ControlIcon />
          </ListItemIcon>
          <ListItemText primary="Contrôles" />
        </ListItem>
        <ListItem button component={NavLink} to="/risks">
          <ListItemIcon>
            <RiskIcon />
          </ListItemIcon>
          <ListItemText primary="Évaluation des risques" />
        </ListItem>
        <ListItem button component={NavLink} to="/tasks">
          <ListItemIcon>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary="Tâches" />
        </ListItem>
        <ListItem button component={NavLink} to="/reports">
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Rapports" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={NavLink} to="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;