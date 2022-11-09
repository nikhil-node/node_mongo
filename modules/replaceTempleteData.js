module.exports = (temp, users) => {
  let output = temp.replace(/{{FIRSTNAME}}/g, users.firstName);
  output = output.replace(/{{LASTNAME}}/g, users.lastName);
  output = output.replace(/{{GENDER}}/g, users.gender);
  output = output.replace(/{{AGE}}/g, users.age);
  output = output.replace(/{{STATE}}/g, users.address.state);
  output = output.replace(/{{CITY}}/g, users.address.city);
  output = output.replace(/{{PHONE}}/g, users.phoneNumbers[0].number);
  output = output.replace(/{{TYPE}}/g, users.phoneNumbers[0].type);
  output = output.replace(/{{ID}}/g, users.id);
  return output;
};
