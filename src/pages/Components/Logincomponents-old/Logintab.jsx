import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
export default function Logintab() {
  
  const router = useRouter();
  
  return (
    <>
    
        <h1>Welcome to SKOLRUP</h1>
        <ul className="nav nav-tabs nav-tabs-solid nav-justified">
        <li className={`nav-item ${router.pathname === '/' || router.pathname === '/Log-in' ? 'active' : ''}`}>
          <Link className="nav-link" href="/Log-in">
            Login
          </Link>
        </li>
        <li className={`nav-item ${router.pathname === '/Join-now' ? 'active' : ''}`}>
          <Link className="nav-link" href="/Join-now">
            Join now
          </Link>
        </li>
      </ul>
    </>
  )
}
