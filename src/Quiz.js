import React, { useState, useEffect } from "react";
import "animate.css"; // Import animations

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question

  useEffect(() => {
    fetch("/api.json")
      .then((response) => response.json())
      .then((data) => setQuizData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion(); // Auto move to next question
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      if (quizData.questions[currentQuestion].options[selectedOption].is_correct) {
        setScore(score + parseFloat(quizData.correct_answer_marks));
      }
    }
    setSelectedOption(null);
    setTimeLeft(15); // Reset timer

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-container animate__animated animate__fadeIn">
      <h1>{quizData.title}</h1>
      <p>{quizData.description}</p>

      {showResult ? (
        <div>
          <h2>🎉 Quiz Completed!</h2>
          <p>Your Score: {score} / {quizData.questions.length * parseFloat(quizData.correct_answer_marks)}</p>
        </div>
      ) : (
        <div>
          <h2 className="question">Question {currentQuestion + 1}:</h2>
          <p>{quizData.questions[currentQuestion].description}</p>
          <p className="timer">⏳ Time Left: {timeLeft}s</p>

          <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}></div>

          <ul>
            {quizData.questions[currentQuestion].options.map((option, index) => (
              <li key={index} onClick={() => setSelectedOption(index)}
                  className={selectedOption === index ? "selected" : ""}>
                {option.description}
              </li>
            ))}
          </ul>

          <button onClick={handleNextQuestion} disabled={selectedOption === null}>
            {currentQuestion === quizData.questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
