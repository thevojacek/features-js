'use strict';

var cronious = require('cronious');
var FetchToMongoTask = require('./fetchToMongoTask');

/**
 * @param {{
     *    sourceUrl: string,
     *    collection: mongodb.Collection
     *    documentId?: string
     *    taskId?: string
     *    lifetime?: number,
     * }} taskOptions
 * @returns {Promise.<Function>}
 */
module.exports = function (taskOptions) {

    var runner = new cronious.Runner({
        collection: taskOptions.collection,
        checkInterval: 10 * 1000
    });

    var task = new FetchToMongoTask(taskOptions);

    return runner.registerTask(task).then(function () {

        runner.startTriggeringTasks();

        return {
            stopFetchToMongoTask: function stopFetchToMongoTask() {
                return runner.stopTriggeringTasks();
            }
        };
    });
};