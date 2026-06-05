import API from '../../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import '../../styles/Mentor.css';

function StudentCommunication({ user }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchMyStudents(); }, []);

  useEffect(() => {
    if (selectedStudent) fetchMessages(selectedStudent.usn);
  }, [selectedStudent]);

  const fetchMyStudents = async () => {
    try {
      const res = await fetch(`${API}/applications`);
      const data = await res.json();
      setStudents(data.filter(a => a.status === 'Accepted' && a.mentorUsn === user?.usn));
    } catch { alert('Could not load students.'); }
  };

  const fetchMessages = async (usn) => {
    try {
      const res = await fetch(`${API}/mentor/messages/${usn}`);
      const data = await res.json();
      setMessages(data);
    } catch { setMessages([]); }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedStudent) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/mentor/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorUsn: user?.usn,
          studentUsn: selectedStudent.usn,
          message: newMessage.trim(),
        }),
      });
      const data = await res.text();
      if (data === 'Message sent') {
        setNewMessage('');
        fetchMessages(selectedStudent.usn);
      }
    } catch { alert('Error sending message.'); }
    finally { setSending(false); }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="page">
      <Header showNav={true} />
      <div className="mentor-container">
        <div className="page-header">
          <h2>Student Communication</h2>
          <button className="btn-back" onClick={() => navigate('/mentor/dashboard')}>← Back to Dashboard</button>
        </div>

        {students.length === 0 ? (
          <div className="empty-state"><p>No students assigned to you yet.</p></div>
        ) : (
          <div className="mentor-layout">

            {/* Student List */}
            <div className="student-list-panel">
              <h3>My Students</h3>
              {students.map(s => (
                <div
                  key={s._id}
                  className={`student-list-item ${selectedStudent?.usn === s.usn ? 'active' : ''}`}
                  onClick={() => setSelectedStudent(s)}
                >
                  <div className="student-list-avatar">{s.usn.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="student-list-usn">{s.usn}</p>
                    <p className="student-list-company">{s.company || s.internshipId?.company}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Panel */}
            <div className="chat-panel">
              {!selectedStudent ? (
                <div className="select-prompt"><p>← Select a student to send a message</p></div>
              ) : (
                <>
                  <div className="chat-header">
                    <div className="chat-avatar">{selectedStudent.usn.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3>{selectedStudent.usn}</h3>
                      <p>{selectedStudent.company || selectedStudent.internshipId?.company}</p>
                    </div>
                  </div>

                  <div className="chat-messages">
                    {messages.length === 0 ? (
                      <p className="no-messages">No messages yet. Send the first message!</p>
                    ) : (
                      messages.map(m => (
                        <div key={m._id} className="message-bubble">
                          <p className="message-text">{m.message}</p>
                          <p className="message-time">{formatDate(m.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="chat-input-area">
                    <textarea
                      className="chat-input"
                      rows="3"
                      placeholder="Type your message to the student..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <button className="btn-send" onClick={handleSend} disabled={sending || !newMessage.trim()}>
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCommunication;
