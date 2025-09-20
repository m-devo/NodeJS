import { Command } from "commander";
const program = new Command();

program
  .command("add")
  .description("to add mutiple numbers")
  .option("-n, --number [numbers...]", "specify numbers")
  .action(({ number }) => {
    console.log(number.reduce((acc, val) => acc + parseInt(val), 0));
  });

program.parse();
