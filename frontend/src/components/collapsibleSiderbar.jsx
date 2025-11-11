// CollapsibleSidebar.jsx
import { MoveDownLeft, MoveRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const CollapsibleSidebar = ({ children, collapsedWidth = 70, expandedWidth = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Handle mouse enter (hover) - expand sidebar to the right
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
    setIsCollapsed(false);
  };

  // Handle mouse leave with delay - collapse sidebar to the left
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setIsCollapsed(true);
    }, 300); // 300ms delay before collapsing
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const sidebarStyle = {
    width: isCollapsed && !isHovering ? collapsedWidth : expandedWidth,
    transition: 'width 0.3s ease-in-out, transform 0.3s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
    height: '100vh',
    // Start from left edge and expand towards center
    MoveDownLeft,
    transform: 'translateX(0)',
  };

  return (
    <div
      ref={sidebarRef}
      style={sidebarStyle}
      className="bg-gray-900 text-white flex flex-col shadow-2xl relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Collapse/Expand Indicator - Right side inside */}
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <div className="w-4 h-12 bg-gray-800 rounded-l-lg flex items-center justify-center cursor-pointer">
          <span className="text-gray-400 text-sm transition-transform duration-300">
            {isCollapsed ? '▶' : '◀'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSidebar;