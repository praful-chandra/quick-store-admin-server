module.exports = (requiredFields,recived)=>{
    let isValid = requiredFields.every((field) =>
    Object.keys(recived).includes(field)
  );

  return isValid;
}