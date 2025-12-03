import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const useAutoLogout = () => {
  const router = useRouter();
  const timeoutRef = useRef(null); // ✅ persist timeout across renders

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          Cookies.remove('isViewAll');

      // ✅ Redirect to login page
      router.push("/login");
    }, 30 * 60 * 1000); // 30 minute
  };

  useEffect(() => {
    // ✅ Listen to activity events
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer(); // ✅ start the timer initially

    return () => {
      // ✅ Cleanup
      clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);
};

export default useAutoLogout;
