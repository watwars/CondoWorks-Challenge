const fs = require("fs");

const path = process.argv[2];
readFileAndProcess(path);

function readFileAndProcess(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      parseData(data.split("\n"));
    }
  });
}

function parseData(fileData) {
  // Finding and printing customer and account no.
  const customerAccountRegex = /Customer *no. *- *Account *no.*/;
  const numberRegex = /[0-9]* *- *[0-9]*/;
  let accountAndCustomerNumber = findMatch(
    fileData,
    customerAccountRegex,
    numberRegex
  );
  if (accountAndCustomerNumber == "NOT FOUND") {
    accountAndCustomerNumber = ["NOT FOUND", "NOT FOUND"];
  } else {
    accountAndCustomerNumber = accountAndCustomerNumber.split("-");
  }
  console.log(
    `Customer Number: ${accountAndCustomerNumber[0]}, Account Number: ${accountAndCustomerNumber[1]}`
  );

  // Finding and printing bill period
  const billPeriodRegex = /Bill *period/;
  const periodRegex =
    /[A-Z][a-z]{2,4} *[0-9]{1,2} *, *[0-9]+ *to *[A-Z][a-z]{2,4} *[0-9]{1,2} *, *[0-9]+/;
  const billPeriod = findMatch(fileData, billPeriodRegex, periodRegex);
  console.log(`Bill Period: ${billPeriod}`);

  // Finding and printing bill number
  const billNumberRegex = /Bill *number *: [0-9]+/;
  const billNumber = findBillInfoMatch(fileData, billNumberRegex).split(
    ": "
  )[1];
  console.log(`Bill Number: ${billNumber}`);

  // Finding and printing bill date
  const billDateRegex = /Bill *date *: [A-Z][a-z]{2,4} *[0-9]{1,2} *, *[0-9]+/;
  const billDate = findBillInfoMatch(fileData, billDateRegex).split(": ")[1];
  console.log(`Bill Date: ${billDate}`);

  // Finding and printing total new charges
  const newChargesRegex = /Total +new +charges *\$([0-9]{1,3}.)*/;
  const newCharges = findBillInfoMatch(fileData, newChargesRegex).split("$")[1];
  console.log(`Total New Charges: $${newCharges}`);
}

function findMatch(fileData, firstPattern, secondPattern) {
  for (let i = 0; i < fileData.length; i++) {
    if (firstPattern.test(fileData[i])) {
      for (let j = i + 1; j < i + 5; j++) {
        let match = fileData[j].match(secondPattern);
        if (match) {
          return match[0];
        }
      }
    }
  }
  return "NOT FOUND";
}

function findBillInfoMatch(fileData, pattern) {
  for (let i = 0; i < fileData.length; i++) {
    let match = fileData[i].match(pattern);
    if (match) {
      return match[0];
    }
  }
  return "NOT FOUND";
}
