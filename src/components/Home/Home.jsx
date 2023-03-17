import React, { useEffect, useState } from "react";
import "./home.css";
import { useAccount, useSigner } from "wagmi";
import Web3 from "web3/dist/web3.min.js";
import erc20abi from "../../abis/ERC20.json";
import stakingabi from "../../abis/staking.json";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, useNavigate } from "react-router-dom";

const erc20_contract_address = import.meta.env.VITE_ERC20;
const staking_contract_address = import.meta.env.VITE_STAKING;

const Home = () => {
  const navigate = useNavigate()
  const { data: signer } = useSigner();
  const { address, connector, isConnected } = useAccount();
  const [provider, setProvider] = useState("");
  const [months, setMonths] = useState("");
  const [amountKeepPercent, setAmountKeepPercent] = useState("");
  const [balance, setBalance] = useState("");
  const [allowance, setAllowance] = useState("");
  const [amount, setAmount] = useState("");
  const [ContractMonths, setContractMonths] = useState([]);
  const [StakerDetails, setStakerDetails] = useState({});
  const [loadingState, setLoadingState] = useState(false);
  const [approveloading, setapproveloading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [currentReward, setCurrentReward] = useState("");

  const getStakeDetails = async () => {
    setLoadingState(true);
    if (provider) {
      const web3 = new Web3(provider);
      window.contract = new web3.eth.Contract(
        stakingabi,
        staking_contract_address
      );
      let staker = await window.contract.methods.Details(address).call();

      setStakerDetails(staker);
      setLoadingState(false);
    }
  };
  const getCurrentBalance = async () => {
    setLoadingState(true);
    if (provider) {
      const web3 = new Web3(provider);
      window.mint_contract = new web3.eth.Contract(
        erc20abi,
        erc20_contract_address
      );
      let balanceToken = await window.mint_contract.methods
        .balanceOf(address)
        .call();
      let Allowance = await window.mint_contract.methods
        .allowance(address, staking_contract_address)
        .call();
      setBalance(balanceToken);
      setAllowance(Allowance);
      setLoadingState(false);
    }
  };

  const validation = () => {
    let error = false;
    if (amount == "" || amount == undefined || amount == null || amount == 0) {
      if (amount == 0) {
        toast("please select amount greater than 0");
      } else {
        toast("please select amount");
      }
      error = true;
    }
    if (months == "" || months == undefined || months == null) {
      toast("please select months");
      error = true;
    }

    if (
      amountKeepPercent == "" ||
      amountKeepPercent == undefined ||
      amountKeepPercent == null
    ) {
      toast("please select Percentage you want to keep");
      error = true;
    }
    if (address == "" || address == undefined || address == null) {
      toast("Please Connect Wallet First", { toastId: "pleaseconnectwallet" });
      error = true;
    }

    return error;
  };
  const stakeToken = async () => {
    const web3 = new Web3(provider);
    window.staking_contract = new web3.eth.Contract(
      stakingabi,
      staking_contract_address
    );


    if (validation() == false) {
      setStakeLoading(true);
      await window.staking_contract.methods
        .DepositTokens(address, amount, months, amountKeepPercent)
        .send({ from: address })
        .on("transactionHash", async (hash) => {
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              navigate("/myStake")
              window.location.reload(false);
              setStakeLoading(false);
              break;
            }

          }
        })
        .on("error", (error) => {
          console.log(error)
          toast("Something went wrong while Approving");
          setStakeLoading(false);
        });
    }
  };

  const getMonthsAndPercentage = async () => {
    setLoadingState(true);
    // const web3 = new Web3(provider);
    const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
    window.staking_contract = new web3.eth.Contract(
      stakingabi,
      staking_contract_address
    );
    var months = [];
    for (let i = 1; i < 4; i++) {
      let monthsSingle = await window.staking_contract.methods.APY(i).call();
      let percentSingle = await window.staking_contract.methods
        .APYPer(i)
        .call();
      percentSingle = percentSingle / 10;
      months.push({ monthsSingle, percentSingle });
    }
    setContractMonths(months);
    setLoadingState(false);

  };

  const approve = async () => {
    setapproveloading(true);
    if (provider) {
      const web3 = new Web3(provider);
      window.mint_contract = new web3.eth.Contract(
        erc20abi,
        erc20_contract_address
      );
      await window.mint_contract.methods
        .approve(staking_contract_address, balance)
        .send({ from: address })
        .on("transactionHash", async (hash) => {
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              window.location.reload(false);
              setapproveloading(false);

              break;
            }

          }
        })
        .on("error", (error) => {
          toast("Something went wrong while Approving");
          setapproveloading(false);
        });
    }
  };
  const getCurrentReward = async () => {
    setLoadingState(true);
    // const web3 = new Web3(provider);
    const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
    window.staking_contract = new web3.eth.Contract(
      stakingabi,
      staking_contract_address
    );

    let currentReward = await window.staking_contract.methods.viewRewards(address).call();


    setCurrentReward(currentReward)
    setLoadingState(false);

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
    getCurrentBalance();
    getMonthsAndPercentage();
  }, [provider]);
  useEffect(() => {
    getCurrentReward();
  }, [provider]);

  useEffect(() => {
    console.log(ContractMonths)
  }, [ContractMonths]);


  return (
    <div className="home-wrapper">
      {loadingState ? (
        <div className="loader-wrap">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="home-content">
          <h1>Welcome to Staking</h1>
          <h6 className="balance">
            {"Balance: " + (balance / 1000000000000000000).toFixed(2) + " MTK"}
          </h6>
          <h6 className="allownace">
            {"Approved Amount: " +
              (allowance / 1000000000000000000).toFixed(2) +
              " MTK"}
          </h6>
          {/* {balance == allowance ? (
            <> </>
          ) : approveloading ? (
            <>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </>
          ) : (
            <button className="btn btn-primary" onClick={approve}>
              Approve
            </button>
          )} */}
          {StakerDetails.check ? (
            <>
              <p className="alreadyStakedNotice">
                <span>You have staked </span>
                {StakerDetails.depositTokens / 1000000000000000000}{" "}
                <span>MTK in </span>
                {StakerDetails.StakeMonth} <span> month with </span>
                {StakerDetails.EarnPersentage}%
              </p>
              <p className="alreadyStakedNotice" style={{ marginTop: "0px " }}>
                You can stake more Tokens in {StakerDetails.StakeMonth} month
                with {StakerDetails.EarnPersentage}%
              </p>
            </>
          ) : (
            <></>
          )}

          {ContractMonths && ContractMonths.length > 0 ? (
            <>
              <div className="radio-btn">
                <div className="DurationRadios">
                  {StakerDetails.check ? (
                    // when there is already staked
                    <form>
                      {ContractMonths[0]?.monthsSingle ==
                        StakerDetails.StakeMonth ? (
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio1"
                              name="optradio"
                              value={ContractMonths[0]?.monthsSingle}
                              onChange={(e) => {
                                setMonths(e.currentTarget.value);
                              }}
                            />
                            {ContractMonths[0]?.monthsSingle}M -
                            {ContractMonths[0]?.percentSingle}% APY
                          </label>
                        </div>
                      ) : (
                        <div className="form-check">
                          <label className="form-check-label disabled">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio1"
                              name="optradio"
                              value={ContractMonths[0]?.monthsSingle}
                              onChange={(e) => {
                                setMonths(e.currentTarget.value);
                              }}
                              disabled
                            />
                            {ContractMonths[0]?.monthsSingle}M -
                            {ContractMonths[0]?.percentSingle}% APY
                          </label>
                        </div>
                      )}
                      {ContractMonths[1]?.monthsSingle ==
                        StakerDetails.StakeMonth ? (
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio2"
                              name="optradio"
                              value={ContractMonths[1]?.monthsSingle}
                              onChange={(e) => {
                                setMonths(e.currentTarget.value);
                              }}
                            />
                            {ContractMonths[1]?.monthsSingle}M -
                            {ContractMonths[1]?.percentSingle}% APY
                          </label>
                        </div>
                      ) : (
                        <div className="form-check">
                          <label className="form-check-label disabled">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio2"
                              name="optradio"
                              value={ContractMonths[1]?.monthsSingle}
                              onChange={(e) => {
                                setMonths(e.currentTarget.value);
                              }}
                              disabled
                            />
                            {ContractMonths[1]?.monthsSingle}M -
                            {ContractMonths[1]?.percentSingle}% APY
                          </label>
                        </div>
                      )}

                      {ContractMonths[2]?.monthsSingle ==
                        StakerDetails.StakeMonth ? (
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio3"
                              name="optradio"
                              value={ContractMonths[2]?.monthsSingle}
                              onChange={(e) => {
                                setMonths(e.currentTarget.value);
                              }}
                            />
                            {ContractMonths[2]?.monthsSingle}M -
                            {ContractMonths[2]?.percentSingle}% APY
                          </label>
                        </div>
                      ) : (
                        <div className="form-check">
                          <label className="form-check-label disabled">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio3"
                              name="optradio"
                              value={ContractMonths[2]?.monthsSingle}
                              onChange={(e) => {
                                setMonths(e.currentTarget.value);
                              }}
                              disabled
                            />
                            {ContractMonths[2]?.monthsSingle}M -
                            {ContractMonths[2]?.percentSingle}% APY
                          </label>
                        </div>
                      )}
                    </form>
                  ) : (
                    // when no staked
                    <form>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="radio1"
                            name="optradio"
                            value={ContractMonths[0]?.monthsSingle}
                            onChange={(e) => {
                              setMonths(e.currentTarget.value);
                            }}
                          />
                          {ContractMonths[0]?.monthsSingle}M -
                          {ContractMonths[0]?.percentSingle}% APY
                        </label>
                      </div>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="radio2"
                            name="optradio"
                            value={ContractMonths[1]?.monthsSingle}
                            onChange={(e) => {
                              setMonths(e.currentTarget.value);
                            }}
                          />
                          {ContractMonths[1]?.monthsSingle}M -
                          {ContractMonths[1]?.percentSingle}% APY
                        </label>
                      </div>

                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="radio3"
                            name="optradio"
                            value={ContractMonths[2]?.monthsSingle}
                            onChange={(e) => {
                              setMonths(e.currentTarget.value);
                            }}
                          />
                          {ContractMonths[2]?.monthsSingle}M -
                          {ContractMonths[2]?.percentSingle}% APY
                        </label>
                      </div>
                    </form>
                  )}
                </div>

                <div className="DurationRadioButtons">
                  {StakerDetails.check ? (
                    //staked
                    <form>
                      {StakerDetails.EarnPersentage == 100 ? (
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio4"
                              name="optradio"
                              value="100"
                              onChange={(e) => {
                                setAmountKeepPercent(e.currentTarget.value);
                              }}
                            />
                            100%
                          </label>
                        </div>
                      ) : (
                        <div className="form-check">
                          <label className="form-check-label disabled">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio4"
                              name="optradio"
                              value="100"
                              onChange={(e) => {
                                setAmountKeepPercent(e.currentTarget.value);
                              }}
                              disabled
                            />
                            100%
                          </label>
                        </div>
                      )}

                      {StakerDetails.EarnPersentage == 75 ? (
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio5"
                              name="optradio"
                              value="75"
                              onChange={(e) => {
                                setAmountKeepPercent(e.currentTarget.value);
                              }}
                            />
                            75%
                          </label>
                        </div>
                      ) : (
                        <div className="form-check">
                          <label className="form-check-label disabled">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio5"
                              name="optradio"
                              value="75"
                              onChange={(e) => {
                                setAmountKeepPercent(e.currentTarget.value);
                              }}
                              disabled
                            />
                            75%
                          </label>
                        </div>
                      )}

                      {StakerDetails.EarnPersentage == 50 ? (
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio6"
                              name="optradio"
                              value="50"
                              onChange={(e) => {
                                setAmountKeepPercent(e.currentTarget.value);
                              }}
                            />
                            50%
                          </label>
                        </div>
                      ) : (
                        <div className="form-check">
                          <label className="form-check-label disabled">
                            <input
                              type="radio"
                              className="form-check-input"
                              id="radio6"
                              name="optradio"
                              value="50"
                              onChange={(e) => {
                                setAmountKeepPercent(e.currentTarget.value);
                              }}
                              disabled
                            />
                            50%
                          </label>
                        </div>
                      )}
                    </form>
                  ) : (
                    //unstaked
                    <form>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="radio4"
                            name="optradio"
                            value="100"
                            onChange={(e) => {
                              setAmountKeepPercent(e.currentTarget.value);
                            }}
                          />
                          100%
                        </label>
                      </div>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="radio5"
                            name="optradio"
                            value="75"
                            onChange={(e) => {
                              setAmountKeepPercent(e.currentTarget.value);
                            }}
                          />
                          75%
                        </label>
                      </div>

                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="radio6"
                            name="optradio"
                            value="50"
                            onChange={(e) => {
                              setAmountKeepPercent(e.currentTarget.value);
                            }}
                          />
                          50%
                        </label>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="input-fields">
                <div className="EarningAmount">
                  <div className="mb-3">
                    <label className="form-label">Amount:</label>
                    <input
                      type="text"
                      className="form-control"
                      // pattern="/[^0-9]/g"
                      id="amount"
                      // placeholder="Amount to Stake"
                      // name="amount"
                      value={amount}
                      onChange={(e) => {


                        const regex = /[^0-9]/g;
                        const value = e.target.value;
                        const newValue = value.replace(regex, "");
                        setAmount(newValue);
                      }}
                    />
                  </div>
                  {balance == allowance ? (

                    stakeLoading ? (
                      <>
                        < Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary" onClick={stakeToken}>
                          Stake
                        </button>

                      </>
                    )
                  ) : approveloading ? (
                    <>
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </>
                  ) : (
                    <button className="btn btn-primary" onClick={approve}>
                      Approve
                    </button>
                  )}

                  {/* <h6 className="balance" style={{ marginTop: "5px" }}>
                {"Reward: " + (currentReward / 1000000000000000000).toFixed(2) + " MTK"}
              </h6> */}
                </div>
              </div>
            </>) : <>Loading Staking Plan...</>}
        </div >
      )}
    </div >
  );
};

export default Home;
