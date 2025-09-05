import { useState } from "react";
import RichEditor from "../components/RichEditor";
import FileUpload from "../components/FileUpload";
import { createPost } from "../utils/api";
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("News");
  const [subcategory, setSubcategory] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [meta, setMeta] = useState("");
  const [links, setLinks] = useState("");
  const [msg, setMsg] = useState("");
  function handleImage(url) { setImages(imgs => [...imgs, url]); }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createPost({
        title, category, subcategory, content,
        images, meta: meta.split(","), links: links.split(",")
      }, localStorage.getItem("token"));
      setMsg("Posted!");
    } catch (err) {
      setMsg("Error: " + (err.response?.data || err.message));
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option>News</option><option>Blog</option><option>Sports</option><option>Entertainment</option><option>Study</option><option>Workshop</option>
      </select>
      {category === "Study" && (
        <select value={subcategory} onChange={e=>setSubcategory(e.target.value)}>
          <option value="">Select Subcategory</option>
          <option>Competition</option>
          <option>12th Board</option>
          <option>10th Board</option>
        </select>
      )}
      <RichEditor value={content} setValue={setContent} />
      <FileUpload onUpload={handleImage} />
      {images.map(url => <img src={url} key={url} style={{maxWidth:150}} />)}
      <input value={meta} onChange={e=>setMeta(e.target.value)} placeholder="Meta tags (comma separated)" />
      <input value={links} onChange={e=>setLinks(e.target.value)} placeholder="Links (comma separated)" />
      <button type="submit">Create Post</button>
      <div>{msg}</div>
    </form>
  );
}
