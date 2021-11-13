const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Starting test...")

  // This gets this data from solana config get.
  // If the config is set to local host, it tells Anchor to
  // to run the code locally.
  anchor.setProvider(anchor.Provider.env());

  // Automatically compiles our code in lib.rs and gets it deployed locally on a local validator
  const program = anchor.workspace.Myepicproject;

  // Actually call our function we made by doing program.rpc.startStuffOff()
  // and await it, which will wait for our local validator to "mine" the instruction.
  const tx = await program.rpc.startStuffOff();

  console.log("📝 Your transaction signature", tx);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
