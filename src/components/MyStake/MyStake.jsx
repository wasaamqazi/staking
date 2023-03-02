import React from "react";
import "./mystake.css";

const MyStake = () => {
  return (
    <div className="home-content staking-home">
      <div className="home-content-btn">
        <div>
          <div className="left-side">Your Stake:</div>
          <div className="right-side">Claimable Amount:</div>
        </div>
        <button type="button" class="btn btn-lg ">
          claim reward
        </button>
      </div>
    </div>
  );
};

export default MyStake;
