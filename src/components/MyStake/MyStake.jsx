import React, { useEffect, useState } from "react";
import "./mystake.css";
import { useAccount, useSigner } from "wagmi";
import Web3 from "web3/dist/web3.min.js";
import erc20abi from "../../abis/ERC20.json";
import stakingabi from "../../abis/staking.json";
import { toast } from "react-toastify";
import moment from "moment/moment";
import Countdown from "react-countdown";
import Spinner from "react-bootstrap/Spinner";

const erc20_contract_address = import.meta.env.VITE_ERC20;
const staking_contract_address = import.meta.env.VITE_STAKING;

const MyStake = () => {
  const { data: signer } = useSigner();
  const { address, connector, isConnected } = useAccount();
  const [provider, setProvider] = useState("");
  const [StakerDetails, setStakerDetails] = useState({});
  const [NewDate, setNewDate] = useState("");
  const [countDownCompleted, setCountDownCompleted] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [currentReward, setCurrentReward] = useState(0);
  const [contractCurrentBalance, setContractCurrentBalance] = useState(0);
  const [rewardPenalty, setRewardPenalty] = useState("");

  const getStakeDetails = async () => {
    if (provider) {
      setisLoading(true);
      const web3 = new Web3(provider);
      window.contract = new web3.eth.Contract(
        stakingabi,
        staking_contract_address
      );
      let staker = await window.contract.methods.Details(address).call();
      // console.log(staker.stakeTime * 1000);

      const date = moment(staker.stakeTime);

      const newDate = moment(staker.stakeTime * 1000).add(
        staker.StakeMonth * 30,
        "minutes"
      );

      setNewDate(newDate);
      console.log(newDate);
      // console.log(newDate.diff(date));
      setStakerDetails(staker);
      setisLoading(false);
    }
  };
  const withdraw = async () => {
    if (provider) {
      setClaimLoading(true);
      const web3 = new Web3(provider);
      window.staking_contract = new web3.eth.Contract(
        stakingabi,
        staking_contract_address
      );
      await window.staking_contract.methods
        .WithdrawTokens(address)
        .send({ from: address })
        .on("transactionHash", async (hash) => {
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              window.location.reload(false);
              setClaimLoading(false);
              break;
            }

          }
        })
        .on("error", (error) => {
          toast("Something went wrong while Approving");
          setClaimLoading(false);
        });
    }
  };
  const claimReward = async () => {
    if (provider) {
      setClaimLoading(true);
      const web3 = new Web3(provider);
      window.staking_contract = new web3.eth.Contract(
        stakingabi,
        staking_contract_address
      );
      await window.staking_contract.methods
        .ClaimRewards(address)
        .send({ from: address })
        .on("transactionHash", async (hash) => {
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              window.location.reload(false);
              setClaimLoading(false);
              break;
            }

          }
        })
        .on("error", (error) => {
          toast("Something went wrong while Approving");
          setClaimLoading(false);
        });
    }
  };
  const getCurrentReward = async () => {

    // const web3 = new Web3(provider);
    const web3 = new Web3(provider);
    window.staking_contract = new web3.eth.Contract(
      stakingabi,
      staking_contract_address
    );

    let currentReward = await window.staking_contract.methods.viewRewards(address).call();


    setCurrentReward(Number(currentReward))


  };
  const getContractBalance = async () => {

    // const web3 = new Web3(provider);
    const web3 = new Web3(provider);
    window.erc20_contract = new web3.eth.Contract(
      erc20abi,
      erc20_contract_address
    );

    let contractCurrentBalance = await window.erc20_contract.methods.balanceOf(staking_contract_address).call();



    setContractCurrentBalance(Number(contractCurrentBalance))


  };
  const getRewardPenalty = async () => {

    // const web3 = new Web3(provider);
    const web3 = new Web3(provider);
    window.staking_contract = new web3.eth.Contract(
      stakingabi,
      staking_contract_address
    );

    let rewardPenalty = await window.staking_contract.methods.getTaxPenalty().call();


    console.log(rewardPenalty)
    setRewardPenalty(rewardPenalty.pen)

  };
  useEffect(() => {
    if (signer) {
      setProvider((signer?.provider).provider);
    }
  }, [signer]);

  useEffect(() => {
    getStakeDetails();
  }, [provider]);
  useEffect(() => {
    if (provider) {
      getContractBalance();
    }
  }, [provider]);
  useEffect(() => {
    if (provider) {
      getCurrentReward();
    }
  }, [provider]);

  useEffect(() => {
    if (provider) {
      getRewardPenalty();
    }
  }, [provider]);
  useEffect(() => {
    console.log(contractCurrentBalance);
    console.log(currentReward);
  }, [currentReward, contractCurrentBalance]);
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You can withdraw you tokens with reward!</span>;
    } else {
      // Render a countdown
      return (
        <div>
          <div>{days} Days</div>
          <div>{hours} Hours</div>
          <div>{minutes} Minutes</div>
          <div>{seconds} Seconds</div>
        </div>
      );
    }
  };

  return (
    <div className="home-content staking-home">
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="home-content-btn">
          {StakerDetails.check ? (
            <>
              <div className="allDetails">
                <div className="mobile-responsive">
                  <div className="left-side">
                    Your Stake:{" "}
                    {StakerDetails.depositTokens / 1000000000000000000}
                  </div>
                  <div className="left-side">
                    Your EarnPercentage: {StakerDetails.EarnPersentage}
                  </div>
                  <div className="left-side">
                    Your StakeMonth: {StakerDetails.StakeMonth}
                  </div>
                  <div className="left-side">
                    Your Stake Date and Time:{" "}
                    {moment(StakerDetails.stakeTime * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </div>
                </div>
                {/* <div className="left-side">Your Stake Time: {StakerDetails.stakeTime}</div> */}

                {/* <div className="right-side">Claimable Amount:</div> */}
              </div>
              <div className="timer">
                <Countdown date={NewDate} renderer={renderer} onComplete={e => {
                  setCountDownCompleted(true)
                }} />
              </div>
              <div className="timer">
                <div>
                  <div>  Rewards: {` `} {(currentReward / 1000000000000000000).toFixed(2)}   MTK  </div>

                </div>
              </div>
              {claimLoading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                contractCurrentBalance > 0 && contractCurrentBalance >= currentReward ?
                  <>
                    {!countDownCompleted ? <button onClick={claimReward} className="btn btn-lg ">
                      claim reward
                    </button> : <></>}
                    <button onClick={withdraw} className="btn btn-lg ">
                      Unstake and Claim reward
                    </button>
                    {rewardPenalty && rewardPenalty > 0 ?
                      <small>*Note: Unstaking before time will result in {rewardPenalty / 10}% penalty on reward
                      </small>
                      : <></>
                    }
                  </>
                  : <div className="timer">
                    <div>
                      <div> Claim Reward is not available right now. Please try again later!</div>

                    </div>
                  </div>
              )}
            </>
          ) : (
            <>Not Staked</>
          )}
        </div>
      )}
    </div>
  );
};

export default MyStake;
