import { useEffect, useState, useRef } from "react";
import "./Chat.css";

function Chat({ jobId }) {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {

  if (!jobId || !user.id) return;

  fetch(`${process.env.REACT_APP_API}/messages/${jobId}/${user.id}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) setMessages(data);
    });

  const ws = new WebSocket(
    `${process.env.REACT_APP_API.replace('https://', 'wss://')}/ws/chat/${jobId}/${user.id}/${user.id}`
  );

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setMessages(prev => [...prev, data]);
  };

  socketRef.current = ws;

  return () => ws.close();

}, [jobId, user.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {

    const ws = socketRef.current;

    if (!text) return;

    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({ text }));

    setText("");
  };

  return (

    <div className="chat-container">

      <div className="chat-header">

        <img
          className="chat-avatar"
          src={
            user.gender === "female"
            ? "/female.png"
            : "/male.png"
          }
          alt="avatar"
        />

        <div>
          <div className="chat-name">
            HR Manager
          </div>
        </div>

      </div>

      <div className="chat-box">

        {messages.length === 0 && (

          <div className="chat-empty">

            <div className="chat-empty-card">

              <p>Bu yerda hali xabar yo‘q</p>

              <span>
                HR xodimi bilan bog‘lanish uchun Rezyume yuboring
              </span>

            </div>

          </div>

        )}

        {messages.map((m,i)=>(

          <div
            key={i}
            className={
              m.sender_id === user.id
              ? "message my-message"
              : "message other-message"
            }
          >

            <div>{m.text}</div>

            <div className="message-time">
              {m.time}
            </div>

          </div>

        ))}

        <div ref={endRef}></div>

      </div>

      <div className="chat-input-area">

        <input
          className="chat-input"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Message..."
        />

        <button
          className="chat-send-btn"
          onClick={sendMessage}
        >
          ➤
        </button>

      </div>

    </div>

  );

}

export default Chat;