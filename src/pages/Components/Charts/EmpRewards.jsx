import { useEffect, useState } from "react";
import { axiosJWT } from "../../Auth/AddAuthorization";
import Profile from "../../rewards-management/profile";

const UpcomingLeaveTab = ({ upcomingLeave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [myReward, setReward] = useState([]);
  const [leaderBoards, setLeaderBoards] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalPoint, setRewardPoint] = useState(0);
  const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/reward/recievedReward`, { 
          params: { page: "0", limit: "10" } 
        });
        const responseLeaderBoards = await axiosJWT.get(`${apiUrl}/me/getDashboardDetails`, { 
          params: { isFor: "LeaderBoards"} 
        });

        const rewardPoint = await axiosJWT.get(`${apiUrl}/reward/rewardPoint`);

        setLeaderBoards(responseLeaderBoards.data.data);
        setReward(response.data.data);
        setRewardPoint(rewardPoint.data.data.totalPoints);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };
    fetchData();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (myReward.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % myReward.length);
      }, 3000); // Auto-slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [myReward]);

  return (
    <div className="col-12 col-md-12 custom_padding_wid_noti mt-3" id="leaderboard-emp-dashboard">
      <div className="row" id="emp-dashboard-rewards">
        <div className="col-12">
          <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
            <ul className="nav-tabs nav nav-tabs-bottom justify-content-center oxyem-graph-tab">
              <li className={`nav-item ${activeTab === 0 ? "active" : ""}`}>
                <a className="nav-link" onClick={() => setActiveTab(0)}>
                  <div className="skolrup-profile-tab-link">My Rewards</div>
                </a>
              </li>
              <li className={`nav-item ${activeTab === 1 ? "active" : ""}`}>
                <a className="nav-link" onClick={() => setActiveTab(1)}>
                  <div className="skolrup-profile-tab-link">Leader Board</div>
                </a>
              </li>
            </ul>

            <div>
              {activeTab === 0 && (
                <div id="rewardCarousel" className="carousel slide">
                  {/* Indicators */}
                  
                  <ol className="carousel-indicators">
                    {myReward.map((_, index) => (
                      <li
                        key={index}
                        className={index === activeSlide ? "active" : ""}
                        onClick={() => setActiveSlide(index)}
                      ></li>
                    ))}
                  </ol>

                  {/* Carousel Items */}
                  <div className="carousel-inner">
                  {totalPoint > 0 && (
                    <span className="total-point-emp-dashboard-reward mt-2">{totalPoint}</span>
                  )} 
                    {myReward.length > 0 ? (
                      myReward.map((reward, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${index === activeSlide ? "active" : ""}`}
                        >
                          <div className="text-center py-3">
                            <img src={reward.badgetsUrl} alt="award" className="img-fluid badget" />
                            <p className="fw-semibold mt-2">{reward.rewardType}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="carousel-item active">
  <p className="text-center mt-3">
    <span className="total-point-emp-dashboard-reward">{totalPoint}</span>
  </p>
</div>

                    )}
                  </div>
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 1 && (
                <>
                  {leaderBoards.length > 0 ? (
                    leaderBoards.map((leaderBoard, index) => (
                      <div className="widget_noti mt-2" key={index}>
                        <div className="row align-items-center">
                          <div className="col-9">
                            <div className="right-panel_w_r">
                              <div className="left-panel panel">
                                <Profile
                                  name={leaderBoard.employeeName}
                                  imageurl={`${baseImageUrl}/${leaderBoard.profilePicPath}` || ""}
                                  size={"30"}
                                  profilelink={`${leaderBoard.profilePicPath}` || ""}
                                  role={""}
                                  designation={leaderBoard.department}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-3 text-center">
                            <span className="leaderboard-point-emp-dashboard">{leaderBoard.totalPoints}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming leaves</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingLeaveTab;
