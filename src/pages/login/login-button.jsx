import Image from 'next/image'
import axios from "axios";
import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function LoginButton() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);

    function waitForCookie(cookieName, timeout = 3000, interval = 100) {
    return new Promise((resolve, reject) => {
      const maxTries = timeout / interval;
      let attempts = 0;
  
      const check = () => {
        const value = Cookies.get(cookieName);
        if (value) {
          resolve(value);
        } else if (++attempts >= maxTries) {
          reject(new Error('Cookie not set in time.'));
        } else {
          setTimeout(check, interval);
        }
      };
  
      check();
    });
  }
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Popup login — no redirect
      const loginResponse = await instance.loginPopup({
        scopes: ["openid", "profile", "email"],  // removed invalid scope
      });

      const account = loginResponse.account;
      instance.setActiveAccount(account);

      // Acquire token silently if needed
      const tokenResponse = await instance.acquireTokenSilent({
        account,
        scopes: ["openid", "profile", "email"],
      });

      const idToken = tokenResponse.idToken;

      // Prepare payload (hardcode authorityType)
      const payload = {
        authorityType: loginResponse.account.authorityType,
        environment: loginResponse.account.environment,
        idToken,
        username: account.username,
        loginResponse: {
        ...loginResponse,
      },
      };

      // Call your API
      const response = await axios.post(`${apiUrl}/users/login`, payload)
      if (response.status !== 200) {
        throw new Error("API request failed");
      }
const refreshTokenName = 'refreshToken';
        const refreshTokenDays = 7;
        const refreshTokenValue = response.data.refreshToken;
        const isViewAllName = 'isViewAll';
        const isViewAllDays = 7;
        const isViewAllValue = response.data.isViewAll;

        const accessTokenName = 'accessToken';
        const accessTokenMinutes = 20;
        const accessTokenValue = response.data.accessToken;

        // Set cookies
        Cookies.set(accessTokenName, accessTokenValue, {
          secure: true,
          path: '/',
          expires: new Date(Date.now() + accessTokenMinutes * 60 * 1000), // 20 minutes
        });

        Cookies.set(refreshTokenName, refreshTokenValue, {
          secure: true,
          path: '/',
          expires: new Date(Date.now() + refreshTokenDays * 24 * 60 * 60 * 1000), // 7 days
        });

        Cookies.set(isViewAllName, isViewAllValue, {
          secure: true,
          path: '/',
          expires: new Date(Date.now() + isViewAllDays * 24 * 60 * 60 * 1000), // 7 days
        });
        // Wait for cookie and redirect
        try {
          await waitForCookie('accessToken');
          const target = isViewAllValue ? '/admin/user-list' : '/employeeDashboard';
          router.push(target); // or router.replace(target)
        } catch (err) {
          console.error('Access token was not set in time', err);
        }
    } catch (error) {
      console.error("Login or API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  <div className="sk-striped"
     style={{
        display: 'flex',
        justifyContent:'center',
        marginTop:'33px',
        alignItems:'center'
      }}
      >
      <span className="sk-striped-line"
      style={{
        flex:'auto',
        height:'1px',
        background:'#ddd'
      }}
      ></span>
      <span className="sk-striped-text"
      style={{
        fontSize:'12px',
        fontWeight:700,
        margin:'0px 10px'
      }}>OR</span>
      <span className="sk-striped-line"
       style={{
        flex:'auto',
        height:'1px',
        background:'#ddd'
      }}></span>
    </div>
    <button
      onClick={handleLogin}
      disabled={loading}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isHover && !loading ? '#004d95' : '#eee',
        color: isHover && !loading ? '#ffffff' : '#000000',
        fontSize:'12px',
        padding:'7px',
        border: 'none',
        borderRadius: '5px',
        fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'background-color 0.3s',
        width: '100%',
        marginTop: '20px'
      }}
    >
      <Image
        src="/assets/img/microsoft.png"
        alt="Logo"
        width={23}
        height={23}
        objectFit='contain'
        style={{
          marginRight: '7px'
        }}
      />
      {loading ? "Logging in..." : "Sign in with Microsoft"}
    </button>
	</>
  );
}
