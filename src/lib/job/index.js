var Job = function(task, then, options) {

    var updateProgress = function(p) {
			p = parseFloat(p.toFixed(8))
			if(options && options.onProgress) options.onProgress(p)
		},
        resolver = function(results) {
            if (typeof then === 'function') then(results)
        }

    if (typeof task === 'function') return task(resolver)

    if (Array.isArray(task)) {

        var completed = 0,
            expecting = task.length,
            _results = [],
            executeNext = function(results) {
                _results[completed] = results
                completed++
				updateProgress(completed / expecting)
                if (completed !== expecting) return new Job(task[completed], executeNext)
                resolver(_results)
            }

        return new Job(task[0], executeNext)

    }

    if (typeof task === 'object') {

        var completed = 0,
            expecting = Object.keys(task)
            .length,
            _results = {},
            runTask = function(task, key) {
                new Job(task, function(results) {
                    _results[key] = results
                    completed++
					updateProgress(completed / expecting)
                    if (completed === expecting) resolver(_results)
                })
            }

        for (var t in task) {
            runTask(task[t], t)
        }

    }
}

if (module) {
    if (module.exports) module.exports = Job
}
