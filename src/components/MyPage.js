// MyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, changePassword } from '../services/api';
import axios from 'axios';
import './MyPage.css';

function MyPage() {
   const [userInfo, setUserInfo] = useState(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
   const [isChangingPassword, setIsChangingPassword] = useState(false);
   const [passwordForm, setPasswordForm] = useState({
       postPassword: '',
       newPassword: '',
       confirmPassword: ''
   });
   const [newNickname, setNewNickname] = useState('');
   const [isChangingNickname, setIsChangingNickname] = useState(false);

   useEffect(() => {
       fetchUserInfo();
   }, []);

   const fetchUserInfo = async () => {
       try {
           const data = await getUserInfo();
           setUserInfo(data);
           setLoading(false);
       } catch (error) {
           alert('사용자 정보를 불러오는데 실패했습니다.');
           navigate('/login');
       }
   };

   const handlePasswordChange = async (e) => {
       e.preventDefault();
       
       if (passwordForm.newPassword !== passwordForm.confirmPassword) {
           alert('새 비밀번호가 일치하지 않습니다.');
           return;
       }

       try {
           await changePassword({
               postPassword: passwordForm.postPassword,
               newPassword: passwordForm.newPassword
           });
           alert('비밀번호가 성공적으로 변경되었습니다.');
           setIsChangingPassword(false);
           setPasswordForm({
               postPassword: '',
               newPassword: '',
               confirmPassword: ''
           });
       } catch (error) {
           alert(error.message);
       }
   };

   const handlePasswordFormChange = (e) => {
       setPasswordForm({
           ...passwordForm,
           [e.target.name]: e.target.value
       });
   };

   const handleNicknameChange = async (e) => {
       e.preventDefault();
       try {
           await axios.put('http://localhost:8080/api/user/nickname', 
               { nickname: newNickname }, 
               { withCredentials: true }
           );
           alert('닉네임이 변경되었습니다.');
           setIsChangingNickname(false);
           fetchUserInfo();
       } catch (error) {
           alert(error.response?.data || '닉네임 변경 중 오류가 발생했습니다.');
       }
   };

   if (loading) return <div>로딩중...</div>;
   if (!userInfo) return <div>사용자 정보를 찾을 수 없습니다.</div>;

   return (
       <div className="mypage-container">
           <div className="mypage-content">
               <h2>마이페이지</h2>
               
               {/* 아이디 섹션 */}
               <div className="user-info-section">
                   <h3>아이디</h3>
                   <p>{userInfo.username}</p>
               </div>

               {/* 닉네임 섹션 */}
               <div className="user-info-section">
                   <h3>닉네임</h3>
                   <div className="info-row">
                       <p>{userInfo.nickname}</p>
                       <button onClick={() => setIsChangingNickname(!isChangingNickname)}>
                           닉네임 변경
                       </button>
                   </div>
                   {isChangingNickname && (
                       <form onSubmit={handleNicknameChange} className="nickname-form">
                           <input
                               type="text"
                               value={newNickname}
                               onChange={(e) => setNewNickname(e.target.value)}
                               placeholder="새 닉네임"
                           />
                           <button type="submit" className="submit-button">변경하기</button>
                       </form>
                   )}
               </div>

               {/* 이메일 섹션 */}
               <div className="user-info-section">
                   <h3>이메일</h3>
                   <p>{userInfo.email}</p>
               </div>

               {/* 투자 스타일 섹션 */}
               <div className="user-info-section">
                   <h3>투자 스타일</h3>
                   <p>{userInfo.style || '미설정'}</p>
               </div>

               {/* 비밀번호 변경 섹션 */}
               <div className="password-section">
                   <button 
                       onClick={() => setIsChangingPassword(!isChangingPassword)}
                       className="change-password-button"
                   >
                       비밀번호 변경
                   </button>
                   {isChangingPassword && (
                       <form onSubmit={handlePasswordChange} className="password-form">
                           <div className="form-group">
                               <input
                                   type="password"
                                   name="postPassword"
                                   value={passwordForm.postPassword}
                                   onChange={handlePasswordFormChange}
                                   placeholder="현재 비밀번호"
                                   required
                               />
                           </div>
                           <div className="form-group">
                               <input
                                   type="password"
                                   name="newPassword"
                                   value={passwordForm.newPassword}
                                   onChange={handlePasswordFormChange}
                                   placeholder="새 비밀번호"
                                   required
                               />
                           </div>
                           <div className="form-group">
                               <input
                                   type="password"
                                   name="confirmPassword"
                                   value={passwordForm.confirmPassword}
                                   onChange={handlePasswordFormChange}
                                   placeholder="새 비밀번호 확인"
                                   required
                               />
                           </div>
                           <button type="submit" className="submit-button">변경하기</button>
                       </form>
                   )}
               </div>

               {/* 투자 성향 섹션 */}
               <div className="style-section">
                   <button 
                       onClick={() => navigate('/investment-survey')}
                       className="survey-button"
                   >
                       투자 성향 진단하기
                   </button>
               </div>
           </div>
       </div>
   );
}

export default MyPage;