const { InfluxDB, Point, HttpError } = require("@influxdata/influxdb-client")
const core = require('@actions/core');

function createWriteApi(url, token, org, bucket) {
    return new InfluxDB({ url, token }).getWriteApi(org, bucket)
}

function durationPoint(name, tags, value) {
    const point = new Point(name)
        .intField("duration", value)
    for (const tagName in tags) {
        if (tags.hasOwnProperty(tagName)) {
            point.tag(tagName, tags[tagName])
        }
    }
    return point
}

function writePoint(writeApi, point) {
    writeApi.writePoint(point)
}

function flushWrites(writeApi) {
    writeApi
        .close()
        .then(() => {
            console.log("Point written successfully.")
        })
        .catch(e => {
            core.error(`Error ${e}`);
            console.error(e)
            if (e instanceof HttpError && e.statusCode === 401) {
                console.log("Setup a new InfluxDB database.")
            }
            console.log("\nFinished ERROR")
        })
}

module.exports = { createWriteApi, durationPoint, writePoint, flushWrites }
