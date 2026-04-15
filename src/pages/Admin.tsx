import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

const Admin: React.FC = () => {
  usePageTitle('Admin | PRODBYRIQ');
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>Beat Upload Portal</h1>
      <p>Coming soon — beat management portal.</p>
    </div>
  );
};

export default Admin;
