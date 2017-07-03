
// Setup environmental constants. This is used in both the frontend and the backend. The process.env is set in webpack and in package.jsonp
// These are setup in the webpack config


class Macros {

  static error(...args) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    console.error.apply(console.error, ['Error:'].concat(args));
    console.trace();

  }

}


if (process.env.PROD || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
  Macros.PROD = true;
  console.log('Running in prod mode.');
} else if (process.env.DEV || process.env.NODE_ENV === 'dev') {
  Macros.DEV = true;
  console.log('Running in dev mode.');
} else if (process.env.NODE_ENV === 'test') {
  Macros.TESTS = true;
} else {
  console.log(`Unknown env! (${process.env.NODE_ENV}) Setting to dev.`);
  Macros.DEV = true;
}

if (!Macros.PROD) {
  Macros.PROD = false;
}

if (!Macros.DEV) {
  Macros.DEV = false;
}

if (!Macros.TESTS) {
  Macros.TESTS = false;
}


// Strips the middle name from a name.
// The given full name is the person's full name, including first, middle, and last names
// Full name is often not equal to first + ' ' + middle + ' ' + last because many people have foreign names and nicknames.
// If firstName and lastName are passed, the accuracy of this function should be higher.
// This is used in mobile class panel view. 
// And also when adding professor names (both from the employee data sources and from the classes data sources) to the search index.
// Even if the middle names are kept, any word that is one character (not including symbols) is still removed). 

// TODO: Remove "Jr." and "III" and other titles. 
// https://www.npmjs.com/package/parse-full-name
// Might help.
// Also, could merge the name functions from employees.js into this. 
Macros.stripMiddleName = function(fullName, keepIfMoreThanOneChar = false, firstName = null, lastName = null) {
  if ((!firstName && lastName) || (firstName && !lastName)) {
    console.error('Need either first and last name or neither first nor last name for stripeMiddleName.');
    console.trace();
    return null;
  }


  const indexOfFirstSpace = fullName.indexOf(' ');

  // If there are no spaces in this name, just return the full name.
  if (indexOfFirstSpace === -1) {
    return fullName;
  }


  let nameWithoutFirstAndLastName;

  console.log(this)

  if (firstName && lastName) {
    if (!fullName.startsWith(firstName)) {
      this.error('Full name does not start with first name?', fullName, '|', firstName);
    }

    if (!fullName.endsWith(lastName)) {
      this.error('Full name does not end with last name?', fullName, '|', lastName);
    }
  }

  // Find the last name and first name by splitting the name by spaces
  else {
    const indexOfLastSpace = fullName.length - fullName.split('').reverse().join('').indexOf(' ');

    firstName = fullName.slice(0, indexOfFirstSpace);
    lastName = fullName.slice(indexOfLastSpace);
  }

  // No need to calculate the middle name if we are going to drop in anyway. 
  if (!keepIfMoreThanOneChar) {
    return `${firstName} ${lastName}`
  }


  // If their middle name is one character (not including symbols), don't add it to the search index.
  // This prevents profs like Stacy C. Marsella from coming up when you type in [C]
  // First, remove the first and last names and toLowerCase()
  nameWithoutFirstAndLastName = fullName.replace(firstName, '').replace(lastName, '');

  // Then remove symbols.
  nameWithoutFirstAndLastName = nameWithoutFirstAndLastName.replace(/[^a-z0-9]/gi, '');

  // If little to nothing remains, just index the first and last names.
  if (keepIfMoreThanOneChar && nameWithoutFirstAndLastName.length > 1) {

    // Purge middle names that are only one char long
    let fullNameSplit = fullName.split(' ')

    // Of the names that remain, remove the ones that are only 1 letter long (not including symbols)
    fullNameSplit = fullNameSplit.filter(function (word) {
      if (word.replace(/[^a-zA-Z0-9]/gi,'').length < 2) {
        return false;
      }
      else {
        return true;
      }
    })

    return fullNameSplit.join(' ');
  }

  return `${firstName} ${lastName}`;
}

export default Macros;
