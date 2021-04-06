const moment = require('moment');

function getJobs(runObject) {
    return runObject["jobs"];
}

function getRunDuration(jobs, measurement = "seconds") {
    let totalDuration = 0;
    for (let i = 0; i < jobs.length; i++) {
        totalDuration += moment(jobs[i]["completed_at"]).diff(moment(jobs[i]["started_at"]), measurement)
    }
    return totalDuration;
}

function getRunConclusion(jobs) {
    let finalConclusion = "success";
    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i]["conclusion"] === "failure") {
            finalConclusion = "failure";
        }
    }
    return finalConclusion;
}

module.exports = { getJobs, getRunDuration, getRunConclusion }
