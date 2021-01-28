const generateMsg = (username, txt) => {
  return {
    txt,
    username,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMsg = (username, url) => {
  return {
    url,
    username,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMsg,
  generateLocationMsg,
};
