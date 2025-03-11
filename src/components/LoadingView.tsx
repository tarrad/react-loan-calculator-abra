import React from 'react';
import '../styles/LoadingView.css';

const LoadingView: React.FC = () => {
    return (
        <div className="loading-view-overlay">
            <div className="loading-view-content">
                <div className="loading-animation">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
                <h2>מעבד את בקשת ההלוואה שלך</h2>
                <p>אנא המתן בזמן שאנו מעבדים את הבקשה...</p>
                <div className="processing-steps">
                    <div className="step">
                        <span className="step-icon">✓</span>
                        <span className="step-text">אימות פרטים</span>
                    </div>
                    <div className="step pending">
                        <span className="step-icon">•</span>
                        <span className="step-text">הכנת הצעה</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingView; 