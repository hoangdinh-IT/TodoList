// import { motion } from "framer-motion";

// const Spinner = () => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//       <div className="flex flex-col items-center">
//         {/* Vòng xoay ánh sáng */}
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
//           className="relative h-16 w-16"
//         >
//           {/* Outer glow ring */}
//           <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 shadow-[0_0_20px_4px_rgba(100,100,255,0.2)]" />
//           {/* Inner blurred core */}
//           <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-md" />
//         </motion.div>

//         {/* Nhịp đập ánh sáng trung tâm */}
//         <motion.div
//           className="mt-3 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_12px_3px_rgba(59,130,246,0.5)]"
//           animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
//           transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//         />

//         {/* Loading text */}
//         <motion.p
//           className="mt-6 text-base font-medium text-white/90 tracking-wide"
//           animate={{ opacity: [0.6, 1, 0.6] }}
//           transition={{ repeat: Infinity, duration: 2 }}
//         >
//           Loading<span className="text-blue-300">...</span>
//         </motion.p>
//       </div>
//     </div>
//   );
// };

// export default Spinner;





import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* Dòng chấm nhảy tưng tưng */}
      <div className="flex space-x-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"
            animate={{
              y: ["0%", "-60%", "0%"],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15, // tạo hiệu ứng nhịp lệch giữa các chấm
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-6 text-base font-medium text-white/90 tracking-wide"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Loading<span className="text-blue-300">...</span>
      </motion.p>
    </div>
  );
};

export default Spinner;
