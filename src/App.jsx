import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import MyStake from "./components/MyStake/MyStake";
import Navbar from "./components/Home/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { mainnet, polygon, bscTestnet, bsc } from "wagmi/chains";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

//Custom BSC Network
const bscTestnetChainCustom = {
  id: 97,
  name: "Binance Smart Chain Testnet",
  network: "bsctestnet",
  iconUrl: "https://example.com/icon.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Smart Chain Testnet BNB",
    symbol: "tBNB",
  },
  rpcUrls: {
    default: {
      http: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    },
  },
  blockExplorers: {
    default: { name: "BscScan Testnet", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
};
const { chains, provider } = configureChains(
  [bscTestnetChainCustom],
  [
    alchemyProvider({ apiKey: "WHmpEswo53EENhh4OBXcQIq2I0ob7x_-" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <div className="App-js">
      <ToastContainer />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myStake" element={<MyStake />} />
          </Routes>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
