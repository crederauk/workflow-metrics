const parser = require('./parser');

const job1EndDate = new Date(Date.now())
const job1StartDate = new Date(job1EndDate.getTime() - 10000)
const job2EndDate = new Date(Date.now() - 10000)
const job2StartDate = new Date(job2EndDate.getTime() - 15000)
const job1 = jobJson(1, "Job 1", "success", job1StartDate.toISOString(), job1EndDate.toISOString())
const job2 = jobJson(2, "Job 2", "failure", job2StartDate.toISOString(), job2EndDate.toISOString())
const singleJobWorkflow = workflowJson([job1])
const multipleJobWorkflow = workflowJson([job1, job2])

describe("Workflow json parser", function () {

    describe("Run duration", function () {
        test("Single job (seconds)", () => {
            expect(parser.getRunDuration(singleJobWorkflow["jobs"])).toBe(10)
        })
        test("Single job (milliseconds)", () => {
            expect(parser.getRunDuration(singleJobWorkflow["jobs"], "milliseconds")).toBe(10000)
        })
        test("Multiple jobs (seconds)", () => {
            expect(parser.getRunDuration(multipleJobWorkflow["jobs"])).toBe(25)
        })
        test("Multiple jobs (milliseconds)", () => {
            expect(parser.getRunDuration(multipleJobWorkflow["jobs"], "milliseconds")).toBe(25000)
        })
    })

    describe("Run conclusion", function () {
        test("Single job success", () => {
            expect(parser.getRunConclusion(singleJobWorkflow["jobs"])).toBe("success")
        })
        test("Multiple jobs with all successes", () => {
            const input = workflowJson([job1, job1])
            expect(parser.getRunConclusion(input["jobs"])).toBe("success")
        })
        test("Multiple jobs with 1 failure", () => {
            expect(parser.getRunConclusion(multipleJobWorkflow["jobs"])).toBe("failure")
        })
        test("Multiple jobs with all failures", () => {
            const input = workflowJson([job2, job2])
            expect(parser.getRunConclusion(input["jobs"])).toBe("failure")
        })
    })

    describe("Run Step Summary", function () {
        test("Single step success", () => {
            expect(parser.getStepsDuration(singleJobWorkflow["jobs"])).toMatchObject([{
                "name": "Job 1 Step 1",
                "conclusion": "success",
                "duration": 10
            }])
        })
        test("Multiple step failure", () => {
            expect(parser.getStepsDuration(multipleJobWorkflow["jobs"])).toMatchObject([{
                "name": "Job 1 Step 1",
                "conclusion": "success",
                "duration": 10
            },
            {
                "name": "Job 2 Step 1",
                "conclusion": "failure",
                "duration": 15
            }])
        })
    })
})

function workflowJson(jobs) {
    return {
        "total_count": jobs.length,
        "jobs": jobs
    }
}

function jobJson(id, name, conclusion, startDate, endDate) {
    return {
        "id": id,
        "run_id": 456,
        "run_url": "https://api.github.com/repos/crederauk/digital-hybrid/actions/runs/456",
        "node_id": "abc123",
        "head_sha": "def456",
        "url": "https://api.github.com/repos/crederauk/digital-hybrid/actions/jobs/" + id,
        "html_url": "https://github.com/crederauk/digital-hybrid/runs/" + id,
        "status": "completed",
        "conclusion": conclusion,
        "started_at": startDate,
        "completed_at": endDate,
        "name": name,
        "steps": [
            {
                "name": name + " Step 1",
                "status": "completed",
                "conclusion": conclusion,
                "number": 1,
                "started_at": startDate,
                "completed_at": endDate
            }
        ],
        "check_run_url": "https://api.github.com/repos/crederauk/digital-hybrid/check-runs/123"
    }
}
