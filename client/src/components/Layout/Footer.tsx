import React from 'react';
import '@styles/components/Footer.css'; // Import the CSS

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Pong Masters. All rights reserved.</p>
      <p>Built with React, Node.js, Socket.IO & TypeScript</p>
    </footer>
  );
};

export default Footer;