import { useEffect, useState, useRef } from "react";
import "./EmployerChat.css";

function EmployerChat() {

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!user.id) return;
    fetch(`${process.env.REACT_APP_API}/employer/jobs/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        setJobs(data);
        if (data.length > 0) setSelectedJob(data[0]);
      });
  }, [user.id]);

  useEffect(() => {
    if (!selectedJob) return;
    fetch(`${process.env.REACT_APP_API}/chat/workers/${selectedJob.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setWorkers(data);
      });
  }, [selectedJob]);

  useEffect(() => {
    if (!selectedWorker || !selectedJob || !user.id) return;

    fetch(`${process.env.REACT_APP_API}/messages/${selectedJob.id}/${selectedWorker.worker_id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      });

    fetch(`${process.env.REACT_APP_API}/messages/seen/${selectedJob.id}/${selectedWorker.worker_id}`, {
      method: "PUT"
    }).then(() => {
      window.dispatchEvent(new Event("notif_update"));
    });

    const ws = new WebSocket(
      `${process.env.REACT_APP_API.replace('https://', 'wss://')}/ws/chat/${selectedJob.id}/${selectedWorker.worker_id}/${user.id}`
    );

    ws.onopen = () => {
      socketRef.current = ws;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    ws.onerror = (e) => {
      console.error("WebSocket xato:", e);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };

  }, [selectedWorker, selectedJob, user.id]);

  const sendMessage = () => {
    const ws = socketRef.current;
    if (!text.trim()) return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ text }));
    setText("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 return (
  <div className="chat-page">
    <div className="chat-layout">

      <div className="jobs-panel">
        <h3>Faol ishlar</h3>
        {jobs.length === 0 && <div className="empty-panel">Ishlar topilmadi</div>}
        {jobs.map(job => (
          <div
            key={job.id}
            className={selectedJob?.id === job.id ? "job-item active" : "job-item"}
            onClick={() => { setSelectedJob(job); setSelectedWorker(null); setMessages([]); }}
          >
            {job.title}
          </div>
        ))}
      </div>

      <div className="workers-panel">
        <h3>Nomzodlar</h3>
        {workers.length === 0 && <div className="empty-panel">Nomzodlar topilmadi</div>}
        {workers.map(w => (
          <div
            key={w.worker_id}
            className={selectedWorker?.worker_id === w.worker_id ? "worker active" : "worker"}
            onClick={() => setSelectedWorker(w)}
          >
            <div className="avatar">{w.name?.charAt(0)}</div>
            <div>
              <div className="worker-name">{w.name}</div>
              <div className="worker-status">Qabul qilingan</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-panel">
        <div className="chat-header">
          {selectedWorker ? (
            <div className="chat-header-info">
              <div className="chat-header-avatar">{selectedWorker.name?.charAt(0)}</div>
              <div>
                <div className="chat-header-name">{selectedWorker.name}</div>
                <div className="chat-header-status">Onlayn</div>
              </div>
            </div>
          ) : (
            <span className="chat-header-placeholder">Xodimni tanlang</span>
          )}
        </div>

        {/* ← chat-body YO'Q, to'g'ridan chat-messages */}
        <div className="chat-messages">
          {!selectedWorker && (
            <div className="empty-chat">
              <div className="empty-chat-icon">💬</div>
              <p>Suhbat boshlash uchun xodimni tanlang</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.sender_id === user.id ? "message my" : "message other"}>
              <div className="bubble">{m.text}</div>
              <div className="time">{m.time}</div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>

        <div className="chat-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Xabar yozing..."
            disabled={!selectedWorker}
          />
          <button onClick={sendMessage} disabled={!selectedWorker}>➤</button>
        </div>

      </div>
    </div>
  </div>
);
}

export default EmployerChat;