// Authentication logic (simple demo)
let user = null;
let userPassword = '';
let ADMIN_PASS = "horizonplus@2025";
function handleLoginSignup(e) {
  e.preventDefault();
  const uname = document.getElementById('loginUsername').value.trim();
  const pwd = document.getElementById('loginPassword').value;
  if(!uname || !pwd){ return false;}
  user = uname;
  userPassword = pwd;
  document.getElementById('loginStatus').textContent = "Logged in as " + user;
  document.getElementById('loginBtn').textContent = "Logged in";
  setTimeout(()=>{document.getElementById('loginStatus').textContent='';}, 2000);
  showAdminSection();
  return false;
}
function showAdminSection(){
  if(userPassword===ADMIN_PASS){
    document.getElementById('adminSection').classList.remove('hide');
  } else {
    document.getElementById('adminSection').classList.add('hide');
  }
}
function showCategory(cat) {
  document.querySelectorAll('.post-list').forEach(e => e.style.display = 'none');
  const id = "posts-" + cat;
  const el = document.getElementById(id);
  if(el) el.style.display = '';
  // Recent posts always show by default
  if(cat === 'Recent') document.getElementById('posts-Recent').style.display = '';
}
function toggleStudy(){
  let p = document.getElementById('studyParent');
  let g = document.getElementById('studyGroup');
  if(g.style.display==='none'){g.style.display=''; p.classList.add('expanded');}
  else {g.style.display='none'; p.classList.remove('expanded');}
}
function searchPosts() {
  const q = document.getElementById('searchBar').value.trim().toLowerCase();
  document.querySelectorAll('.post-list').forEach(list=>{
    Array.from(list.children).forEach(post=>{
      const text = post.innerText.toLowerCase();
      post.style.display = text.includes(q)?'':'none';
    });
  });
}
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
function submitSettingsPost(event) {
  event.preventDefault();
  if(!user || !userPassword){
    alert("Login/signup karen aur password set karen.");
    return false;
  }
  const inputPwd = document.getElementById('settingsPostPassword').value;
  if(inputPwd !== userPassword){
    alert("Password incorrect. Apne set password se hi post upload hogi.");
    return false;
  }
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
  // Category list
  const posts = document.getElementById("posts-" + cat);
  const recent = document.getElementById("posts-Recent");
  const el = document.createElement('div');
  el.className = 'blog-post';
  let metaHtml = metaTags ? `<div class="meta-tags">Meta: ${metaTags}</div>` : '';
  let linkHtml = '';
  if(links){
    linkHtml = `<div class="post-links">` + links.split(',').map(l=>`<a href="${l.trim()}" target="_blank">${l.trim()}</a>`).join('') + `</div>`;
  }
  let translateBtn = `<button class="translate" onclick="translatePost(this)">🌐 Translate</button>`;
  el.innerHTML = `<span class="category-tag">${cat}</span><h4>${title}</h4>${imgTag}<div class="post-content">${content}</div>${metaHtml}${linkHtml}${translateBtn}`;
  posts.prepend(el.cloneNode(true));
  recent.prepend(el);
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
function saveAdminSettings() {
  alert("Admin settings saved (demo, static only).");
}
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
document.addEventListener('keydown',function(e){if(e.key==="Escape") closeSettings();});
// Analytics Chart (demo)
window.onload = function(){
  if(window.Chart){
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{ label: 'Visitors', data: [120,180,150,200,170,250,300], backgroundColor: '#5a61ff' }]
      }
    });
  }
};
