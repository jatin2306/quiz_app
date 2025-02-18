import React from "react";

const Loader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <div className="text-center">
        <strong>Loading...</strong>
        <div className="spinner-border ms-2" role="status" aria-hidden="true"></div>
      </div>
    </div>
  );
};

export default Loader;
