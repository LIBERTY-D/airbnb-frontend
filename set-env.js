const { writeFileSync } = require("fs");

const targetPath = "./src/environments/environment.prod.ts";

const envConfigFile = `export const environment = {
  production: true,
  BASE_URL: '${process.env.BASE_URL}',
  LOGIN_GITHUB: '${process.env.LOGIN_GITHUB}',
  LOGIN_GOOGLE: '${process.env.LOGIN_GOOGLE}',
  BOOKINGS_URL: '${process.env.BOOKINGS_URL}',
  LISTINGS_URL: '${process.env.LISTINGS_URL}',
  LOGIN_URL: '${process.env.LOGIN_URL}',
  REGISTER_URL: '${process.env.REGISTER_URL}',
  USER_LOGGED_URL: '${process.env.USER_LOGGED_URL}',
  USERS_URL: '${process.env.USERS_URL}'
};
`;

writeFileSync(targetPath, envConfigFile);
console.log(`Environment file generated at ${targetPath}`);
