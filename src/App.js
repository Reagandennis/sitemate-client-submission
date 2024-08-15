import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

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
      // Generate a new unique ID for the new issue
      const newId = issues.length > 0 ? Math.max(...issues.map(issue => issue.id)) + 1 : 1;
      const issueToCreate = { ...newIssue, id: newId };

      const res = await axios.post('http://localhost:4000/issues', issueToCreate);
      setIssues([...issues, res.data]);
      setNewIssue({ id: '', title: '', description: '' });
    } catch (error) {
      setError('Error creating issue: ' + error.message);
      console.error('Error creating issue:', error);
    }
  };

  const handleUpdateClick = (issue) => {
    // Prepopulate the form with the issue details to update
    setNewIssue(issue);
  };

  const updateIssue = async (id) => {
    try {
      console.log(`Attempting to update issue with ID: ${id}`); // Debugging: Log the ID being updated
      const res = await axios.put(`http://localhost:4000/issues/${id}`, newIssue);
      console.log('Update response:', res.data); // Debugging: Log the response
      setIssues(issues.map(issue => (issue.id === id ? res.data : issue)));
      setNewIssue({ id: '', title: '', description: '' });
    } catch (error) {
      setError('Error updating issue: ' + error.message);
      console.error('Error updating issue:', error);
    }
  };

  const deleteIssue = async (id) => {
    try {
      console.log(`Attempting to delete issue with ID: ${id}`); // Debugging: Log the ID being deleted
      const res = await axios.delete(`http://localhost:4000/issues/${id}`);
      setIssues(issues.filter(issue => issue.id !== id));
      console.log('Issue deleted successfully:', res.data); // Debugging: Log successful deletion
    } catch (error) {
      setError('Error deleting issue: ' + error.message);
      console.error('Error deleting issue:', error);
    }
  };

  return (
    <div className="container">
      <h1>Issue Tracker</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="ID"
        value={newIssue.id}
        onChange={(e) => setNewIssue({ ...newIssue, id: e.target.value })}
        disabled // Disable manual ID entry to avoid duplicate keys
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
      <button onClick={() => updateIssue(newIssue.id)}>Update Issue</button>

      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            {issue.title} - {issue.description}
            <div>
              <button onClick={() => handleUpdateClick(issue)}>Edit</button>
              <button onClick={() => deleteIssue(issue.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
