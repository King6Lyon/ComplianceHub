import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import UserProfile from '../components/dashboard/UserProfile';
import MfaSetup from '../components/auth/MfaSetup';

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <Tabs defaultActiveKey="profile" id="settings-tabs">
        <Tab eventKey="profile" title="Profile">
          <UserProfile />
        </Tab>
        <Tab eventKey="security" title="Security">
          <h2>Multi-Factor Authentication</h2>
          <MfaSetup />
        </Tab>
        <Tab eventKey="preferences" title="Preferences">
          <h2>User Preferences</h2>
          <p>Coming soon...</p>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Settings;