const core = require("@actions/core");
const { getJobs, getRunDuration, getRunConclusion, getStepsDuration } = require("./js/parser");
const { createWriteApi, durationPoint, writePoint, flushWrites } = require("./js/writeToInflux");

try {
    const workflowName = core.getInput("name")
    const url = core.getInput("url")
    const org = core.getInput("org")
    const bucket = core.getInput("bucket")
    const token = core.getInput("token")
    const data = core.getInput("data")

    const jobs = getJobs(JSON.parse(data))

    const duration = getRunDuration(jobs, "seconds");
    const conclusion = getRunConclusion(jobs);
    const stepsDuration = getStepsDuration(jobs, "seconds");

    const workflowDuration = durationPoint("workflow-duration", { "conclusion": conclusion, "workflow": workflowName }, duration)

    const writeApi = createWriteApi(url, token, org, bucket)
    writePoint(writeApi, workflowDuration)

    for (let i = 0; i < stepsDuration.length; i++) {
        let stepDuration = durationPoint("step-duration", { "step": stepsDuration[i]["name"], "conclusion": stepsDuration[i]["conclusion"] }, stepsDuration[i]["duration"])
        writePoint(writeApi, stepDuration)
    }

    flushWrites(writeApi)

} catch (error) {
    core.setFailed(error.message);
}
