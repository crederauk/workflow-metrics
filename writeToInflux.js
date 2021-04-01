const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client')

function writePointToInflux(url, token, org, bucket, measurement, workflow_env, conclusion, duration) {
    const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, measurement)
    let point = new Point('workflow-runtime')
        .tag('conclusion', conclusion)
        .floatField('duration', duration)
    writeApi.writePoint(point)
    console.log(` ${point}`)

    writeApi
        .close()
        .then(() => {
            console.log('Point written successfully.')
        })
        .catch(e => {
            console.error(e)
            if (e instanceof HttpError && e.statusCode === 401) {
                console.log('Setup a new InfluxDB database.')
            }
            console.log('\nFinished ERROR')
        })
}

module.exports = { writePointToInflux }