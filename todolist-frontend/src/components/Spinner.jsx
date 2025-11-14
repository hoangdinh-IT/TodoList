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
    </div>
  );
};

export default Spinner;
