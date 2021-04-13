const core = require("@actions/core");
const { getJobs, getRunDuration, getRunConclusion, getJestDuration, getCypressDuration } = require("./js/parser");
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
    const jestTestDuration = getJestDuration(jobs, conclusion, "seconds");
    const cypressTestDuration = getCypressDuration(jobs, conclusion, "seconds");

    const workflowDuration = durationPoint("workflow-duration", { "conclusion": conclusion, "workflow": workflowName }, duration, jestTestDuration, cypressTestDuration)

    const writeApi = createWriteApi(url, token, org, bucket)
    writePoint(writeApi, workflowDuration)
    flushWrites(writeApi)

} catch (error) {
    core.setFailed(error.message);
}
