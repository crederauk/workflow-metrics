const writeToInflux = require("./writeToInflux")
const {Point} = require("@influxdata/influxdb-client")

describe("InfluxDB writes", function () {
    describe("Duration point", function () {
        test("No tags", () => {
            const expected = new Point("test-duration")
                .intField("duration", 10)
            expect(writeToInflux.durationPoint("test-duration", {}, 10)).toStrictEqual(expected)
        })
        test("Single tag", () => {
            const expected = new Point("test-duration")
                .intField("duration", 10)
                .tag("tag1", "tagVal1")
            expect(writeToInflux.durationPoint("test-duration", {"tag1": "tagVal1"}, 10)).toStrictEqual(expected)
        })
        test("Multiple tags", () => {
            const expected = new Point("test-duration")
                .intField("duration", 10)
                .tag("tag1", "tagVal1")
                .tag("tag2", "tagVal2")
            expect(writeToInflux.durationPoint("test-duration", {"tag1": "tagVal1", "tag2": "tagVal2"}, 10)).toStrictEqual(expected)
        })
    })
})
