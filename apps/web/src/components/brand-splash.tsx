'use client';
import { useState, useEffect } from 'react';

export function BrandSplash() {
  const [done, setDone] = useState(true);
  
  useEffect(() => {
    try { 
      if (!sessionStorage.getItem('pl_splash')) { 
        setDone(false); 
        sessionStorage.setItem('pl_splash','1'); 
      } 
    } catch {}
  }, []);

  if (done) return null;

  return (
    <div onClick={() => setDone(true)}
      style={{position:'fixed',inset:0,zIndex:9999,background:'#111418',display:'grid',placeItems:'center',
              animation:'plfade .5s ease 2.6s forwards'}}>
      <video src="/brand/parilink-logo-animation.mp4" autoPlay muted playsInline
        onEnded={() => setDone(true)} style={{width:'min(560px,80vw)',height:'auto'}} />
      <style>{`@keyframes plfade{to{opacity:0;visibility:hidden}}`}</style>
    </div>
  );
}
