// src/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/flashcards')
      .then(response => setFlashcards(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleAdd = () => {
    axios.post('http://localhost:5000/flashcards', { question: newQuestion, answer: newAnswer })
      .then(response => {
        setFlashcards([...flashcards, response.data]);
        setNewQuestion('');
        setNewAnswer('');
      })
      .catch(error => console.error('Error adding flashcard:', error));
  };

  const handleEdit = (id, question, answer) => {
    setEditingId(id);
    setEditQuestion(question);
    setEditAnswer(answer);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/flashcards/${editingId}`, { question: editQuestion, answer: editAnswer })
      .then(response => {
        setFlashcards(flashcards.map(fc => fc.id === editingId ? { ...fc, question: editQuestion, answer: editAnswer } : fc));
        setEditingId(null);
        setEditQuestion('');
        setEditAnswer('');
      })
      .catch(error => console.error('Error updating flashcard:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/flashcards/${id}`)
      .then(response => {
        setFlashcards(flashcards.filter(fc => fc.id !== id));
      })
      .catch(error => console.error('Error deleting flashcard:', error));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-form">
        <h2>{editingId ? 'Edit Flashcard' : 'Add Flashcard'}</h2>
        <input
          type="text"
          value={editingId ? editQuestion : newQuestion}
          onChange={(e) => editingId ? setEditQuestion(e.target.value) : setNewQuestion(e.target.value)}
          placeholder="Question"
        />
        <input
          type="text"
          value={editingId ? editAnswer : newAnswer}
          onChange={(e) => editingId ? setEditAnswer(e.target.value) : setNewAnswer(e.target.value)}
          placeholder="Answer"
        />
        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="flashcard-list">
        <h2>Flashcards</h2>
        <ul>
          {flashcards.map(fc => (
            <li key={fc.id} className="flashcard-item">
              <div>
                <strong>Question:</strong> {fc.question} <br />
                <strong>Answer:</strong> {fc.answer} <br />
                <button onClick={() => handleEdit(fc.id, fc.question, fc.answer)}>Edit</button>
                <button onClick={() => handleDelete(fc.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
