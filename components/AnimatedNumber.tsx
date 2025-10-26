'use client';

import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface AnimatedNumberProps {
  value: number;
  format?: boolean;
  duration?: number; 
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = false,
  duration = 800,
}) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    config: { tension: 80, friction: 18, duration },
  });

  return (
    <animated.span>
      {number.to((n) =>
        format
          ? n.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : Math.round(n).toLocaleString('en-IN')
      )}
    </animated.span>
  );
};

export default AnimatedNumber;
