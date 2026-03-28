import { useEffect, useState, useRef } from "react";
import "./EmployerChat.css";

function EmployerChat() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const endRef = useRef(null);


  // LOAD EMPLOYER JOBS
  useEffect(() => {
    fetch(`http://localhost:8000/employer/jobs/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        if (data.length > 0) setSelectedJob(data[0]);
      });
  }, [user.id]);


  // LOAD WORKERS
  useEffect(() => {
    if (!selectedJob) return;
    fetch(`http://localhost:8000/chat/workers/${selectedJob.id}`)
      .then(res => res.json())
      .then(setWorkers);
  }, [selectedJob]);


  // LOAD CHAT
 useEffect(() => {
  if (!selectedWorker || !selectedJob) return;

  fetch(`http://localhost:8000/messages/${selectedJob.id}/${selectedWorker.worker_id}`)
    .then(res => res.json())
    .then(setMessages);
// 🔔 YANGI QO'SHILGAN QATOR
 fetch(`http://localhost:8000/messages/seen/${selectedJob.id}/${selectedWorker.worker_id}`, {
  method: "PUT"
}).then(() => {
  window.dispatchEvent(new Event("notif_update"));
});
  const ws = new WebSocket(
    `ws://localhost:8000/ws/chat/${selectedJob.id}/${selectedWorker.worker_id}/${user.id}`
  );

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setMessages(prev => [...prev, data]);
  };

  socketRef.current = ws;

  return () => ws.close();

}, [selectedWorker, selectedJob, user.id]);


  // SEND MESSAGE
  const sendMessage = () => {
    const ws = socketRef.current;
    if (!text) return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ text }));
    setText("");
  };


  // AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


 return (
  <div className="chat-page">
    <div className="chat-layout">

      {/* JOBS */}
      <div className="jobs-panel">
        <h3>Active Jobs</h3>
        {jobs.map(job => (
          <div
            key={job.id}
            className={selectedJob?.id === job.id ? "job-item active" : "job-item"}
            onClick={() => {
              setSelectedJob(job);
              setSelectedWorker(null);
              setMessages([]);
            }}
          >
            {job.title}
          </div>
        ))}
      </div>

      {/* WORKERS */}
      <div className="workers-panel">
        <h3>Applicants</h3>
        {workers.map(w => (
          <div
            key={w.worker_id}
            className={selectedWorker?.worker_id === w.worker_id ? "worker active" : "worker"}
            onClick={() => setSelectedWorker(w)}
          >
            <div className="avatar">{w.name?.charAt(0)}</div>
            <div>
              <div className="worker-name">{w.name}</div>
              <div className="worker-status">Accepted</div>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div className="chat-panel">

        <div className="chat-header">
          {selectedWorker ? selectedWorker.name : "Select a worker"}
        </div>

        <div className="chat-body">

          <div className="chat-messages">
            {!selectedWorker && (
              <div className="empty-chat">
                Select a worker to start chatting
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender_id === user.id ? "message my" : "message other"}
              >
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
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
            />

            <button onClick={sendMessage}>➤</button>
          </div>

        </div>

      </div>

    </div>
  </div>
);

}

export default EmployerChat;