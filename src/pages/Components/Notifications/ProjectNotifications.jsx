import { useEffect, useState } from "react";

const ProjectNotifications = ({
  apiUrl,
  height = "auto",
  emptyText = "No notifications available",
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (isMounted) setData(json || []);
      } catch (error) {
        if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        // silent handling – user not authorised / session expired
        console.warn("Unauthorized – session expired");
        return;
      }

      // other API errors (500, 404, etc.)
      console.warn("Attendance API error:", status);
    } else {
      // network / unexpected error
      console.warn("Network error while fetching attendance");
    }
       
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  if (loading) {
    return <div className="notification-loading">Loading…</div>;
  }

  if (!data.length) {
    return <div className="notification-empty">{emptyText}</div>;
  }

  return (
    <div className="notification-list" style={{ maxHeight: height }}>
      {data.map((item) => (
        <div
          key={item.id}
          className={`notification-item ${
            item.isHighlighted ? "highlighted" : ""
          }`}
        >
          <div className="notification-content">
            <h6 className="mb-1">{item.title}</h6>
            <p className="mb-0 text-muted">{item.description}</p>
          </div>
          <span className="notification-time">{item.timeAgo}</span>
        </div>
      ))}
    </div>
  );
};

export default ProjectNotifications;
