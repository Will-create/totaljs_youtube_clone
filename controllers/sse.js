exports.install = function() {
    ROUTE('GET /sse/notifications/', notifications, ['sse']);
}

function notifications () {
    // SSE controller
    var self = this;
    // save sse controller into Global so that i can access it anywhere i want
    if (MAIN.sse)
        MAIN.sse = null;
    MAIN.sse = self;
    self.sse({ type: 'notification', message: 'Welcome' });
}