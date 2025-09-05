import { useState } from "react";
import FileUpload from "./FileUpload";
const workshopSubs = [
  "Cafe", "Website Building", "Dropshipping", "Affiliate Marketing", "Content Writing", "Editing", "Other"
];
const studySubs = ["Competition", "12th Board", "10th Board"];
const categories = [
  "Home", "News", "Live", "Study", "Workshop", "Extra", "Contact"
];
export default function BlogEditor({ onPost }) {
  const [category, setCategory] = useState("Home");
  const [subcategory, setSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState("");
  const [links, setLinks] = useState("");
  const [images, setImages] = useState([]);
  const [password, setPassword] = useState("");
  function handleImage(url) { setImages(imgs => [...imgs, url]); }
  function handleSubmit(e) {
    e.preventDefault();
    if (!password) return alert("Password required!");
    onPost({ category, subcategory, title, content, meta, links, images });
    setTitle(""); setContent(""); setMeta(""); setLinks(""); setImages([]);
  }
  return (
    <form onSubmit={handleSubmit}>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>
      {(category === "Study") && (
        <select value={subcategory} onChange={e=>setSubcategory(e.target.value)}>
          <option value="">Select Subcategory</option>
          {studySubs.map(sub => <option key={sub}>{sub}</option>)}
        </select>
      )}
      {(category === "Workshop") && (
        <select value={subcategory} onChange={e=>setSubcategory(e.target.value)}>
          <option value="">Select Subcategory</option>
          {workshopSubs.map(sub => <option key={sub}>{sub}</option>)}
        </select>
      )}
      {(category === "Extra") && (
        <input value={subcategory} onChange={e=>setSubcategory(e.target.value)} placeholder="Extra section name" />
      )}
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" required />
      <FileUpload onUpload={handleImage} />
      {images.map(url => <img src={url} key={url} style={{maxWidth:150}} />)}
      <input value={meta} onChange={e=>setMeta(e.target.value)} placeholder="Meta tags (comma separated)" />
      <input value={links} onChange={e=>setLinks(e.target.value)} placeholder="Links (comma separated)" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required minLength={3} />
      <button type="submit">Create Post</button>
    </form>
  );
}
