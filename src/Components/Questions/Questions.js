/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import UserList from "../UserList/UserList";
import { toast, ToastContainer } from "react-toastify";

const ReadingFillBlanks = ({ setLoading, loading }) => {
  const [questions, setQuestions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [draggedWord, setDraggedWord] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    getRequest("questions");
    getUserData("getUserData");
  }, []);

  const getRequest = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/${url}`);
      setQuestions(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDrop = (index) => {
    if (draggedWord !== null) {
      setUserAnswers((prev) => ({ ...prev, [index]: draggedWord }));
      setDraggedWord(null);
    }
  };

  const handleDragStart = (word) => {
    setDraggedWord(word);
  };
  const handleClear = () => {
    setUserAnswers({});
    setShowAnswer(false);
    setIsSubmitted(false);
  };
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleClear();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      handleClear();
    }
  };
  const handleSubmit = () => {
    const correctWords = JSON.parse(questions[currentIndex]?.correct_words);
    let correctAnswers = 0;

    for (let index = 0; index < Object.keys(userAnswers).length; index++) {
      if (userAnswers[index] === correctWords[index]) {
        correctAnswers++;
      }
    }

    setIsSubmitted(true);
    setShowAnswer(true);
    const payload = {
      user_id: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("userName"),
      question_id: questions[currentIndex]?.id,
      words: Object.values(userAnswers),
      score: correctAnswers,
      total: Object.keys(correctWords).length,
    };
    PostRequest("saveData", payload);
  };

  const getUserData = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/${url}`);
      setUserData(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const PostRequest = async (url, payload) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/${url}`,
        payload
      );

      if (response?.status === 201) {
        toast.success(response.data.message);
        getUserData("getUserData");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-3 bg-light">
          <div className="bg-head d-flex justify-content-between align-items-center p-2 text-white rounded">
            <span className="fw-bold">READING FILL IN THE BLANKS</span>
            <div className="d-flex align-items-center">
              <button className="btn btn-light btn-sm me-2">
                Seen in exams
              </button>
              <span className="me-2">
                Total Attempt{" "}
                <span className="badge bg-light text-dark">4</span>
              </span>
              <span>
                Tested <span className="badge bg-light text-dark">1</span>
              </span>
            </div>
          </div>
          <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>#{currentIndex + 1} Question</h5>
              <span className="fw-bold">
                <button className="btn btn-outline-secondary btn-sm me-3 py-2 rounded-5">
                  Label
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  🕒 Time Spent: {timeSpent}s
                </button>
              </span>
            </div>
          </div>

          <div className="container mt-3">
            {questions.length > 0 && (
              <div>
                <p>
                  {questions[currentIndex]?.question_text
                    .split("_")
                    .map((part, index) => {
                      const correctWords = JSON.parse(
                        questions[currentIndex].correct_words
                      );
                      const userAnswer = userAnswers[index];
                      const isCorrect = userAnswer === correctWords[index];

                      return (
                        <span key={index}>
                          {part}
                          {index <
                            questions[currentIndex].question_text.split("_")
                              .length -
                              1 && (
                            <>
                              <span
                                style={{
                                  minWidth: "60px",
                                  textAlign: "center",
                                  border: isSubmitted
                                    ? isCorrect
                                      ? "#dff0d8"
                                      : "#f8d7da"
                                    : "#f0f0f0",
                                  color: isSubmitted
                                    ? isCorrect
                                      ? "green"
                                      : "red"
                                    : "black",
                                }}
                                className="mx-1 border p-1 d-inline-block input-drag"
                                onDrop={() => handleDrop(index)}
                                onDragOver={(e) => e.preventDefault()}
                              >
                                {userAnswers[index] || "____"}
                              </span>
                              {showAnswer && (
                                <span className="text-success fw-bold">
                                  (Answer:{" "}
                                  {
                                    JSON.parse(
                                      questions[currentIndex].correct_words
                                    )[index]
                                  }
                                  )
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      );
                    })}
                </p>
              </div>
            )}

            <div className="d-flex flex-wrap gap-2 mt-3">
              {questions[currentIndex]?.available_options &&
                JSON.parse(questions[currentIndex].available_options).map(
                  (word, index) => (
                    <button
                      key={index}
                      className="btn btn-success"
                      draggable
                      onDragStart={() => handleDragStart(word)}
                    >
                      {word}
                    </button>
                  )
                )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center p-2 border-top mt-3">
            <div>
              <button
                className="btn text-white me-2 bg-head"
                disabled={isSubmitted || Object.keys(userAnswers).length === 0}
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="btn btn-secondary me-3"
                onClick={() => {
                  setTimeSpent(0);
                  setUserAnswers({});
                  setShowAnswer(false);
                  setIsSubmitted(false);
                }}
              >
                Restart
              </button>
              <span className="fw-bold">Answer:</span>
              {!isSubmitted ? (
                <button
                  className={`btn btn-sm ${
                    showAnswer ? "btn-danger" : "btn-light"
                  } ms-2`}
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {showAnswer ? "HIDE" : "SHOW"}
                </button>
              ) : (
                ""
              )}
            </div>
            {questions.length > 1 ? (
              <div className="d-flex align-items-center">
                <select
                  className="form-select form-select-sm me-2"
                  style={{ width: "60px" }}
                  value={currentIndex}
                  onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
                >
                  {questions.map((_, index) => (
                    <option key={index} value={index}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="btn bg-head text-white me-2"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="btn bg-head text-white"
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      <UserList userData={userData} loading={loading} />
    </>
  );
};

export default ReadingFillBlanks;
