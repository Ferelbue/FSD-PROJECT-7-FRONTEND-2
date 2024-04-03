import React from 'react';
import './CustomLike.css';

export const CustomLike = ({ title, onClick }) => {
  return (
    <div className="likeDesign" onClick={onClick}>
      {title}
    </div>
  );
};
