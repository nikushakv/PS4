import React from 'react';
import '@styles/components/Header.css'; // Import the CSS

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>Multiplayer Pong</h1>
    </header>
  );
};

export default Header;