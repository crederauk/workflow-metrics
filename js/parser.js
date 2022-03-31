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

function getStepsDuration(jobs, measurement = "seconds") {

    let listOfSteps = [];
    for (let i = 0; i < jobs.length; i++) {
        for (let j = 0; j < jobs[i]["steps"].length; j++) {
            let stepObj = {
                "name": jobs[i]["steps"][j]["name"],
                "conclusion": jobs[i]["steps"][j]["conclusion"],
                "duration": moment(jobs[i]["steps"][j]["completed_at"]).diff(moment(jobs[i]["steps"][j]["started_at"]), measurement)
            }
            listOfSteps.push(stepObj)
        }
    }
    return listOfSteps;
}

module.exports = { getJobs, getRunDuration, getRunConclusion, getStepsDuration }
