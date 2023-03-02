import React from "react";
import "./home.css";
import Navbar from "./Navbar/Navbar";

const Home = () => {
  return (
    <div>
      <div className="home-content">
        <h1>Welcome to Staking</h1>

        {/* <div className="home-content-btn">
          <button type="button" class="btn btn-lg btn-success">
            3M - 22% APY
          </button>
          <button type="button" class="btn btn-lg btn-success">
            6M - 25% APY
          </button>
          <button type="button" class="btn btn-lg btn-success">
            12M - 30% APY
          </button>
        </div> */}

        <div className="radio-btn">
          <form action="#">
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="radio1"
                name="optradio"
                value="option1"
              />
              <label class="form-check-label" for="radio1">
                3M - 22% APY
              </label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="radio2"
                name="optradio"
                value="option2"
              />
              <label class="form-check-label" for="radio2">
                6M - 25% APY
              </label>
            </div>

            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="radio3"
                name="optradio"
                value="option3"
              />
              <label class="form-check-label" for="radio3">
                12M - 30% APY
              </label>
            </div>
          </form>

          <form action="#">
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="radio4"
                name="optradio"
                value="option4"
              />
              <label class="form-check-label" for="radio4">
                100%
              </label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="radio5"
                name="optradio"
                value="option5"
              />
              <label class="form-check-label" for="radio5">
                75%
              </label>
            </div>

            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="radio6"
                name="optradio"
                value="option6"
              />
              <label class="form-check-label" for="radio6">
                50%
              </label>
            </div>
          </form>
        </div>

        <div className="input-fields">
          <form action="#">
            <div class="mb-3 mt-3">
              <label for="earning" class="form-label">
                Earning:
              </label>
              <input
                type="text"
                class="form-control"
                id="earning"
                placeholder="Earning"
                name="earning"
              />
            </div>
            <div class="mb-3">
              <label for="amount" class="form-label">
                Amount:
              </label>
              <input
                type="text"
                class="form-control"
                id="amount"
                placeholder="Amount to Stake"
                name="amount"
              />
            </div>

            <button type="submit" class="btn btn-primary">
              Stake
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
