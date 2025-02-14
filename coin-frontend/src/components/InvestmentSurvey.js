import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateStyle } from '../services/api';
import './InvestmentSurvey.css';

function InvestmentSurvey() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = [
		{
	        "category": "투자 경험 및 지식",
	        "question": "가상화폐 투자 경험이 얼마나 되셨나요?",
	        "options": [
	            { "text": "경험 없음", "score": 1 },
	            { "text": "6개월 미만", "score": 2 },
	            { "text": "6개월~1년", "score": 3 },
	            { "text": "1~2년", "score": 4 },
	            { "text": "2년 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 경험 및 지식",
	        "question": "주식이나 펀드 등 다른 투자 경험이 있으신가요?",
	        "options": [
	            { "text": "경험 없음", "score": 1 },
	            { "text": "예금, 적금만", "score": 2 },
	            { "text": "펀드 경험 있음", "score": 3 },
	            { "text": "주식 경험 있음", "score": 4 },
	            { "text": "파생상품까지 경험", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 경험 및 지식",
	        "question": "일주일에 투자 관련 공부나 학습을 얼마나 하시나요?",
	        "options": [
	            { "text": "거의 안함", "score": 1 },
	            { "text": "1시간 미만", "score": 2 },
	            { "text": "1~3시간", "score": 3 },
	            { "text": "3~5시간", "score": 4 },
	            { "text": "5시간 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 경험 및 지식",
	        "question": "가상화폐 시장에 대한 이해도는 어느 정도인가요?",
	        "options": [
	            { "text": "전혀 모름", "score": 1 },
	            { "text": "기초 개념만 앎", "score": 2 },
	            { "text": "주요 코인과 거래소 이해", "score": 3 },
	            { "text": "차트 분석과 기술적 지표 이해", "score": 4 },
	            { "text": "전문적 수준의 이해", "score": 5 }
	        ]
	    },
	    {
	        "category": "심리적 특성",
	        "question": "투자에서 손실에 대한 태도는 어떠신가요?",
	        "options": [
	            { "text": "절대 손실 수용 불가", "score": 1 },
	            { "text": "5% 미만 손실 수용", "score": 2 },
	            { "text": "10% 미만 손실 수용", "score": 3 },
	            { "text": "20% 미만 손실 수용", "score": 4 },
	            { "text": "30% 이상도 수용 가능", "score": 5 }
	        ]
	    },
	    {
	        "category": "심리적 특성",
	        "question": "시장이 급락할 때 대처 방식은 어떻게 하시나요?",
	        "options": [
	            { "text": "즉시 전량 매도", "score": 1 },
	            { "text": "손절가에서 매도", "score": 2 },
	            { "text": "일부 매도 검토", "score": 3 },
	            { "text": "관망", "score": 4 },
	            { "text": "추가 매수 고려", "score": 5 }
	        ]
	    },
	    {
	        "category": "심리적 특성",
	        "question": "투자 결정을 내릴 때 분석과 직관의 비중은 어느 정도인가요?",
	        "options": [
	            { "text": "100% 분석 기반", "score": 1 },
	            { "text": "80% 분석 / 20% 직관", "score": 2 },
	            { "text": "50% 분석 / 50% 직관", "score": 3 },
	            { "text": "30% 분석 / 70% 직관", "score": 4 },
	            { "text": "대부분 직관적 판단", "score": 5 }
	        ]
	    },
	    {
	        "category": "심리적 특성",
	        "question": "투기적 성향은 어느 정도인가요?",
	        "options": [
	            { "text": "매우 보수적", "score": 1 },
	            { "text": "다소 보수적", "score": 2 },
	            { "text": "중립적", "score": 3 },
	            { "text": "다소 투기적", "score": 4 },
	            { "text": "매우 투기적", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 행태",
	        "question": "선호하는 투자 기간은 얼마나 되시나요?",
	        "options": [
	            { "text": "1개월 미만", "score": 1 },
	            { "text": "1~3개월", "score": 2 },
	            { "text": "3~6개월", "score": 3 },
	            { "text": "6개월~1년", "score": 4 },
	            { "text": "1년 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 행태",
	        "question": "포트폴리오 조정을 얼마나 자주 하시나요?",
	        "options": [
	            { "text": "거의 안함", "score": 1 },
	            { "text": "분기별", "score": 2 },
	            { "text": "월별", "score": 3 },
	            { "text": "주별", "score": 4 },
	            { "text": "수시로", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 행태",
	        "question": "투자 정보를 얼마나 자주 수집하시나요?",
	        "options": [
	            { "text": "거의 안함", "score": 1 },
	            { "text": "주 1회 미만", "score": 2 },
	            { "text": "주 2~3회", "score": 3 },
	            { "text": "매일 1회", "score": 4 },
	            { "text": "수시로 확인", "score": 5 }
	        ]
	    },
	    {
	        "category": "투자 행태",
	        "question": "매매 빈도가 어떻게 되시나요?",
	        "options": [
	            { "text": "매우 낮음 (연 1~2회)", "score": 1 },
	            { "text": "낮음 (월 1~2회)", "score": 2 },
	            { "text": "보통 (주 1~2회)", "score": 3 },
	            { "text": "높음 (주 3~4회)", "score": 4 },
	            { "text": "매우 높음 (거의 매일)", "score": 5 }
	        ]
	    },
	    {
	        "category": "위험-수익 성향",
	        "question": "목표 연간 수익률은 어떻게 되시나요?",
	        "options": [
	            { "text": "10% 미만", "score": 1 },
	            { "text": "10~30%", "score": 2 },
	            { "text": "30~50%", "score": 3 },
	            { "text": "50~100%", "score": 4 },
	            { "text": "100% 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "위험-수익 성향",
	        "question": "감내 가능한 최대 손실률은 어느 정도인가요?",
	        "options": [
	            { "text": "5% 미만", "score": 1 },
	            { "text": "5~10%", "score": 2 },
	            { "text": "10~20%", "score": 3 },
	            { "text": "20~30%", "score": 4 },
	            { "text": "30% 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "위험-수익 성향",
	        "question": "고위험-고수익 선호도는 어느 정도인가요?",
	        "options": [
	            { "text": "매우 낮음", "score": 1 },
	            { "text": "다소 낮음", "score": 2 },
	            { "text": "보통", "score": 3 },
	            { "text": "다소 높음", "score": 4 },
	            { "text": "매우 높음", "score": 5 }
	        ]
	    },
		{
	        "category": "위험-수익 성향",
	        "question": "투자 위험 감수 정도는 어떻게 되시나요?",
	        "options": [
	            { "text": "위험 회피형", "score": 1 },
	            { "text": "다소 보수형", "score": 2 },
	            { "text": "중립형", "score": 3 },
	            { "text": "다소 적극형", "score": 4 },
	            { "text": "위험 추구형", "score": 5 }
	        ]
	    },
	    {
	        "category": "자금 관리",
	        "question": "총 자산 대비 투자 비중은 어떻게 되시나요?",
	        "options": [
	            { "text": "5% 미만", "score": 1 },
	            { "text": "5~10%", "score": 2 },
	            { "text": "10~20%", "score": 3 },
	            { "text": "20~30%", "score": 4 },
	            { "text": "30% 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "자금 관리",
	        "question": "월 수입 대비 투자 비율은 어떻게 되시나요?",
	        "options": [
	            { "text": "5% 미만", "score": 1 },
	            { "text": "5~10%", "score": 2 },
	            { "text": "10~20%", "score": 3 },
	            { "text": "20~30%", "score": 4 },
	            { "text": "30% 이상", "score": 5 }
	        ]
	    },
	    {
	        "category": "자금 관리",
	        "question": "비상금은 얼마나 보유하고 계신가요?",
	        "options": [
	            { "text": "1년치 이상 생활비", "score": 1 },
	            { "text": "6개월치 생활비", "score": 2 },
	            { "text": "3개월치 생활비", "score": 3 },
	            { "text": "1개월치 생활비", "score": 4 },
	            { "text": "거의 없음", "score": 5 }
	        ]
	    },
	    {
	        "category": "자금 관리",
	        "question": "레버리지를 사용하실 의향이 있으신가요?",
	        "options": [
	            { "text": "절대 사용 안함", "score": 1 },
	            { "text": "2배 미만 소액만", "score": 2 },
	            { "text": "2배까지 일부 사용", "score": 3 },
	            { "text": "3배까지 사용", "score": 4 },
	            { "text": "5배 이상도 사용", "score": 5 }
	        ]
	    }
    ];

    const handleAnswer = (score) => {
        setAnswers({
            ...answers,
            [currentQuestion]: score
        });

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateStyle();
        }
    };

    const calculateStyle = () => {
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
        let style;

        if (totalScore <= 35) style = "안정형";
        else if (totalScore <= 55) style = "약간 안정형";
        else if (totalScore <= 75) style = "중립형";
        else if (totalScore <= 90) style = "약간 공격형";
        else style = "공격형";

        submitStyle(style, totalScore);
    };

	const submitStyle = async (style, score) => {
	    try {
	        await updateStyle(style, score);  // 함수 이름 변경
	        alert('투자 성향이 설정되었습니다.');
	        navigate('/mypage');
	    } catch (error) {
	        alert(error.message);
	    }
	};

    return (
        <div className="survey-container">
            <div className="survey-content">
                <div className="progress-bar">
                    질문 {currentQuestion + 1} / {questions.length}
                </div>

                <div className="question-container">
                    <h3 className="category">{questions[currentQuestion].category}</h3>
                    <h2 className="question">{questions[currentQuestion].question}</h2>
                    
                    <div className="options">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                className="option-button"
                                onClick={() => handleAnswer(option.score)}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestmentSurvey;