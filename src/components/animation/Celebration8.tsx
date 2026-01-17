// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Celebration from './Celebration';

// interface CelebrationProps {
//   onComplete: () => void;
//   title: string | null;
// }

// const celebration8: React.FC<CelebrationProps> = ({ onComplete, title }) => {
//  useEffect(() => {
//   const timer = setTimeout(onComplete, 4000);
//   return () => clearTimeout(timer);
// }, [onComplete]);

// const butterflies = Array.from({ length: 20 }).map((_, i) => ({
//   id: i,
//   startX: Math.random() * 100,
//   startY: 80 + Math.random() * 20,
//   endX: Math.random() * 100,
//   endY: 4 + Math.random() * 20, // Changed: now flies to 40-60% (middle of screen) instead of -20 (top)
//   delay: Math.random() * 1.5,
//   duration: 1.8 + Math.random() * 1.2,
//   color: ['#FF6B9D', '#FFB347', '#A78BFA', '#6BCF7F', '#4ECDC4'][i % 5],
//   size: 40 + Math.random() * 30,
// }));

// return (
//   <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
//     <motion.div
//       className="absolute inset-0 bg-gradient-to-b from-pink-100/30 via-purple-100/20 to-green-100/30"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     />

//     <div className="absolute inset-0 flex items-center justify-center">
//       <motion.h1
//         className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-green-500"
//         initial={{ scale: 0, y: 50 }}
//         animate={{ 
//           scale: [0, 1.1, 1],
//           y: [50, -10, 0],
//         }}
//         transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
//       >
//         {title || "BEAUTIFUL!"}
//       </motion.h1>
//     </div>

//     {/* Flying butterflies - Now flies to mid-screen */}
//     {butterflies.map((butterfly) => (
//       <motion.div
//         key={butterfly.id}
//         className="absolute"
//         style={{ left: `${butterfly.startX}%`, top: `${butterfly.startY}%` }}
//         initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
//         animate={{
//           x: [
//             0,
//             (butterfly.endX - butterfly.startX) * 0.3,
//             (butterfly.endX - butterfly.startX) * 0.7,
//             butterfly.endX - butterfly.startX,
//           ],
//           y: [
//             0,
//             (butterfly.endY - butterfly.startY) * 0.3,
//             (butterfly.endY - butterfly.startY) * 0.7,
//             butterfly.endY - butterfly.startY,
//           ],
//           rotate: [0, 20, -15, 10, 0],
//           opacity: [0, 1, 1, 0],
//         }}
//         transition={{
//           duration: butterfly.duration,
//           delay: butterfly.delay,
//           ease: "easeInOut",
//         }}
//       >
//         <motion.svg
//           width={butterfly.size}
//           height={butterfly.size * 0.8}
//           viewBox="0 0 100 80"
//           animate={{
//             scaleX: [1, 0.7, 1, 0.7, 1],
//           }}
//           transition={{
//             duration: 0.2,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         >
//           {/* Butterfly wings */}
//           <ellipse cx="30" cy="35" rx="25" ry="30" fill={butterfly.color} opacity="0.9" />
//           <ellipse cx="70" cy="35" rx="25" ry="30" fill={butterfly.color} opacity="0.9" />
//           <ellipse cx="30" cy="50" rx="20" ry="25" fill={butterfly.color} opacity="0.8" />
//           <ellipse cx="70" cy="50" rx="20" ry="25" fill={butterfly.color} opacity="0.8" />
//           {/* Body */}
//           <ellipse cx="50" cy="40" rx="5" ry="35" fill="#333" />
//           {/* Patterns */}
//           <circle cx="30" cy="35" r="8" fill="white" opacity="0.6" />
//           <circle cx="70" cy="35" r="8" fill="white" opacity="0.6" />
//         </motion.svg>
//       </motion.div>
//     ))}
//   </div>
// );
// };

// export default celebration8;
