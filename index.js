const core = require("@actions/core");
const { getJobs, getRunDuration, getRunConclusion } = require("./js/parser");
const { createWriteApi, durationPoint, writePoint, flushWrites } = require("./js/writeToInflux");

try {
    const url = core.getInput("url")
    const org = core.getInput("org")
    const bucket = core.getInput("bucket")
    const token = core.getInput("token")
    const data = core.getInput("data")

    const jobs = getJobs(JSON.parse(data))

    const duration = getRunDuration(jobs, "seconds");
    const conclusion = getRunConclusion(jobs);

    const workflowDuration = durationPoint("workflow-duration", { "conclusion": conclusion }, duration)

    const writeApi = createWriteApi(url, token, org, bucket)
    writePoint(writeApi, workflowDuration)
    flushWrites(writeApi)

} catch (error) {
    core.setFailed(error.message);
}
