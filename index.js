const axios = require('axios');
const { Client } = require('@notionhq/client');

require('dotenv').config();
const username = process.env.USERNAME;
const goal_name = process.env.GOAL_NAME;
const auth_token = process.env.BEEMINDER_AUTH_TOKEN;

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const createDataPoint = value => {
  const now = new Date();
  const comment = now.toDateString() + ' ' + now.toLocaleTimeString();
  const options = {
    method: 'POST',
    url:
      'https://www.beeminder.com/api/v1/users/' +
      username +
      '/goals/' +
      goal_name +
      '/datapoints.json?auth_token=' +
      auth_token +
      '&value=' +
      value +
      '&comment=' +
      comment
  };
  axios(options)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
};

const getPageCount = page => {
  const promiseFunc = async page => {
    let count = 0;
    const blockId = page.id;
    const blockResponse = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 50
    });
    blockResponse.results.forEach(block => {
      block.paragraph.text.forEach(text => {
        count += text.plain_text.split(' ').length;
      });
    });
    return Promise.resolve(count);
  };
  return promiseFunc(page);
};

const queryJournal = async () => {
  const databaseId = process.env.DATABASE_ID;
  const pageResponse = await notion.databases.query({
    database_id: databaseId
  });
  let count = async pageResponse => {
    return Promise.all(
      pageResponse.results.map(page => {
        return getPageCount(page);
      })
    );
  };
  count(pageResponse).then(counts => {
    let total = counts.reduce((a, b) => a + b);
    console.log(total + ' words counted');
    createDataPoint(total);
  });
};

queryJournal();
