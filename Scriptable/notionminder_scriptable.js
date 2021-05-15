// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: pencil-alt;
const database_id = args.shortcutParameter.database_id;
const notion_api_key =
  'Bearer ' + args.shortcutParameter.notion_api_key;
const beeminder_auth_token = args.shortcutParameter.beeminder_auth_token;
const goal_name = args.shortcutParameter.goal_name;
const username = args.shortcutParameter.username;
const headers = {
  'Notion-Version': '2021-05-13',
  Authorization: notion_api_key,
  'Content-Type': 'application.json'
};

const createDataPoint = async value => {
  const datapointURL =
    'https://www.beeminder.com/api/v1/users/' +
    username +
    '/goals/' +
    goal_name +
    '/datapoints.json?auth_token=' +
    beeminder_auth_token +
    '&value=' +
    value;
  const datapoint = new Request(datapointURL);
  datapoint.method = 'POST';
  const datapointResults = await datapoint.loadJSON();
  console.log(datapointResults);
  Script.complete()
};

const getPageCount = page => {
  const promiseFunc = async page => {
    let count = 0;
    const getPageTextURL =
      'https://api.notion.com/v1/blocks/' + page.id + '/children?page_size=100';
    const getPageText = new Request(getPageTextURL);
    getPageText.method = 'GET';
    getPageText.headers = headers;
    const blockResponse = await getPageText.loadJSON();
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
  const getPagesURL =
    'https://api.notion.com/v1/databases/' + database_id + '/query';
  const getPages = new Request(getPagesURL);
  getPages.method = 'POST';
  getPages.headers = headers;
  const pageResponse = await getPages.loadJSON();
  let count = async pageResponse => {
    return Promise.all(
      pageResponse.results.map(page => {
        return getPageCount(page);
      })
    );
  };
  count(pageResponse).then(counts => {
    let total = counts.reduce((a, b) => a + b);
    createDataPoint(total)
  });
};

queryJournal();
