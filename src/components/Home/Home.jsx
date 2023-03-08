import React, { useEffect, useState } from "react";
import "./home.css";
import { useAccount, useSigner } from "wagmi";
import Web3 from "web3/dist/web3.min.js";
import erc20abi from "../../abis/ERC20.json"
import stakingabi from "../../abis/staking.json"
import { toast } from "react-toastify";

const erc20_contract_address = import.meta.env.VITE_ERC20;
const staking_contract_address = import.meta.env.VITE_STAKING;

const Home = () => {
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

  const getStakeDetails = async () => {
    if (provider) {
      const web3 = new Web3(provider);
      window.contract = new web3.eth.Contract(
        stakingabi,
        staking_contract_address
      );
      let staker = await window.contract.methods.Details(address).call()
      // console.log(staker);
      setStakerDetails(staker)

    }
  }
  const getCurrentBalance = async () => {
    if (provider) {
      const web3 = new Web3(provider);
      window.mint_contract = new web3.eth.Contract(
        erc20abi,
        erc20_contract_address
      );
      let balanceToken = await window.mint_contract.methods.balanceOf(address).call()
      let Allowance = await window.mint_contract.methods.allowance(address, staking_contract_address).call()
      setBalance(balanceToken)
      setAllowance(Allowance)
    }

  }

  const validation = () => {
    let error = false;
    if (amount == "" || amount == undefined || amount == null) {
      toast("please select amount")
      error = true;

    }
    if (months == "" || months == undefined || months == null) {
      toast("please select months")
      error = true;
    }

    if (amountKeepPercent == "" || amountKeepPercent == undefined || amountKeepPercent == null) {
      toast("please select Percentage you want to keep")
      error = true;
    }

    return error
  }
  const stakeToken = async () => {
    const web3 = new Web3(provider);
    window.staking_contract = new web3.eth.Contract(
      stakingabi,
      staking_contract_address
    );
    console.log(address);
    console.log(amount);
    console.log(months);
    console.log(amountKeepPercent);
    if (validation() == false) {
      console.log("enters");

      let balanceToken = await window.staking_contract.methods.DepositTokens(address, amount, months, amountKeepPercent)
        .send({ from: address })
        .on("transactionHash", async (hash) => {
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              window.location.reload(false);
              // setLoadingState1(false)
              break;
            }
            console.log("hello");
          }
        })
        .on("error", (error) => {
          toast("Something went wrong while Approving");
          // setLoadingState1(false);
        });

    }
  }


  const getMonths = async () => {
    if (provider) {
      const web3 = new Web3(provider);
      window.staking_contract = new web3.eth.Contract(
        stakingabi,
        staking_contract_address
      );

      // console.log(amount);
      var months = [];
      for (let i = 1; i < 4; i++) {
        let monthsSingle = await window.staking_contract.methods.APY(i).call()
        let percentSingle = await window.staking_contract.methods.APYPer(i).call()
        percentSingle = percentSingle / 10
        // console.log(months);
        months.push({ monthsSingle, percentSingle })

      }

      setContractMonths(months)
    }

  }

  const approve = async () => {

    if (provider) {

      const web3 = new Web3(provider);
      window.mint_contract = new web3.eth.Contract(
        erc20abi,
        erc20_contract_address
      );

      let balanceToken = await window.mint_contract.methods.approve(staking_contract_address, balance)
        .send({ from: address })
        .on("transactionHash", async (hash) => {
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              window.location.reload(false);
              // setLoadingState1(false)
              break;
            }
            console.log("hello");
          }
        })
        .on("error", (error) => {
          toast("Something went wrong while Approving");
          // setLoadingState1(false);
        });



    }
  }

  // const getStakeDetails = async () => {
  //   if (provider) {
  //     const web3 = new Web3(provider);
  //     window.contract = new web3.eth.Contract(
  //       stakingabi,
  //       staking_contract_address
  //     );
  //     let staker = await window.contract.methods.Details(address).call()
  //     console.log(staker.stakeTime * 1000);



  //     const date = moment(staker.stakeTime);
  //     console.log(date);
  //     const newDate = moment(staker.stakeTime * 1000).add(staker.StakeMonth * 30, 'days');

  //     setNewDate(newDate)
  //     console.log(newDate);
  //     console.log(newDate.diff(date));
  //     setStakerDetails(staker)

  //   }
  // }


  useEffect(() => {
    if (signer) {
      setProvider((signer?.provider).provider);
    }
  }, [signer]);
  useEffect(() => {
    getStakeDetails()
  }, [provider])

  useEffect(() => {
    getCurrentBalance()
    getMonths()
  }, [provider])

  // useEffect(() => {
  //   console.log(amountKeepPercent);
  // }, [amountKeepPercent])
  useEffect(() => {
    console.log(StakerDetails);
  }, [StakerDetails])


  return (
    <div>
      <div className="home-content">
        <h1>Welcome to Staking</h1>
        <h6 className="balance">{"Balance: " + balance / 1000000000000000000 + " MTK"}</h6>
        <h6 className="allownace">{"Approved Amount: " + allowance / 1000000000000000000 + " MTK"}</h6>
        {

          balance == allowance ? <></> : <button className="btn btn-primary" onClick={approve}>
            Approve
          </button>
        }


        {

          StakerDetails.check ?
            <>
              <p className="alreadyStakedNotice">You have already staked {StakerDetails.depositTokens / 1000000000000000000} MTK in {StakerDetails.StakeMonth} months with {StakerDetails.EarnPersentage}%</p>
              <p className="alreadyStakedNotice" style={{ marginTop: "0px " }}>You can stake more Tokens in  {StakerDetails.StakeMonth} month  with {StakerDetails.EarnPersentage}%</p>
            </>
            :
            <></>

        }

        <div className="radio-btn">
          <div className="DurationRadios">

            {
              StakerDetails.check ?
                // when there is already staked
                <form >

                  {

                    ContractMonths[0]?.monthsSingle == StakerDetails.StakeMonth ? <div className="form-check">
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
                      <label className="form-check-label">
                        {ContractMonths[0]?.monthsSingle}M - {ContractMonths[0]?.percentSingle}% APY
                      </label>
                    </div>
                      : <div className="form-check">
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
                        <label className="form-check-label">
                          {ContractMonths[0]?.monthsSingle}M - {ContractMonths[0]?.percentSingle}% APY
                        </label>
                      </div>
                  }
                  {ContractMonths[1]?.monthsSingle == StakerDetails.StakeMonth ?
                    <div className="form-check">
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
                      <label className="form-check-label">
                        {ContractMonths[1]?.monthsSingle}M - {ContractMonths[1]?.percentSingle}% APY
                      </label>
                    </div>

                    : <div className="form-check">
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
                      <label className="form-check-label">
                        {ContractMonths[1]?.monthsSingle}M - {ContractMonths[1]?.percentSingle}% APY
                      </label>
                    </div>}


                  {ContractMonths[2]?.monthsSingle == StakerDetails.StakeMonth ?

                    <div className="form-check">
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
                      <label className="form-check-label" >
                        {ContractMonths[2]?.monthsSingle}M - {ContractMonths[2]?.percentSingle}% APY
                      </label>
                    </div>
                    :
                    <div className="form-check">
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
                      <label className="form-check-label" >
                        {ContractMonths[2]?.monthsSingle}M - {ContractMonths[2]?.percentSingle}% APY
                      </label>
                    </div>}

                </form> :
                // when no staked
                <form >
                  <div className="form-check">
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
                    <label className="form-check-label">
                      {ContractMonths[0]?.monthsSingle}M - {ContractMonths[0]?.percentSingle}% APY
                    </label>
                  </div>
                  <div className="form-check">
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
                    <label className="form-check-label">
                      {ContractMonths[1]?.monthsSingle}M - {ContractMonths[1]?.percentSingle}% APY
                    </label>
                  </div>

                  <div className="form-check">
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
                    <label className="form-check-label" >
                      {ContractMonths[2]?.monthsSingle}M - {ContractMonths[2]?.percentSingle}% APY
                    </label>
                  </div>
                </form>
            }

          </div>

          <div className="DurationRadioButtons">


            {
              StakerDetails.check ?
                //staked
                <form >
                  {
                    StakerDetails.EarnPersentage == 100 ?
                      <div className="form-check">
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
                        <label className="form-check-label" >
                          100%
                        </label>
                      </div> : <div className="form-check">
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
                        <label className="form-check-label" >
                          100%
                        </label>
                      </div>

                  }


                  {
                    StakerDetails.EarnPersentage == 75 ?
                      <div className="form-check">
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
                        <label className="form-check-label">
                          75%
                        </label>
                      </div> : <div className="form-check">
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
                        <label className="form-check-label">
                          75%
                        </label>
                      </div>}


                  {
                    StakerDetails.EarnPersentage == 50 ?
                      <div className="form-check">
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
                        <label className="form-check-label">
                          50%
                        </label>
                      </div> :
                      <div className="form-check">
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
                        <label className="form-check-label">
                          50%
                        </label>
                      </div>
                  }
                </form> :
                //unstaked
                <form >
                  <div className="form-check">
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
                    <label className="form-check-label" >
                      100%
                    </label>
                  </div>
                  <div className="form-check">
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
                    <label className="form-check-label">
                      75%
                    </label>
                  </div>

                  <div className="form-check">
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
                    <label className="form-check-label">
                      50%
                    </label>
                  </div>
                </form>
            }

          </div>

        </div>

        <div className="input-fields">
          <div className="EarningAmount">

            <div className="mb-3">
              <label className="form-label">
                Amount:
              </label>
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
                  const newValue = value.replace(regex, '');
                  setAmount(newValue)
                }}
              />
            </div>

            <button className="btn btn-primary" onClick={stakeToken}>
              Stake
            </button>
          </div>
        </div>



      </div>
    </div>
  );
};

export default Home;
