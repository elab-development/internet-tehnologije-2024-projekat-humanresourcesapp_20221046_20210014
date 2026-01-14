import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../animations/loading.json';

const Loading = () => {
  return (
    <div className="loading-container">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
};

export default Loading;
