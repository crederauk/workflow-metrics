const { InfluxDB, Point, HttpError } = require("@influxdata/influxdb-client")

function createWriteApi(url, token, org, bucket) {
    return new InfluxDB({ url, token }).getWriteApi(org, bucket)
}

function durationPoint(name, tags, duration, jestDuration, cypressDuration) {
    const point = new Point(name)
        .intField("duration", duration)
        .intField("jestDuration", jestDuration)
        .intField("cypressDuration", cypressDuration)
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
            console.error(e)
            if (e instanceof HttpError && e.statusCode === 401) {
                console.log("Setup a new InfluxDB database.")
            }
            console.log("\nFinished ERROR")
        })
}

module.exports = { createWriteApi, durationPoint, writePoint, flushWrites }
