import React from 'react';
import '@styles/components/ConnectionStatus.css'; // Import the CSS

interface ConnectionStatusProps {
  isConnected: boolean;
  playerId: string | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, playerId }) => {
  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator"></div>
      <span className="status-text">
        {isConnected ? `Connected (ID: ${playerId?.substring(0,6)}...)` : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;