import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SessionTimer.css';

function SessionTimer({ setUser }) {
   const [timeLeft, setTimeLeft] = useState(() => {
       const sessionStart = localStorage.getItem('sessionStart');
       if (!sessionStart) {
           localStorage.setItem('sessionStart', Date.now().toString());
           return 1800;
       }
       
       const elapsed = Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
       const remaining = Math.max(60 - elapsed, 0);
       return remaining;
   });
   
   const navigate = useNavigate();

   const resetTimer = () => {
       localStorage.setItem('sessionStart', Date.now().toString());
       setTimeLeft(1800);
   };

   useEffect(() => {
       const timer = setInterval(() => {
           setTimeLeft(prevTime => {
               if (prevTime <= 1) {
                   localStorage.removeItem('sessionStart');
                   clearInterval(timer);
                   handleSessionTimeout();
                   return 0;
               }
               return prevTime - 1;
           });
       }, 1000);

       return () => clearInterval(timer);
   }, []);

   const handleSessionTimeout = async () => {
       try {
           await axios.post('http://localhost:8080/api/logout', {}, {
               withCredentials: true
           });
           setUser(null);
           navigate('/login');
       } catch (error) {
           console.error('Session timeout error:', error);
           setUser(null);
           navigate('/login');
       }
   };

   return (
       <div className="session-info">
           <span className="session-timer">
               남은 시간: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </span>
           <button
               onClick={resetTimer}
               className="extend-session-btn"
           >
               연장
           </button>
       </div>
   );
}

export default SessionTimer;