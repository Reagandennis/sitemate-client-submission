import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ id: '', title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get('http://localhost:4000/issues');
      setIssues(res.data);
    } catch (error) {
      setError('Error fetching issues: ' + error.message);
      console.error('Error fetching issues:', error);
    }
  };

  const createIssue = async () => {
    try {
      const res = await axios.post('http://localhost:4000/issues', newIssue);
      setIssues([...issues, res.data]);
      setNewIssue({ id: '', title: '', description: '' });
    } catch (error) {
      setError('Error creating issue: ' + error.message);
      console.error('Error creating issue:', error);
    }
  };

  const updateIssue = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4000/issues/${id}`, newIssue);
      setIssues(issues.map(issue => (issue.id === id ? res.data : issue)));
      setNewIssue({ id: '', title: '', description: '' });
    } catch (error) {
      setError('Error updating issue: ' + error.message);
      console.error('Error updating issue:', error);
    }
  };

  const deleteIssue = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/issues/${id}`);
      setIssues(issues.filter(issue => issue.id !== id));
    } catch (error) {
      setError('Error deleting issue: ' + error.message);
      console.error('Error deleting issue:', error);
    }
  };

  return (
    <div>
      <h1>Issue Tracker</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="ID"
        value={newIssue.id}
        onChange={(e) => setNewIssue({ ...newIssue, id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Title"
        value={newIssue.title}
        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newIssue.description}
        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
      />
      <button onClick={createIssue}>Create Issue</button>

      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            {issue.title} - {issue.description}
            <button onClick={() => updateIssue(issue.id)}>Update</button>
            <button onClick={() => deleteIssue(issue.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
