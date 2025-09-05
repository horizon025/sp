export default function Sidebar({ setCategory }) {
  return (
    <aside className="sidebar">
      <button onClick={()=>setCategory("Home")}>🏠 Home</button>
      <button onClick={()=>setCategory("Tech")}>🚀 Tech</button>
      <button onClick={()=>setCategory("Bollywood")}>🎬 Bollywood</button>
      <button onClick={()=>setCategory("Sports")}>⚽ Sports</button>
      <button onClick={()=>setCategory("Study")}>📚 Study</button>
      <button onClick={()=>setCategory("Workshop")}>🛠️ Workshop</button>
      <button onClick={()=>setCategory("Contact")}>📞 Contact</button>
      <button onClick={()=>setCategory("Recent")}>🕑 Recent</button>
    </aside>
  );
}
