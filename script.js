// Category-wise post show/hide logic
function showCategory(cat) {
  document.querySelectorAll('.post-list').forEach(e => e.style.display = 'none');
  const id = "posts-" + cat;
  const el = document.getElementById(id);
  if(el) el.style.display = '';
}
function toggleStudy(){
  let p = document.getElementById('studyParent');
  let g = document.getElementById('studyGroup');
  if(g.style.display==='none'){g.style.display=''; p.classList.add('expanded');}
  else {g.style.display='none'; p.classList.remove('expanded');}
}
// Search posts
function searchPosts() {
  const q = document.getElementById('searchBar').value.trim().toLowerCase();
  document.querySelectorAll('.post-list').forEach(list=>{
    Array.from(list.children).forEach(post=>{
      const text = post.innerText.toLowerCase();
      post.style.display = text.includes(q)?'':'none';
    });
  });
}
// Image preview
function settingsPreviewImg(e) {
  const file = e.target.files[0];
  const img = document.getElementById('settingsImgPreview');
  if (file) {
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
}
// Rich editor (basic)
function formatDoc(cmd, val=null){
  document.execCommand(cmd,false,val);
  document.getElementById('editor').focus();
}
// Post submit
function submitSettingsPost(event) {
  event.preventDefault();
  const cat = document.getElementById('settingsCategorySelect').value;
  const title = document.getElementById('settingsPostTitle').value;
  const content = document.getElementById('editor').innerHTML;
  const imgInput = document.getElementById('settingsPostImage');
  const metaTags = document.getElementById('settingsMetaTags').value;
  const links = document.getElementById('settingsLinks').value;
  let imgTag = '';
  if(imgInput.files[0]){
    const url = URL.createObjectURL(imgInput.files[0]);
    imgTag = `<img src="${url}">`;
  }
  const posts = document.getElementById("posts-" + cat);
  const el = document.createElement('div');
  el.className = 'blog-post';
  let metaHtml = metaTags ? `<div class="meta-tags">Meta: ${metaTags}</div>` : '';
  let linkHtml = '';
  if(links){
    linkHtml = `<div class="post-links">` + links.split(',').map(l=>`<a href="${l.trim()}" target="_blank">${l.trim()}</a>`).join('') + `</div>`;
  }
  let translateBtn = `<button class="translate" onclick="translatePost(this)">🌐 Translate</button>`;
  el.innerHTML = `<span class="category-tag">${cat}</span><h4>${title}</h4>${imgTag}<div class="post-content">${content}</div>${metaHtml}${linkHtml}${translateBtn}`;
  posts.prepend(el);
  resetSettingsPostForm();
  closeSettings();
  alert("Post uploaded!");
}
function resetSettingsPostForm() {
  document.getElementById('settingsPostForm').reset();
  document.getElementById('settingsImgPreview').style.display = 'none';
  document.getElementById('editor').innerHTML = '';
}
function openSettings() {
  document.getElementById('settingsModal').classList.add('open');
}
function closeSettings() {
  document.getElementById('settingsModal').classList.remove('open');
}
// Google Translate demo (EN->HI)
function translatePost(btn){
  let postBox = btn.closest('.blog-post');
  let contentDiv = postBox.querySelector('.post-content');
  if(!contentDiv) return;
  let text = contentDiv.innerText;
  btn.disabled = true;
  btn.textContent = "Translating...";
  fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`)
    .then(r=>r.json())
    .then(res=>{
      contentDiv.innerHTML = res.responseData.translatedText;
      btn.textContent = "🌐 Hindi";
      btn.onclick=function(){reverseTranslate(contentDiv, text, btn);}
    })
    .catch(_=>{
      btn.textContent = "Error";
    });
}
function reverseTranslate(contentDiv, original, btn){
  contentDiv.innerHTML = original;
  btn.textContent = "🌐 Translate";
  btn.onclick = function(){translatePost(btn);}
}
document.addEventListener('keydown',function(e){
  if(e.key==="Escape") closeSettings();
});
