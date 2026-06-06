import { useMemo, useState } from 'react';
import { Bot, MapPin, Send, Sparkles } from 'lucide-react';
import { college } from '../utils/college';

const quickQuestions = [
  'College route epudi poganum?',
  'Bus and train route sollu',
  'College facilities enna irukku?',
  'Fees doubt irukku',
  'Admission process sollu',
  'Attendance doubt clear pannu',
  'Marks and GPA epudi calculate aagum?'
];

function answerFor(message) {
  const text = message.toLowerCase();

  if (text.includes('route') || text.includes('bus') || text.includes('train') || text.includes('poganum') || text.includes('location')) {
    return `Campus route: ${college.name} is at ${college.address}. From Chennai Central, take Metro/train towards Guindy/Thiruvanmiyur side, then bus/cab via OMR to Thoraipakkam. From Tambaram, take bus/cab via Velachery and Pallikaranai to Thoraipakkam. Landmark: Rajiv Gandhi Salai OMR, near Thoraipakkam signal.`;
  }

  if (text.includes('facility') || text.includes('facilities') || text.includes('library') || text.includes('lab') || text.includes('hostel')) {
    return 'Facilities: digital classrooms, computer labs, science labs, library, seminar hall, placement cell, sports area, cafeteria, transport support, student help desk, attendance and fee office. For department-specific lab details, choose the department in Courses/Students and ask the office.';
  }

  if (text.includes('fee') || text.includes('fees') || text.includes('payment') || text.includes('receipt')) {
    return 'Fees help: Go to Fees page, select student, amount, status PAID/UNPAID, then choose Cash or Online Payment for paid entries. After saving, click view/receipt button to download the official receipt.';
  }

  if (text.includes('admission') || text.includes('join') || text.includes('apply')) {
    return 'Admission process: collect application form, submit marksheet, TC, community certificate if applicable, Aadhaar copy, passport photo, and contact details. Admin can add the student in Students page after verification.';
  }

  if (text.includes('attendance') || text.includes('present') || text.includes('absent')) {
    return 'Attendance help: Open Attendance page, select date, then mark Present or Absent for each student. The dashboard calculates attendance percentage based on marked records.';
  }

  if (text.includes('mark') || text.includes('marks') || text.includes('gpa') || text.includes('grade')) {
    return 'Marks help: First add student and course/group. Then open Marks page, select student, select course/group, enter internal and external marks, and save. GPA and grade are calculated automatically.';
  }

  if (text.includes('contact') || text.includes('phone') || text.includes('email')) {
    return `Contact: ${college.phone}, ${college.email}. Website: ${college.website}. Address: ${college.address}.`;
  }

  return 'I can help with route, facilities, admission, fees, attendance, marks, GPA, receipts, and contact details. Try asking: "BA Tamil facilities?", "fees receipt epudi download?", or "college route from Tambaram".';
}

export default function AIGuide() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi, I am the ${college.shortName} AI Guide. Ask about route, facilities, admission, fees, attendance, marks, or receipts.`
    }
  ]);
  const [input, setInput] = useState('');

  const routeLink = useMemo(() => {
    const query = encodeURIComponent(college.address);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, []);

  const ask = (question = input) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((old) => [...old, { role: 'user', text: clean }, { role: 'assistant', text: answerFor(clean) }]);
    setInput('');
  };

  return (
    <div className="page">
      <div className="toolbar">
        <div>
          <h2>AI College Guide</h2>
          <p>Route guidance, facilities, and common student doubts in one place.</p>
        </div>
        <a className="btn btn-outline-primary" href={routeLink} target="_blank" rel="noreferrer">
          <MapPin size={18} /> Open Map
        </a>
      </div>

      <div className="ai-grid">
        <div className="panel guide-panel">
          <div className="guide-hero">
            <Sparkles size={24} />
            <div>
              <h3>{college.name}</h3>
              <p>{college.address}</p>
              <small>{college.phone} | {college.email}</small>
            </div>
          </div>

          <h4>Quick Questions</h4>
          <div className="quick-list">
            {quickQuestions.map((question) => (
              <button type="button" className="btn btn-light" key={question} onClick={() => ask(question)}>
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="panel chat-panel">
          <div className="chat-header">
            <Bot size={22} />
            <div>
              <h3>Student Help Chat</h3>
              <small>Works offline with college-specific guidance.</small>
            </div>
          </div>
          <div className="chat-window">
            {messages.map((message, index) => (
              <div className={`chat-bubble ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); ask(); }}>
            <input
              className="form-control"
              value={input}
              placeholder="Type your doubt here..."
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="btn btn-primary" type="submit"><Send size={18} /> Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
