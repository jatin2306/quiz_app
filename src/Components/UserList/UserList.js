import React from "react";
import Loader from "../Loader/Loader";

const UserList = ({ userData, loading }) => {
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-4">
          {userData.map((item, index) => (
            <div key={index} className="card mb-3 p-3">
              <div className="d-flex align-items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Profile Icon"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <div>
                  <h6 className="mb-0 text-primary">{item.username}</h6>

                  <p className="mb-1 text-muted">
                    {" "}
                    {JSON.parse(item.words).join(", ")}
                  </p>

                  <button className="btn btn-sm btn-info text-white">
                    SEE REMARKS {item.score}/ {item.total}
                  </button>
                </div>
                <div className="ms-auto">
                  <button className="btn btn-warning me-2">
                    Add to vocabulary
                  </button>
                  <button className="btn btn-danger me-1">🗑</button>
                  <button className="btn btn-outline-dark">💬</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserList;
