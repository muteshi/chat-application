const generateMsg = (txt) => {
  return {
    txt,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMsg = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMsg,
  generateLocationMsg,
};
