import { useEffect, useState } from "react";
import axios from "axios";
export default function AdminPanel() {
  const [adsense, setAdsense] = useState("");
  const [seo, setSeo] = useState("");
  const [analytics, setAnalytics] = useState({visitors:[],days:[],earnings:0,impressions:0,clicks:0});
  useEffect(()=>{
    axios.get("http://localhost:4000/api/analytics",{headers:{Authorization:"Bearer "+localStorage.getItem("token")}})
      .then(res=>setAnalytics(res.data));
  },[]);
  function saveSettings() {
    alert("Settings saved! (demo)");
  }
  return (
    <div>
      <h2>Admin Settings</h2>
      <label>AdSense Code</label>
      <textarea value={adsense} onChange={e=>setAdsense(e.target.value)} />
      <label>SEO Meta Tag</label>
      <input value={seo} onChange={e=>setSeo(e.target.value)} />
      <button onClick={saveSettings}>Save</button>
      <div>
        <h3>Analytics</h3>
        <div>Today's Earnings: ₹{analytics.earnings}</div>
        <div>Impressions: {analytics.impressions}</div>
        <div>Clicks: {analytics.clicks}</div>
        <div>Visitors: {analytics.visitors.reduce((a,b)=>a+b,0)}</div>
        {/* Chart.js or recharts can be used for actual chart */}
      </div>
    </div>
  );
}
