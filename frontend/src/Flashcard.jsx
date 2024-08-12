// frontend/src/Flashcard.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';


const Card = styled.div`
  width: 300px;
  height: 200px;
  perspective: 1000px;
  margin-bottom: 20px;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;

  ${({ isFlipped }) => isFlipped && `
    transform: rotateY(180deg);
  `}
`;

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #f9f9f9;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #4CAF50;
  color: white;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
`;

const Flashcard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/flashcards')
      .then(response => setFlashcards(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((currentIndex + 1) % flashcards.length);
  };

  const handleBack = () => {
    setIsFlipped(false);
    setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);
  };

  if (flashcards.length === 0) {
    return <div>No Card Found!</div>;
  }

  const { question, answer } = flashcards[currentIndex];

  return (
    <div>
      <Card onClick={handleFlip}>
        <CardInner isFlipped={isFlipped}>
          <CardFront>
            {question}
          </CardFront>
          <CardBack>
            {answer}
          </CardBack>
        </CardInner>
      </Card>
      <button onClick={handleBack}>Back</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Flashcard;
