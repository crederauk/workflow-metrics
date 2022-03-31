# Workflow Metrics

This action allows for the parsing and uploading of workflow data to InfluxDB.

## Output Metrics

The following shows which metrics are output by this action:

- [x] Total workflow duration
- [x] Step durations
- [ ] Job durations

:warn: Note that all metrics are uploaded without a timestamp, so InfluxDB will assign a timestamp upon receipt of each metric

## Tags

To assist with filtration and querying in InfluxDB the following tags are provided on data

| Tag Name      | Tag description                              | Metric(s) applied to |
| ------------- | -------------------------------------------- | -------------------- |
| Workflow name | Name of the workflow this metrics relates to | All                  |
| Conclusion    | Outcome of the related metric                | All                  |

## Usage

```yaml
uses: crederauk/workflow-metrics
with:
  name: ${{ WORKFLOW_RUN_NAME }}
  url: ${{ INFLUX_DB_URL }}
  organisation: ${{ GITHUB_ORG }}
  bucket: ${{ INFLUX_DB_BUCKET }}
  token: ${{ INFLUX_DB_TOKEN }}
  data: ${{ GITHUB_ACTIONS_RUN_OBJECT }}
```
