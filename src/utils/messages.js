const generateMsg = (txt) => {
  return {
    txt,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMsg,
};
