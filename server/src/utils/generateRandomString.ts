function generateRandomString(length: number = 8): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    password += letters[randomIndex];
  }

  return password;
}

export default generateRandomString;
