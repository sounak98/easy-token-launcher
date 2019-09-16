import React, { Component, Fragment } from "react";

import axios from "axios";
import Web3 from "web3";

import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Fab,
  Typography,
  Grid,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
  Paper
} from "@material-ui/core";
import TrendingUp from "@material-ui/icons/TrendingUpRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreRounded";
import ShopIcon from "@material-ui/icons/ShopRounded";

import Navbar from "./Navbar";
import Loader from "./Loader";

const styles = theme => ({
  gutterRight: {
    marginRight: theme.spacing(1)
  },
  gutterBottom: {
    marginBottom: theme.spacing(3)
  },
  paper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid"
  }
});

class Home extends Component {
  state = {
    allPeers: null,
    allPeerRules: {},
    user: null
  };

  async componentDidMount() {
    this.fetchPeers();
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        this.setState({ user: window.ethereum.selectedAddress });
      }
    } else {
      console.error("Install/Update MetaMask");
    }
  }

  deleteRule = async (peerContractAddress, rule) => {
    var web3 = new Web3(window.ethereum);
    var abi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "takerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "makerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "maxTakerAmount",
            type: "uint256"
          },
          {
            indexed: false,
            name: "priceCoef",
            type: "uint256"
          },
          {
            indexed: false,
            name: "priceExp",
            type: "uint256"
          }
        ],
        name: "SetRule",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "takerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "makerToken",
            type: "address"
          }
        ],
        name: "UnsetRule",
        type: "event"
      },
      {
        constant: false,
        inputs: [
          {
            name: "",
            type: "address"
          },
          {
            name: "",
            type: "address"
          }
        ],
        name: "rules",
        outputs: [
          {
            components: [
              {
                name: "maxTakerAmount",
                type: "uint256"
              },
              {
                name: "priceCoef",
                type: "uint256"
              },
              {
                name: "priceExp",
                type: "uint256"
              }
            ],
            name: "",
            type: "tuple"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          },
          {
            name: "_maxTakerAmount",
            type: "uint256"
          },
          {
            name: "_priceCoef",
            type: "uint256"
          },
          {
            name: "_priceExp",
            type: "uint256"
          }
        ],
        name: "setRule",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "unsetRule",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_takerParam",
            type: "uint256"
          },
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "getMakerSideQuote",
        outputs: [
          {
            name: "makerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_makerParam",
            type: "uint256"
          },
          {
            name: "_makerToken",
            type: "address"
          },
          {
            name: "_takerToken",
            type: "address"
          }
        ],
        name: "getTakerSideQuote",
        outputs: [
          {
            name: "takerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "getMaxQuote",
        outputs: [
          {
            name: "takerParam",

            type: "uint256"
          },
          {
            name: "makerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            components: [
              {
                name: "nonce",
                type: "uint256"
              },
              {
                name: "expiry",
                type: "uint256"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "maker",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "taker",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "affiliate",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "signer",
                    type: "address"
                  },
                  {
                    name: "v",
                    type: "uint8"
                  },
                  {
                    name: "r",
                    type: "bytes32"
                  },
                  {
                    name: "s",
                    type: "bytes32"
                  },
                  {
                    name: "version",
                    type: "bytes1"
                  }
                ],
                name: "signature",
                type: "tuple"
              }
            ],
            name: "_order",
            type: "tuple"
          }
        ],
        name: "provideOrder",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
          {
            name: "",
            type: "address"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      }
    ];
    var peerContract = new web3.eth.Contract(abi, peerContractAddress);
    await peerContract.methods
      .unsetRule(rule.takerToken.address, rule.makerToken.address)
      .send({
        from: this.state.user,
        value: 0
      });
    var allPeerRules = this.state.allPeerRules;
    var index = allPeerRules[peerContractAddress].indexOf(rule);
    allPeerRules[peerContractAddress].splice(index, 1);
    this.setState({ allPeerRules });
  };

  fetchTokenDetails = async tokenContract => {
    console.log("fetching token details");
    var web3 = new Web3(window.ethereum);
    const abi = [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string"
          }
        ],
        payable: false,
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
          {
            name: "",
            type: "uint8"
          }
        ],
        payable: false,
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256"
          }
        ],
        payable: false,
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
          {
            name: "",
            type: "string"
          }
        ],
        payable: false,
        type: "function"
      }
    ];
    var erc20Contract = new web3.eth.Contract(abi, tokenContract);
    var name = await erc20Contract.methods.name().call();
    var symbol = await erc20Contract.methods.symbol().call();
    return { symbol, name, address: tokenContract };
  };

  fetchRules = async peerContractAddress => {
    var allPeerRules = this.state.allPeerRules;
    allPeerRules[peerContractAddress] = [];
    this.setState({ allPeerRules });
    console.log("fetching rules");
    var web3 = new Web3(window.ethereum);
    var abi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "takerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "makerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "maxTakerAmount",
            type: "uint256"
          },
          {
            indexed: false,
            name: "priceCoef",
            type: "uint256"
          },
          {
            indexed: false,
            name: "priceExp",
            type: "uint256"
          }
        ],
        name: "SetRule",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "takerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "makerToken",
            type: "address"
          }
        ],
        name: "UnsetRule",
        type: "event"
      },
      {
        constant: false,
        inputs: [
          {
            name: "",
            type: "address"
          },
          {
            name: "",
            type: "address"
          }
        ],
        name: "rules",
        outputs: [
          {
            components: [
              {
                name: "maxTakerAmount",
                type: "uint256"
              },
              {
                name: "priceCoef",
                type: "uint256"
              },
              {
                name: "priceExp",
                type: "uint256"
              }
            ],
            name: "",
            type: "tuple"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          },
          {
            name: "_maxTakerAmount",
            type: "uint256"
          },
          {
            name: "_priceCoef",
            type: "uint256"
          },
          {
            name: "_priceExp",
            type: "uint256"
          }
        ],
        name: "setRule",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "unsetRule",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_takerParam",
            type: "uint256"
          },
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "getMakerSideQuote",
        outputs: [
          {
            name: "makerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_makerParam",
            type: "uint256"
          },
          {
            name: "_makerToken",
            type: "address"
          },
          {
            name: "_takerToken",
            type: "address"
          }
        ],
        name: "getTakerSideQuote",
        outputs: [
          {
            name: "takerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "getMaxQuote",
        outputs: [
          {
            name: "takerParam",

            type: "uint256"
          },
          {
            name: "makerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            components: [
              {
                name: "nonce",
                type: "uint256"
              },
              {
                name: "expiry",
                type: "uint256"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "maker",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "taker",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "affiliate",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "signer",
                    type: "address"
                  },
                  {
                    name: "v",
                    type: "uint8"
                  },
                  {
                    name: "r",
                    type: "bytes32"
                  },
                  {
                    name: "s",
                    type: "bytes32"
                  },
                  {
                    name: "version",
                    type: "bytes1"
                  }
                ],
                name: "signature",
                type: "tuple"
              }
            ],
            name: "_order",
            type: "tuple"
          }
        ],
        name: "provideOrder",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
          {
            name: "",
            type: "address"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      }
    ];
    var peerContract = new web3.eth.Contract(abi, peerContractAddress);
    peerContract.events.SetRule(
      {
        fromBlock: 0,
        toBlock: "latest"
      },
      async (error, event) => {
        var takerToken = await this.fetchTokenDetails(
          event.returnValues.takerToken
        );
        var makerToken = await this.fetchTokenDetails(
          event.returnValues.makerToken
        );
        var rule = { takerToken, makerToken };
        var allPeerRules = this.state.allPeerRules;
        allPeerRules[peerContractAddress].push(rule);
        this.setState({ allPeerRules });
      }
    );
  };

  handleChange = (e, expanded, peerContractAddress) => {
    console.log(expanded, peerContractAddress);
  };

  fetchPeers = async () => {
    console.log("fetching peers from graph");
    var response = await axios.post(
      "https://api.thegraph.com/subgraphs/name/nanspro/airswappeerfactory",
      {
        query: `
            {
              createPeers(first: 100) {
                id
                peerContract
                swapContract
                peerContractOwner
              }
            }
          `
      }
    );
    var allPeers = response.data.data.createPeers;
    var allPeerRules = {};
    for (var peer of allPeers) {
      allPeerRules[peer.peerContract] = [];
    }
    this.setState({ allPeers, allPeerRules });
  };

  dataLoaded = () => {
    return Boolean(this.state.allPeers);
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <Container maxWidth="md">
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={3}
            className={classes.gutterBottom}
          >
            <Grid item>
              <Typography variant="h4" align="center">
                Welcome to Easy Token Launcher
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                Decentralized, transparent, responsible way to distribute or
                launch your tokens using AirSwap Protocol.
              </Typography>
            </Grid>
            <Grid item>
              <Fab
                variant="extended"
                color="primary"
                href="/launch"
                className={classes.gutterRight}
              >
                <TrendingUp className={classes.gutterRight} />
                Launch Tokens
              </Fab>
              <Fab
                variant="extended"
                color="primary"
                href="/buy/0xCC1CBD4f67cCeb7c001bD4aDF98451237a193Ff8/0x662469f56080c807250216e1fa8c68EA9e63EC79"
              >
                <ShopIcon className={classes.gutterRight} />
                Buy (Sample)
              </Fab>
            </Grid>
          </Grid>
          {this.dataLoaded() ? (
            <Fragment>
              {this.state.allPeers.map(peer => (
                <ExpansionPanel
                  key={peer.id}
                  onClick={this.fetchRules.bind(this, peer.peerContract)}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{peer.peerContract}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography variant="body1">
                      Owner: {peer.peerContractOwner}
                    </Typography>
                  </ExpansionPanelDetails>
                  <ExpansionPanelDetails>
                    <Paper className={classes.paper} elevation={0}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Offering Token</TableCell>
                            <TableCell align="center">Payable Token</TableCell>
                            <TableCell align="center">Buy</TableCell>
                            {this.state.user &&
                              this.state.user === peer.peerContractOwner && (
                                <TableCell align="center">Delete</TableCell>
                              )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.allPeerRules[peer.peerContract].map(
                            (rule, idx) => (
                              <TableRow key={idx}>
                                <TableCell align="center">
                                  {rule.takerToken.name} (
                                  {rule.takerToken.symbol})
                                </TableCell>
                                <TableCell align="center">
                                  {rule.makerToken.name} (
                                  {rule.makerToken.symbol})
                                </TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="outlined"
                                    href={`/buy/${rule.takerToken.address}/${rule.makerToken.address}`}
                                    color="primary"
                                  >
                                    Buy
                                  </Button>
                                </TableCell>
                                <TableCell align="center">
                                  {this.state.user &&
                                    this.state.user ===
                                      peer.peerContractOwner && (
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={this.deleteRule.bind(
                                          this,
                                          peer.peerContract,
                                          rule
                                        )}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </Paper>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
            </Fragment>
          ) : (
            <Loader />
          )}
        </Container>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Home);
