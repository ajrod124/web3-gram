import {
  Button,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import { InboxOutlined } from "@ant-design/icons";
import { useContext, useState, useEffect } from "react";

import * as ipfsClient from "ipfs-http-client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

import { Metaplex } from "@metaplex-foundation/js";

import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";

import SolMintNftIdl from "../idl/sol_mint_nft.json";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" // TODO: replace with env
);

const SOL_MINT_NFT_PROGRAM_ID = new anchor.web3.PublicKey(
  "9FKLho9AUYScrrKgJbG1mExt5nSgEfk1CNEbR8qBwKTZ" // TODO: replace with env
);

const NFT_SYMBOL = "ani-nft"; // TODO: replace with env

const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const Posts = (props) => {
  let posts = useState(null);
  const wallet = useWallet();
  const { connection } = useConnection();
  const mx = Metaplex.make(connection);

  useEffect(() => {
    getTokens(false);
  }, []);

  const getTokens = async (isMinter) => {
    const provider = new anchor.AnchorProvider(connection, wallet);
    anchor.setProvider(provider);

    const program = new Program(
      SolMintNftIdl,
      SOL_MINT_NFT_PROGRAM_ID,
      provider
    );

    const accounts = await program.provider.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: isMinter ? 0 : 32,
              bytes: provider.wallet.publicKey,
            },
          },
        ],
      }
    );

    console.log(
    `Found ${accounts.length} token account(s) for wallet ${provider.wallet.publicKey}: `
    );
    accounts.forEach(async (account, i) => {
      console.log(
        `-- Token Account Address ${i + 1}: ${account.pubkey.toString()} --`
      );
      const mintAddress = account.account.data['parsed']['info']['mint'];
      const nft = await mx.nfts().findByMint({ mintAddress }).run();
      console.log(nft);
    });
  }

  return (
    <Row gutter={[8, 8]}>

    </Row>
  )
}

export default Posts;
