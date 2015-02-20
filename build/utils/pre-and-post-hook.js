var grunt = require('grunt');
var hooker = require('hooker');

module.exports = preAndPostHook = function () {
    var currentTask = undefined;

    /**
     * Do something when the task has sta.
     * @param taskName The task name.
     */
    function taskStartCallback(taskName) {
        // do something
        currentTask = taskName;
    }

    /**
     * Do something when the task has finished.
     * @param taskResult <code>true</code> if successful, else <code>false</code>.
     */
    function taskEndCallback(taskResult) {
        currentTask = undefined;
        // do something
    }

    /** Hook into the grunt task runner. */
    hooker.hook(grunt.task, 'runTaskFn', {
        pre: function (context) {
            var taskName = context.nameArgs;
            if (currentTask !== undefined) {
                taskEndCallback(true); // true indicates the task has finished successfully.
            }
            taskStartCallback(taskName);
        }
    });

    /** Hook into the success / fail writer. */
    hooker.hook(grunt.log.writeln(), ['success', 'fail'], function (res) { // check done or aborted
        var done = res === 'Done, without errors.';
        var warning = res === 'Done, but with warnings.';
        var aborted = res === 'Aborted due to warnings.';
        var error = warning || aborted;

        if (done || error) {
            if (currentTask !== undefined) {
                taskEndCallback(error ? false : true);
            }
        }
    });

    /** Hook into the fatal writer. */
    hooker.hook(grunt.fail, 'fatal', function () { // in case of a real failure
        if (currentTask !== undefined) {
            taskEndCallback(false);
        }
    });
}