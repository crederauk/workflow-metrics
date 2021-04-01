const core = require('@actions/core');
const { getJobs, getRunDuration, getRunConclusion } = require("./parser");
const { writePointToInflux } = require("./writeToInflux");

const fileName = process.argv.slice(2)[0];
const runObject = JSON.parse(fileName);
const jobs = getJobs(runObject);
const duration = getRunDuration(jobs, "seconds");
const conclusion = getRunConclusion(jobs);

const token = process.env.INFLUX_TOKEN;
const url = process.env.INFLUX_URL;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

writePointToInflux(url, token, org, bucket, 's', conclusion, duration);

console.log("Duration:", duration);
console.log("Conclusion:", conclusion);