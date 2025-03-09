/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nsgd.json`.
 */
export type Nsgd = {
  "address": "Cyq8xw2mP2hCy62voStd5WEHTkPC1yyMoNiv5267m2W5",
  "metadata": {
    "name": "nsgd",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initBank",
      "discriminator": [
        73,
        111,
        27,
        243,
        202,
        129,
        159,
        80
      ],
      "accounts": [
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "bank",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  110,
                  107
                ]
              }
            ]
          }
        },
        {
          "name": "collectionTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initToken",
      "discriminator": [
        9,
        187,
        206,
        103,
        139,
        126,
        246,
        181
      ],
      "accounts": [
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "bank"
          ]
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "bank",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  110,
                  107
                ]
              }
            ]
          }
        },
        {
          "name": "collectionTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bank",
      "discriminator": [
        142,
        49,
        166,
        242,
        50,
        66,
        97,
        188
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "bankAlreadyInitialized",
      "msg": "Bank is already initialized. Cannot be initialized again."
    }
  ],
  "types": [
    {
      "name": "bank",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "collectionTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mintBump",
            "type": "u8"
          },
          {
            "name": "collectionTokenAccountBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "bankSeed",
      "type": "bytes",
      "value": "[98, 97, 110, 107]"
    },
    {
      "name": "collectionTokenAccountSeed",
      "type": "bytes",
      "value": "[99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 95, 116, 111, 107, 101, 110, 95, 97, 99, 99, 111, 117, 110, 116]"
    },
    {
      "name": "metadataSeed",
      "type": "bytes",
      "value": "[109, 101, 116, 97, 100, 97, 116, 97]"
    },
    {
      "name": "tokenMetadataUrl",
      "type": "string",
      "value": "\"https://solana-content.jianhong.link/nsgd/token-metadata.json\""
    },
    {
      "name": "tokenMintSeed",
      "type": "bytes",
      "value": "[116, 111, 107, 101, 110, 95, 109, 105, 110, 116]"
    },
    {
      "name": "tokenName",
      "type": "string",
      "value": "\"New SGD\""
    },
    {
      "name": "tokenSymbol",
      "type": "string",
      "value": "\"NSGD\""
    }
  ]
};
