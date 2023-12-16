const { url } = require("inspector");
const { JSDOM } = require("jsdom");

const normalizeURL = (urlString) => {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  linkElements.forEach((link) => {
    if (link.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(`${baseURL}${link.href}`);
      } catch (error) {
        console.log("error with relative url");
      }
      urls.push(`${baseURL}${link.href}`);
    } else {
      // absolutes
      urls.push(link.href);
    }
  });
  return urls;
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
};
