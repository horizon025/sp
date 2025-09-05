import { useState } from "react";
import axios from "axios";
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Home");
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState("");
  const [links, setLinks] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  // Dummy: login for demo
  function doLogin() {
    axios.post("http://localhost:4000/api/login", {username:"admin",password}).then(res=>setToken(res.data.token));
  }
  function handleImage(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    axios.post("http://localhost:4000/api/upload", formData).then(res=>setImage(res.data.url));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if(!token){setMsg("Login required"); return;}
    await axios.post("http://localhost:4000/api/posts",
      {
        title, category, content,
        image, meta: meta.split(","), links: links.split(",")
      },
      {headers:{Authorization:"Bearer "+token}}
    );
    setMsg("Posted!");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        {["Home","Tech","Bollywood","Sports","Study","Workshop","Contact"].map(cat=>
          <option key={cat}>{cat}</option>
        )}
      </select>
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" rows={6} />
      <input value={meta} onChange={e=>setMeta(e.target.value)} placeholder="Meta (comma separated)" />
      <input value={links} onChange={e=>setLinks(e.target.value)} placeholder="Links (comma separated)" />
      <input type="file" accept="image/*" onChange={handleImage} />
      {image && <img src={`http://localhost:4000${image}`} style={{maxWidth:120}} />}
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password for post upload" required />
      <button type="button" onClick={doLogin}>Login</button>
      <button type="submit">Upload Post</button>
      <div>{msg}</div>
    </form>
  );
}
