import React from 'react';
import { Link } from 'react-router-dom';

// Simple LinkContainer component to replicate react-router-bootstrap functionality
export const LinkContainer = ({ to, children }) => {
  const child = React.Children.only(children);
  
  return React.cloneElement(child, {
    as: Link,
    to: to,
  });
};

export default LinkContainer; 