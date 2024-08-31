import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuestionForm = () => {
  const [className, setClassName] = useState('');
  const [paperName, setPaperName] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', importantPoints: [''] }]);

  const navigate = useNavigate();

  const handleClassNameChange = (e) => setClassName(e.target.value);
  const handlePaperNameChange = (e) => setPaperName(e.target.value);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handlePointChange = (questionIndex, pointIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].importantPoints[pointIndex] = value;
    setQuestions(newQuestions);
  };

  const addNewPoint = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].importantPoints.push('');
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([...questions, { questionText: '', importantPoints: [''] }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const removePoint = (questionIndex, pointIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].importantPoints = newQuestions[questionIndex].importantPoints.filter((_, i) => i !== pointIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      className,
      questionPaperName: paperName,
      questions: questions.map(q => ({
        questionText: q.questionText,
        importantPoints: q.importantPoints
      }))
    };

    try {
      const response = await axios.post('http://localhost:3000/api/create-question-paper', requestData);
      console.log('Response:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="bg-purple-200 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white w-full max-w-md rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Create Quiz</h1>

          <label className="block text-lg font-medium mb-2">
            Classroom Name:
            <input
              type="text"
              value={className}
              onChange={handleClassNameChange}
              placeholder="Enter classroom name"
              className="block w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </label>

          <label className="block text-lg font-medium mb-2">
            Question Paper Name:
            <input
              type="text"
              value={paperName}
              onChange={handlePaperNameChange}
              placeholder="Enter question paper name"
              className="block w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </label>

          {questions.map((questionObj, questionIndex) => (
            <div key={questionIndex} className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Question {questionIndex + 1}:
                <input
                  type="text"
                  value={questionObj.questionText}
                  onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                  placeholder="Enter question"
                  className="block w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </label>

              {/* Button container for Remove Question and Add New Point */}
              <div className="flex items-center space-x-4 mt-2">
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove Question
                </button>
                
                {/* Button to add a new point to the question */}
                <button
                  type="button"
                  onClick={() => addNewPoint(questionIndex)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 "
                >
                  ➕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {questionObj.importantPoints.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-center space-x-4">
                    <label className="flex-1">
                      Important Point {pointIndex + 1}:
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(questionIndex, pointIndex, e.target.value)}
                        placeholder="Enter important point"
                        className="block w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </label>

                    {/* Button to remove a specific point */}
                    <button
                      type="button"
                      onClick={() => removePoint(questionIndex, pointIndex)}
                      className="bg-red-500 text-white px-4 mt-7 py-2 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Button to add a new question */}
          <button
            type="button"
            onClick={addNewQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add New Question
          </button>

          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-md shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
