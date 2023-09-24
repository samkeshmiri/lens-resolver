import { init } from "@airstack/node";
import { fetchQuery } from "@airstack/node";
init("7a8ab044a188462da3b1a65cc7031e35");

type LensHandleResponse = {
  Wallet: {
    socials: {
      dappName: string;
      profileName: string;
    }[];
    domains: {
      name: string;
    }[];
    primaryDomain: {
      name: string;
    };
    addresses: string[];
  };
};

const LENS_RESOLVER_QUERY = `query resolveLensHandle($address: Identity!) {
    Wallet(input: {identity: $address, blockchain: ethereum}) {
      socials {
        dappName
        profileName
      }
      domains {
        name
      }
      primaryDomain {
        name
      }
      addresses
    }
  }
  `;

async function resolveLensHandle(lensHandle: string) {
  console.log("lens handle: ", lensHandle);
  const { data } = await fetchQuery(LENS_RESOLVER_QUERY, {
    address: lensHandle,
  });

  const response = data as LensHandleResponse;

  return response.Wallet.addresses[0] ?? "";
}

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

app.get("/resolveLensHandle", async (req, res) => {
  try {
    const lensHandle = req.query.handle;

    if (!lensHandle) {
      return res.status(400).json({ error: "Lens handle is required" });
    }

    // Use the resolveLensHandle function.
    const result = await resolveLensHandle(lensHandle);

    // Return the result.
    res.json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
