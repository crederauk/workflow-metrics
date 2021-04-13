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

function getJestDuration(jobs, runConclusion, measurement = "seconds") {
    let jestDuration = 0;
    if (runConclusion === "success") {
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i]["name"].toLowerCase().includes("unit")) {
                for (let j = 0; j < jobs[i]["steps"].length; j++) {
                    if (jobs[i]["steps"][j]["name"].toLowerCase().includes("run")) {
                        jestDuration = moment(jobs[i]["steps"][j]["completed_at"]).diff(moment(jobs[i]["steps"][j]["started_at"]), measurement)
                    }
                }
            }
        }
    } else {
        return jestDuration
    }
    return jestDuration;
}

function getCypressDuration(jobs, runConclusion, measurement = "seconds") {
    let cypressDuration = 0;
    if (runConclusion === "success") {
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i]["name"].toLowerCase().includes("e2e")) {
                for (let j = 0; j < jobs[i]["steps"].length; j++) {
                    if (jobs[i]["steps"][j]["name"].toLowerCase().includes("run")) {
                        cypressDuration = moment(jobs[i]["steps"][j]["completed_at"]).diff(moment(jobs[i]["steps"][j]["started_at"]), measurement)
                    }
                }
            }
        }
    } else {
        return cypressDuration;
    }
    return cypressDuration;
}

module.exports = { getJobs, getRunDuration, getRunConclusion, getJestDuration, getCypressDuration }
