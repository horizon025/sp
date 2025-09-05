import { useRef } from "react";

export default function FileUpload({ onUpload }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    fetch("/api/upload", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => onUpload(data.url));
  }

  return (
    <div>
      <input type="file" accept="image/*" ref={inputRef} onChange={handleChange} />
    </div>
  );
}
