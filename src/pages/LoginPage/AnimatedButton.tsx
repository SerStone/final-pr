import React, { useState } from "react";

import styles from "./AnimatedButton.module.css";

interface AnimatedButtonProps {
    isValid: boolean | null;
    onAction: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ isValid, onAction }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleClick = () => {
        setIsLoading(true);
        setShowResult(false);

        onAction();

        setTimeout(() => {
            setIsLoading(false);
            setShowResult(true);
        }, 2000);
    };

    return (
        <button className={styles.button} onClick={handleClick} disabled={isLoading}>
            {isLoading ? (
                <div className={styles.loader}></div>
            ) : showResult && isValid !== null ? (
                isValid ? (
                    <svg className={styles.check} viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className={styles.cross} viewBox="0 0 24 24">
                        <path d="M6 6L18 18M6 18L18 6" />
                    </svg>
                )
            ) : (
                <span>Submit</span>
            )}
        </button>
    );
};


export default AnimatedButton;


