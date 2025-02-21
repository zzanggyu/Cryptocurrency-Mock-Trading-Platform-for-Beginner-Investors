import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const LoginModal = ({ isOpen, onClose, initialIsSignup = false, onLoginSuccess }) => {  // onLoginSuccess prop 추가
   const [shouldRender, setShouldRender] = useState(isOpen);
   const [isSignup, setIsSignup] = useState(initialIsSignup);

   useEffect(() => {
       if (isOpen) {
           setShouldRender(true);
           setIsSignup(initialIsSignup); // 모달이 열릴 때 initialIsSignup 값으로 설정
       } else {
           setTimeout(() => setShouldRender(false), 300);
       }
   }, [isOpen, initialIsSignup]);

   if (!shouldRender) return null;

   const handleBackgroundClick = (e) => {
       if (e.target === e.currentTarget) {
           onClose();
       }
   };

   return (
       <AnimatePresence>
           <div 
               className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
               onClick={handleBackgroundClick}
           >
               <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.2 }}
                   className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
               >
                   <button 
                       className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
                       onClick={(e) => {
                           e.stopPropagation();
                           onClose();
                       }}
                   >
                       ✖
                   </button>
                   
                   <h2 className="text-lg font-semibold mb-4 text-center">
                       {isSignup ? '회원가입' : '로그인'}
                   </h2>

                   {isSignup ? <SignupForm /> : <LoginForm onLoginSuccess={onLoginSuccess} />}

                   <div className="mt-4 text-center">
                       <button
                           className="text-blue-500 hover:underline"
                           onClick={() => setIsSignup(!isSignup)}
                       >
                           {isSignup ? '이미 계정이 있나요? 로그인' : '계정이 없으신가요? 회원가입'}
                       </button>
                   </div>
               </motion.div>
           </div>
       </AnimatePresence>
   );
};

export default LoginModal;
