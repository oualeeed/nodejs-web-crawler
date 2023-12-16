const { url } = require("inspector");
const { JSDOM } = require("jsdom");

const crawlPage = async (pageURL) => {
  console.log(`Activliy crawling ${pageURL}`);

  try {
    const resp = await fetch(pageURL);
    if (resp.status >= 400) {
      console.log(
        `error fetching page on url ${pageURL} with code status ${resp.status}`
      );
      return;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content-type ${contentType} on page ${pageURL}`
      );
      return;
    }
    console.log(await resp.text());
  } catch (error) {
    console.log(
      `error fetching page on url ${pageURL}, with message: ${error.message}`
    );
  }
};

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
        urls.push(`${baseURL}${link.href}`);
      } catch (error) {
        console.log("error with relative url");
      }
    } else {
      // absolutes
      try {
        const urlObj = new URL(link.href);
        urls.push(link.href);
      } catch (error) {
        console.log("error with absolute url");
      }
    }
  });
  return urls;
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
