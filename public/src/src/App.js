import React, { useState, useEffect } from "react";
import { auth, provider, db, storage } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [youtube, setYoutube] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const adminEmail = "hpareek005@gmail.com";

  useEffect(() => {
    const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setClasses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
    } catch (e) {
      alert(e.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const uploadClass = async () => {
    if (!title) return alert("Enter title");
    let notesUrl = "";
    if (pdfFile) {
      const storageRef = ref(storage, `notes/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(storageRef, pdfFile);
      notesUrl = await getDownloadURL(storageRef);
    }
    await addDoc(collection(db, "classes"), {
      title,
      youtube,
      notesUrl,
      createdAt: serverTimestamp(),
      createdBy: user ? user.email : null
    });
    setTitle(""); setYoutube(""); setPdfFile(null);
    alert("Uploaded ✅");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎓 PDUSU EDUCATION</h1>
        <div>
          {!user ? (
            <button className="btn btn-blue" onClick={login}>Sign in with Google</button>
          ) : (
            <>
              <span className="small">Hello, {user.displayName}</span>
              <button style={{marginLeft:8}} className="btn btn-gray" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>

      {user && user.email === adminEmail && (
        <div className="card">
          <h3>Upload New Class</h3>
          <input className="input" placeholder="Class title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" placeholder="YouTube link" value={youtube} onChange={e=>setYoutube(e.target.value)} />
          <input className="file" type="file" accept=".pdf" onChange={e=>setPdfFile(e.target.files[0])} />
          <button className="btn btn-blue" onClick={uploadClass}>Upload</button>
        </div>
      )}

      <div style={{marginTop:20}}>
        <h2>Classes</h2>
        {classes.length === 0 && <div className="card">No classes yet.</div>}
        {classes.map(c=>(
          <div key={c.id} className="card">
            <h3>{c.title}</h3>
            {c.youtube && <a href={c.youtube} target="_blank" rel="noreferrer">Watch Video</a>}
            {c.notesUrl && <div><a href={c.notesUrl} target="_blank" rel="noreferrer">Download Notes (PDF)</a></div>}
            <div className="small">Uploaded by: {c.createdBy || "unknown"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
